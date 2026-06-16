# ATLAS Roadmap

Date: 2026-06-11

Goal:
- Make ATLAS usable as a real operating system before adding new features.

## Prioritization Rules

1. Foundation before polish.
2. Memory before more features.
3. Tool use before automation sprawl.
4. File access before browser work.
5. Email and calendar before voice.
6. Dashboard must reflect real state, not mock state.

## Highest ROI Tasks

### 1. Authentication and role permissions
- Why it matters: everything else becomes safer and easier to gate.
- Current status: missing.
- Outcome: a real user/session model and permission checks.

### 2. Persistent database layer
- Why it matters: current persistence is file-backed JSON and mock contract state.
- Current status: stub/mock only.
- Outcome: stable shared state, migrations, and scalable storage.

### 3. Unified memory service
- Why it matters: ATLAS needs one context spine for company, personal, and project memory.
- Current status: implemented in pieces.
- Outcome: one memory API for retrieval, consolidation, and assistant context.

### 4. Unified tool registry
- Why it matters: tool use is scattered across helpers and connectors.
- Current status: partial.
- Outcome: one approval-gated execution layer.

### 5. Dashboard backend replacement
- Why it matters: the command center is currently a mock contract.
- Current status: stub/mock only.
- Outcome: a real operating surface backed by live data.

### 6. File bridge
- Why it matters: file workflows are advisory instead of operational.
- Current status: partial.
- Outcome: safe read/write/move/rename/delete with logs and approvals.

### 7. Email pipeline
- Why it matters: drafting exists, but inbox and send remain incomplete.
- Current status: partial.
- Outcome: draft, search, approve, send, and track.

### 8. Calendar pipeline
- Why it matters: scheduling is still suggestion-based.
- Current status: partial.
- Outcome: read, create, edit, delete, and daily agenda.

### 9. Backup and restore
- Why it matters: local state is vulnerable without recovery.
- Current status: missing.
- Outcome: restore confidence and safer iteration.

### 10. Browser automation
- Why it matters: browser tasks are missing entirely.
- Current status: missing.
- Outcome: research and external workflow support.

## What To Defer

- Voice wake word and speech loop.
- Smart-glasses work.
- Facial and hand-signal research.
- Deep browser intelligence.
- Larger agent civilization ideas.

These should wait until:
- auth exists
- database exists
- memory is unified
- tool use is unified
- dashboard reflects real backend state

## Single Recommended Build

Build the authenticated persistent core first:
- auth
- permissions
- durable storage
- audit logging
- dashboard connection

## Suggested Build Order

1. Authentication and permissions.
2. Persistent database abstraction.
3. Unified memory/context service.
4. Unified tool registry.
5. Dashboard backend replacement.
6. File bridge.
7. Email pipeline.
8. Calendar pipeline.
9. Backup and restore.
10. Browser automation.

## Exit Criteria For Phase 1

ATLAS can be called usable when:
- the dashboard shows real state
- the assistant remembers prior work
- tool actions are approval gated
- file actions are tracked
- email and calendar are usable
- auth protects the system
- backup and recovery exist

## One-Line Direction

Stop adding surface area until the core is authenticated, persistent, logged, and context-aware.
