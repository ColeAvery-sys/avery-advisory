declare const require: any;
declare const __dirname: string;

import { logMemoryAction } from "./memoryEngineService";
import {
  FileIndexLink,
  FileIndexRecord,
  FileSystemLinkTargetType,
  FileSystemPermission,
  FileSystemPermissionContext,
  FileSystemSearchFilters,
  FileSystemState,
} from "./fileSystemTypes";
import {
  cloneFileSystemState,
  getIndexedFileRecord,
  loadFileSystemState,
  removeFileIndexRecord,
  resetFileSystemRuntime,
  saveFileSystemState,
  upsertFileIndexRecord,
} from "./fileSystemRepository";

const fs = require("fs");
const path = require("path");

const WORKSPACE_ROOT = path.resolve(__dirname, "..");

export interface FileOperationResult {
  path: string;
  operation: string;
  bytes?: number;
  content?: string;
  metadata?: FileIndexRecord;
}

export function createFile(relativePath: string, content: string = "", context: FileSystemPermissionContext): FileOperationResult {
  const startedAt = Date.now();
  try {
    requirePermission("Write", context.permission);
    const targetPath = resolveWorkspacePath(relativePath);
    ensureParentDirectory(targetPath);
    if (fs.existsSync(targetPath)) {
      throw fileError("File already exists.");
    }
    fs.writeFileSync(targetPath, content, "utf8");
    const metadata = upsertMetadataFromDisk(targetPath, "File");
    logFileOperation("File Created", "Create File", targetPath, "Success", startedAt, context.actor, { bytes: content.length });
    return { path: targetPath, operation: "Create File", bytes: content.length, metadata: metadata };
  } catch (error: any) {
    logFileFailure("File Created", "Create File", relativePath, startedAt, context.actor, error);
    throw error;
  }
}

export function readFile(relativePath: string, context: FileSystemPermissionContext): FileOperationResult {
  const startedAt = Date.now();
  try {
    requirePermission("Read", context.permission);
    const targetPath = resolveWorkspacePath(relativePath);
    ensureExists(targetPath);
    const content = fs.readFileSync(targetPath, "utf8");
    const metadata = upsertMetadataFromDisk(targetPath, "File");
    const bytes = content.length;
    logFileOperation("File Read", "Read File", targetPath, "Success", startedAt, context.actor, { bytes: bytes });
    return { path: targetPath, operation: "Read File", content: content, bytes: bytes, metadata: metadata };
  } catch (error: any) {
    logFileFailure("File Read", "Read File", relativePath, startedAt, context.actor, error);
    throw error;
  }
}

export function updateFile(relativePath: string, content: string, context: FileSystemPermissionContext): FileOperationResult {
  const startedAt = Date.now();
  try {
    requirePermission("Write", context.permission);
    const targetPath = resolveWorkspacePath(relativePath);
    ensureExists(targetPath);
    fs.writeFileSync(targetPath, content, "utf8");
    const metadata = upsertMetadataFromDisk(targetPath, "File");
    logFileOperation("File Updated", "Update File", targetPath, "Success", startedAt, context.actor, { bytes: content.length });
    return { path: targetPath, operation: "Update File", bytes: content.length, metadata: metadata };
  } catch (error: any) {
    logFileFailure("File Updated", "Update File", relativePath, startedAt, context.actor, error);
    throw error;
  }
}

export function deleteFile(relativePath: string, context: FileSystemPermissionContext): FileOperationResult {
  const startedAt = Date.now();
  try {
    requirePermission("Admin", context.permission);
    const targetPath = resolveWorkspacePath(relativePath);
    ensureExists(targetPath);
    fs.unlinkSync(targetPath);
    removeFileIndexRecord(targetPath);
    logFileOperation("File Deleted", "Delete File", targetPath, "Success", startedAt, context.actor, {});
    return { path: targetPath, operation: "Delete File" };
  } catch (error: any) {
    logFileFailure("File Deleted", "Delete File", relativePath, startedAt, context.actor, error);
    throw error;
  }
}

export function createFolder(relativePath: string, context: FileSystemPermissionContext): FileOperationResult {
  const startedAt = Date.now();
  try {
    requirePermission("Write", context.permission);
    const targetPath = resolveWorkspacePath(relativePath);
    fs.mkdirSync(targetPath, { recursive: true });
    const metadata = upsertMetadataFromDisk(targetPath, "Folder");
    logFileOperation("File Created", "Create Folder", targetPath, "Success", startedAt, context.actor, {});
    return { path: targetPath, operation: "Create Folder", metadata: metadata };
  } catch (error: any) {
    logFileFailure("File Created", "Create Folder", relativePath, startedAt, context.actor, error);
    throw error;
  }
}

export function moveFile(sourceRelativePath: string, destinationRelativePath: string, context: FileSystemPermissionContext): FileOperationResult {
  const startedAt = Date.now();
  try {
    requirePermission("Write", context.permission);
    const sourcePath = resolveWorkspacePath(sourceRelativePath);
    const destinationPath = resolveWorkspacePath(destinationRelativePath);
    ensureExists(sourcePath);
    ensureParentDirectory(destinationPath);
    fs.renameSync(sourcePath, destinationPath);
    removeFileIndexRecord(sourcePath);
    const metadata = upsertMetadataFromDisk(destinationPath, isFolder(destinationPath) ? "Folder" : "File");
    logFileOperation("File Moved", "Move File", destinationPath, "Success", startedAt, context.actor, { sourcePath: sourcePath });
    return { path: destinationPath, operation: "Move File", metadata: metadata };
  } catch (error: any) {
    logFileFailure("File Moved", "Move File", sourceRelativePath, startedAt, context.actor, error);
    throw error;
  }
}

export function copyFile(sourceRelativePath: string, destinationRelativePath: string, context: FileSystemPermissionContext): FileOperationResult {
  const startedAt = Date.now();
  try {
    requirePermission("Write", context.permission);
    const sourcePath = resolveWorkspacePath(sourceRelativePath);
    const destinationPath = resolveWorkspacePath(destinationRelativePath);
    ensureExists(sourcePath);
    ensureParentDirectory(destinationPath);
    fs.copyFileSync(sourcePath, destinationPath);
    const metadata = upsertMetadataFromDisk(destinationPath, isFolder(destinationPath) ? "Folder" : "File");
    logFileOperation("File Copied", "Copy File", destinationPath, "Success", startedAt, context.actor, { sourcePath: sourcePath });
    return { path: destinationPath, operation: "Copy File", metadata: metadata };
  } catch (error: any) {
    logFileFailure("File Copied", "Copy File", sourceRelativePath, startedAt, context.actor, error);
    throw error;
  }
}

export function renameFile(relativePath: string, newName: string, context: FileSystemPermissionContext): FileOperationResult {
  const startedAt = Date.now();
  try {
    requirePermission("Write", context.permission);
    const sourcePath = resolveWorkspacePath(relativePath);
    ensureExists(sourcePath);
    const destinationPath = path.join(path.dirname(sourcePath), newName);
    ensureParentDirectory(destinationPath);
    fs.renameSync(sourcePath, destinationPath);
    removeFileIndexRecord(sourcePath);
    const metadata = upsertMetadataFromDisk(destinationPath, isFolder(destinationPath) ? "Folder" : "File");
    logFileOperation("File Renamed", "Rename File", destinationPath, "Success", startedAt, context.actor, { sourcePath: sourcePath });
    return { path: destinationPath, operation: "Rename File", metadata: metadata };
  } catch (error: any) {
    logFileFailure("File Renamed", "Rename File", relativePath, startedAt, context.actor, error);
    throw error;
  }
}

export function searchFiles(query: string, filters: FileSystemSearchFilters = {}, context: FileSystemPermissionContext): FileIndexRecord[] {
  const startedAt = Date.now();
  try {
    requirePermission("Read", context.permission);
    const needle = normalizeText(query).toLowerCase();
    const state = loadFileSystemState();
    const results = state.fileIndex.filter((record) => matchesSearch(record, needle, filters));
    logFileOperation("File Searched", "Search File", "index", "Success", startedAt, context.actor, { query: needle, count: results.length });
    return results.map((record) => cloneRecord(record));
  } catch (error: any) {
    logFileFailure("File Searched", "Search File", query, startedAt, context.actor, error);
    throw error;
  }
}

export function searchFolders(query: string, filters: FileSystemSearchFilters = {}, context: FileSystemPermissionContext): FileIndexRecord[] {
  return searchFiles(query, { ...filters, itemType: "Folder" }, context);
}

export function getFileMetadata(relativePath: string, context: FileSystemPermissionContext): FileIndexRecord {
  const startedAt = Date.now();
  requirePermission("Read", context.permission);
  const targetPath = resolveWorkspacePath(relativePath);
  const record = getIndexedFileRecord(targetPath);
  if (!record) {
    throw fileError("File metadata not found.");
  }
  logFileOperation("File Metadata Retrieved", "Metadata", targetPath, "Success", startedAt, context.actor, {});
  return cloneRecord(record);
}

export function linkFileToProject(relativePath: string, projectId: string, context: FileSystemPermissionContext): FileIndexRecord {
  return linkFile(relativePath, "Project", projectId, context);
}

export function linkFileToTask(relativePath: string, taskId: string, context: FileSystemPermissionContext): FileIndexRecord {
  return linkFile(relativePath, "Task", taskId, context);
}

export function linkFileToMemory(relativePath: string, memoryId: string, context: FileSystemPermissionContext): FileIndexRecord {
  return linkFile(relativePath, "Memory", memoryId, context);
}

export function linkFileToContact(relativePath: string, contactId: string, context: FileSystemPermissionContext): FileIndexRecord {
  return linkFile(relativePath, "Contact", contactId, context);
}

export function listFileIndex(): FileIndexRecord[] {
  return loadFileSystemState().fileIndex.map((record) => cloneRecord(record));
}

export function resetFileSystemForDemo(): void {
  resetFileSystemRuntime();
  const state = loadFileSystemState();
  state.fileIndex = [];
  state.updatedAt = new Date().toISOString();
  saveFileSystemState(state);
}

function linkFile(relativePath: string, targetType: FileSystemLinkTargetType, targetId: string, context: FileSystemPermissionContext): FileIndexRecord {
  const startedAt = Date.now();
  try {
    requirePermission("Write", context.permission);
    const targetPath = resolveWorkspacePath(relativePath);
    const existing = getIndexedFileRecord(targetPath);
    if (!existing) {
      throw fileError("File metadata not found.");
    }
    const link: FileIndexLink = { targetType: targetType, targetId: targetId };
    if (!existing.links.some((item) => item.targetType === link.targetType && item.targetId === link.targetId)) {
      existing.links.push(link);
    }
    switch (targetType) {
      case "Project":
        existing.associatedProjectId = targetId;
        break;
      case "Task":
        if (existing.associatedTaskIds.indexOf(targetId) < 0) existing.associatedTaskIds.push(targetId);
        break;
      case "Memory":
        if (existing.associatedMemoryIds.indexOf(targetId) < 0) existing.associatedMemoryIds.push(targetId);
        break;
      case "Contact":
        if (existing.associatedContactIds.indexOf(targetId) < 0) existing.associatedContactIds.push(targetId);
        break;
    }
    existing.modifiedDate = new Date().toISOString();
    upsertFileIndexRecord(existing);
    logFileOperation("File Linked", "File Linked", targetPath, "Success", startedAt, context.actor, { targetType: targetType, targetId: targetId });
    return cloneRecord(existing);
  } catch (error: any) {
    logFileFailure("File Linked", "File Linked", relativePath, startedAt, context.actor, error);
    throw error;
  }
}

function upsertMetadataFromDisk(targetPath: string, itemType: "File" | "Folder"): FileIndexRecord {
  const stats = fs.statSync(targetPath);
  const existing = getIndexedFileRecord(targetPath);
  const now = new Date().toISOString();
  const record: FileIndexRecord = {
    id: existing && existing.id ? existing.id : createId("file"),
    path: targetPath,
    name: path.basename(targetPath),
    itemType: itemType,
    fileType: itemType === "Folder" ? "folder" : getFileExtension(targetPath),
    fileSize: itemType === "Folder" ? 0 : stats.size,
    createdDate: existing && existing.createdDate ? existing.createdDate : stats.birthtime.toISOString(),
    modifiedDate: stats.mtime.toISOString() || now,
    associatedProjectId: existing && existing.associatedProjectId ? existing.associatedProjectId : undefined,
    associatedTaskIds: existing && existing.associatedTaskIds ? existing.associatedTaskIds.slice() : [],
    associatedMemoryIds: existing && existing.associatedMemoryIds ? existing.associatedMemoryIds.slice() : [],
    associatedContactIds: existing && existing.associatedContactIds ? existing.associatedContactIds.slice() : [],
    links: existing && existing.links ? existing.links.slice() : [],
  };
  upsertFileIndexRecord(record);
  return record;
}

function matchesSearch(record: FileIndexRecord, needle: string, filters: FileSystemSearchFilters): boolean {
  if (filters.itemType && record.itemType !== filters.itemType) return false;
  if (filters.fileType && normalizeText(record.fileType).toLowerCase() !== normalizeText(filters.fileType).toLowerCase()) return false;
  if (filters.projectId && record.associatedProjectId !== filters.projectId && record.links.every((link) => !(link.targetType === "Project" && link.targetId === filters.projectId))) return false;
  if (filters.dateFrom && new Date(record.modifiedDate).getTime() < new Date(filters.dateFrom).getTime()) return false;
  if (filters.dateTo && new Date(record.modifiedDate).getTime() > new Date(filters.dateTo).getTime()) return false;
  if (!needle) return true;
  if (record.path.toLowerCase().indexOf(needle) >= 0 || record.name.toLowerCase().indexOf(needle) >= 0 || record.fileType.toLowerCase().indexOf(needle) >= 0) return true;
  if (record.itemType === "File" && fs.existsSync(record.path)) {
    try {
      const text = fs.readFileSync(record.path, "utf8").toLowerCase();
      return text.indexOf(needle) >= 0;
    } catch {
      return false;
    }
  }
  return false;
}

function requirePermission(required: FileSystemPermission, granted: FileSystemPermission) {
  if (permissionRank(granted) < permissionRank(required)) {
    throw fileError("Permission denied.");
  }
}

function permissionRank(permission: FileSystemPermission) {
  if (permission === "Read") return 1;
  if (permission === "Write") return 2;
  return 3;
}

function logFileOperation(actionType: any, operation: string, targetFile: string, result: string, startedAt: number, actor: string, details: Record<string, unknown>) {
  logMemoryAction(actionType, "File", targetFile, actor || "ATLAS", "Success", {
    operation: operation,
    targetFile: targetFile,
    result: result,
    durationMs: Date.now() - startedAt,
    ...details,
  });
}

function logFileFailure(actionType: any, operation: string, targetFile: string, startedAt: number, actor: string, error: any) {
  logMemoryAction(actionType, "File", targetFile, actor || "ATLAS", "Failed", {
    operation: operation,
    targetFile: targetFile,
    result: "Failure",
    durationMs: Date.now() - startedAt,
    message: error && error.message ? error.message : String(error),
  });
}

function resolveWorkspacePath(relativePath: string) {
  const resolved = path.resolve(WORKSPACE_ROOT, relativePath);
  if (resolved.indexOf(WORKSPACE_ROOT) !== 0) {
    throw fileError("Path escapes workspace root.");
  }
  return resolved;
}

function ensureParentDirectory(targetPath: string) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
}

function ensureExists(targetPath: string) {
  if (!fs.existsSync(targetPath)) {
    throw fileError("Target not found.");
  }
}

function isFolder(targetPath: string) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory();
}

function getFileExtension(targetPath: string) {
  const ext = path.extname(targetPath).replace(/^\./, "");
  return ext ? ext.toLowerCase() : "unknown";
}

function normalizeText(value: any) {
  return String(value == null ? "" : value).trim();
}

function cloneRecord<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function fileError(message: string) {
  const error = new Error(message) as Error & { code: string; statusCode: number };
  error.code = "FILE_SYSTEM_ERROR";
  error.statusCode = 400;
  return error;
}

function createId(prefix: string) {
  return prefix + "-" + new Date().getTime().toString(36) + "-" + Math.random().toString(16).slice(2, 8);
}
