declare const require: any;
declare const __dirname: string;

import {
  JournalLinkRecord,
  JournalRecord,
  MemoryActionRecord,
  MemoryEngineDatabase,
  MemoryLinkRecord,
  MemoryRecord,
  MemoryTagRecord,
} from "./memoryEngineTypes";

const fs = require("fs");
const path = require("path");

export const MEMORY_ENGINE_DB_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_memory_engine_v1.json");
export const MEMORY_ENGINE_BACKUP_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_memory_engine_v1.backup.json");
export const MEMORY_ENGINE_MIGRATION_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_memory_engine_v1.migration.json");

let memoryEngineCache: MemoryEngineDatabase | null = null;

export function createEmptyMemoryEngineDatabase(): MemoryEngineDatabase {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    memories: [],
    memoryTags: [],
    memoryLinks: [],
    journalEntries: [],
    journalLinks: [],
    memoryActions: [],
  };
}

export function loadMemoryEngineDatabase(): MemoryEngineDatabase {
  if (memoryEngineCache) {
    return cloneDatabase(memoryEngineCache);
  }

  if (!fs.existsSync(MEMORY_ENGINE_DB_PATH)) {
    memoryEngineCache = createEmptyMemoryEngineDatabase();
    return cloneDatabase(memoryEngineCache);
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(MEMORY_ENGINE_DB_PATH, "utf8"));
    memoryEngineCache = normalizeMemoryEngineDatabase(parsed);
    return cloneDatabase(memoryEngineCache);
  } catch (primaryError) {
    if (fs.existsSync(MEMORY_ENGINE_BACKUP_PATH)) {
      try {
        const backupParsed = JSON.parse(fs.readFileSync(MEMORY_ENGINE_BACKUP_PATH, "utf8"));
        memoryEngineCache = normalizeMemoryEngineDatabase(backupParsed);
        persistMemoryEngineDatabase(memoryEngineCache);
        return cloneDatabase(memoryEngineCache);
      } catch (_backupError) {
        throw primaryError;
      }
    }

    throw primaryError;
  }
}

export function saveMemoryEngineDatabase(database: MemoryEngineDatabase): MemoryEngineDatabase {
  const normalized = normalizeMemoryEngineDatabase(database);
  persistMemoryEngineDatabase(normalized);
  memoryEngineCache = normalized;
  return cloneDatabase(normalized);
}

export function resetMemoryEngineRuntime(): void {
  memoryEngineCache = null;
}

export function resetMemoryEngineDatabaseForDemo(): MemoryEngineDatabase {
  const empty = createEmptyMemoryEngineDatabase();
  saveMemoryEngineDatabase(empty);
  return loadMemoryEngineDatabase();
}

export function backupMemoryEngineDatabase(): void {
  if (!fs.existsSync(MEMORY_ENGINE_DB_PATH)) return;
  fs.mkdirSync(path.dirname(MEMORY_ENGINE_BACKUP_PATH), { recursive: true });
  fs.copyFileSync(MEMORY_ENGINE_DB_PATH, MEMORY_ENGINE_BACKUP_PATH);
}

export function writeMigrationSnapshot(payload: any): void {
  fs.mkdirSync(path.dirname(MEMORY_ENGINE_MIGRATION_PATH), { recursive: true });
  fs.writeFileSync(MEMORY_ENGINE_MIGRATION_PATH, JSON.stringify(payload, null, 2));
}

export function cloneDatabase(database: MemoryEngineDatabase): MemoryEngineDatabase {
  return JSON.parse(JSON.stringify(database));
}

export function normalizeMemoryEngineDatabase(database: any): MemoryEngineDatabase {
  const fallback = createEmptyMemoryEngineDatabase();
  const normalized = {
    schemaVersion: Number(database && database.schemaVersion) || 1,
    createdAt: (database && database.createdAt) || fallback.createdAt,
    updatedAt: (database && database.updatedAt) || fallback.updatedAt,
    memories: Array.isArray(database && database.memories) ? database.memories : [],
    memoryTags: Array.isArray(database && database.memoryTags) ? database.memoryTags : [],
    memoryLinks: Array.isArray(database && database.memoryLinks) ? database.memoryLinks : [],
    journalEntries: Array.isArray(database && database.journalEntries) ? database.journalEntries : [],
    journalLinks: Array.isArray(database && database.journalLinks) ? database.journalLinks : [],
    memoryActions: Array.isArray(database && database.memoryActions) ? database.memoryActions : [],
  };

  normalized.memories = normalized.memories.map(normalizeMemoryRecord);
  normalized.memoryTags = normalized.memoryTags.map(normalizeMemoryTagRecord);
  normalized.memoryLinks = normalized.memoryLinks.map(normalizeMemoryLinkRecord);
  normalized.journalEntries = normalized.journalEntries.map(normalizeJournalRecord);
  normalized.journalLinks = normalized.journalLinks.map(normalizeJournalLinkRecord);
  normalized.memoryActions = normalized.memoryActions.map(normalizeMemoryActionRecord);

  return normalized;
}

export function persistMemoryEngineDatabase(database: MemoryEngineDatabase): void {
  fs.mkdirSync(path.dirname(MEMORY_ENGINE_DB_PATH), { recursive: true });
  if (fs.existsSync(MEMORY_ENGINE_DB_PATH)) {
    backupMemoryEngineDatabase();
  }

  const tempPath = MEMORY_ENGINE_DB_PATH + ".tmp";
  fs.writeFileSync(tempPath, JSON.stringify(database, null, 2));
  let lastError: any = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (fs.existsSync(MEMORY_ENGINE_DB_PATH)) {
        try {
          fs.unlinkSync(MEMORY_ENGINE_DB_PATH);
        } catch {
          // ignore and fall through to replacement strategies
        }
      }
      fs.renameSync(tempPath, MEMORY_ENGINE_DB_PATH);
      return;
    } catch (error) {
      lastError = error;
      try {
        if (fs.existsSync(MEMORY_ENGINE_DB_PATH)) {
          try {
            fs.unlinkSync(MEMORY_ENGINE_DB_PATH);
          } catch {
            // ignore
          }
        }
        fs.copyFileSync(tempPath, MEMORY_ENGINE_DB_PATH);
        fs.unlinkSync(tempPath);
        return;
      } catch (copyError) {
        lastError = copyError;
        try {
          fs.writeFileSync(MEMORY_ENGINE_DB_PATH, JSON.stringify(database, null, 2));
          fs.unlinkSync(tempPath);
          return;
        } catch (writeError) {
          lastError = writeError;
        }
      }
    }
  }

  throw lastError;
}

function normalizeMemoryRecord(record: any): MemoryRecord {
  const now = new Date().toISOString();
  return {
    id: String(record && record.id ? record.id : `memory-${now}`),
    title: String(record && record.title ? record.title : "Untitled memory"),
    summary: String(record && record.summary ? record.summary : ""),
    body: String(record && record.body ? record.body : ""),
    memoryType: String(record && record.memoryType ? record.memoryType : "General"),
    source: String(record && record.source ? record.source : "ATLAS"),
    confidence: typeof record && typeof record.confidence === "number" ? record.confidence : 0.5,
    status: record && record.status === "Deleted" ? "Deleted" : "Active",
    visibility: String(record && record.visibility ? record.visibility : "Private"),
    createdAt: String(record && record.createdAt ? record.createdAt : now),
    updatedAt: String(record && record.updatedAt ? record.updatedAt : now),
    archivedAt: record && record.archivedAt ? String(record.archivedAt) : null,
  };
}

function normalizeMemoryTagRecord(record: any): MemoryTagRecord {
  const now = new Date().toISOString();
  return {
    id: String(record && record.id ? record.id : `tag-${now}`),
    memoryId: String(record && record.memoryId ? record.memoryId : ""),
    tag: String(record && record.tag ? record.tag : ""),
    createdAt: String(record && record.createdAt ? record.createdAt : now),
  };
}

function normalizeMemoryLinkRecord(record: any): MemoryLinkRecord {
  const now = new Date().toISOString();
  return {
    id: String(record && record.id ? record.id : `link-${now}`),
    memoryId: String(record && record.memoryId ? record.memoryId : ""),
    linkedObjectType: normalizeLinkedObjectType(record && record.linkedObjectType),
    linkedObjectId: String(record && record.linkedObjectId ? record.linkedObjectId : ""),
    linkType: String(record && record.linkType ? record.linkType : "references"),
    createdAt: String(record && record.createdAt ? record.createdAt : now),
  };
}

function normalizeJournalRecord(record: any): JournalRecord {
  const now = new Date().toISOString();
  return {
    id: String(record && record.id ? record.id : `journal-${now}`),
    entryDate: String(record && record.entryDate ? record.entryDate : now.slice(0, 10)),
    title: String(record && record.title ? record.title : "Untitled journal entry"),
    summary: String(record && record.summary ? record.summary : ""),
    body: String(record && record.body ? record.body : ""),
    mood: String(record && record.mood ? record.mood : ""),
    energy: String(record && record.energy ? record.energy : ""),
    status: record && record.status === "Deleted" ? "Deleted" : "Active",
    createdAt: String(record && record.createdAt ? record.createdAt : now),
    updatedAt: String(record && record.updatedAt ? record.updatedAt : now),
  };
}

function normalizeJournalLinkRecord(record: any): JournalLinkRecord {
  const now = new Date().toISOString();
  return {
    id: String(record && record.id ? record.id : `journal-link-${now}`),
    journalId: String(record && record.journalId ? record.journalId : ""),
    linkedObjectType: normalizeJournalLinkedObjectType(record && record.linkedObjectType),
    linkedObjectId: String(record && record.linkedObjectId ? record.linkedObjectId : ""),
    linkType: String(record && record.linkType ? record.linkType : "references"),
    createdAt: String(record && record.createdAt ? record.createdAt : now),
  };
}

function normalizeMemoryActionRecord(record: any): MemoryActionRecord {
  const now = new Date().toISOString();
  return {
    id: String(record && record.id ? record.id : `action-${now}`),
    actionType: String(record && record.actionType ? record.actionType : "Memory Searched") as MemoryActionRecord["actionType"],
    objectType: String(record && record.objectType ? record.objectType : "Memory") as MemoryActionRecord["objectType"],
    objectId: String(record && record.objectId ? record.objectId : ""),
    actor: String(record && record.actor ? record.actor : "ATLAS"),
    status: record && record.status === "Failed" ? "Failed" : "Success",
    details: String(record && record.details ? record.details : ""),
    createdAt: String(record && record.createdAt ? record.createdAt : now),
  };
}

function normalizeLinkedObjectType(value: any): MemoryLinkRecord["linkedObjectType"] {
  if (value === "Task" || value === "Contact" || value === "Project") return value;
  return "Project";
}

function normalizeJournalLinkedObjectType(value: any): JournalLinkRecord["linkedObjectType"] {
  if (value === "Memory" || value === "Task" || value === "Contact" || value === "Project" || value === "Knowledge" || value === "Goal") {
    return value;
  }
  return "Memory";
}
