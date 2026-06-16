declare const require: any;
declare const __dirname: string;

import { FileIndexRecord, FileSystemState } from "./fileSystemTypes";

const fs = require("fs");
const path = require("path");

export const FILE_SYSTEM_STATE_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_file_system_v1.json");
export const FILE_SYSTEM_BACKUP_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_file_system_v1.backup.json");

let fileSystemCache: FileSystemState | null = null;

export function createEmptyFileSystemState(): FileSystemState {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    fileIndex: [],
  };
}

export function loadFileSystemState(): FileSystemState {
  if (fileSystemCache) {
    return cloneFileSystemState(fileSystemCache);
  }

  if (!fs.existsSync(FILE_SYSTEM_STATE_PATH)) {
    fileSystemCache = createEmptyFileSystemState();
    return cloneFileSystemState(fileSystemCache);
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(FILE_SYSTEM_STATE_PATH, "utf8"));
    fileSystemCache = normalizeFileSystemState(parsed);
    return cloneFileSystemState(fileSystemCache);
  } catch (primaryError) {
    if (fs.existsSync(FILE_SYSTEM_BACKUP_PATH)) {
      try {
        const parsedBackup = JSON.parse(fs.readFileSync(FILE_SYSTEM_BACKUP_PATH, "utf8"));
        fileSystemCache = normalizeFileSystemState(parsedBackup);
        persistFileSystemState(fileSystemCache);
        return cloneFileSystemState(fileSystemCache);
      } catch (_backupError) {
        throw primaryError;
      }
    }
    throw primaryError;
  }
}

export function saveFileSystemState(state: FileSystemState): FileSystemState {
  const normalized = normalizeFileSystemState(state);
  persistFileSystemState(normalized);
  fileSystemCache = normalized;
  return cloneFileSystemState(normalized);
}

export function resetFileSystemRuntime(): void {
  fileSystemCache = null;
}

export function cloneFileSystemState(state: FileSystemState): FileSystemState {
  return JSON.parse(JSON.stringify(state));
}

export function normalizeFileSystemState(payload: any): FileSystemState {
  const fallback = createEmptyFileSystemState();
  return {
    schemaVersion: Number(payload && payload.schemaVersion) || 1,
    createdAt: String(payload && payload.createdAt ? payload.createdAt : fallback.createdAt),
    updatedAt: String(payload && payload.updatedAt ? payload.updatedAt : fallback.updatedAt),
    fileIndex: Array.isArray(payload && payload.fileIndex) ? payload.fileIndex.map(normalizeFileIndexRecord) : [],
  };
}

export function persistFileSystemState(state: FileSystemState): void {
  fs.mkdirSync(path.dirname(FILE_SYSTEM_STATE_PATH), { recursive: true });
  if (fs.existsSync(FILE_SYSTEM_STATE_PATH)) {
    try {
      fs.chmodSync(FILE_SYSTEM_STATE_PATH, 0o666);
    } catch {
      // Ignore chmod failures on platforms that do not support it.
    }
    fs.copyFileSync(FILE_SYSTEM_STATE_PATH, FILE_SYSTEM_BACKUP_PATH);
    fs.unlinkSync(FILE_SYSTEM_STATE_PATH);
  }
  try {
    fs.chmodSync(FILE_SYSTEM_STATE_PATH, 0o666);
  } catch {
    // Ignore chmod failures on platforms that do not support it.
  }
  fs.writeFileSync(FILE_SYSTEM_STATE_PATH, JSON.stringify(state, null, 2));
}

export function upsertFileIndexRecord(record: FileIndexRecord): FileSystemState {
  const state = loadFileSystemState();
  const index = state.fileIndex.findIndex((item) => item.path === record.path);
  if (index >= 0) {
    state.fileIndex[index] = record;
  } else {
    state.fileIndex.push(record);
  }
  state.updatedAt = new Date().toISOString();
  return saveFileSystemState(state);
}

export function removeFileIndexRecord(filePath: string): FileSystemState {
  const state = loadFileSystemState();
  state.fileIndex = state.fileIndex.filter((item) => item.path !== filePath);
  state.updatedAt = new Date().toISOString();
  return saveFileSystemState(state);
}

export function getIndexedFileRecord(filePath: string) {
  const state = loadFileSystemState();
  return state.fileIndex.find((item) => item.path === filePath) || null;
}

function normalizeFileIndexRecord(record: any): FileIndexRecord {
  return {
    id: String(record && record.id ? record.id : `file-${Date.now()}`),
    path: String(record && record.path ? record.path : ""),
    name: String(record && record.name ? record.name : ""),
    itemType: record && record.itemType === "Folder" ? "Folder" : "File",
    fileType: String(record && record.fileType ? record.fileType : ""),
    fileSize: typeof record && typeof record.fileSize === "number" ? record.fileSize : 0,
    createdDate: String(record && record.createdDate ? record.createdDate : new Date().toISOString()),
    modifiedDate: String(record && record.modifiedDate ? record.modifiedDate : new Date().toISOString()),
    associatedProjectId: record && record.associatedProjectId ? String(record.associatedProjectId) : undefined,
    associatedTaskIds: Array.isArray(record && record.associatedTaskIds) ? record.associatedTaskIds.map(String) : [],
    associatedMemoryIds: Array.isArray(record && record.associatedMemoryIds) ? record.associatedMemoryIds.map(String) : [],
    associatedContactIds: Array.isArray(record && record.associatedContactIds) ? record.associatedContactIds.map(String) : [],
    links: Array.isArray(record && record.links) ? record.links.map(normalizeLink) : [],
  };
}

function normalizeLink(link: any) {
  const allowed = link && (link.targetType === "Task" || link.targetType === "Memory" || link.targetType === "Contact" || link.targetType === "Project");
  return {
    targetType: allowed ? link.targetType : "Project",
    targetId: String(link && link.targetId ? link.targetId : ""),
  };
}
