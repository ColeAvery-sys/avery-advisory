# ATLAS HQ Architecture Direction

ATLAS HQ is the future operating system for Avery Industries LLC.

The system should become the central place where ideas, tasks, notes, grants, clients, product plans, approvals, and daily execution all flow through one repeatable company workflow.

## Core Responsibilities

ATLAS should eventually handle:

1. Capturing all ideas, tasks, notes, grants, clients, and product plans.
2. Sorting captured items into departments.
3. Prioritizing work by money, urgency, effort, and long-term value.
4. Creating tasks and checklists.
5. Drafting emails, grants, client packets, and product specs.
6. Dispatching technical work to Cursor and Codex.
7. Tracking what is waiting on Cole.
8. Keeping risky actions behind approval.
9. Generating daily and weekly plans.
10. Building a repeatable company workflow.

## Approval Boundary

ATLAS should not automatically:

- Spend money.
- Send external emails.
- Submit grants.
- Sign contracts.
- Hire people.
- Delete records.
- Publish public content.
- Make legal or financial decisions.

Those actions require Cole approval.

## System Modules

The long-term ATLAS HQ system should be built as a set of small modules that can work independently before becoming one larger app.

### Intake

Captures raw inputs from Cole, files, forms, messages, email, voice notes, or future integrations.

Each intake item should preserve:

- Raw input.
- Source.
- Created date.
- Related person, client, grant, product, or company.
- Attachments or links.
- Initial tags.

### Router

Classifies each intake item by department and assigned agent.

The current `atlasAgentRouter.ts` module is the first version of this layer.

Expected departments include:

- Grants and Funding.
- Creator Logistics.
- Product and Engineering.
- Sales.
- Legal and Finance.
- Personal Operations.

### Priority Engine

Ranks work by financial upside, urgency, effort, long-term value, and personal importance.

The current `scoreAtlasItem.js` module is the first version of this layer.

### Task Builder

Turns routed and scored items into structured tasks, checklists, and next actions.

Each task should include:

- Owner.
- Department.
- Priority.
- Due date or review date.
- Checklist.
- Approval requirement.
- Blockers.
- Status.

### Drafting Layer

Creates drafts but does not send them without approval.

Draft types include:

- Emails.
- Grant responses.
- Client packets.
- Product specs.
- Internal briefs.
- Daily and weekly plans.

### Dispatcher

Sends technical work to the correct building tool.

Dispatch targets include:

- Codex for scripts, functions, tests, backend logic, and small technical tasks.
- Cursor for larger app edits, UI work, multi-file implementation, and interactive project development.

### Approval Queue

Tracks actions waiting on Cole.

Anything involving money, legal/financial decisions, public communication, external submissions, hiring, contracts, record deletion, or public posting must enter this queue before execution.

### Planning Engine

Generates daily and weekly execution plans from:

- Highest-priority items.
- Urgent deadlines.
- Cole-blocked items.
- Client obligations.
- Grant deadlines.
- Product milestones.
- Personal commitments.

## Safety Principle

ATLAS can recommend, draft, organize, score, and prepare.

ATLAS cannot independently commit Avery Industries LLC to external action, financial action, legal action, or public action.

Cole remains the approval authority for risky or irreversible decisions.

For the Batch 4 build sequence, see `BATCH_4_BUILD_ORDER.md`.

For the full Batch 4 safety boundary, see `BATCH_4_SAFETY_RULES.md`.

Recent backend batches extend the operating system into public lead capture, marketing, and revenue operations while preserving the approval boundary:

- Batch 12 receives public website interest and routes it into ATLAS.
- Batch 13 drafts and tracks marketing content but never publishes automatically.
- Batch 14 scores leads, drafts sales materials, calculates quotes, and forecasts revenue but never contacts leads, closes deals, sends contracts, or requests payment without Cole approval.
- Batch 16 adds product development and QA discipline so features, bugs, tests, releases, demos, accessibility, and security/privacy risks are tracked before public, client, grant, or funder use.
- Batch 17 adds operations, outsourcing, creative pipeline support, mission guardrails, and Easy Mode decisions so creative production supports the main company mission instead of distracting from it.
- Batch 18 adds the Media Baron Sales Engine for multi-platform publishing prep, service marketplace listings, Etsy, books, merch, social platforms, Reddit, and analytics, while keeping all platform-facing action approval-gated.
- Batch 19 adds the Brand Empire Map, asset rights tracking, offer ladders, cross-promotion, repurposing, platform policy, ad tests, support drafts, storefront audits, and revenue attribution so the media system becomes connected and safer.
- Batch 20 adds the Marketplace, Fulfillment, and Digital Product Factory for digital products, Etsy products, KDP books, merch, templates, asset packs, listing QA, service orders, order tracking, and customer delivery packets. It can draft, package, QA, and prepare, but it cannot publish, sell, deliver paid work, issue refunds, message customers, change prices, or make platform commitments without Cole approval.
- Batch 21 adds local/mock real-fulfillment connector workflows for Etsy exports, KDP metadata, Teespring product prep, YouTube upload packages, Google Drive delivery folders, Gmail customer drafts, invoice draft tracking, Make.com payloads, connector permissions, and error recovery. It prepares platform actions and logs outcomes while blocking publishing, public uploads, email sending, payment requests, refunds, price changes, external sharing, and customer-facing automations without Cole approval.
- Batch 22 adds the AI Content Studio and Production Room for scripts, voiceover planning, DaVinci edit plans, thumbnails, asset generation requests, shot lists, b-roll, music/SFX rights, captions, and content QC. It can draft and package production work, but public, client-facing, paid-generation, sponsored, rights-sensitive, or claims-sensitive content remains blocked until Cole approval and safety checks pass.
- Batch 23 adds Audience Infrastructure: audience dashboards, community CRM, comment intelligence, supporter tracking, newsletter growth, community hub planning, audience research, feedback mining, surveys, and the superfan pipeline. It can analyze, organize, draft, and recommend, but it cannot impersonate people, send messages automatically, mass-DM users, manipulate communities, or create fake engagement.
- Batch 24 adds the Executive AI Chief of Staff System: executive command center, daily briefing, weekly reality reports, priority arbitration, focus protection, decision queues, goal tracking, delegation, crisis mode, and strategic planning. It exists to protect Cole's bandwidth and force fewer, better priorities.
- Batch 25 adds the Self-Improving Company Intelligence Layer: company memory, lessons learned, win/loss analysis, opportunity discovery, pattern detection, knowledge graph, SOP drafting, predictions, recommendations, and institutional memory. It helps Avery Industries LLC learn from experience, but it cannot automatically change strategy, pricing, hiring, publishing, finances, or policies.
- Batch 26 adds the Autonomous Workforce Layer: talent command, applicant tracking, editor management, contractor management, onboarding academy, skill matrix, workload balancing, performance reviews, knowledge transfer, and career paths. ATLAS can organize, score, recommend, train, and track people, but it cannot hire, fire, discipline, sign contracts, change pay, or assign paid/client work without Cole approval.
- Batch 27 adds the Autonomous Development and R&D Division: R&D command, software project management, feature roadmap scoring, R&D bug prioritization, research lab, experiment tracking, Godot Studio, Blender assets, 3D printing, and prototype scoring. ATLAS can prioritize and recommend builds, but it cannot deploy production code, release products, order hardware, spend money, or approve research claims without Cole approval.
- Batch 28 adds the AveryTech Accessibility Research Institute: research command, participant CRM, pilot programs, accessibility testing, grant intelligence, outcome measurement, publication drafts, university partnerships, healthcare partnerships, and assistive technology roadmaps. ATLAS can organize research and prepare evidence, but it cannot provide medical advice, make clinical claims, approve studies, store diagnosis records, or submit grants without Cole approval and appropriate review.
- Batch 29 adds the Physical HQ and Real-World Operations System: HQ command, property tracking, facility planning, studios, equipment inventory, maker/lab management, events, vehicles/logistics, emergency operations, and expansion planning. ATLAS can plan and inventory real-world operations, but it cannot buy property, sign leases, hire contractors, spend money, approve construction, or take on debt without Cole approval.
- Batch 30 adds the ATLAS Network Operating System: ATLAS Core, unified identity, cross-system memory bus, universal approvals, universal notifications, department AI managers, global search, knowledge mesh, network analytics, and the ATLAS OS dashboard. ATLAS can coordinate the whole organization, but financial, legal, HR, publishing, grant, hiring, research, and customer-facing approvals still require Cole.
- Batch 31 adds the Autonomous Agent Civilization Layer: agent registry, creation factory, training center, skill trees, communication network, task marketplace, reputation, budget system, oversight council, and civilization dashboard. Agents can recommend, draft, and complete approved tasks, but they cannot spend money, hire, fire, publish, approve critical actions, conceal information, or override human decisions.

## Prototype First Rule

Any software project, game, hardware project, accessibility tool, or product idea must pass:

```text
Research -> Prototype -> Validation
```

before entering full development.

ATLAS should actively discourage large projects from skipping this process.

## Evidence Before Expansion Rule

Accessibility products should move through:

```text
Research -> Prototype -> Pilot -> Outcome Measurement -> Grant Readiness -> Scale
```

before large investment.

ATLAS should actively discourage building accessibility products with no user testing or evidence gathering.

## HQ Before Empire Rule

Do not acquire larger space simply because space is available.

Expansion should follow:

```text
Revenue -> Team -> Capacity Need -> Expansion
```

not:

```text
Dream -> Debt
```

ATLAS should hardcode this into expansion recommendations.

## Single Source of Truth Rule

No department should store important information only inside itself.

All critical information must sync into ATLAS Core.

If information exists in multiple places, ATLAS Core becomes the authority.

## Human Sovereignty Rule

Agents exist to assist humans.

Agents cannot override human decisions.

Agents cannot conceal information.

Agents must explain recommendations.

Cole remains final authority.

## Layered ATLAS Stack

After Batch 25, ATLAS is organized into six layers:

1. Money Engine: Creator Logistics, services, products, and stores.
2. Operations Engine: ATLAS HQ, Easy Mode, executive systems, and approval gates.
3. Production Engine: Content Studio, Media Empire, and community/audience systems.
4. Innovation Engine: ATLAS Assist, accessibility, research, grants, and pilots.
5. Creation Engine: Godot, Blender, DaVinci, 3D printing, and smart-glasses preparation.
6. Intelligence Engine: memory, predictions, patterns, recommendations, SOPs, and institutional knowledge.

## Workforce Layer

After Batch 26, Avery Industries LLC can scale beyond Cole plus ATLAS without losing the operating system:

```text
Cole Avery
  |
  v
ATLAS Executive Layer
  |
  +-- Revenue
  +-- Operations
  +-- Innovation
  |
  v
Workforce Layer
  |
  +-- Editors
  +-- Developers
  +-- Artists
  +-- Contractors
  +-- Moderators
```

All people-management actions remain advisory until Cole approves.

## R&D Priority Ladder

1. ATLAS HQ, ATLAS Assist, EchoFrame, and Creator Logistics Tools.
2. Jax Mission Control, Executive Dysfunction App, and Accessibility Utilities.
3. Smart Glasses Integration, Voice Systems, and Research Projects.
4. Godot Games, VR Concepts, 3D Printing, and Blender Asset Library.
5. Experimental Entertainment Projects.

## Seven-Layer Avery Industries LLC Structure

After Batch 29, the company stack is:

1. Revenue: Creator Logistics, services, and products.
2. Operations: ATLAS HQ and the executive layer.
3. Media Empire: content, audience, and community.
4. Accessibility Institute: research, pilots, and grants.
5. R&D: software, games, Blender, smart glasses, and prototypes.
6. Workforce: editors, contractors, and developers.
7. Physical HQ: facilities, equipment, studios, labs, and events.

## Four Roadmap Kingdoms

After Batch 23, the roadmap splits into four operating kingdoms:

1. Money: Creator Logistics, services marketplace, Etsy, KDP, merch, funnels, and lead magnets.
2. ATLAS: ATLAS HQ, Easy Mode, approval system, automation engine, and company OS.
3. AveryTech: ATLAS Assist, accessibility tools, grant pipeline, research, and pilot programs.
4. Media Empire: YouTube, New Prometheus, Content Studio, community, audience growth, books, merch, future games, and future animation.

## Permanent Master Priority Ladder

1. Creator Logistics revenue, client fulfillment, and cash flow.
2. ATLAS HQ, executive systems, and Easy Mode.
3. ATLAS Assist, accessibility products, and grant readiness.
4. Media Baron system, Content Studio, and audience growth.
5. Digital products, books, and merch.
6. Godot, Blender, 3D printing, and smart glasses.
7. Experimental ideas.
