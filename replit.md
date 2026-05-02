# CareConnect — AI Voice Assistant Platform

A full-stack operations platform for a San Jose home care agency. Staff use the web dashboard to manage clients, caregivers, appointments, call logs, reminders, and escalations. A backend webhook integrates with Vapi.ai for 24/7 AI-handled inbound calls.

## Architecture

### Monorepo (pnpm workspaces)

```
artifacts/
  api-server/         Express API server (port 8080, /api prefix)
  care-dashboard/     React + Vite admin dashboard (port 21243, base /)
lib/
  api-spec/           OpenAPI spec + orval codegen config
  api-client-react/   Generated TanStack Query hooks (from orval)
  api-zod/            Generated Zod validation schemas (from orval)
  db/                 Drizzle ORM schema + DB client (PostgreSQL)
```

### Key Libraries
- **Backend:** Express 5, Drizzle ORM, pino logging
- **Frontend:** React, Vite, Wouter routing, TanStack Query, shadcn/ui, Tailwind
- **Codegen:** orval (generates React Query hooks + Zod schemas from OpenAPI spec)
- **DB:** PostgreSQL via `DATABASE_URL` env var, Drizzle for schema/migrations

## Database Schema

6 tables in PostgreSQL:
- `clients` — care recipients (name, DOB, address, phone, language, care plan, status)
- `caregivers` — staff (name, role, availability, languages, certifications, status)
- `appointments` — scheduled visits (type, status, client/caregiver IDs, scheduledAt)
- `call_logs` — AI voice call records (transcript, intent, language, outcome, duration)
- `reminders` — medication/visit/appointment reminders (type, message, scheduledAt, status)
- `escalations` — issues requiring human intervention (priority, reason, assignedTo, resolved)
- `voice_agent_config` — Clara AI assistant settings (systemPrompt, languages, escalationPhone)

## API Routes

All prefixed under `/api`:

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | /clients | List / create clients |
| GET/PATCH/DELETE | /clients/:id | Get / update / delete client |
| GET/POST | /caregivers | List / create caregivers |
| GET/PATCH/DELETE | /caregivers/:id | Get / update / delete caregiver |
| GET/POST | /appointments | List / create appointments |
| GET/PATCH/DELETE | /appointments/:id | Get / update / delete appointment |
| GET/POST | /call-logs | List / create call logs |
| GET | /call-logs/:id | Get call log |
| GET/POST | /reminders | List / create reminders |
| GET/PATCH/DELETE | /reminders/:id | Get / update / delete reminder |
| GET/POST | /escalations | List / create escalations |
| GET/PATCH | /escalations/:id | Get / update escalation |
| GET | /dashboard/summary | Aggregated metrics |
| GET | /dashboard/activity | Recent activity feed |
| GET/PATCH | /voice-agent/config | Get / update Clara's config |
| POST | /vapi/webhook | Vapi.ai webhook endpoint |
| GET | /healthz | Health check |

## Frontend Pages

- `/` — Dashboard with live metrics, activity feed, call breakdowns
- `/clients` — Client roster with search, add/delete
- `/clients/:id` — Client detail (profile, care plan, notes)
- `/caregivers` — Caregiver directory with add form
- `/appointments` — Upcoming/past appointments with status updates
- `/call-logs` — AI call history with transcript accordion viewer
- `/reminders` — Medication/visit reminders with mark-sent actions
- `/escalations` — Open issues with priority badges, mark-resolved action
- `/voice-agent` — Configure Clara's system prompt, languages, escalation phone

## Codegen Workflow

When the OpenAPI spec changes:
```
pnpm --filter @workspace/api-spec run codegen
```
Then manually fix `lib/api-zod/src/index.ts` to only export:
```ts
export * from "./generated/api/api";
```

## Seeding

```
cd artifacts/api-server && pnpm exec tsx src/seed.ts
```

Seeds 8 San Jose clients, 6 caregivers, 15 appointments, 10 call logs (with realistic transcripts), 11 reminders, and 4 escalations.

## Vapi.ai Integration

The `/api/vapi/webhook` endpoint receives Vapi end-of-call reports and:
1. Saves call logs with transcript, intent detection, language, and outcome
2. Auto-creates HIGH priority escalations for detected urgent issues

To connect a real Vapi assistant, set `VAPI_API_KEY` as an env secret and configure the webhook URL to `https://your-domain/api/vapi/webhook`.

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (managed by Replit)
- `VAPI_API_KEY` — (optional) Vapi.ai API key for live assistant management
