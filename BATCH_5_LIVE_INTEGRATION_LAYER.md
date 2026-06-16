# ATLAS Batch 5 Live Integration Layer

Batch 5 starts connecting ATLAS to real-world workflows through staged placeholders.

ATLAS may prepare drafts, files, folders, packets, exports, webhook payloads, prompt exports, watcher records, notifications, and dry-run tests.

ATLAS must not send emails, submit forms, delete files, spend money, publish content, or contact people automatically.

Everything external-facing goes to Action Center first.

## Backend Engines

- `gmailDraftCenterEngine.ts`: stages Gmail draft records after Cole approval.
- `calendarDraftCenterEngine.ts`: stages calendar-ready items and placeholders.
- `googleDriveStructureBuilder.ts`: prepares Avery Industries LLC folder maps.
- `googleDocsGeneratorEngine.ts`: prepares Google Docs-ready document records and text/markdown exports.
- `googleSheetsExportCenter.ts`: prepares CSV and sheet previews.
- `makeWebhookStagingEngine.ts`: prepares Make.com webhook payloads and dry-run staging.
- `promptExportEngine.ts`: exports Cursor/Codex prompts with the ATLAS North Star.
- `localFileWatcherEngine.ts`: records planned local file watchers without live filesystem automation.
- `notificationCenterEngine.ts`: creates local approval/deadline/integration notifications.
- `integrationTestConsole.ts`: runs dry integration tests only.

## Cursor UI Targets

Cursor should build pages over these engines:

1. Gmail Draft Center
2. Calendar Draft Center
3. Google Drive Structure Builder
4. Google Docs Generator
5. Google Sheets Export Center
6. Make.com Webhook Staging
7. Cursor/Codex Prompt Export
8. Local File Watcher
9. Notification Center
10. Integration Test Console

## Safety Boundary

- Gmail: draft placeholders only. No automatic send.
- Calendar: internal plans and placeholders only. External invites require approval.
- Drive: folder maps and placeholders only. No deletion.
- Docs: generated local text/markdown and placeholders only.
- Sheets: CSV and previews only.
- Make.com: payload staging only. Risky automations require approval.
- Prompt export: local prompt records only.
- File watcher: placeholder records only.
- Notifications: local notifications only.
- Test console: dry runs only.
