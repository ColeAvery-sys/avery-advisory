# ATLAS Batch 11: Client Portal and External-Facing Systems

Batch 11 lets outside people submit information into ATLAS safely.

External users can submit forms, links, files, notes, testimonials, revision requests, and partner inquiries.

ATLAS can organize, score, draft, prepare, notify, and create internal records.

Cole still approves client delivery, pricing, contracts, payment requests, public-facing messages, grant submissions, contractor assignments, and sensitive external communication.

## Backend Engines

- `creatorClientPortalEngine.ts`: safe client-visible project summaries.
- `creatorLeadIntakeEngine.ts`: creator lead intake, scoring, package recommendation, CRM/pipeline records, and draft replies.
- `clientOnboardingEngine.ts`: onboarding completion checks, project records, checklists, and start approval items.
- `clientDeliveryTrackerEngine.ts`: internal delivery tracking and simplified client status.
- `revisionRequestEngine.ts`: structured revision requests, scope checks, and draft responses.
- `contractorPortalEngine.ts`: contractor-visible task records with restricted fields hidden.
- `grantPartnerIntakeEngine.ts`: grant/funder intake records, fit scoring, and follow-up drafts.
- `clinicDisabilityPartnerIntakeEngine.ts`: clinic/disability partner intake with compliance concerns.
- `publicRequestRouterEngine.ts`: public request classification, routing, CRM item, inbox item, and draft reply.
- `testimonialCaseStudyEngine.ts`: testimonial permissions, case study drafts, public-use approval, and sanitization.

## Safety Rules

1. External users can submit forms, links, files, notes, and requests.
2. ATLAS can create internal records from external submissions.
3. ATLAS can score leads, recommend packages, draft replies, create tasks, and notify agents.
4. ATLAS cannot automatically accept clients.
5. ATLAS cannot automatically send replies.
6. ATLAS cannot promise pricing, timelines, funding, clinical outcomes, or partnerships.
7. ATLAS cannot expose internal notes to clients, contractors, partners, or public users.
8. ATLAS cannot publish testimonials without permission and Cole approval.
9. ATLAS cannot expose contractor pay, profit margins, risk flags, or legal/finance notes externally.
10. ATLAS cannot collect unnecessary sensitive medical information.
11. Client delivery requires Cole approval.
12. Contractor assignments require Cole approval.
13. Grant/funder follow-ups require Cole approval.
14. Anything that commits Avery Industries LLC externally requires Cole approval.

## Batch 12 Preview

Batch 12 should be Public Website, Landing Pages, and Conversion System:

- AveryTech landing page.
- ATLAS Assist landing page.
- Creator Logistics sales page.
- Grant/funder credibility page.
- Partner page.
- Case studies page.
- Lead magnets.
- Email capture.
- Pricing page.
- Demo request page.
- SEO content structure.
- Analytics events.
- Conversion tracking.
