import { Router } from "express";
import { db } from "@workspace/db";
import { escalationsTable, clientsTable } from "@workspace/db";
import { eq, sql, and } from "drizzle-orm";
import {
  CreateEscalationBody,
  UpdateEscalationBody,
  GetEscalationParams,
  UpdateEscalationParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/escalations", async (req, res): Promise<void> => {
  try {
    const { priority, resolved } = req.query as Record<string, string | undefined>;

    const conditions = [];
    if (priority) conditions.push(eq(escalationsTable.priority, priority));
    if (resolved !== undefined && resolved !== "") {
      conditions.push(eq(escalationsTable.resolved, resolved === "true"));
    }

    const rows = await db
      .select({ escalation: escalationsTable, clientName: clientsTable.name })
      .from(escalationsTable)
      .leftJoin(clientsTable, eq(escalationsTable.clientId, clientsTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${escalationsTable.createdAt} DESC`);
    res.json(rows.map(r => formatEscalation(r.escalation, r.clientName)));
  } catch {
    res.status(500).json({ error: "Failed to fetch escalations" });
  }
});

router.post("/escalations", async (req, res): Promise<void> => {
  const parsed = CreateEscalationBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  try {
    const [esc] = await db.insert(escalationsTable).values(parsed.data).returning();
    res.status(201).json(formatEscalation(esc, null));
  } catch {
    res.status(500).json({ error: "Failed to create escalation" });
  }
});

router.get("/escalations/:id", async (req, res): Promise<void> => {
  const { id } = GetEscalationParams.parse(req.params);
  const [row] = await db
    .select({ escalation: escalationsTable, clientName: clientsTable.name })
    .from(escalationsTable)
    .leftJoin(clientsTable, eq(escalationsTable.clientId, clientsTable.id))
    .where(eq(escalationsTable.id, id));
  if (!row) { res.status(404).json({ error: "Escalation not found" }); return; }
  res.json(formatEscalation(row.escalation, row.clientName));
});

router.patch("/escalations/:id", async (req, res): Promise<void> => {
  const { id } = UpdateEscalationParams.parse(req.params);
  const parsed = UpdateEscalationBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updateData: Record<string, unknown> = { ...parsed.data };
  const resolvedAt = (parsed.data as Record<string, unknown>).resolvedAt as string | undefined;
  if (resolvedAt) updateData.resolvedAt = new Date(resolvedAt);
  const [esc] = await db.update(escalationsTable).set(updateData).where(eq(escalationsTable.id, id)).returning();
  if (!esc) { res.status(404).json({ error: "Escalation not found" }); return; }
  res.json(formatEscalation(esc, null));
});

router.delete("/escalations/:id", async (req, res): Promise<void> => {
  const { id } = GetEscalationParams.parse(req.params);
  await db.delete(escalationsTable).where(eq(escalationsTable.id, id));
  res.status(204).send();
});

function formatEscalation(e: typeof escalationsTable.$inferSelect, clientName: string | null | undefined) {
  return {
    ...e,
    clientName: clientName ?? null,
    resolvedAt: e.resolvedAt?.toISOString() ?? null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  };
}

export default router;
