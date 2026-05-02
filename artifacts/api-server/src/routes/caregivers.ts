import { Router } from "express";
import { db } from "@workspace/db";
import { caregiversTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateCaregiverBody,
  UpdateCaregiverBody,
  GetCaregiverParams,
  UpdateCaregiverParams,
  DeleteCaregiverParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/caregivers", async (_req, res): Promise<void> => {
  try {
    const caregivers = await db.select().from(caregiversTable).orderBy(caregiversTable.name);
    res.json(caregivers.map(formatCaregiver));
  } catch {
    res.status(500).json({ error: "Failed to fetch caregivers" });
  }
});

router.post("/caregivers", async (req, res): Promise<void> => {
  const parsed = CreateCaregiverBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  try {
    const [caregiver] = await db.insert(caregiversTable).values({
      ...parsed.data,
      languages: parsed.data.languages ?? "English",
      status: parsed.data.status ?? "active",
    }).returning();
    res.status(201).json(formatCaregiver(caregiver));
  } catch {
    res.status(500).json({ error: "Failed to create caregiver" });
  }
});

router.get("/caregivers/:id", async (req, res): Promise<void> => {
  const { id } = GetCaregiverParams.parse(req.params);
  const [caregiver] = await db.select().from(caregiversTable).where(eq(caregiversTable.id, id));
  if (!caregiver) { res.status(404).json({ error: "Caregiver not found" }); return; }
  res.json(formatCaregiver(caregiver));
});

router.patch("/caregivers/:id", async (req, res): Promise<void> => {
  const { id } = UpdateCaregiverParams.parse(req.params);
  const parsed = UpdateCaregiverBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [caregiver] = await db.update(caregiversTable).set(parsed.data).where(eq(caregiversTable.id, id)).returning();
  if (!caregiver) { res.status(404).json({ error: "Caregiver not found" }); return; }
  res.json(formatCaregiver(caregiver));
});

router.delete("/caregivers/:id", async (req, res): Promise<void> => {
  const { id } = DeleteCaregiverParams.parse(req.params);
  await db.delete(caregiversTable).where(eq(caregiversTable.id, id));
  res.status(204).send();
});

function formatCaregiver(c: typeof caregiversTable.$inferSelect) {
  return {
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export default router;
