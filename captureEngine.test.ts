declare const require: any;
declare const __dirname: string;
declare const process: any;

const fs = require("fs");
const path = require("path");

import { MEMORY_ENGINE_BACKUP_PATH, MEMORY_ENGINE_DB_PATH, MEMORY_ENGINE_MIGRATION_PATH, resetMemoryEngineRuntime } from "./memoryEngineRepository";
import { getJournalEntryById, getMemoryById, listMemoryActions, searchMemories } from "./memoryEngineService";
import { CAPTURE_ENGINE_BACKUP_PATH, CAPTURE_ENGINE_STATE_PATH, resetCaptureEngineRuntime } from "./captureEngineRepository";
import { captureInput, classifyCaptureText, listCaptures, resetCaptureEngineForDemo, searchCaptures } from "./captureEngineService";

const memoryBackup = readBackup(MEMORY_ENGINE_DB_PATH);
const memoryBakBackup = readBackup(MEMORY_ENGINE_BACKUP_PATH);
const memoryMigrationBackup = readBackup(MEMORY_ENGINE_MIGRATION_PATH);
const captureBackup = readBackup(CAPTURE_ENGINE_STATE_PATH);
const captureBakBackup = readBackup(CAPTURE_ENGINE_BACKUP_PATH);

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  try {
    restoreState();

    const taskClassification = classifyCaptureText("Need to call DMV tomorrow.");
    assertEqual(taskClassification.type, "Task");
    assertEqual(taskClassification.priority, "High");
    assertEqual(taskClassification.category, "Personal");

    const taskCapture = captureInput({ text: "Need to call DMV tomorrow.", source: "Text", actor: "QA" });
    assertEqual(taskCapture.classification.type, "Task");
    assertEqual(taskCapture.classification.priority, "High");
    assertEqual(taskCapture.memoryId !== undefined, true);
    const taskMemory = getMemoryById(taskCapture.memoryId as string);
    assertEqual(taskMemory.memoryType, "Task");
    assertEqual(searchMemories("Call DMV").length >= 1, true);

    const projectCapture = captureInput({ text: "Project EchoFrame launch plan for Avery Industries LLC.", source: "Text", actor: "QA" });
    assertEqual(projectCapture.classification.type, "Project");
    assertEqual(projectCapture.classification.category, "EchoFrame");
    const projectMemory = getMemoryById(projectCapture.memoryId as string);
    assertEqual(projectMemory.links.some((link) => link.linkedObjectType === "Project" && link.linkedObjectId === "echoframe"), true);

    const goalCapture = captureInput({ text: "My goal is to launch the ATLAS memory core.", source: "Text", actor: "QA" });
    assertEqual(goalCapture.classification.type, "Goal");
    const goalMemory = getMemoryById(goalCapture.memoryId as string);
    assertEqual(goalMemory.memoryType, "Goal");

    const journalCapture = captureInput({ text: "Nightly debrief: felt focused and finished the memory checks.", source: "Text", actor: "QA" });
    assertEqual(journalCapture.classification.type, "Journal Entry");
    assertEqual(journalCapture.journalId !== undefined, true);
    const journal = getJournalEntryById(journalCapture.journalId as string);
    assertEqual(journal.title, "Nightly Debrief");

    const contactCapture = captureInput({ text: "Met with John Smith from Avery Industries LLC in Boston.", source: "Text", actor: "QA" });
    assertEqual(contactCapture.classification.type, "Contact");
    const contactMemory = getMemoryById(contactCapture.memoryId as string);
    assertEqual(contactMemory.links.some((link) => link.linkedObjectType === "Contact"), true);
    assertEqual(contactMemory.links.some((link) => link.linkedObjectType === "Contact" && link.linkedObjectId === "john-smith"), true);

    assertEqual(searchCaptures("EchoFrame").length >= 1, true);
    assertEqual(listCaptures().length >= 5, true);

    assertThrows(() => captureInput({ text: "", source: "Text", actor: "QA" }));

    resetCaptureEngineRuntime();
    resetMemoryEngineRuntime();
    const restartCapture = listCaptures();
    assertEqual(restartCapture.length >= 5, true);

    const captureActions = listMemoryActions().filter((item) => item.objectType === "Memory" || item.objectType === "Journal");
    assertEqual(captureActions.length >= 5, true);

    console.log("All Capture Engine V1 tests passed.");
  } finally {
    restoreFile(MEMORY_ENGINE_DB_PATH, memoryBackup);
    restoreFile(MEMORY_ENGINE_BACKUP_PATH, memoryBakBackup);
    restoreFile(MEMORY_ENGINE_MIGRATION_PATH, memoryMigrationBackup);
    restoreFile(CAPTURE_ENGINE_STATE_PATH, captureBackup);
    restoreFile(CAPTURE_ENGINE_BACKUP_PATH, captureBakBackup);
    resetMemoryEngineRuntime();
    resetCaptureEngineRuntime();
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
  resetCaptureEngineRuntime();
  resetCaptureEngineForDemo();
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
