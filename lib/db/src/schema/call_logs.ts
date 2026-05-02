import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const callLogsTable = pgTable("call_logs", {
  id: serial("id").primaryKey(),
  callerPhone: text("caller_phone"),
  callerName: text("caller_name"),
  transcript: text("transcript"),
  intent: text("intent"),
  language: text("language").notNull().default("English"),
  durationSeconds: integer("duration_seconds"),
  outcome: text("outcome").notNull().default("resolved"),
  vapiCallId: text("vapi_call_id"),
  clientId: integer("client_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCallLogSchema = createInsertSchema(callLogsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type CallLog = typeof callLogsTable.$inferSelect;
