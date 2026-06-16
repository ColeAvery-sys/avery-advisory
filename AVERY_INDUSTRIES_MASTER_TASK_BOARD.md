# Avery Industries Master Task Board

Workbook name: `Avery Industries - Master Task Board`

Purpose: temporary Google Sheets operating system until ATLAS has a full database and dashboard.

Primary goal: Cole can understand company state, approvals, tasks, leads, and blockers quickly without hunting through chat history.

## Required Tabs

1. `Executive Queue`
2. `Agent Tasks`
3. `Approvals`
4. `Executive Reports`
5. `Idea Vault`
6. `Leads`
7. `Departments`
8. `Agents`
9. `SOPs`
10. `Daily Brief`

## Tab Structure

### Executive Queue

Purpose: CEO-only daily view.

Columns:

- Priority
- Task
- Department
- Assigned To
- Status
- Needs Approval
- Due Date
- Notes
- Next Action

Statuses: `Pending`, `Review`, `Approved`, `Complete`, `Blocked`.

### Agent Tasks

Purpose: main task database for all AI agents and departments.

Columns:

- Task ID
- Task Title
- Description
- Department
- Assigned Agent
- Manager Agent
- Priority
- Status
- Approval Required
- Created Date
- Due Date
- Dependencies
- Output Link
- Completion Notes

Task ID format: `AI-0001`, `AI-0002`, `AI-0003`.

Statuses: `Backlog`, `Assigned`, `Working`, `Review`, `Approved`, `Complete`, `Blocked`.

Priorities: `Critical`, `High`, `Medium`, `Low`, `Parking Lot`.

### Approvals

Purpose: anything requiring Cole approval before action.

Columns:

- Approval ID
- Date
- Request
- Requesting Agent
- Department
- Cost
- Risk Level
- Reason
- Status
- Cole Decision
- Decision Date
- Notes

Statuses: `Pending`, `Approved`, `Rejected`, `Needs More Info`.

Risk levels: `Low`, `Medium`, `High`, `Critical`.

Approval-required actions:

- Spend money
- Send emails
- Contact clients
- Post publicly
- Submit grants
- Sign documents
- Hire contractors

### Executive Reports

Purpose: daily and weekly reports from agent managers.

Columns:

- Report ID
- Date
- Department
- Manager Agent
- Summary
- Completed
- Blockers
- Recommendations
- Approvals Needed
- Next 24 Hours

### Idea Vault

Purpose: stores every idea Cole gives ATLAS.

Columns:

- Idea ID
- Idea
- Source
- Division
- Category
- Priority
- Revenue Potential
- Impact Potential
- Status
- Assigned Manager
- Expansion Notes
- Next Action

Categories: `Content`, `Product`, `App`, `Marketing`, `Sales`, `Philanthropy`, `Real Estate`, `Entertainment`, `Education`, `Automation`.

Statuses: `Captured`, `Expanded`, `Assigned`, `Active`, `Paused`, `Archived`.

### Leads

Purpose: Creator Logistics lead database.

Columns:

- Lead ID
- Name
- Company/Channel
- Platform
- Contact
- Source
- Niche
- Opportunity
- Status
- Priority
- Assigned Agent
- Last Contact
- Next Follow-Up
- Notes

Statuses: `New`, `Researching`, `Qualified`, `Draft Proposal`, `Awaiting Approval`, `Contacted`, `Follow-Up`, `Won`, `Lost`, `Archived`.

### Departments

Purpose: official department registry.

Columns:

- Department ID
- Department Name
- Division
- Manager Agent
- Mission
- Success Metric
- Status
- Notes

Starter departments:

- Executive Operations
- Executive Strategy
- ATLAS Systems
- Creator Logistics Sales
- Creator Logistics Operations
- Marketing & Growth
- AveryTech
- Avery Entertainment
- Avery Community Foundation
- Operations
- Knowledge Management
- Monitoring & Security
- Avery Academy
- Avery Music Group
- Avery Collectibles
- Real Estate Initiatives

### Agents

Purpose: official AI agent registry.

Columns:

- Agent ID
- Agent Name
- Title
- Department
- Manager
- Role
- Responsibilities
- Status
- Current Task ID
- Last Report Date
- Notes

Starter agents:

- ATLAS Prime
- Echo
- Circuit
- Broker
- Mercury
- Broadcaster
- Guide
- Apollo
- Lantern
- Forge
- Archivist
- Sentinel

Statuses: `Active`, `Idle`, `Waiting`, `Blocked`, `Disabled`.

### SOPs

Purpose: operating procedures for how the company uses the task board.

Columns:

- SOP ID
- SOP Name
- Department
- Procedure
- Owner
- Status
- Last Updated

Required SOPs:

- Task Creation SOP
- Task Assignment SOP
- Approval Routing SOP
- Daily Report SOP
- Idea Vault SOP
- Lead Management SOP
- Escalation SOP

### Daily Brief

Purpose: single-page CEO brief generated from the rest of the workbook.

Sections:

- Today's Critical Tasks
- Pending Approvals
- Blocked Tasks
- New Leads
- Department Updates
- Recommended CEO Decisions

## Recommended Formulas

Counting tasks by status:

```gs
=COUNTIF('Agent Tasks'!H:H,"Working")
```

Counting approvals pending:

```gs
=COUNTIF(Approvals!I:I,"Pending")
```

Counting high-priority tasks:

```gs
=COUNTIF('Agent Tasks'!G:G,"High")
```

Counting leads by status:

```gs
=COUNTIF(Leads!I:I,"Qualified")
```

Listing tasks due today:

```gs
=FILTER('Agent Tasks'!A:N,'Agent Tasks'!K:K=TODAY())
```

Listing blocked tasks:

```gs
=FILTER('Agent Tasks'!A:N,'Agent Tasks'!H:H="Blocked")
```

Listing tasks requiring approval:

```gs
=FILTER('Agent Tasks'!A:N,'Agent Tasks'!I:I="Yes")
```

## Formatting Rules

- Freeze top row on every tab.
- Bold column headers.
- Add filters on every tab.
- Add dropdown validation for statuses, priorities, approval fields, and risk levels.
- Conditional formatting:
  - `Critical` priority = red
  - `High` priority = orange
  - `Complete` = green
  - `Blocked` = red
  - `Pending` approval = yellow

## SOP: How To Use This Sheet

Cole:

- Start in `Daily Brief`.
- Review `Executive Queue`.
- Decide only on the highest-value approvals and blockers.
- Do not manually manage every task.

ATLAS Prime:

- Converts company priorities into `Agent Tasks`.
- Routes risky work into `Approvals`.
- Produces daily summaries in `Executive Reports`.
- Escalates only the top items to `Executive Queue`.

Codex:

- Uses the board to create schemas, SOPs, automation plans, and backend modules.
- Does not create live integrations that send, spend, publish, submit, or contact people without approval.

Cursor:

- Uses the board to build UI, APIs, dashboards, and integrations.
- Prioritizes the ATLAS Command Center, task views, approval queue, and Creator Logistics lead flow.

Future agents:

- Claim or receive tasks from `Agent Tasks`.
- Report blockers and outputs.
- Never bypass `Approvals`.

## Apps Script Generator

Use:

```txt
atlas_ops/templates/create_avery_master_task_board.gs
```

In Google Apps Script:

1. Create a blank Apps Script project.
2. Paste the file contents.
3. Run `createAveryIndustriesMasterTaskBoard`.
4. Authorize the script.
5. Open the returned spreadsheet URL.

## Next Cursor Batch

Build ATLAS to Google Sheets connection layer:

1. Add sheet ID setting.
2. Build read-only sync for `Agents`, `Departments`, `Agent Tasks`, `Approvals`, and `Leads`.
3. Build local dashboard views from sheet data.
4. Add draft-only write actions for new tasks, approvals, reports, and leads.
5. Require Cole approval before writing externally.
6. Add sync error logging.
7. Add manual import/export fallback.
