# ATLAS Memory Engine V1 Spec

Date: 2026-06-11

## Goal

Define the smallest working Memory Engine that can act as the first executable nucleus of ATLAS Core.

This spec follows the current ATLAS Core architecture:

- ATLAS Core is the source of truth.
- Interfaces are replaceable.
- Memory is the product.
- No interface owns primary data.

## Scope

Memory Engine V1 must support:

- Save a memory
- Retrieve a memory by ID
- Search memories
- Tag memories
- Link memories to projects
- Link memories to tasks
- Link memories to contacts
- Store journal entries
- Log every memory action
- Survive app restart

## Out Of Scope

Do not build:

- dashboard work
- voice work
- Discord
- Telegram
- new UI
- browser automation
- strategic advisor modules
- pattern recognition modules
- task/project/goal full implementations beyond references needed for memory links

## Design Principle

Memory Engine V1 is not a generic content system.
It is the first durable ATLAS Core object store for context, recall, and journaling.

## Canonical Objects Used By V1

Memory Engine V1 must directly support these canonical object types:

- Memory
- Journal
- Task reference
- Project reference
- Contact reference

It may store lightweight references to other objects, but it must not own the full downstream systems.

## Database Schema

### Tables

#### `memory_entries`

Purpose:

- store durable memories

Columns:

- `id` TEXT PRIMARY KEY
- `title` TEXT NOT NULL
- `summary` TEXT NOT NULL
- `body` TEXT NOT NULL
- `memory_type` TEXT NOT NULL
- `source` TEXT NOT NULL
- `confidence` REAL NOT NULL DEFAULT 0.5
- `status` TEXT NOT NULL DEFAULT 'Active'
- `visibility` TEXT NOT NULL DEFAULT 'Private'
- `created_at` TEXT NOT NULL
- `updated_at` TEXT NOT NULL
- `archived_at` TEXT NULL

Indexes:

- `idx_memory_entries_created_at`
- `idx_memory_entries_updated_at`
- `idx_memory_entries_status`
- `idx_memory_entries_memory_type`

#### `memory_tags`

Purpose:

- support multi-tag search and filtering

Columns:

- `id` TEXT PRIMARY KEY
- `memory_id` TEXT NOT NULL
- `tag` TEXT NOT NULL
- `created_at` TEXT NOT NULL

Indexes:

- `idx_memory_tags_memory_id`
- `idx_memory_tags_tag`

#### `memory_links`

Purpose:

- link memories to other canonical objects

Columns:

- `id` TEXT PRIMARY KEY
- `memory_id` TEXT NOT NULL
- `linked_object_type` TEXT NOT NULL
- `linked_object_id` TEXT NOT NULL
- `link_type` TEXT NOT NULL
- `created_at` TEXT NOT NULL

Indexes:

- `idx_memory_links_memory_id`
- `idx_memory_links_linked_object`
- `idx_memory_links_link_type`

#### `journal_entries`

Purpose:

- store reflective journal history that can seed memory and pattern analysis later

Columns:

- `id` TEXT PRIMARY KEY
- `entry_date` TEXT NOT NULL
- `title` TEXT NOT NULL
- `summary` TEXT NOT NULL
- `body` TEXT NOT NULL
- `mood` TEXT NULL
- `energy` TEXT NULL
- `status` TEXT NOT NULL DEFAULT 'Active'
- `created_at` TEXT NOT NULL
- `updated_at` TEXT NOT NULL

Indexes:

- `idx_journal_entries_entry_date`
- `idx_journal_entries_created_at`
- `idx_journal_entries_status`

#### `journal_links`

Purpose:

- connect journal entries to memories, tasks, projects, contacts, and knowledge later

Columns:

- `id` TEXT PRIMARY KEY
- `journal_id` TEXT NOT NULL
- `linked_object_type` TEXT NOT NULL
- `linked_object_id` TEXT NOT NULL
- `link_type` TEXT NOT NULL
- `created_at` TEXT NOT NULL

Indexes:

- `idx_journal_links_journal_id`
- `idx_journal_links_linked_object`

#### `memory_actions`

Purpose:

- log every memory action

Columns:

- `id` TEXT PRIMARY KEY
- `action_type` TEXT NOT NULL
- `object_type` TEXT NOT NULL
- `object_id` TEXT NOT NULL
- `actor` TEXT NOT NULL
- `status` TEXT NOT NULL
- `details` TEXT NOT NULL
- `created_at` TEXT NOT NULL

Indexes:

- `idx_memory_actions_object`
- `idx_memory_actions_action_type`
- `idx_memory_actions_created_at`

## API Routes

Memory Engine V1 should expose these routes through the ATLAS Core backend:

### Memory Routes

- `POST /api/memory`
  - Create a memory
- `GET /api/memory/:id`
  - Retrieve one memory by ID
- `GET /api/memory`
  - Search memories using query params
- `PATCH /api/memory/:id`
  - Update a memory
- `POST /api/memory/:id/archive`
  - Archive a memory

### Tag Routes

- `POST /api/memory/:id/tags`
  - Add tags to a memory
- `DELETE /api/memory/:id/tags/:tag`
  - Remove a tag from a memory

### Link Routes

- `POST /api/memory/:id/links`
  - Link a memory to a project, task, contact, or knowledge item
- `DELETE /api/memory/:id/links/:linkId`
  - Remove a memory link

### Journal Routes

- `POST /api/journal`
  - Create a journal entry
- `GET /api/journal/:id`
  - Retrieve one journal entry by ID
- `GET /api/journal`
  - Search or filter journal entries
- `POST /api/journal/:id/links`
  - Link a journal entry to a canonical object

### Action Log Routes

- `GET /api/memory/actions`
  - Read memory action logs

## Service Functions

Memory Engine V1 should expose these core service functions:

### Memory Service

- `saveMemory(input)`
- `getMemoryById(id)`
- `searchMemories(query, filters)`
- `updateMemory(id, patch)`
- `archiveMemory(id)`

### Tag Service

- `addMemoryTags(memoryId, tags)`
- `removeMemoryTag(memoryId, tag)`
- `listMemoryTags(memoryId)`

### Link Service

- `linkMemory(memoryId, linkedObjectType, linkedObjectId, linkType)`
- `unlinkMemory(memoryId, linkId)`
- `listMemoryLinks(memoryId)`

### Journal Service

- `saveJournalEntry(input)`
- `getJournalEntryById(id)`
- `searchJournalEntries(query, filters)`
- `linkJournalEntry(journalId, linkedObjectType, linkedObjectId, linkType)`

### Action Log Service

- `logMemoryAction(actionType, objectType, objectId, actor, status, details)`
- `listMemoryActions(filters)`

## Search Rules

Search must support:

- title search
- summary search
- body search
- tag search
- memory type search
- status search
- linked-object filtering

Search should return:

- exact matches first
- tagged matches second
- body-only matches last

## Linking Rules

Memory links must support:

- `relatesTo`
- `supports`
- `followsUpOn`
- `createdFrom`
- `references`
- `reminds`

Every memory may link to:

- many tasks
- many projects
- many contacts
- many journal entries later if needed

## Error Handling Plan

Memory Engine V1 must fail safely.

Required errors:

- missing required fields
- invalid IDs
- duplicate tag entries
- duplicate link entries
- unsupported link types
- search query too short or invalid
- storage write failure
- storage read failure

Required behavior:

- return structured errors
- do not destroy existing data on failure
- log the failure as an action
- preserve input for retry when possible

## Logging Plan

Every memory-related action must be logged:

- create
- update
- archive
- tag add
- tag remove
- link add
- link remove
- journal create
- journal update
- search
- failure

Action log records must include:

- action type
- object type
- object ID
- actor
- status
- details
- timestamp

## Test Plan

Memory Engine V1 should ship with tests for:

### Create and Retrieve

- save 10 test memories
- retrieve each memory by ID
- confirm fields persist

### Search

- search by title
- search by summary
- search by tag
- search by memory type
- search by linked object

### Tags

- add tags
- remove tags
- reject duplicate tags

### Links

- link memories to projects
- link memories to tasks
- link memories to contacts
- reject duplicate links

### Journal

- save journal entries
- retrieve journal entries
- search journal entries
- link journal entries

### Restart Survival

- persist data
- restart app or reload store
- confirm data remains available

### Logging

- confirm every action creates a log entry
- confirm failed actions also log

## Migration Plan

Memory Engine V1 migration path:

1. Start from the current file-backed/local store if needed for bootstrap.
2. Create canonical `memory_entries`, `memory_tags`, `memory_links`, `journal_entries`, `journal_links`, and `memory_actions` tables.
3. Migrate any pre-existing local memory, journal, or note data into canonical records.
4. Preserve IDs if possible, otherwise create deterministic migration mappings.
5. Backfill tags from existing metadata.
6. Backfill links from existing relationships or source references.
7. Validate counts before switching read/write traffic.

Migration rules:

- do not overwrite source data until migration validation succeeds
- preserve audit history
- preserve source references
- keep rollback artifacts until the migration is proven stable

## Rollback Plan

If Memory Engine V1 fails after rollout:

1. Stop writes to the new memory tables.
2. Switch reads back to the previous store.
3. Preserve the migrated data snapshot.
4. Record the failure in the action log.
5. Restore the previous store from backup or snapshot.
6. Investigate mismatched counts, missing links, or search failures.

Rollback must not:

- delete prior records
- lose journal history
- lose action logs
- lose tags or links without a recovery copy

## Definition Of Done

Memory Engine V1 is done only when:

- 10 test memories can be saved
- all 10 can be retrieved
- search returns correct results
- tags work
- project/task/contact links work
- journal entries persist
- app restart does not delete data
- logs show every action

## Implementation Boundary

When the build starts, implement only the Memory Engine V1 spec.

Do not add:

- dashboard features
- voice features
- Discord features
- Telegram features
- new UI surfaces
- broader intelligence modules
- extra capture channels beyond what the spec requires

## Recommended Next Step

Implement Memory Engine V1 exactly from this spec.
