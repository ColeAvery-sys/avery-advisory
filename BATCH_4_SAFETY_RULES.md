# ATLAS Batch 4 Safety Rules

1. ATLAS may draft, organize, recommend, prepare, score, and log actions.
2. ATLAS may not send emails automatically.
3. ATLAS may not submit grants automatically.
4. ATLAS may not spend money automatically.
5. ATLAS may not pay contractors automatically.
6. ATLAS may not publish content automatically.
7. ATLAS may not delete files automatically.
8. ATLAS may not create invoices or payment requests without Cole approval.
9. ATLAS may not contact clients, funders, colleges, contractors, or partners without Cole approval.
10. Every external-facing action must go through Action Center or Approval Inbox.
11. Every action must be logged.
12. Every generated draft should clearly show whether it is internal-only or external-facing.
13. Legal, financial, grant, contract, loan, client, contractor, and public actions are high-risk by default.
14. Keep all integrations as placeholders until Cole explicitly connects them.
15. The system should be useful locally before live automation is added.

## Current Implementation Notes

- `automationPermissionEngine.ts` blocks automatic sending, grant/application submission, spending, contractor payment, publishing, and deletion.
- `automationPermissionEngine.ts` requires Cole approval for invoices, payment requests, external contact, and high-risk categories.
- `documentDraftEngine.ts` labels generated drafts as internal-only or external-facing.
- `atlasActionLogger.ts` provides the local action log and approval status functions.
- Integrations remain placeholders. No external APIs are connected.
