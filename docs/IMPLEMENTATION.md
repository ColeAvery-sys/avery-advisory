# Implementation Guide

## Scope
This repo is the working base for `Avery Industries LLC` and the `ATLAS HQ` command center.

Primary domains:
- ATLAS OS and executive command workflows
- division dashboards
- idea vault and institutional memory
- lead generation and CRM
- content operations
- grant operations
- approval and release gates

## Build Priorities
1. Stabilize core navigation and the executive home surface.
2. Keep ATLAS HQ as the central operating layer.
3. Wire revenue-related workflows before expansion features.
4. Add approval gates before any automated external action.
5. Log every important state change and every outbound action.

## Required Standards
- Use `Avery Industries LLC` in all user-facing and internal references.
- Do not rename the company to anything else.
- Keep automations local-first until a user-approved integration is ready.
- Treat outbound communication as draft-only unless the user explicitly approves sending.
- Treat every new feature as incomplete until it has a validation checklist.

## Phase Workflow
### Phase 1
- Define the workflow and its data model.
- Add approval rules.
- Add logging hooks.
- Add tests or a manual validation checklist.

### Phase 2
- Implement the UI or script.
- Keep the layout dense and executive-style.
- Verify mobile behavior.

### Phase 3
- Validate the output against the checklist.
- Update related docs.
- Record the release status and gaps.

### Current Career OS Phase
- Career OS core data model and generator logic added.
- Local React dashboard and file-backed server added.
- Validation script added; build and smoke test still need to be run in this workspace before release.

### Current Avery Advisory Phase
- Public website branding shifted back to Avery Advisory.
- Shared site constants now use the Avery Advisory contact email, founder name, and site URL.
- Homepage, services, about, and contact pages now speak to marketing consolidation first and AI second.
- The Avery Advisory logo image is now used in the header and homepage hero.
- Contact intake now uses `alphapotentiallive@gmail.com` as the primary draft inbox and shows `ColeAvery@Avery-Advisory.com` as the secondary site contact.
- The footer now uses a cleaner multi-column layout and surfaces both contact addresses more clearly.
- The footer contact card now emphasizes the primary inbox and adds direct email/contact actions.
- Stripe now recognizes a public publishable-key config flag and the services page highlights the featured value offer with Stripe-ready status text.
- Next step: finish any remaining Avery Advisory copy sweep and validate the rendered pages.

## Done Means
A feature is not done until:
- it works locally
- it is reviewed against the checklist
- it has tests or a documented validation path
- status docs are updated
