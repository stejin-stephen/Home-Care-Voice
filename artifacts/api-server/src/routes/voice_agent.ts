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
    const [updated] = await db
      .update(voiceAgentConfigTable)
      .set(parsed.data)
      .where(eq(voiceAgentConfigTable.id, config.id))
      .returning();
    res.json(formatConfig(updated));
  } catch {
    res.status(500).json({ error: "Failed to update voice agent config" });
  }
});

router.post("/vapi/webhook", async (req, res): Promise<void> => {
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
