# ATLAS Batch 4 Build Order

Build Batch 4 in this order:

1. Action Center
2. Action Center Engine
3. Integration Hub
4. Integration Permission Registry
5. Communication Drafts
6. Communication Draft Engine
7. Calendar Command
8. Calendar Command Engine
9. File/Drive Manager
10. File/Drive Manager Engine
11. Grant Submission Packet Builder
12. Grant Submission Packet Engine
13. Client Delivery Packet Builder
14. Client Delivery Packet Engine
15. Invoice & Payment Tracker
16. Invoice Payment Tracker Engine
17. Outreach CRM
18. Outreach CRM Engine
19. Automation Logs
20. Automation Log Engine

## Build Principle

Build UI surfaces and local backend engines together, but keep all live integrations as placeholders until Cole explicitly connects them.

The system should be useful locally before live automation is added.

## Safety Rules

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

## Implementation Notes

- Start with Action Center because risky workflow needs a review surface before more automation exists.
- Build each engine as local TypeScript logic before connecting UI or external services.
- Route all external-facing items through the permission engine and action logger.
- Treat Integration Hub as a registry and placeholder layer first, not a live connector layer.
- Do not add sending, submitting, spending, publishing, or deleting behavior in Batch 4.

## Backend Engine Files

- `actionCenterEngine.ts`
- `integrationPermissionRegistry.ts`
- `communicationDraftEngine.ts`
- `calendarCommandEngine.ts`
- `fileDriveManagerEngine.ts`
- `grantSubmissionPacketEngine.ts`
- `clientDeliveryPacketEngine.ts`
- `invoicePaymentTrackerEngine.ts`
- `outreachCrmEngine.ts`
- `automationLogEngine.ts`
