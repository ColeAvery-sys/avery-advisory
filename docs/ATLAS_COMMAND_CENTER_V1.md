# ATLAS Command Center v1

ATLAS Command Center v1 is the local executive shell for Avery Industries LLC.

## Routes

- `/dashboard`
- `/idea-vault`
- `/leads`
- `/content-ops`
- `/grants`
- `/creator-logistics`
- `/divisions`
- `/settings`
- `/approval-queue`

## Company Config

- Parent company: Avery Industries LLC
- Divisions are loaded in the shell and mirrored in the mock bootstrap data.
- The shell is dense, mobile-friendly, and focused on approvals, logging, and revenue automation.

## Shared Data Layer

The first shared store lives at `atlas_ops/logs/atlas_shared_data.json`.

All command-center views read from the same bootstrap contract:

- Ideas
- Leads
- Tasks
- Divisions
- Content packages
- Grants
- Approval queue
- Audit logs

The shared bootstrap also exposes division profiles, company flowchart data, and derived draft outputs for ideas, leads, content, and grants so every route sees the same operating system state.

## API Routes

The local server exposes read/write routes for the shared store:

- `/api/health`
- `/api/bootstrap`
- `/api/ideas`
- `/api/leads`
- `/api/tasks`
- `/api/divisions`
- `/api/content-packages`
- `/api/grants`
- `/api/approval-queue`
- `/api/audit-logs`

Write actions:

- `POST` creates a record.
- `PATCH` updates a record.
- `POST /approve` marks an item approved.
- `POST /reject` marks an item rejected and blocked.
- `POST /export` marks an item exported and sent.

Batch workflow helpers:

- `POST /api/idea-vault/distribute`
- `POST /api/idea-vault/send-to-approval`
- `POST /api/idea-vault/generate-codex-batch`
- `POST /api/leads/score`
- `POST /api/leads/drafts`
- `GET /api/leads/export.csv`
- `POST /api/content-packages/generate`
- `POST /api/grants/checklist`
- `GET /api/divisions/flowchart`

## Mock Backend Contract

The local server still runs as a mock-only contract until the real backend is connected. The API exists so the shell has a clean source of truth while the real persistence layer is still missing.

## What Still Needs Backend Connection

- Persistent database for tasks, approvals, leads, and notes.
- Real CRM and lead source integrations.
- Email and DM connectors with approval storage.
- Grant document storage and submission tracking.
- Content publishing integrations.
- Analytics and event logging backend.
- Authentication and user permissions.

## Validation Checklist

- Top nav shows all nine routes.
- Status badges include Draft, Pending Approval, Approved, Sent, and Blocked.
- Company name is Avery Industries LLC.
- Mock data appears when no real backend is connected.
- Idea, lead, content, and grant actions route through shared store helpers.
- The page is readable on mobile and desktop widths.
- No sendable action is auto-executed without approval.
