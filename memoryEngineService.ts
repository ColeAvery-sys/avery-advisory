import {
  JournalLinkRecord,
  JournalRecord,
  JournalSearchFilters,
  JournalView,
  MemoryActionRecord,
  MemoryActionType,
  MemoryLinkRecord,
  MemoryLinkTargetType,
  MemoryRecord,
  MemorySearchFilters,
  MemoryView,
} from "./memoryEngineTypes";
import {
  loadMemoryEngineDatabase,
  resetMemoryEngineRuntime,
  saveMemoryEngineDatabase,
} from "./memoryEngineRepository";
import { ensureMemoryEngineV1Migration } from "./memoryEngineMigration";

export type MemoryInput = {
  id?: string;
  title: string;
  summary: string;
  body: string;
  memoryType: string;
  source?: string;
  confidence?: number;
  visibility?: string;
  tags?: string[];
  projectIds?: string[];
  taskIds?: string[];
  contactIds?: string[];
  actor?: string;
};

export type MemoryPatch = Partial<Pick<MemoryInput, "title" | "summary" | "body" | "memoryType" | "source" | "confidence" | "visibility">>;

export type JournalInput = {
  id?: string;
  entryDate: string;
  title: string;
  summary: string;
  body: string;
  mood?: string;
  energy?: string;
  tags?: string[];
  projectIds?: string[];
  taskIds?: string[];
  contactIds?: string[];
  memoryIds?: string[];
  actor?: string;
};

type SearchBoost = {
  exactTitle: boolean;
  tagMatch: boolean;
  bodyMatch: boolean;
  linkedMatch: boolean;
};

export function saveMemory(input: MemoryInput): MemoryView {
  const db = loadDatabaseWithMigration();
  validateMemoryInput(input);
  const now = new Date().toISOString();
  const memory: MemoryRecord = {
    id: input.id || createId("memory"),
    title: normalizeText(input.title),
    summary: normalizeText(input.summary),
    body: normalizeText(input.body),
    memoryType: normalizeText(input.memoryType),
    source: normalizeText(input.source || "ATLAS"),
    confidence: clampConfidence(input.confidence),
    status: "Active",
    visibility: normalizeText(input.visibility || "Private"),
    createdAt: now,
    updatedAt: now,
    archivedAt: null,
  };

  const index = db.memories.findIndex((item) => item.id === memory.id);
  if (index >= 0) {
    db.memories[index] = memory;
  } else {
    db.memories.push(memory);
  }

  upsertTags(db, memory.id, input.tags || []);
  upsertLinks(db, memory.id, input.projectIds || [], "Project", "createdFrom");
  upsertLinks(db, memory.id, input.taskIds || [], "Task", "createdFrom");
  upsertLinks(db, memory.id, input.contactIds || [], "Contact", "createdFrom");
  logAction(db, "Memory Created", "Memory", memory.id, input.actor || "ATLAS", "Success", {
    memoryType: memory.memoryType,
    tagCount: input.tags ? input.tags.length : 0,
    projectLinks: input.projectIds ? input.projectIds.length : 0,
    taskLinks: input.taskIds ? input.taskIds.length : 0,
    contactLinks: input.contactIds ? input.contactIds.length : 0,
  });

  saveDatabase(db);
  return getMemoryView(db, memory.id);
}

export function getMemoryById(id: string, actor: string = "ATLAS"): MemoryView {
  const db = loadDatabaseWithMigration();
  validateId(id, "memory id");
  const memory = findMemory(db, id);
  if (memory.status === "Deleted") {
    throw memoryError("Memory has been deleted.", 404);
  }

  logAction(db, "Memory Retrieved", "Memory", id, actor, "Success", { title: memory.title });
  return getMemoryView(db, id);
}

export function searchMemories(query: string, filters: MemorySearchFilters = {}, actor: string = "ATLAS"): MemoryView[] {
  const db = loadDatabaseWithMigration();
  const normalizedQuery = normalizeText(query || "").toLowerCase();
  if (normalizedQuery.length > 0 && normalizedQuery.length < 2) {
    throw memoryError("Search query too short.", 400);
  }
  const results = db.memories
    .filter((memory) => memory.status !== "Deleted")
    .map((memory) => ({
      memory,
      view: getMemoryView(db, memory.id),
      boost: scoreMemory(memory, db, normalizedQuery, filters),
    }))
    .filter((item) => item.boost.exactTitle || item.boost.tagMatch || item.boost.bodyMatch || item.boost.linkedMatch || normalizedQuery.length === 0)
    .filter((item) => matchesMemoryFilters(item.view, filters))
    .sort((a, b) => compareBoost(b.boost, a.boost))
    .map((item) => item.view);

  logAction(db, "Memory Searched", "Memory", "search", actor, "Success", {
    query: normalizedQuery,
    resultCount: results.length,
    filters: filters,
  });
  return results;
}

export function updateMemory(id: string, patch: MemoryPatch, actor: string = "ATLAS"): MemoryView {
  const db = loadDatabaseWithMigration();
  validateId(id, "memory id");
  const memory = findMemory(db, id);
  if (memory.status === "Deleted") {
    throw memoryError("Cannot update a deleted memory.", 410);
  }

  if (patch.title !== undefined) memory.title = normalizeText(patch.title);
  if (patch.summary !== undefined) memory.summary = normalizeText(patch.summary);
  if (patch.body !== undefined) memory.body = normalizeText(patch.body);
  if (patch.memoryType !== undefined) memory.memoryType = normalizeText(patch.memoryType);
  if (patch.source !== undefined) memory.source = normalizeText(patch.source);
  if (patch.confidence !== undefined) memory.confidence = clampConfidence(patch.confidence);
  if (patch.visibility !== undefined) memory.visibility = normalizeText(patch.visibility);
  memory.updatedAt = new Date().toISOString();

  logAction(db, "Memory Updated", "Memory", id, actor, "Success", { patch: patch });
  saveDatabase(db);
  return getMemoryView(db, id);
}

export function deleteMemory(id: string, actor: string = "ATLAS"): MemoryRecord {
  return archiveMemory(id, actor);
}

export function archiveMemory(id: string, actor: string = "ATLAS"): MemoryRecord {
  const db = loadDatabaseWithMigration();
  validateId(id, "memory id");
  const memory = findMemory(db, id);
  if (memory.status === "Deleted") {
    throw memoryError("Memory has already been deleted.", 410);
  }

  memory.status = "Deleted";
  memory.archivedAt = new Date().toISOString();
  memory.updatedAt = memory.archivedAt;
  logAction(db, "Memory Deleted", "Memory", id, actor, "Success", { title: memory.title });
  saveDatabase(db);
  return cloneRecord(memory);
}

export function tagMemory(id: string, tags: string[], actor: string = "ATLAS"): MemoryView {
  const db = loadDatabaseWithMigration();
  validateId(id, "memory id");
  const memory = findMemory(db, id);
  if (memory.status === "Deleted") throw memoryError("Cannot tag a deleted memory.", 410);
  const cleaned = normalizeTags(tags);
  upsertTags(db, id, cleaned);
  memory.updatedAt = new Date().toISOString();
  logAction(db, "Memory Tagged", "Tag", id, actor, "Success", { tags: cleaned });
  saveDatabase(db);
  return getMemoryView(db, id);
}

export function removeMemoryTag(id: string, tag: string, actor: string = "ATLAS"): MemoryView {
  const db = loadDatabaseWithMigration();
  validateId(id, "memory id");
  validateId(tag, "tag");
  const before = db.memoryTags.length;
  db.memoryTags = db.memoryTags.filter((item) => !(item.memoryId === id && item.tag.toLowerCase() === normalizeText(tag).toLowerCase()));
  if (before === db.memoryTags.length) {
    throw memoryError("Tag not found on memory.", 404);
  }
  const memory = findMemory(db, id);
  memory.updatedAt = new Date().toISOString();
  logAction(db, "Memory Tag Removed", "Tag", id, actor, "Success", { tag: normalizeText(tag) });
  saveDatabase(db);
  return getMemoryView(db, id);
}

export function linkMemoryToProject(id: string, projectId: string, linkType: string = "supports", actor: string = "ATLAS"): MemoryView {
  return linkMemory(id, "Project", projectId, linkType, actor);
}

export function linkMemoryToTask(id: string, taskId: string, linkType: string = "supports", actor: string = "ATLAS"): MemoryView {
  return linkMemory(id, "Task", taskId, linkType, actor);
}

export function linkMemoryToContact(id: string, contactId: string, linkType: string = "references", actor: string = "ATLAS"): MemoryView {
  return linkMemory(id, "Contact", contactId, linkType, actor);
}

export function linkMemory(id: string, linkedObjectType: MemoryLinkTargetType, linkedObjectId: string, linkType: string = "references", actor: string = "ATLAS"): MemoryView {
  const db = loadDatabaseWithMigration();
  validateId(id, "memory id");
  validateId(linkedObjectId, "linked object id");
  const memory = findMemory(db, id);
  if (memory.status === "Deleted") throw memoryError("Cannot link a deleted memory.", 410);
  const normalizedLinkType = normalizeText(linkType || "references");
  const duplicate = db.memoryLinks.some((item) =>
    item.memoryId === id &&
    item.linkedObjectType === linkedObjectType &&
    item.linkedObjectId === linkedObjectId &&
    item.linkType.toLowerCase() === normalizedLinkType.toLowerCase(),
  );
  if (duplicate) {
    throw memoryError("Duplicate memory link.", 409);
  }

  const now = new Date().toISOString();
  db.memoryLinks.push({
    id: createId("memory-link"),
    memoryId: id,
    linkedObjectType: linkedObjectType,
    linkedObjectId: linkedObjectId,
    linkType: normalizedLinkType,
    createdAt: now,
  });
  memory.updatedAt = now;
  logAction(db, "Memory Linked", "Link", id, actor, "Success", { linkedObjectType: linkedObjectType, linkedObjectId: linkedObjectId, linkType: normalizedLinkType });
  saveDatabase(db);
  return getMemoryView(db, id);
}

export function unlinkMemory(id: string, linkId: string, actor: string = "ATLAS"): MemoryView {
  const db = loadDatabaseWithMigration();
  validateId(id, "memory id");
  validateId(linkId, "link id");
  const memory = findMemory(db, id);
  const before = db.memoryLinks.length;
  db.memoryLinks = db.memoryLinks.filter((item) => !(item.id === linkId && item.memoryId === id));
  if (before === db.memoryLinks.length) {
    throw memoryError("Memory link not found.", 404);
  }
  memory.updatedAt = new Date().toISOString();
  logAction(db, "Memory Link Removed", "Link", id, actor, "Success", { linkId: linkId });
  saveDatabase(db);
  return getMemoryView(db, id);
}

export function saveJournalEntry(input: JournalInput): JournalView {
  const db = loadDatabaseWithMigration();
  validateJournalInput(input);
  const now = new Date().toISOString();
  const journal: JournalRecord = {
    id: input.id || createId("journal"),
    entryDate: normalizeText(input.entryDate),
    title: normalizeText(input.title),
    summary: normalizeText(input.summary),
    body: normalizeText(input.body),
    mood: normalizeText(input.mood || ""),
    energy: normalizeText(input.energy || ""),
    status: "Active",
    createdAt: now,
    updatedAt: now,
  };
  const index = db.journalEntries.findIndex((item) => item.id === journal.id);
  if (index >= 0) {
    db.journalEntries[index] = journal;
  } else {
    db.journalEntries.push(journal);
  }
  upsertJournalLinks(db, journal.id, input.memoryIds || [], "Memory", "reflects");
  upsertJournalLinks(db, journal.id, input.projectIds || [], "Project", "reflects");
  upsertJournalLinks(db, journal.id, input.taskIds || [], "Task", "reflects");
  upsertJournalLinks(db, journal.id, input.contactIds || [], "Contact", "mentions");
  logAction(db, "Journal Created", "Journal", journal.id, input.actor || "ATLAS", "Success", { entryDate: journal.entryDate });
  saveDatabase(db);
  return getJournalView(db, journal.id);
}

export function getJournalEntryById(id: string, actor: string = "ATLAS"): JournalView {
  const db = loadDatabaseWithMigration();
  validateId(id, "journal id");
  const journal = findJournal(db, id);
  if (journal.status === "Deleted") throw memoryError("Journal entry has been deleted.", 404);
  logAction(db, "Journal Retrieved", "Journal", id, actor, "Success", { title: journal.title });
  return getJournalView(db, id);
}

export function searchJournalEntries(query: string, filters: JournalSearchFilters = {}, actor: string = "ATLAS"): JournalView[] {
  const db = loadDatabaseWithMigration();
  const normalizedQuery = normalizeText(query || "").toLowerCase();
  if (normalizedQuery.length > 0 && normalizedQuery.length < 2) {
    throw memoryError("Search query too short.", 400);
  }
  const results = db.journalEntries
    .filter((journal) => journal.status !== "Deleted")
    .map((journal) => ({ journal: journal, view: getJournalView(db, journal.id), score: scoreJournal(journal, db, normalizedQuery, filters) }))
    .filter((item) => normalizedQuery.length === 0 || item.score > 0)
    .filter((item) => matchesJournalFilters(item.view, filters))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.view);

  logAction(db, "Journal Searched", "Journal", "search", actor, "Success", { query: normalizedQuery, resultCount: results.length });
  return results;
}

export function linkJournalEntry(journalId: string, linkedObjectType: JournalLinkRecord["linkedObjectType"], linkedObjectId: string, linkType: string = "references", actor: string = "ATLAS"): JournalView {
  const db = loadDatabaseWithMigration();
  validateId(journalId, "journal id");
  validateId(linkedObjectId, "linked object id");
  const journal = findJournal(db, journalId);
  if (journal.status === "Deleted") throw memoryError("Cannot link a deleted journal entry.", 410);
  const normalizedLinkType = normalizeText(linkType || "references");
  const duplicate = db.journalLinks.some((item) =>
    item.journalId === journalId &&
    item.linkedObjectType === linkedObjectType &&
    item.linkedObjectId === linkedObjectId &&
    item.linkType.toLowerCase() === normalizedLinkType.toLowerCase(),
  );
  if (duplicate) {
    throw memoryError("Duplicate journal link.", 409);
  }

  db.journalLinks.push({
    id: createId("journal-link"),
    journalId: journalId,
    linkedObjectType: linkedObjectType,
    linkedObjectId: linkedObjectId,
    linkType: normalizedLinkType,
    createdAt: new Date().toISOString(),
  });
  journal.updatedAt = new Date().toISOString();
  logAction(db, "Journal Linked", "Link", journalId, actor, "Success", { linkedObjectType: linkedObjectType, linkedObjectId: linkedObjectId, linkType: normalizedLinkType });
  saveDatabase(db);
  return getJournalView(db, journalId);
}

export function listMemoryActions() {
  return loadDatabaseWithMigration().memoryActions.slice();
}

export function listMemoryTags(memoryId: string) {
  const db = loadDatabaseWithMigration();
  validateId(memoryId, "memory id");
  return db.memoryTags.filter((item) => item.memoryId === memoryId).map((item) => cloneRecord(item));
}

export function listMemoryLinks(memoryId: string) {
  const db = loadDatabaseWithMigration();
  validateId(memoryId, "memory id");
  return db.memoryLinks.filter((item) => item.memoryId === memoryId).map((item) => cloneRecord(item));
}

export function logMemoryAction(actionType: MemoryActionType, objectType: "Memory" | "Journal" | "Tag" | "Link" | "Tool" | "File" | "Calendar" | "Email", objectId: string, actor: string, status: "Success" | "Failed", details: Record<string, unknown>) {
  const db = loadDatabaseWithMigration();
  logAction(db, actionType, objectType, objectId, actor, status, details);
  saveDatabase(db);
}

export function resetMemoryEngineForDemo(): void {
  resetMemoryEngineRuntime();
  const db = loadDatabaseWithMigration();
  db.memories = [];
  db.memoryTags = [];
  db.memoryLinks = [];
  db.journalEntries = [];
  db.journalLinks = [];
  db.memoryActions = [];
  db.updatedAt = new Date().toISOString();
  saveDatabase(db);
}

export function getMemoryEngineStatistics() {
  const db = loadDatabaseWithMigration();
  return {
    memories: db.memories.filter((item) => item.status !== "Deleted").length,
    journalEntries: db.journalEntries.filter((item) => item.status !== "Deleted").length,
    tags: db.memoryTags.length,
    links: db.memoryLinks.length,
    journalLinks: db.journalLinks.length,
    actions: db.memoryActions.length,
  };
}

export function loadMemoryEngineState() {
  return loadDatabaseWithMigration();
}

function loadDatabaseWithMigration() {
  ensureMemoryEngineV1Migration();
  return loadMemoryEngineDatabase();
}

function saveDatabase(database: ReturnType<typeof loadMemoryEngineDatabase>) {
  database.updatedAt = new Date().toISOString();
  saveMemoryEngineDatabase(database);
}

function cloneRecord<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function logAction(db: ReturnType<typeof loadMemoryEngineDatabase>, actionType: MemoryActionType, objectType: "Memory" | "Journal" | "Tag" | "Link" | "Tool" | "File" | "Calendar" | "Email", objectId: string, actor: string, status: "Success" | "Failed", details: Record<string, unknown>) {
  const entry: MemoryActionRecord = {
    id: createId("memory-action"),
    actionType: actionType,
    objectType: objectType,
    objectId: objectId,
    actor: actor || "ATLAS",
    status: status,
    details: JSON.stringify(details || {}),
    createdAt: new Date().toISOString(),
  };
  db.memoryActions.push(entry);
}

function getMemoryView(db: ReturnType<typeof loadMemoryEngineDatabase>, id: string): MemoryView {
  const memory = findMemory(db, id);
  return {
    ...cloneRecord(memory),
    tags: db.memoryTags.filter((item) => item.memoryId === id).map((item) => item.tag),
    links: db.memoryLinks.filter((item) => item.memoryId === id),
  };
}

function getJournalView(db: ReturnType<typeof loadMemoryEngineDatabase>, id: string): JournalView {
  const journal = findJournal(db, id);
  return {
    ...cloneRecord(journal),
    links: db.journalLinks.filter((item) => item.journalId === id),
  };
}

function findMemory(db: ReturnType<typeof loadMemoryEngineDatabase>, id: string) {
  const memory = db.memories.find((item) => item.id === id);
  if (!memory) throw memoryError(`Memory ${id} not found.`, 404);
  return memory;
}

function findJournal(db: ReturnType<typeof loadMemoryEngineDatabase>, id: string) {
  const journal = db.journalEntries.find((item) => item.id === id);
  if (!journal) throw memoryError(`Journal entry ${id} not found.`, 404);
  return journal;
}

function upsertTags(db: ReturnType<typeof loadMemoryEngineDatabase>, memoryId: string, tags: string[]) {
  const cleaned = normalizeTags(tags);
  const existing = new Set(db.memoryTags.filter((item) => item.memoryId === memoryId).map((item) => item.tag.toLowerCase()));
  for (const tag of cleaned) {
    if (existing.has(tag.toLowerCase())) continue;
    db.memoryTags.push({
      id: createId("memory-tag"),
      memoryId: memoryId,
      tag: tag,
      createdAt: new Date().toISOString(),
    });
  }
}

function upsertLinks(db: ReturnType<typeof loadMemoryEngineDatabase>, memoryId: string, linkedIds: string[], linkedObjectType: MemoryLinkTargetType, linkType: string) {
  const ids = normalizeIds(linkedIds);
  for (const linkedObjectId of ids) {
    const duplicate = db.memoryLinks.some((item) =>
      item.memoryId === memoryId &&
      item.linkedObjectType === linkedObjectType &&
      item.linkedObjectId === linkedObjectId &&
      item.linkType.toLowerCase() === linkType.toLowerCase(),
    );
    if (duplicate) continue;
    db.memoryLinks.push({
      id: createId("memory-link"),
      memoryId: memoryId,
      linkedObjectType: linkedObjectType,
      linkedObjectId: linkedObjectId,
      linkType: linkType,
      createdAt: new Date().toISOString(),
    });
  }
}

function upsertJournalLinks(db: ReturnType<typeof loadMemoryEngineDatabase>, journalId: string, linkedIds: string[], linkedObjectType: JournalLinkRecord["linkedObjectType"], linkType: string) {
  const ids = normalizeIds(linkedIds);
  for (const linkedObjectId of ids) {
    const duplicate = db.journalLinks.some((item) =>
      item.journalId === journalId &&
      item.linkedObjectType === linkedObjectType &&
      item.linkedObjectId === linkedObjectId &&
      item.linkType.toLowerCase() === linkType.toLowerCase(),
    );
    if (duplicate) continue;
    db.journalLinks.push({
      id: createId("journal-link"),
      journalId: journalId,
      linkedObjectType: linkedObjectType,
      linkedObjectId: linkedObjectId,
      linkType: linkType,
      createdAt: new Date().toISOString(),
    });
  }
}

function scoreMemory(memory: MemoryRecord, db: ReturnType<typeof loadMemoryEngineDatabase>, normalizedQuery: string, filters: MemorySearchFilters): SearchBoost {
  const title = normalizeText(memory.title).toLowerCase();
  const summary = normalizeText(memory.summary).toLowerCase();
  const body = normalizeText(memory.body).toLowerCase();
  const tags = db.memoryTags.filter((item) => item.memoryId === memory.id).map((item) => normalizeText(item.tag).toLowerCase());
  const links = db.memoryLinks.filter((item) => item.memoryId === memory.id);
  const hasExactTitle = normalizedQuery.length > 0 && title.indexOf(normalizedQuery) === 0;
  const hasTagMatch = normalizedQuery.length > 0 && tags.some((tag) => tag.indexOf(normalizedQuery) >= 0);
  const hasBodyMatch = normalizedQuery.length > 0 && (title.indexOf(normalizedQuery) >= 0 || summary.indexOf(normalizedQuery) >= 0 || body.indexOf(normalizedQuery) >= 0);
  const hasLinkedMatch = normalizedQuery.length > 0 && links.some((link) => normalizeText(link.linkedObjectId).toLowerCase().indexOf(normalizedQuery) >= 0 || normalizeText(link.linkType).toLowerCase().indexOf(normalizedQuery) >= 0 || normalizeText(link.linkedObjectType).toLowerCase().indexOf(normalizedQuery) >= 0);

  return {
    exactTitle: hasExactTitle,
    tagMatch: hasTagMatch,
    bodyMatch: hasBodyMatch,
    linkedMatch: hasLinkedMatch,
  };
}

function scoreJournal(journal: JournalRecord, db: ReturnType<typeof loadMemoryEngineDatabase>, normalizedQuery: string, filters: JournalSearchFilters) {
  const title = normalizeText(journal.title).toLowerCase();
  const summary = normalizeText(journal.summary).toLowerCase();
  const body = normalizeText(journal.body).toLowerCase();
  const links = db.journalLinks.filter((item) => item.journalId === journal.id);
  let score = 0;
  if (normalizedQuery.length === 0) score += 1;
  if (title.indexOf(normalizedQuery) >= 0) score += 3;
  if (summary.indexOf(normalizedQuery) >= 0) score += 2;
  if (body.indexOf(normalizedQuery) >= 0) score += 1;
  if (links.some((link) => normalizeText(link.linkedObjectId).toLowerCase().indexOf(normalizedQuery) >= 0 || normalizeText(link.linkType).toLowerCase().indexOf(normalizedQuery) >= 0)) score += 1;
  return score;
}

function compareBoost(a: SearchBoost, b: SearchBoost) {
  return scoreBoost(a) - scoreBoost(b);
}

function scoreBoost(boost: SearchBoost) {
  return (boost.exactTitle ? 4 : 0) + (boost.tagMatch ? 3 : 0) + (boost.bodyMatch ? 2 : 0) + (boost.linkedMatch ? 1 : 0);
}

function matchesMemoryFilters(view: MemoryView, filters: MemorySearchFilters): boolean {
  if (filters.status && view.status !== filters.status) return false;
  if (filters.memoryType && normalizeText(view.memoryType).toLowerCase() !== normalizeText(filters.memoryType).toLowerCase()) return false;
  if (filters.tags && filters.tags.length > 0) {
    const wanted = normalizeTags(filters.tags).map((tag) => tag.toLowerCase());
    const current = view.tags.map((tag) => tag.toLowerCase());
    if (!wanted.every((tag) => current.indexOf(tag) >= 0)) return false;
  }
  if (filters.linkedObjectType || filters.linkedObjectId) {
    const hasLink = view.links.some((link) => {
      if (filters.linkedObjectType && link.linkedObjectType !== filters.linkedObjectType) return false;
      if (filters.linkedObjectId && link.linkedObjectId !== filters.linkedObjectId) return false;
      return true;
    });
    if (!hasLink) return false;
  }
  return true;
}

function matchesJournalFilters(view: JournalView, filters: JournalSearchFilters): boolean {
  if (filters.status && view.status !== filters.status) return false;
  if (filters.linkedObjectType || filters.linkedObjectId) {
    const hasLink = view.links.some((link) => {
      if (filters.linkedObjectType && link.linkedObjectType !== filters.linkedObjectType) return false;
      if (filters.linkedObjectId && link.linkedObjectId !== filters.linkedObjectId) return false;
      return true;
    });
    if (!hasLink) return false;
  }
  return true;
}

function validateMemoryInput(input: MemoryInput) {
  if (!input || typeof input !== "object") throw memoryError("Memory input must be an object.", 400);
  validateRequiredString(input.title, "title");
  validateRequiredString(input.summary, "summary");
  validateRequiredString(input.body, "body");
  validateRequiredString(input.memoryType, "memoryType");
  if (input.confidence !== undefined && (typeof input.confidence !== "number" || input.confidence < 0 || input.confidence > 1)) {
    throw memoryError("confidence must be between 0 and 1.", 400);
  }
  if (input.tags !== undefined && !Array.isArray(input.tags)) throw memoryError("tags must be an array when provided.", 400);
  if (input.projectIds !== undefined && !Array.isArray(input.projectIds)) throw memoryError("projectIds must be an array when provided.", 400);
  if (input.taskIds !== undefined && !Array.isArray(input.taskIds)) throw memoryError("taskIds must be an array when provided.", 400);
  if (input.contactIds !== undefined && !Array.isArray(input.contactIds)) throw memoryError("contactIds must be an array when provided.", 400);
}

function validateJournalInput(input: JournalInput) {
  if (!input || typeof input !== "object") throw memoryError("Journal input must be an object.", 400);
  validateRequiredString(input.entryDate, "entryDate");
  validateRequiredString(input.title, "title");
  validateRequiredString(input.summary, "summary");
  validateRequiredString(input.body, "body");
  if (input.tags !== undefined && !Array.isArray(input.tags)) throw memoryError("tags must be an array when provided.", 400);
  if (input.memoryIds !== undefined && !Array.isArray(input.memoryIds)) throw memoryError("memoryIds must be an array when provided.", 400);
  if (input.projectIds !== undefined && !Array.isArray(input.projectIds)) throw memoryError("projectIds must be an array when provided.", 400);
  if (input.taskIds !== undefined && !Array.isArray(input.taskIds)) throw memoryError("taskIds must be an array when provided.", 400);
  if (input.contactIds !== undefined && !Array.isArray(input.contactIds)) throw memoryError("contactIds must be an array when provided.", 400);
}

function validateRequiredString(value: any, fieldName: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw memoryError(fieldName + " is required.", 400);
  }
}

function validateId(value: string, fieldName: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw memoryError(fieldName + " is required.", 400);
  }
}

function normalizeText(value: any) {
  return String(value == null ? "" : value).trim();
}

function normalizeTags(tags: string[]) {
  const unique: string[] = [];
  for (const tag of tags || []) {
    const cleaned = normalizeText(tag);
    if (!cleaned) continue;
    if (unique.map((item) => item.toLowerCase()).indexOf(cleaned.toLowerCase()) >= 0) continue;
    unique.push(cleaned);
  }
  return unique;
}

function normalizeIds(ids: string[]) {
  const unique: string[] = [];
  for (const id of ids || []) {
    const cleaned = normalizeText(id);
    if (!cleaned) continue;
    if (unique.indexOf(cleaned) >= 0) continue;
    unique.push(cleaned);
  }
  return unique;
}

function clampConfidence(value: number | undefined) {
  if (typeof value !== "number") return 0.5;
  return Math.max(0, Math.min(1, value));
}

function createId(prefix: string) {
  return prefix + "-" + new Date().getTime().toString(36) + "-" + Math.random().toString(16).slice(2, 8);
}

export interface MemoryEngineError extends Error {
  code: string;
  statusCode: number;
}

function memoryError(message: string, statusCode: number): MemoryEngineError {
  const error = new Error(message) as MemoryEngineError;
  error.code = "MEMORY_ENGINE_ERROR";
  error.statusCode = statusCode;
  return error;
}
