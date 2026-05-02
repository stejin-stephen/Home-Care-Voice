import { Router } from "express";
import { db } from "@workspace/db";
import { remindersTable, clientsTable } from "@workspace/db";
import { eq, sql, and } from "drizzle-orm";
import {
  CreateReminderBody,
  UpdateReminderBody,
  GetReminderParams,
  UpdateReminderParams,
  DeleteReminderParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/reminders", async (req, res): Promise<void> => {
  try {
    const { type, status } = req.query as Record<string, string | undefined>;

    const conditions = [];
    if (type) conditions.push(eq(remindersTable.type, type));
    if (status) conditions.push(eq(remindersTable.status, status));

    const rows = await db
      .select({ reminder: remindersTable, clientName: clientsTable.name })
      .from(remindersTable)
      .leftJoin(clientsTable, eq(remindersTable.clientId, clientsTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${remindersTable.scheduledAt} ASC`);
    res.json(rows.map(r => formatReminder(r.reminder, r.clientName)));
  } catch {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

router.post("/reminders", async (req, res): Promise<void> => {
  const parsed = CreateReminderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  try {
    const [reminder] = await db.insert(remindersTable).values({
      ...parsed.data,
      scheduledAt: new Date(parsed.data.scheduledAt),
      status: parsed.data.status ?? "pending",
    }).returning();
    res.status(201).json(formatReminder(reminder, null));
  } catch {
    res.status(500).json({ error: "Failed to create reminder" });
  }
});

router.get("/reminders/:id", async (req, res): Promise<void> => {
  const { id } = GetReminderParams.parse(req.params);
  const [row] = await db
    .select({ reminder: remindersTable, clientName: clientsTable.name })
    .from(remindersTable)
    .leftJoin(clientsTable, eq(remindersTable.clientId, clientsTable.id))
    .where(eq(remindersTable.id, id));
  if (!row) { res.status(404).json({ error: "Reminder not found" }); return; }
  res.json(formatReminder(row.reminder, row.clientName));
});

router.patch("/reminders/:id", async (req, res): Promise<void> => {
  const { id } = UpdateReminderParams.parse(req.params);
  const parsed = UpdateReminderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.scheduledAt) updateData.scheduledAt = new Date(parsed.data.scheduledAt);
  const [reminder] = await db.update(remindersTable).set(updateData).where(eq(remindersTable.id, id)).returning();
  if (!reminder) { res.status(404).json({ error: "Reminder not found" }); return; }
  res.json(formatReminder(reminder, null));
});

router.delete("/reminders/:id", async (req, res): Promise<void> => {
  const { id } = DeleteReminderParams.parse(req.params);
  await db.delete(remindersTable).where(eq(remindersTable.id, id));
  res.status(204).send();
});

function formatReminder(r: typeof remindersTable.$inferSelect, clientName: string | null | undefined) {
  return {
    ...r,
    clientName: clientName ?? null,
    scheduledAt: r.scheduledAt.toISOString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export default router;
