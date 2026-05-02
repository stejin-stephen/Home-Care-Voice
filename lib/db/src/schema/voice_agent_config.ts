import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const voiceAgentConfigTable = pgTable("voice_agent_config", {
  id: serial("id").primaryKey(),
  assistantName: text("assistant_name").notNull().default("Clara"),
  systemPrompt: text("system_prompt").notNull(),
  supportedLanguages: text("supported_languages").notNull().default("English,Spanish,Vietnamese,Mandarin,Tagalog"),
  escalationPhone: text("escalation_phone").notNull().default("+14085550100"),
  vapiAssistantId: text("vapi_assistant_id"),
  isActive: boolean("is_active").notNull().default(true),
  maxCallDurationSeconds: integer("max_call_duration_seconds").notNull().default(600),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertVoiceAgentConfigSchema = createInsertSchema(voiceAgentConfigTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertVoiceAgentConfig = z.infer<typeof insertVoiceAgentConfigSchema>;
export type VoiceAgentConfig = typeof voiceAgentConfigTable.$inferSelect;
