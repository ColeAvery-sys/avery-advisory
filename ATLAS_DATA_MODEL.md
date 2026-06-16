# ATLAS Data Model

Date: 2026-06-11

## Model Goals

The data model must support:

- persistent storage
- search
- relationship linking
- capture from multiple interfaces
- reasoning and recommendation
- auditing
- portability

## Shared Base Fields

Every primary object should support these base fields:

- `id`
- `objectType`
- `title`
- `summary`
- `status`
- `priority`
- `owner`
- `source`
- `tags`
- `createdAt`
- `updatedAt`
- `archivedAt`
- `approvalStatus`
- `visibility`

Optional shared fields:

- `sourceInterface`
- `sourceMessageId`
- `sourceFilePath`
- `sourceUrl`
- `dueDate`
- `completedAt`
- `confidence`
- `riskLevel`

## Core Object Types

### Task

Purpose:

- track executable work

Required fields:

- `title`
- `summary`
- `status`
- `priority`
- `dueDate`
- `owner`

Relationships:

- belongs to `Project`
- may originate from `Memory`
- may be triggered by `Journal`
- may reference `Contact`

### Project

Purpose:

- group related work and outcomes

Required fields:

- `title`
- `summary`
- `status`
- `owner`
- `area`

Relationships:

- contains `Task`
- links to `Goal`
- links to `Memory`
- links to `Knowledge`

### Goal

Purpose:

- capture intended outcomes

Required fields:

- `title`
- `summary`
- `status`
- `targetDate`
- `successCriteria`

Relationships:

- linked by `Project`
- linked by `Task`
- influenced by `Memory`
- reviewed in `Journal`

### Memory

Purpose:

- store durable recall

Required fields:

- `title`
- `summary`
- `fullText`
- `memoryType`
- `confidence`
- `status`

Relationships:

- links to `Task`
- links to `Project`
- links to `Goal`
- links to `Contact`
- links to `Knowledge`
- links to `Journal`

### Contact

Purpose:

- store people and orgs

Required fields:

- `name`
- `summary`
- `type`
- `status`

Relationships:

- linked by `Task`
- linked by `Project`
- linked by `Memory`
- linked by `Journal`

### Knowledge

Purpose:

- store durable facts, notes, rules, and reference material

Required fields:

- `title`
- `summary`
- `knowledgeType`
- `source`
- `confidence`

Relationships:

- linked to `Memory`
- linked to `Project`
- linked to `Task`
- linked to `Journal`

### Journal

Purpose:

- store daily reflection and operating history

Required fields:

- `title`
- `entryDate`
- `summary`
- `fullText`
- `mood`
- `energy`

Relationships:

- links to `Task`
- links to `Project`
- links to `Goal`
- links to `Memory`
- links to `Contact`
- links to `Knowledge`

## File Metadata

ATLAS should track file metadata separately from file contents.

Required fields:

- `id`
- `path`
- `name`
- `mimeType`
- `fileType`
- `owner`
- `status`
- `visibility`
- `checksum`
- `createdAt`
- `updatedAt`

Relationships:

- may attach to `Task`
- may attach to `Project`
- may attach to `Memory`
- may attach to `Goal`
- may attach to `Journal`

## Relationship Records

Relationships should be first-class records, not just embedded text.

Required fields:

- `id`
- `fromObjectType`
- `fromObjectId`
- `toObjectType`
- `toObjectId`
- `relationshipType`
- `strength`
- `createdAt`
- `updatedAt`

Suggested relationship types:

- `belongsTo`
- `references`
- `derivedFrom`
- `supports`
- `blocks`
- `reminds`
- `followsUpOn`
- `captures`
- `summarizes`
- `confirms`

## Indexing Strategy

ATLAS Core should index by:

- object type
- status
- owner
- priority
- due date
- tags
- source interface
- relationships
- confidence

Memory and knowledge should also support semantic search.

## Storage Strategy

The first data layer should separate:

1. canonical objects
2. relationship records
3. audit logs
4. interface drafts
5. derived search indexes

No interface should directly own canonical records.

## Recommended Tables Or Collections

- `objects`
- `relationships`
- `audit_logs`
- `interface_sessions`
- `capture_events`
- `search_indexes`
- `attachments`
- `file_metadata`

## Canonical Object Rules

1. Every object has one primary record.
2. Every object may have many relationships.
3. Every object can be captured from any interface.
4. Every object can be searched.
5. Every object can be linked to memory.
6. Every object can be archived without being destroyed.

