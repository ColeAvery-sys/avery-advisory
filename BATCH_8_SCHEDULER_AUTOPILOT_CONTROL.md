# ATLAS Batch 8: Scheduler and Autopilot Control

Batch 8 gives ATLAS a safe autopilot.

ATLAS can schedule, scan, draft, summarize, recommend, notify, and queue.

ATLAS cannot send, submit, spend, publish, delete, hire, pay, or contact people without Cole approval.

## Backend Engines

- `autopilotSafetySwitch.ts`: global pause, local-only mode, and safety-state checks.
- `autopilotControlEngine.ts`: autopilot modes and allowed output rules.
- `autopilotRunHistoryEngine.ts`: run records, failed run visibility, and debug prompts.
- `loopSchedulerEngine.ts`: mock/manual scheduler structure and safe run recording.
- `systemHealthMonitorEngine.ts`: local health checks and Codex debug prompts.
- `morningBriefEngine.ts`: morning operating brief generation.
- `eveningShutdownEngine.ts`: end-of-day closeout generation.
- `weeklyCeoReportEngine.ts`: weekly CEO report generation.
- `approvalReminderEngine.ts`: approval reminder prioritization.
- `deadlineMonitorEngine.ts`: deadline severity scanning.

## Autopilot Modes

- `Off`: no loops.
- `Manual Only`: only manually triggered loops, log-only output.
- `Draft Mode`: tasks and drafts.
- `Notify Mode`: tasks, drafts, and notifications.
- `Approval Queue Mode`: tasks, drafts, notifications, and approval items.
- `Limited Autopilot`: scheduled loops plus safe internal outputs.

## Safety Rules

1. Autopilot can run loops, create drafts, create tasks, create reports, create notifications, and queue approvals.
2. Autopilot cannot send emails.
3. Autopilot cannot submit grants.
4. Autopilot cannot spend money.
5. Autopilot cannot pay contractors.
6. Autopilot cannot publish content.
7. Autopilot cannot delete files.
8. Autopilot cannot contact people automatically.
9. Autopilot cannot make legal, financial, or medical decisions as final authority.
10. Every scheduled run must be logged.
11. Every failed run must be visible.
12. Every high-risk output must go to Action Center.
13. Every autopilot mode must clearly show what outputs are allowed.
14. There must be a Pause All button visible from the main interface.
15. Local Only Mode must block all external integrations.
16. When uncertain, block the action and ask for Cole approval.

## Batch 9 Preview

Batch 9 should be ATLAS Memory, Learning, and Decision Intelligence:

- Preference learning.
- Decision history.
- Pattern detection.
- Recommendation scoring improvements.
- What worked and what failed tracking.
- Company memory consolidation.
- Strategy refinement.
- Client/funder intelligence.
- Personal operating profile.
- ATLAS self-improvement reports.
