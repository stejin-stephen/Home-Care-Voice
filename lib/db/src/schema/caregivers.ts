import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const caregiversTable = pgTable("caregivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  role: text("role").notNull().default("caregiver"),
  availability: text("availability").notNull().default("full_time"),
  languages: text("languages").notNull().default("English"),
  certifications: text("certifications"),
  status: text("status").notNull().default("active"),
  hireDate: text("hire_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCaregiverSchema = createInsertSchema(caregiversTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCaregiver = z.infer<typeof insertCaregiverSchema>;
export type Caregiver = typeof caregiversTable.$inferSelect;
