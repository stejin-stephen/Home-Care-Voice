import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, clientsTable, caregiversTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  CreateAppointmentBody,
  UpdateAppointmentBody,
  GetAppointmentParams,
  UpdateAppointmentParams,
  DeleteAppointmentParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/appointments", async (_req, res): Promise<void> => {
  try {
    const rows = await db
      .select({
        appointment: appointmentsTable,
        clientName: clientsTable.name,
        caregiverName: caregiversTable.name,
      })
      .from(appointmentsTable)
      .leftJoin(clientsTable, eq(appointmentsTable.clientId, clientsTable.id))
      .leftJoin(caregiversTable, eq(appointmentsTable.caregiverId, caregiversTable.id))
      .orderBy(sql`${appointmentsTable.scheduledAt} DESC`);

    res.json(rows.map(r => formatAppointment(r.appointment, r.clientName, r.caregiverName)));
  } catch {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

router.post("/appointments", async (req, res): Promise<void> => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  try {
    const [appt] = await db.insert(appointmentsTable).values({
      ...parsed.data,
      scheduledAt: new Date(parsed.data.scheduledAt),
      status: parsed.data.status ?? "scheduled",
    }).returning();
    res.status(201).json(formatAppointment(appt, null, null));
  } catch {
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

router.get("/appointments/:id", async (req, res): Promise<void> => {
  const { id } = GetAppointmentParams.parse(req.params);
  const [row] = await db
    .select({
      appointment: appointmentsTable,
      clientName: clientsTable.name,
      caregiverName: caregiversTable.name,
    })
    .from(appointmentsTable)
    .leftJoin(clientsTable, eq(appointmentsTable.clientId, clientsTable.id))
    .leftJoin(caregiversTable, eq(appointmentsTable.caregiverId, caregiversTable.id))
    .where(eq(appointmentsTable.id, id));
  if (!row) { res.status(404).json({ error: "Appointment not found" }); return; }
  res.json(formatAppointment(row.appointment, row.clientName, row.caregiverName));
});

router.patch("/appointments/:id", async (req, res): Promise<void> => {
  const { id } = UpdateAppointmentParams.parse(req.params);
  const parsed = UpdateAppointmentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.scheduledAt) updateData.scheduledAt = new Date(parsed.data.scheduledAt);
  const [appt] = await db.update(appointmentsTable).set(updateData).where(eq(appointmentsTable.id, id)).returning();
  if (!appt) { res.status(404).json({ error: "Appointment not found" }); return; }
  res.json(formatAppointment(appt, null, null));
});

router.delete("/appointments/:id", async (req, res): Promise<void> => {
  const { id } = DeleteAppointmentParams.parse(req.params);
  await db.delete(appointmentsTable).where(eq(appointmentsTable.id, id));
  res.status(204).send();
});

function formatAppointment(
  a: typeof appointmentsTable.$inferSelect,
  clientName: string | null | undefined,
  caregiverName: string | null | undefined
) {
  return {
    ...a,
    scheduledAt: a.scheduledAt.toISOString(),
    clientName: clientName ?? null,
    caregiverName: caregiverName ?? null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export default router;
