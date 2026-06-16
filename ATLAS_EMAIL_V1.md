# ATLAS Email Integration V1

## Mission

Make ATLAS communication-aware through a local email object layer that can read, draft, send, reply, forward, search, classify, and track follow-up needs.

## Scope

- Email objects with subject, sender, recipients, timestamp, thread ID, and status
- Draft, send, reply, forward, search, filter, and thread retrieval
- Classification for client, personal, internal, sales, support, finance, and legal
- Memory Engine action logging
- Calendar follow-up reminders for overdue or pending replies

## Data Model

Primary email record:
- `id`
- `subject`
- `sender`
- `recipients`
- `cc`
- `bcc`
- `timestamp`
- `threadId`
- `status`
- `classification`
- `body`
- `snippet`
- `replyRequired`
- `followUpStatus`
- `followUpDueAt`
- `linkedProjectIds`
- `linkedTaskIds`
- `linkedContactIds`
- `linkedMemoryIds`
- `links`
- `createdAt`
- `updatedAt`

## Operations

- `createDraft`
- `updateDraft`
- `deleteDraft`
- `sendEmail`
- `receiveEmail`
- `sendReply`
- `forwardEmail`
- `readEmail`
- `searchEmails`
- `filterEmails`
- `retrieveThread`
- `classifyEmail`
- `detectFollowUpEmails`

## Logging

Every major operation records an action in the Memory Engine action log with the `Email` object type.

## Persistence

Email state is file-backed and survives restart through the local `atlas_ops/logs/atlas_email_v1.json` store and backup file.

## Verification

- Create, update, delete draft
- Send email
- Reply and forward
- Search and classification
- Thread retrieval
- Follow-up detection
- Calendar reminder generation for follow-ups
