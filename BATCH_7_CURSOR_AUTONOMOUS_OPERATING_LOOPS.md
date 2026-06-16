# ATLAS Batch 7: Cursor Build Brief

Batch 7 gives ATLAS routines.

ATLAS should support manually runnable operating loops that watch the company, review what matters, prepare work, flag risks, send risky items to Action Center, and log every result.

This batch does not mean ATLAS does everything without permission.

ATLAS watches, reviews, prepares, recommends, sends risky items to approval, executes only approved safe actions, and logs everything.

## Cursor Scope

Build the UI/page layer for Autonomous Operating Loops.

Do not build live scheduled automation in this batch.

Do not auto-send emails, auto-submit grants, auto-spend money, auto-publish content, auto-delete files, auto-contact people, or auto-pay contractors.

## Pages To Build

1. Daily Planning Loop
2. Weekly Review Loop
3. Grant Deadline Loop
4. Client Follow-Up Loop
5. Creator Delivery Loop
6. Invoice and Payment Loop
7. Product Build Loop
8. Inbox Triage Loop
9. Evidence Collection Loop
10. KPI Reporting Loop

## Shared Page Behavior

Every loop page should:

- Run manually for now.
- Show inputs and outputs clearly.
- Generate recommendations.
- Create tasks.
- Create notifications.
- Send risky items to Action Center.
- Create Codex/Cursor prompts when needed.
- Log every loop run.
- Explain why recommendations were made.
- Flag uncertainty for Cole review.

## Batch 7 Build Order

1. Daily Planning Loop
2. `dailyPlanningLoop.ts`
3. Notification hooks for Daily Planning
4. Weekly Review Loop
5. `weeklyReviewLoop.ts`
6. KPI Reporting Loop
7. `kpiReportingLoop.ts`
8. Grant Deadline Loop
9. `grantDeadlineLoop.ts`
10. Client Follow-Up Loop
11. `clientFollowUpLoop.ts`
12. Creator Delivery Loop
13. `creatorDeliveryLoop.ts`
14. Invoice and Payment Loop
15. `invoicePaymentLoop.ts`
16. Product Build Loop
17. `productBuildLoop.ts`
18. Evidence Collection Loop
19. `evidenceCollectionLoop.ts`
20. Inbox Triage Loop
21. `inboxTriageLoop.ts`

## Batch 7 Safety Rules

1. Loops are manually runnable first.
2. Scheduled automation may be added later, but not in this batch.
3. Loops may create tasks, drafts, notifications, recommendations, calendar drafts, and Action Center items.
4. Loops may not send emails.
5. Loops may not submit grants.
6. Loops may not spend money.
7. Loops may not publish content.
8. Loops may not delete files.
9. Loops may not contact people automatically.
10. Loops may not pay contractors.
11. Loops may not make legal, financial, or medical claims as final authority.
12. Every risky output must go to Action Center.
13. Every loop run must create a log entry.
14. Every loop should explain why it made each recommendation.
15. When uncertain, flag for Cole review.

## 1. Daily Planning Loop

Purpose: generate Cole's daily operating plan.

Inputs:

- Active goals.
- Overdue tasks.
- Money pipeline.
- Grants.
- Clients.
- Approvals.
- Calendar drafts.
- Product build tasks.
- Personal/admin tasks.
- Blockers.
- Energy level/manual input.

Outputs:

- Today's top 3.
- Fastest money move.
- Most important long-term move.
- Approvals needed.
- Deadlines today.
- Follow-ups due.
- Avoid today list.
- Suggested calendar blocks.
- Execution orders.
- Recovery/buffer recommendation.

Buttons:

- Run Daily Planning Loop.
- Create Today's Tasks.
- Generate Calendar Drafts.
- Send Approvals to Action Center.
- Generate Morning Brief.
- Generate Nightly Shutdown Review.

Daily brief should answer:

- What should Cole do first?
- What makes money fastest?
- What protects the long-term company?
- What is overdue?
- What can be ignored?
- What requires approval?

## 2. Weekly Review Loop

Purpose: review company progress every week.

Inputs:

- Completed tasks.
- Missed tasks.
- Revenue activity.
- Grant activity.
- Client activity.
- Product progress.
- Content progress.
- Approvals.
- Blockers.
- Logs.

Outputs:

- Weekly wins.
- Revenue progress.
- Grant progress.
- Client progress.
- Product progress.
- Missed opportunities.
- Recurring blockers.
- Next week's top 5.
- Pause/kill recommendations.
- Follow-up list.
- KPI snapshot.

Buttons:

- Run Weekly Review.
- Generate Weekly Report.
- Save to Knowledge Base.
- Create Next Week Tasks.
- Send Risk Items to Action Center.
- Export Markdown.

## 3. Grant Deadline Loop

Purpose: monitor grant deadlines and prepare next actions.

Inputs:

- Grant records.
- Deadlines.
- Readiness scores.
- Missing documents.
- Eligibility status.
- Evidence locker.
- Company docs.
- Project summaries.

Outputs:

- Grants due soon.
- Apply now recommendations.
- Missing documents.
- Funder questions.
- Packet readiness.
- Draft emails.
- Deadline warnings.
- Approval items.

Rules:

- Grants within 14 days should be flagged.
- Grants within 7 days should be urgent.
- Grants within 48 hours should be critical.
- Missing documents should create tasks.
- Submission always requires Cole approval.

Buttons:

- Run Grant Deadline Loop.
- Generate Missing Document Tasks.
- Generate Funder Email Drafts.
- Generate Submission Packets.
- Send to Approval.

## 4. Client Follow-Up Loop

Purpose: keep Creator Logistics leads and clients from going cold.

Inputs:

- Outreach CRM.
- Client Pipeline.
- Communication Drafts.
- Last contacted dates.
- Next follow-up dates.
- Proposal statuses.
- Payment statuses.
- Delivery statuses.

Outputs:

- Follow-ups due today.
- Overdue follow-ups.
- Hot leads.
- Dead leads.
- Proposal reminders.
- Payment reminders.
- Delivery status reminders.
- Draft messages.

Rules:

- ATLAS can draft follow-ups.
- Cole must approve before sending.
- No contact happens automatically.
- Warm leads and money opportunities rank first.

Buttons:

- Run Client Follow-Up Loop.
- Generate Follow-Up Drafts.
- Send Drafts to Action Center.
- Convert Lead to Client.
- Mark Dead Lead.
- Create Sales Tasks.

## 5. Creator Delivery Loop

Purpose: manage client delivery deadlines for Creator Logistics.

Inputs:

- Active client projects.
- Deliverables.
- Raw footage status.
- Contractor tasks.
- Revision count.
- Delivery due dates.
- Payment status.
- Quality checklist.

Outputs:

- Deliveries due soon.
- Missing assets.
- Contractor blockers.
- Unpaid delivery warnings.
- Revision risk.
- Quality check tasks.
- Delivery packet drafts.
- Delivery email drafts.

Rules:

- If payment unpaid, flag before delivery.
- If revision count exceeds 3, flag.
- If due within 48 hours, urgent.
- Client delivery requires Cole approval.

Buttons:

- Run Creator Delivery Loop.
- Generate Delivery Packets.
- Generate Contractor Tasks.
- Generate Quality Checklist.
- Send Delivery to Approval.

## 6. Invoice and Payment Loop

Purpose: track expected cash, unpaid invoices, payment reminders, and contractor payments.

Inputs:

- Invoices.
- Client records.
- Contractor payment records.
- Delivery status.
- Payment due dates.
- Money pipeline.

Outputs:

- Expected cash.
- Overdue invoices.
- Payment reminders.
- Contractor payment approvals.
- Cash risk warnings.
- Next money move.

Rules:

- ATLAS can draft reminders.
- ATLAS cannot request payment automatically.
- ATLAS cannot pay contractors automatically.
- All payment actions require approval.

Buttons:

- Run Payment Loop.
- Generate Payment Reminder Drafts.
- Send Money Actions to Approval.
- Mark Paid.
- Generate Cash Snapshot.

## 7. Product Build Loop

Purpose: keep AveryTech product development moving.

Inputs:

- Product Roadmap.
- Active build tasks.
- Codex/Cursor prompts.
- Bugs.
- Blockers.
- Test results.
- User feedback.
- Grant requirements.
- Demo readiness.

Outputs:

- Next build task.
- Blocked build items.
- Bugs needing Codex.
- Features needing Cursor.
- MVP progress.
- Demo readiness score.
- Grant-related product gaps.
- Technical debt warnings.

Buttons:

- Run Product Build Loop.
- Generate Cursor Prompts.
- Generate Codex Prompts.
- Create Build Sprint.
- Send Failed Tests to Codex.
- Update Product Roadmap.

## 8. Inbox Triage Loop

Purpose: prepare for email/message triage without unsafe automatic replies.

Inputs:

- Gmail draft records.
- Manually imported emails.
- Future Gmail read integration.
- Client messages.
- Grant/funder messages.
- College/admin messages.
- Contractor messages.

Outputs:

- Needs reply.
- Needs task.
- Needs document.
- Needs calendar block.
- Needs approval.
- Can archive manually.
- Urgent/risk flag.
- Suggested reply draft.

Rules:

- ATLAS can summarize and draft replies.
- ATLAS cannot send replies.
- Messages involving money, legal, client, college, funding, or personal relationships require review.

Buttons:

- Run Inbox Triage.
- Generate Reply Drafts.
- Convert Message to Task.
- Convert Message to Calendar Draft.
- Send Reply to Approval.

## 9. Evidence Collection Loop

Purpose: collect proof-of-work for grants, investors, clients, and credibility.

Inputs:

- Completed tasks.
- Product demos.
- Screenshots.
- Client wins.
- Testimonials.
- Grant documents.
- Pitch materials.
- Content samples.
- File scanner results.
- Weekly reviews.

Outputs:

- Evidence to collect.
- Missing proof.
- Suggested screenshots.
- Case study drafts.
- Grant support evidence.
- Investor proof list.
- Attach-to-packet recommendations.

Rules:

- Do not exaggerate claims.
- Unverified evidence should be marked Needs Review.
- Sensitive evidence requires approval before external use.

Buttons:

- Run Evidence Loop.
- Generate Evidence Checklist.
- Attach Evidence to Grant.
- Attach Evidence to Pitch.
- Create Case Study Draft.
- Send External Evidence Use to Approval.

## 10. KPI Reporting Loop

Purpose: create regular health reports for the company.

Inputs:

- Revenue.
- Grants.
- Clients.
- Outreach.
- Product roadmap.
- Tasks.
- Approvals.
- Action logs.
- Automation logs.
- Invoices.
- Contractor tasks.

Outputs:

- Daily KPI snapshot.
- Weekly KPI report.
- Monthly KPI report.
- Risk warnings.
- Trend notes.
- Recommendations.
- Dashboard updates.

KPIs:

- Monthly revenue.
- Expected revenue.
- Active leads.
- Warm leads.
- Active clients.
- Unpaid invoices.
- Grants due.
- Grants submitted.
- Product progress.
- Approvals waiting.
- Overdue tasks.
- Blocked tasks.
- Delivery risks.

Buttons:

- Run KPI Loop.
- Generate Daily Snapshot.
- Generate Weekly Report.
- Generate Monthly Report.
- Save to Knowledge Base.
- Export to Sheets.

## What Batch 7 Unlocks

After Batch 7, ATLAS should be able to run the company rhythm:

- Run daily plan.
- Run grant check.
- Run client follow-up check.
- Run delivery check.
- Run payment check.
- Run product build check.
- Run evidence check.
- Run KPI report.
- Create the tasks.
- Create the drafts.
- Create the approvals.
- Create the notifications.
- Log the results.
- Tell Cole what matters now.

## Batch 8 Preview

Batch 8 should be ATLAS Scheduler and Autopilot Control:

- Scheduled loop runner.
- Autopilot permission levels.
- Morning brief automation.
- Weekly review automation.
- Grant deadline monitor.
- Client follow-up monitor.
- Invoice monitor.
- Approval reminders.
- System health checks.
- Autopilot pause switch.

Batch 7 gives ATLAS routines.

Batch 8 gives ATLAS a controlled autopilot.
