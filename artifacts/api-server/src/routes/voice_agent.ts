import { Router } from "express";
import { db } from "@workspace/db";
import { voiceAgentConfigTable, callLogsTable, escalationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateVoiceAgentConfigBody } from "@workspace/api-zod";

const DEFAULT_SYSTEM_PROMPT = `You are Clara, a warm and professional AI assistant for a home care agency in San Jose, California. Your role is to help families, clients, and caregivers with compassionate and efficient service.

You can help callers with:
- Information about home care services (daily assistance, companionship, transportation, telehealth, medication management)
- Scheduling and confirming appointments
- Medication and visit reminders
- Connecting families with the right care coordinator
- General questions about our care programs

Always speak warmly and with patience. Many of our callers are seniors or their family members who may be in stressful situations. If a caller has an urgent medical emergency, always instruct them to call 911 first.

For non-urgent urgent issues or if a caller is very distressed, offer to connect them to our on-call coordinator.

We support conversations in English, Spanish, Vietnamese, Mandarin, and Tagalog. Detect the caller's preferred language and respond in kind.`;

const router = Router();

async function ensureConfig() {
  const [existing] = await db.select().from(voiceAgentConfigTable).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(voiceAgentConfigTable).values({
    assistantName: "Clara",
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    supportedLanguages: "English,Spanish,Vietnamese,Mandarin,Tagalog",
    escalationPhone: "+14085550100",
    isActive: true,
    maxCallDurationSeconds: 600,
  }).returning();
  return created;
}

/**
 * Sync the voice agent configuration to the live Vapi assistant.
 * Requires VAPI_API_KEY env var. If the key is absent or the API call fails,
 * we log a warning but do not block the local config save.
 */
async function syncToVapi(config: typeof voiceAgentConfigTable.$inferSelect): Promise<string | null> {
  const apiKey = process.env.VAPI_API_KEY;
  if (!apiKey) return null;

  const languages = config.supportedLanguages
    .split(",")
    .map(l => l.trim())
    .filter(Boolean);

  const assistantPayload = {
    name: config.assistantName,
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      systemPrompt: config.systemPrompt,
    },
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
    },
    maxDurationSeconds: config.maxCallDurationSeconds,
    endCallFunctionEnabled: true,
    endCallMessage: "Thank you for calling CareConnect. Have a wonderful day.",
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "multi",
    },
    metadata: {
      supportedLanguages: languages,
      escalationPhone: config.escalationPhone,
    },
  };

  try {
    let response: Response;

    if (config.vapiAssistantId) {
      // Update existing assistant
      response = await fetch(`https://api.vapi.ai/assistant/${config.vapiAssistantId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assistantPayload),
      });
    } else {
      // Create new assistant
      response = await fetch("https://api.vapi.ai/assistant", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assistantPayload),
      });
    }

    if (response.ok) {
      const data = await response.json() as { id?: string };
      return data.id ?? config.vapiAssistantId ?? null;
    } else {
      const err = await response.text();
      console.warn(`[vapi] Failed to sync assistant: ${response.status} ${err}`);
      return config.vapiAssistantId ?? null;
    }
  } catch (err) {
    console.warn("[vapi] Error syncing to Vapi API:", err);
    return config.vapiAssistantId ?? null;
  }
}

router.get("/voice-agent/config", async (_req, res): Promise<void> => {
  try {
    const config = await ensureConfig();
    res.json(formatConfig(config));
  } catch {
    res.status(500).json({ error: "Failed to fetch voice agent config" });
  }
});

router.patch("/voice-agent/config", async (req, res): Promise<void> => {
  const parsed = UpdateVoiceAgentConfigBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  try {
    const config = await ensureConfig();

    // Save locally first
    const [updated] = await db
      .update(voiceAgentConfigTable)
      .set(parsed.data)
      .where(eq(voiceAgentConfigTable.id, config.id))
      .returning();

    // Sync to Vapi API — updates the live assistant's prompt, voice, languages, etc.
    const vapiId = await syncToVapi(updated);
    if (vapiId && vapiId !== updated.vapiAssistantId) {
      const [withVapiId] = await db
        .update(voiceAgentConfigTable)
        .set({ vapiAssistantId: vapiId })
        .where(eq(voiceAgentConfigTable.id, config.id))
        .returning();
      res.json(formatConfig(withVapiId));
      return;
    }

    res.json(formatConfig(updated));
  } catch {
    res.status(500).json({ error: "Failed to update voice agent config" });
  }
});

router.post("/vapi/webhook", async (req, res): Promise<void> => {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (secret) {
    const provided = req.headers["x-vapi-secret"] ?? req.headers["x-webhook-secret"];
    if (provided !== secret) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  }

  try {
    const event = req.body as Record<string, unknown>;
    const message = event?.message as Record<string, unknown> | undefined;
    const messageType = message?.type as string | undefined;

    if (messageType === "end-of-call-report" || messageType === "end_of_call_report") {
      const callData = message as Record<string, unknown>;
      const artifact = callData?.artifact as Record<string, unknown> | undefined;
      const transcript = (artifact?.transcript ?? callData?.transcript ?? null) as string | null;
      const duration = (callData?.durationSeconds ?? callData?.duration ?? null) as number | null;
      const customer = callData?.customer as Record<string, unknown> | undefined;
      const callerPhone = (customer?.number ?? null) as string | null;
      const call = (callData?.call ?? event?.call) as Record<string, unknown> | undefined;
      const vapiCallId = (call?.id ?? null) as string | null;

      let intent: string | null = null;
      if (transcript) {
        const lower = transcript.toLowerCase();
        if (lower.includes("appointment") || lower.includes("schedule")) intent = "appointment_request";
        else if (lower.includes("medication") || lower.includes("medicine") || lower.includes("pill")) intent = "medication_reminder";
        else if (lower.includes("urgent") || lower.includes("emergency") || lower.includes("fall")) intent = "urgent_issue";
        else if (lower.includes("service") || lower.includes("care") || lower.includes("help")) intent = "service_inquiry";
        else if (lower.includes("family") || lower.includes("son") || lower.includes("daughter")) intent = "family_update";
        else intent = "general_inquiry";
      }

      const language = (callData?.language ?? "English") as string;
      const endedReason = callData?.endedReason as string | undefined;
      const outcome = endedReason === "assistant-error" ? "follow_up_needed"
        : endedReason === "voicemail" ? "voicemail"
        : "resolved";

      const [log] = await db.insert(callLogsTable).values({
        callerPhone,
        transcript,
        intent,
        language,
        durationSeconds: duration ? Math.round(duration) : null,
        outcome,
        vapiCallId,
      }).returning();

      if (intent === "urgent_issue") {
        await db.insert(escalationsTable).values({
          callLogId: log.id,
          priority: "high",
          reason: "Urgent issue detected in AI call — immediate follow-up required",
          assignedTo: "On-Call Coordinator",
        });
      }
    }

    res.json({ received: true });
  } catch {
    res.json({ received: true });
  }
});

function formatConfig(c: typeof voiceAgentConfigTable.$inferSelect) {
  return {
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export default router;
