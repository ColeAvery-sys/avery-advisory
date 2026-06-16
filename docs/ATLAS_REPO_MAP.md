# ATLAS Repo Map

Generated: 2026-05-28

## Current Structure

This repo is a flat local TypeScript and JavaScript utility workspace for ATLAS HQ and the ATLAS Command Center v1 shell.

- Root `*.ts` files: ATLAS backend engines for routing, approvals, portals, marketing, sales, product QA, media operations, rights tracking, and related demos/tests.
- Root `*.js` files: original priority scoring demo and tests.
- `dist/`: compiled JavaScript output from `tsc`.
- `node_modules/`: local TypeScript dependency.
- `package.json`: npm scripts for demos and test batches.
- `tsconfig.json`: TypeScript compiler config.
- `README.md`: master file index and usage notes.
- `docs/atlas_command_center/`: local ATLAS Command Center v1 shell, styles, mock bootstrap data, and local server.
- `docs/career_os/`: local React Career OS dashboard, server, and copy-paste generation UI.
- `atlasSharedDataLayer.ts`: shared file-backed data layer for ideas, leads, tasks, divisions, content packages, grants, approvals, and audit logs.
- `BATCH_*.md`: batch-level architecture notes.
- `APP_DEV_BARE_MINIMUM_JOURNAL.md`: side-quest app development packet.
- `atlas_ops/`: local operations folder created for practical operator workflows, logs, prompts, approvals, asset rights, and reports.
- `docs/`: repo maps, environment notes, summaries, and implementation documentation.

## Main Scripts

From `package.json`:

- `npm test`: runs the full local test suite.
- `npm run test:score`: tests the original priority scorer.
- `npm run test:router`: tests the ATLAS agent router.
- `npm run test:batch2` through `npm run test:batch19`: run compiled tests for implemented ATLAS batches.
- `npm run demo`: runs the original score demo.
- `npm run demo:batch2` through `npm run demo:batch19`: run compiled demos for implemented batches.

All TypeScript test/demo scripts compile with `tsc` before running from `dist/`.

## Servers, Ports, And Local Services

The ATLAS Command Center v1 shell now has a local server and shared data layer:

- `npm run atlas:command-center`
- `http://localhost:8788/dashboard`
- `atlas_ops/logs/atlas_shared_data.json`

Career OS has its own local server and file-backed profile store:

- `npm run career:os`
- `http://localhost:8799/`
- `atlas_ops/logs/career_os_master.json`

The rest of the repo still behaves like a local module/test workspace. `systemHealthMonitorEngine.ts` includes health-check concepts, but it does not start a server.

## Environment Variables Found

No project-specific `process.env` usage was found outside `node_modules`.

The only environment variable references detected were inside TypeScript's installed dependency files, not ATLAS source files.

## Startup Commands

Primary verification:

```bash
npm test
```

Useful demos:

```bash
npm run demo
npm run demo:batch19
```

Local helper scripts added:

```powershell
.\start-atlas-local.ps1
```

```bash
./start-atlas-local.sh
```

These helpers point to the ATLAS Command Center local server and the main validation command. They still run no paid or external actions.

## Known Missing Files Or Broken References

- No `/docs` folder existed before this organization pass.
- No `.env.example` existed before this organization pass.
- No active intake endpoint was found, so the intake logging upgrade is documented as a local CSV proposal in `atlas_ops/logs/intake_log.csv`.
- No package script exists for Batch 15, which appears to be planned in conversation but not currently present in source files.
- Git is not available in this environment, so branch/commit status could not be inspected with `git`.

## Suggested Next Steps

1. Keep using local CSV/Markdown ops files until a persistent app database exists.
2. Add a real intake endpoint only after the ATLAS HQ app/server layer exists.
3. Wire future paid tools, including ElevenLabs, behind explicit environment variables and approval gates.
4. Add a small `docs/CHANGELOG.md` once batch work continues to accelerate.
5. When Cursor is responsive, have Cursor build UI pages that read from the same ops concepts: approvals, asset rights, daily reports, and Easy Mode decisions.
