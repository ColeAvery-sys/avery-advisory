# Batch 21: Real Fulfillment Integrations And Platform Connectors

Batch 21 connects the Batch 20 factory to real platform workflows while staying local/mock-first and approval-gated.

## Modules

- `platformConnectorSafety.ts`: shared connector safety helpers for approvals, rights, QA, payment checks, risk detection, field validation, and logs.
- `platformConnectorCommandEngine.ts`: connector records, permission modes, allowed/blocked action checks, setup checklists, disabling, and integration tasks.
- `platformConnectorErrorRecovery.ts`: connector error records, classification, retry decisions, recovery guidance, manual workarounds, and Codex debug prompts.
- `driveDeliveryFolderBuilder.ts`: Google Drive delivery folder structures, client-visible file validation, mock approved folder creation, packet attachment, share logging, and Drive logs.
- `gmailCustomerDraftConnector.ts`: customer/client/funder draft validation, mock Gmail draft creation after approval, revision/refund drafts, manual sent logging, and Gmail logs.
- `youtubeUploadPackageExporter.ts`: YouTube upload package validation, package exports, description/tag exports, shorts plans, manual upload logging, and YouTube logs.
- `etsyDraftListingConnector.ts`: Etsy listing export validation, JSON/CSV/copy-paste packets, manual listing creation logging, and Etsy connector logs.
- `kdpMetadataExporter.ts`: KDP metadata validation, Markdown/CSV/copy-paste packets, launch checklists, manual publish logging, and KDP safeguards.
- `teespringProductDraftPrep.ts`: Teespring/Spring merch prep validation, upload packets, copy, tags, mockup checks, upload notes, and manual publish logging.
- `invoiceDraftConnector.ts`: Stripe/PayPal/manual invoice draft validation, payment-link draft data, manual creation/sent/paid tracking, and invoice logs.
- `makeFulfillmentTriggerEngine.ts`: Make.com scenario records, payload generation, payload validation, approved mock webhook triggering, result logs, and scenario disabling.

## Safety Rules

- No automatic listing publishing.
- No automatic public video uploads.
- No automatic customer emails.
- No automatic payment requests.
- No automatic refunds.
- No automatic price changes.
- No automatic external Drive sharing.
- No customer-facing automations without Cole approval.
- Unknown asset rights block platform export.
- Failed listing QA blocks platform export.
- Payment actions require approval and logs.
- Connector errors stay visible until resolved.

## Demo And Tests

```bash
npm run demo:batch21
npm run test:batch21
```

