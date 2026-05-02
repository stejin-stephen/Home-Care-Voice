import { Router } from "express";
import { db } from "@workspace/db";
import { callLogsTable, clientsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { CreateCallLogBody, GetCallLogParams } from "@workspace/api-zod";

const router = Router();

router.get("/call-logs", async (_req, res): Promise<void> => {
  try {
    const rows = await db
      .select({ callLog: callLogsTable, clientName: clientsTable.name })
      .from(callLogsTable)
      .leftJoin(clientsTable, eq(callLogsTable.clientId, clientsTable.id))
      .orderBy(sql`${callLogsTable.createdAt} DESC`);
    res.json(rows.map(r => formatCallLog(r.callLog, r.clientName)));
  } catch {
    res.status(500).json({ error: "Failed to fetch call logs" });
  }
});

router.post("/call-logs", async (req, res): Promise<void> => {
  const parsed = CreateCallLogBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  try {
    const [log] = await db.insert(callLogsTable).values(parsed.data).returning();
    res.status(201).json(formatCallLog(log, null));
  } catch {
    res.status(500).json({ error: "Failed to create call log" });
  }
});

router.get("/call-logs/:id", async (req, res): Promise<void> => {
  const { id } = GetCallLogParams.parse(req.params);
  const [row] = await db
    .select({ callLog: callLogsTable, clientName: clientsTable.name })
    .from(callLogsTable)
    .leftJoin(clientsTable, eq(callLogsTable.clientId, clientsTable.id))
    .where(eq(callLogsTable.id, id));
  if (!row) { res.status(404).json({ error: "Call log not found" }); return; }
  res.json(formatCallLog(row.callLog, row.clientName));
});

function formatCallLog(
  c: typeof callLogsTable.$inferSelect,
  clientName: string | null | undefined
) {
  return {
    ...c,
    clientName: clientName ?? null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export default router;
