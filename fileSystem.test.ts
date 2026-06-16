declare const require: any;
declare const __dirname: string;
declare const process: any;

const fs = require("fs");
const path = require("path");

import { listMemoryActions } from "./memoryEngineService";
import { MEMORY_ENGINE_BACKUP_PATH, MEMORY_ENGINE_DB_PATH, MEMORY_ENGINE_MIGRATION_PATH } from "./memoryEngineRepository";
import { FILE_SYSTEM_BACKUP_PATH, FILE_SYSTEM_STATE_PATH, resetFileSystemRuntime } from "./fileSystemRepository";
import {
  createFile,
  createFolder,
  copyFile,
  deleteFile,
  getFileMetadata,
  linkFileToContact,
  linkFileToMemory,
  linkFileToProject,
  linkFileToTask,
  listFileIndex,
  readFile,
  renameFile,
  moveFile,
  searchFiles,
  searchFolders,
  updateFile,
  resetFileSystemForDemo,
} from "./fileSystemService";
import { resetMemoryEngineRuntime } from "./memoryEngineRepository";

const memoryBackup = readBackup(MEMORY_ENGINE_DB_PATH);
const memoryBakBackup = readBackup(MEMORY_ENGINE_BACKUP_PATH);
const memoryMigrationBackup = readBackup(MEMORY_ENGINE_MIGRATION_PATH);
const fileBackup = readBackup(FILE_SYSTEM_STATE_PATH);
const fileBakBackup = readBackup(FILE_SYSTEM_BACKUP_PATH);

const testRoot = path.resolve(__dirname, "..", "atlas_ops", "file_system_v1_tests");
const sourceFile = path.join("atlas_ops", "file_system_v1_tests", "dmv_note.txt");
const movedFile = path.join("atlas_ops", "file_system_v1_tests", "archive", "dmv_note_moved.txt");
const copiedFile = path.join("atlas_ops", "file_system_v1_tests", "copy", "dmv_note_copy.txt");
const renamedFolder = path.join("atlas_ops", "file_system_v1_tests", "renamed-folder");

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  try {
    restoreState();
    cleanupWorkspace();

    const createdFolder = createFolder("atlas_ops/file_system_v1_tests", { actor: "QA", permission: "Write" });
    assertEqual(fs.existsSync(createdFolder.path), true);

    const created = createFile(sourceFile, "Need to call DMV tomorrow.", { actor: "QA", permission: "Write" });
    assertEqual(fs.existsSync(created.path), true);
    assertEqual(readFile(sourceFile, { actor: "QA", permission: "Read" }).content, "Need to call DMV tomorrow.");

    const updated = updateFile(sourceFile, "Need to call DMV tomorrow. Bring ID.", { actor: "QA", permission: "Write" });
    assertEqual(updated.bytes as number, "Need to call DMV tomorrow. Bring ID.".length);
    assertEqual(readFile(sourceFile, { actor: "QA", permission: "Read" }).content, "Need to call DMV tomorrow. Bring ID.");

    const linkedProject = linkFileToProject(sourceFile, "echoframe", { actor: "QA", permission: "Write" });
    const linkedTask = linkFileToTask(sourceFile, "task-dmv", { actor: "QA", permission: "Write" });
    const linkedMemory = linkFileToMemory(sourceFile, "memory-abc", { actor: "QA", permission: "Write" });
    const linkedContact = linkFileToContact(sourceFile, "contact-cole", { actor: "QA", permission: "Write" });
    assertEqual(linkedProject.associatedProjectId, "echoframe");
    assertEqual(linkedTask.associatedTaskIds.indexOf("task-dmv") >= 0, true);
    assertEqual(linkedMemory.associatedMemoryIds.indexOf("memory-abc") >= 0, true);
    assertEqual(linkedContact.associatedContactIds.indexOf("contact-cole") >= 0, true);

    const metadata = getFileMetadata(sourceFile, { actor: "QA", permission: "Read" });
    assertEqual(metadata.path.indexOf("dmv_note.txt") >= 0, true);
    assertEqual(metadata.fileType, "txt");

    assertEqual(searchFiles("DMV", { projectId: "echoframe" }, { actor: "QA", permission: "Read" }).length >= 1, true);
    assertEqual(searchFolders("file_system_v1_tests", { itemType: "Folder" }, { actor: "QA", permission: "Read" }).length >= 1, true);

    const moved = moveFile(sourceFile, movedFile, { actor: "QA", permission: "Write" });
    assertEqual(fs.existsSync(moved.path), true);
    assertEqual(searchFiles("Bring ID", {}, { actor: "QA", permission: "Read" }).length >= 1, true);

    const copied = createFolder("atlas_ops/file_system_v1_tests/copy", { actor: "QA", permission: "Write" });
    assertEqual(fs.existsSync(copied.path), true);
    const copiedResult = copyFile(movedFile, copiedFile, { actor: "QA", permission: "Write" });
    assertEqual(fs.existsSync(copiedResult.path), true);

    const renamed = renameFile("atlas_ops/file_system_v1_tests/copy", "renamed-folder", { actor: "QA", permission: "Write" });
    assertEqual(fs.existsSync(renamed.path), true);

    assertThrows(() => createFile("atlas_ops/file_system_v1_tests/read-only.txt", "blocked", { actor: "QA", permission: "Read" }));
    assertThrows(() => deleteFile(movedFile, { actor: "QA", permission: "Write" }));

    const deleted = deleteFile(movedFile, { actor: "QA", permission: "Admin" });
    assertEqual(fs.existsSync(deleted.path), false);

    resetFileSystemRuntime();
    resetMemoryEngineRuntime();
    assertEqual(listFileIndex().length >= 3, true);

    const actions = listMemoryActions().filter((item) => item.objectType === "File");
    assertEqual(actions.some((item) => item.actionType === "File Created"), true);
    assertEqual(actions.some((item) => item.actionType === "File Read"), true);
    assertEqual(actions.some((item) => item.actionType === "File Updated"), true);
    assertEqual(actions.some((item) => item.actionType === "File Deleted"), true);
    assertEqual(actions.some((item) => item.actionType === "File Moved"), true);
    assertEqual(actions.some((item) => item.actionType === "File Searched"), true);
    assertEqual(actions.some((item) => item.actionType === "File Linked"), true);

    console.log("All File System Layer V1 tests passed.");
  } finally {
    cleanupWorkspace();
    restoreFile(MEMORY_ENGINE_DB_PATH, memoryBackup);
    restoreFile(MEMORY_ENGINE_BACKUP_PATH, memoryBakBackup);
    restoreFile(MEMORY_ENGINE_MIGRATION_PATH, memoryMigrationBackup);
    restoreFile(FILE_SYSTEM_STATE_PATH, fileBackup);
    restoreFile(FILE_SYSTEM_BACKUP_PATH, fileBakBackup);
    resetMemoryEngineRuntime();
    resetFileSystemRuntime();
  }
}

function readBackup(filePath: string) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function restoreFile(filePath: string, content: string | null) {
  if (content === null) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function restoreState() {
  resetMemoryEngineRuntime();
  resetFileSystemRuntime();
  resetFileSystemForDemo();
}

function cleanupWorkspace() {
  removeRecursive(testRoot);
}

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}

function assertThrows(callback: () => void): void {
  let threw = false;
  try {
    callback();
  } catch {
    threw = true;
  }
  if (!threw) {
    throw new Error("Expected function to throw.");
  }
}

function removeRecursive(targetPath: string) {
  if (!fs.existsSync(targetPath)) return;
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(targetPath)) {
      removeRecursive(path.join(targetPath, entry));
    }
    fs.rmdirSync(targetPath);
    return;
  }
  fs.unlinkSync(targetPath);
}
