import { Router } from "express";
import { db } from "@workspace/db";
import {
  clientsTable,
  caregiversTable,
  appointmentsTable,
  callLogsTable,
  remindersTable,
  escalationsTable,
} from "@workspace/db";
import { eq, gte, sql, and, lt } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (_req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);
    const weekStart = new Date(todayStart.getTime() - 7 * 86400000);

    const [
      activeClients,
      activeCaregivers,
      callsToday,
      callsThisWeek,
      apptToday,
      apptThisWeek,
      pendingReminders,
      openEscalations,
      criticalEscalations,
      resolvedToday,
      avgDuration,
      allCalls,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(clientsTable).where(eq(clientsTable.status, "active")),
      db.select({ count: sql<number>`count(*)` }).from(caregiversTable).where(eq(caregiversTable.status, "active")),
      db.select({ count: sql<number>`count(*)` }).from(callLogsTable).where(and(gte(callLogsTable.createdAt, todayStart), lt(callLogsTable.createdAt, todayEnd))),
      db.select({ count: sql<number>`count(*)` }).from(callLogsTable).where(gte(callLogsTable.createdAt, weekStart)),
      db.select({ count: sql<number>`count(*)` }).from(appointmentsTable).where(and(gte(appointmentsTable.scheduledAt, todayStart), lt(appointmentsTable.scheduledAt, todayEnd))),
      db.select({ count: sql<number>`count(*)` }).from(appointmentsTable).where(gte(appointmentsTable.scheduledAt, weekStart)),
      db.select({ count: sql<number>`count(*)` }).from(remindersTable).where(eq(remindersTable.status, "pending")),
      db.select({ count: sql<number>`count(*)` }).from(escalationsTable).where(eq(escalationsTable.resolved, false)),
      db.select({ count: sql<number>`count(*)` }).from(escalationsTable).where(and(eq(escalationsTable.resolved, false), eq(escalationsTable.priority, "critical"))),
      db.select({ count: sql<number>`count(*)` }).from(escalationsTable).where(and(eq(escalationsTable.resolved, true), gte(escalationsTable.resolvedAt!, todayStart))),
      db.select({ avg: sql<number>`avg(duration_seconds)` }).from(callLogsTable).where(sql`duration_seconds is not null`),
      db.select({ outcome: callLogsTable.outcome, language: callLogsTable.language, intent: callLogsTable.intent }).from(callLogsTable),
    ]);

    const callsByOutcome: Record<string, number> = {};
    const callsByLanguage: Record<string, number> = {};
    const callsByIntent: Record<string, number> = {};

    for (const call of allCalls) {
      callsByOutcome[call.outcome] = (callsByOutcome[call.outcome] ?? 0) + 1;
      const lang = call.language ?? "Unknown";
      callsByLanguage[lang] = (callsByLanguage[lang] ?? 0) + 1;
      if (call.intent) {
        callsByIntent[call.intent] = (callsByIntent[call.intent] ?? 0) + 1;
      }
    }

    res.json({
      callsToday: Number(callsToday[0]?.count ?? 0),
      callsThisWeek: Number(callsThisWeek[0]?.count ?? 0),
      activeClients: Number(activeClients[0]?.count ?? 0),
      activeCaregivers: Number(activeCaregivers[0]?.count ?? 0),
      appointmentsToday: Number(apptToday[0]?.count ?? 0),
      appointmentsThisWeek: Number(apptThisWeek[0]?.count ?? 0),
      pendingReminders: Number(pendingReminders[0]?.count ?? 0),
      openEscalations: Number(openEscalations[0]?.count ?? 0),
      criticalEscalations: Number(criticalEscalations[0]?.count ?? 0),
      resolvedEscalationsToday: Number(resolvedToday[0]?.count ?? 0),
      avgCallDurationSeconds: avgDuration[0]?.avg ? Math.round(Number(avgDuration[0].avg)) : null,
      callsByOutcome,
      callsByLanguage,
      callsByIntent,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
});

router.get("/dashboard/activity", async (_req, res) => {
  try {
    const [recentCalls, recentAppts, upcomingReminders, openEscs] = await Promise.all([
      db.select().from(callLogsTable).orderBy(sql`${callLogsTable.createdAt} DESC`).limit(5),
      db.select().from(appointmentsTable).orderBy(sql`${appointmentsTable.scheduledAt} DESC`).limit(5),
      db.select().from(remindersTable).where(eq(remindersTable.status, "pending")).orderBy(remindersTable.scheduledAt).limit(3),
      db.select().from(escalationsTable).where(eq(escalationsTable.resolved, false)).orderBy(sql`${escalationsTable.createdAt} DESC`).limit(3),
    ]);

    const activity = [
      ...recentCalls.map(c => ({
        id: `call-${c.id}`,
        type: "call" as const,
        title: `AI Call — ${c.outcome.replace(/_/g, " ")}`,
        description: c.intent ? `Intent: ${c.intent.replace(/_/g, " ")}` : "Inbound call handled",
        timestamp: c.createdAt.toISOString(),
        status: c.outcome,
        clientName: c.callerName ?? null,
        priority: null,
      })),
      ...recentAppts.map(a => ({
        id: `appt-${a.id}`,
        type: "appointment" as const,
        title: `${a.type.replace(/_/g, " ")} — ${a.status}`,
        description: `Duration: ${a.durationMinutes} min`,
        timestamp: a.scheduledAt.toISOString(),
        status: a.status,
        clientName: null,
        priority: null,
      })),
      ...upcomingReminders.map(r => ({
        id: `reminder-${r.id}`,
        type: "reminder" as const,
        title: `${r.type.replace(/_/g, " ")} reminder`,
        description: r.message,
        timestamp: r.scheduledAt.toISOString(),
        status: r.status,
        clientName: null,
        priority: null,
      })),
      ...openEscs.map(e => ({
        id: `esc-${e.id}`,
        type: "escalation" as const,
        title: `Escalation — ${e.priority} priority`,
        description: e.reason,
        timestamp: e.createdAt.toISOString(),
        status: e.resolved ? "resolved" : "open",
        clientName: null,
        priority: e.priority,
      })),
    ];

    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(activity.slice(0, 15));
  } catch {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

export default router;
