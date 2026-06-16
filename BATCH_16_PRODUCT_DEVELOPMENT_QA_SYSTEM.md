# Batch 16: Product Development and QA System

ATLAS Batch 16 adds local backend logic for product discipline across ATLAS HQ, ATLAS Intake, ATLAS Assist, Creator Logistics Portal, the public website, and future AveryTech products.

## Core Rule

ATLAS can plan, test, document, and dispatch product work.

ATLAS cannot silently ship public-facing changes, expose sensitive data, or claim a product is ready without QA and Cole approval.

## Modules

- `productCommandEngine.ts`: product snapshots, blocked products, build priorities, and product tasks.
- `bugTrackerEngine.ts`: bug reports, severity classification, reproduction steps, and Codex/Cursor prompts.
- `featureSpecEngine.ts`: feature specs, user stories, acceptance criteria, edge cases, risk classification, and dispatch prompts.
- `testCaseManagerEngine.ts`: test cases, regression suites, manual results, failed-test bug creation, and untested critical flows.
- `securityPrivacyChecklistEngine.ts`: security/privacy checklists, critical issue tracking, privacy reviews, and release blockers.
- `accessibilityQaEngine.ts`: accessibility checklists, issue tracking, fix prompts, internal reports, and severe issue blockers.
- `mvpReadinessEngine.ts`: MVP readiness scoring, missing items, blockers, risks, docs, and approval requirements.
- `demoReadinessEngine.ts`: demo plans, scripts, checklists, sample data plans, backup plans, and live demo risk flags.
- `releasePlannerEngine.ts`: release plans, release readiness validation, release notes, rollback plans, blockers, and manual release approval.
- `userFeedbackEngine.ts`: feedback records, triage, conversion to features or bugs, summaries, and repeated feedback patterns.

## Safety Rules

1. ATLAS can create product specs, test cases, bug reports, release notes, and QA plans.
2. ATLAS cannot mark public, client, or funder-facing products ready without Cole approval.
3. Critical bugs block release.
4. Security/privacy critical issues block release.
5. Accessibility issues should be flagged honestly.
6. Do not claim full accessibility compliance without professional audit.
7. Do not expose sensitive data in demos.
8. Do not expose secrets in UI, logs, or exports.
9. Public, client, grant, financial, legal, disability, or personal-data features require risk review.
10. Every release should have known issues, rollback plan, and release notes.
11. Vague features should be marked Needs Review.
12. Failed critical tests should generate bug reports and Codex prompts.

## What This Unlocks

ATLAS can now say whether a product is blocked, whether a demo is safe, whether MVP readiness is real, which bugs block release, which specs are vague, which accessibility/security issues need review, and whether Codex or Cursor should handle the next technical task.
