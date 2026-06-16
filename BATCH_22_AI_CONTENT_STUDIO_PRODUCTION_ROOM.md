# Batch 22: AI Content Studio And Production Room

Batch 22 builds the production room where ATLAS can turn ideas into scripts, voiceover plans, DaVinci edit plans, thumbnails, asset requests, shot lists, captions, audio libraries, and QC-ready content.

## Modules

- `contentStudioSafety.ts`: shared studio helpers for approval gates, rights checks, claim risk detection, word/credit estimates, and readiness scoring.
- `contentStudioCommandEngine.ts`: content projects, production plans, Cole-waiting queues, missing assets, studio recommendations, and next-stage routing.
- `scriptStudioEngine.ts`: script projects, hooks, outlines, full scripts, shorter/punchier versions, safer-claims versions, shorts extraction, and claim validation.
- `contentQcApprovalEngine.ts`: final content QC, asset rights validation, claims validation, platform policy checks, fix lists, and approval gates for manual publish or client delivery.
- `davinciEditPlannerEngine.ts`: edit plans, timeline structure, Resolve prompts, asset checklists, motion notes, export presets, fulfillment routing, and edit-plan validation.
- `assetGenerationRequestEngine.ts`: asset requests, briefs, image/Blender/animation prompts, manual generated status, project attachment, and rights-tracker handoff.
- `shotListBrollEngine.ts`: shot lists, script-to-shot conversion, b-roll ideas, missing asset flags, asset requests, and edit planner routing.
- `thumbnailCommandEngine.ts`: thumbnail projects, concepts, text options, designer briefs, A/B ideas, risk validation, and manual final gates.
- `captionSubtitleEngine.ts`: caption projects, transcript import, SRT placeholders, short-form captions, caption QA, exports, and edit planner routing.
- `musicSfxLibraryEngine.ts`: music/SFX records, rights checks, usage notes, project attachment, unknown-rights flags, and public-use blocks.
- `voiceoverProductionEngine.ts`: voiceover plans, length and credit estimates, voice direction, recording notes, manual generated status, project attachment, and rights logs.

## Safety Rules

- No automatic publishing or public uploads.
- No automatic client delivery.
- No spending paid generation credits without Cole approval.
- Unknown asset/audio rights block public or commercial use.
- Client assets cannot be reused without permission.
- Unsupported claims fail review.
- Political, legal, financial, health, disability, client, sponsor, grant, and affiliate claims require review.
- Failed rights checks block approval.
- Failed claims checks block approval.
- Sponsor, affiliate, and ad disclosures must be flagged.

## Demo And Tests

```bash
npm run demo:batch22
npm run test:batch22
```

