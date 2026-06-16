declare const require: any;

import {
  createEmptyMemoryEngineDatabase,
  loadMemoryEngineDatabase,
  normalizeMemoryEngineDatabase,
  saveMemoryEngineDatabase,
  writeMigrationSnapshot,
} from "./memoryEngineRepository";

export interface MemoryEngineMigrationReport {
  schemaVersion: number;
  migrated: boolean;
  source: string;
  notes: string[];
  recordCounts: {
    memories: number;
    memoryTags: number;
    memoryLinks: number;
    journalEntries: number;
    journalLinks: number;
    memoryActions: number;
  };
}

export function ensureMemoryEngineV1Migration(): MemoryEngineMigrationReport {
  const existing = loadMemoryEngineDatabase();
  const normalized = normalizeMemoryEngineDatabase(existing);
  const migrated = JSON.stringify(existing) !== JSON.stringify(normalized);
  const notes: string[] = [];

  if (migrated) {
    notes.push("Normalized existing memory database to schemaVersion 1.");
    saveMemoryEngineDatabase(normalized);
  }

  if (normalized.memories.length === 0 && normalized.journalEntries.length === 0) {
    notes.push("Initialized fresh ATLAS Memory Engine V1 storage.");
  }

  const report: MemoryEngineMigrationReport = {
    schemaVersion: 1,
    migrated,
    source: migrated ? "normalized" : "current",
    notes,
    recordCounts: {
      memories: normalized.memories.length,
      memoryTags: normalized.memoryTags.length,
      memoryLinks: normalized.memoryLinks.length,
      journalEntries: normalized.journalEntries.length,
      journalLinks: normalized.journalLinks.length,
      memoryActions: normalized.memoryActions.length,
    },
  };

  writeMigrationSnapshot(report);
  return report;
}

export function createFreshMemoryEngineSchema() {
  return createEmptyMemoryEngineDatabase();
}

