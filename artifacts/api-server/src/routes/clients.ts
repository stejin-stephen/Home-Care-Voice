import { Router } from "express";
import { db } from "@workspace/db";
import { clientsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateClientBody,
  UpdateClientBody,
  GetClientParams,
  UpdateClientParams,
  DeleteClientParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/clients", async (_req, res): Promise<void> => {
  try {
    const clients = await db.select().from(clientsTable).orderBy(clientsTable.name);
    res.json(clients.map(formatClient));
  } catch {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

router.post("/clients", async (req, res): Promise<void> => {
  const parsed = CreateClientBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  try {
    const [client] = await db.insert(clientsTable).values({
      ...parsed.data,
      preferredLanguage: parsed.data.preferredLanguage ?? "English",
      status: parsed.data.status ?? "active",
    }).returning();
    res.status(201).json(formatClient(client));
  } catch {
    res.status(500).json({ error: "Failed to create client" });
  }
});

router.get("/clients/:id", async (req, res): Promise<void> => {
  const { id } = GetClientParams.parse(req.params);
  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, id));
  if (!client) { res.status(404).json({ error: "Client not found" }); return; }
  res.json(formatClient(client));
});

router.patch("/clients/:id", async (req, res): Promise<void> => {
  const { id } = UpdateClientParams.parse(req.params);
  const parsed = UpdateClientBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [client] = await db.update(clientsTable).set(parsed.data).where(eq(clientsTable.id, id)).returning();
  if (!client) { res.status(404).json({ error: "Client not found" }); return; }
  res.json(formatClient(client));
});

router.delete("/clients/:id", async (req, res): Promise<void> => {
  const { id } = DeleteClientParams.parse(req.params);
  await db.delete(clientsTable).where(eq(clientsTable.id, id));
  res.status(204).send();
});

function formatClient(c: typeof clientsTable.$inferSelect) {
  return {
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export default router;
