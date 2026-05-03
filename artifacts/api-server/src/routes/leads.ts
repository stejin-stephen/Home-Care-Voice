import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db";
import { z } from "zod/v4";

const router = Router();

const createLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  agencyName: z.string().trim().min(1, "Agency name is required").max(200),
  phone: z.string().trim().min(1, "Phone is required").max(50),
  email: z.string().trim().email("Invalid email address").max(254),
  message: z.string().trim().max(2000).optional(),
});

router.post("/leads", async (req, res): Promise<void> => {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [lead] = await db.insert(leadsTable).values(parsed.data).returning();
    res.status(201).json({
      id: lead.id,
      createdAt: lead.createdAt.toISOString(),
    });
  } catch {
    res.status(500).json({ error: "Failed to save lead" });
  }
});

export default router;
