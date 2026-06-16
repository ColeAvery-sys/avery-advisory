declare const require: any;

const fs = require("fs");
const path = require("path");

import {
  MEMORY_ENGINE_BACKUP_PATH,
  MEMORY_ENGINE_DB_PATH,
  MEMORY_ENGINE_MIGRATION_PATH,
  resetMemoryEngineDatabaseForDemo,
  resetMemoryEngineRuntime,
} from "./memoryEngineRepository";
import {
  deleteMemory,
  getJournalEntryById,
  getMemoryById,
  getMemoryEngineStatistics,
  linkMemoryToContact,
  linkMemoryToProject,
  linkMemoryToTask,
  listMemoryActions,
  saveJournalEntry,
  saveMemory,
  searchJournalEntries,
  searchMemories,
  tagMemory,
  unlinkMemory,
  updateMemory,
  removeMemoryTag,
} from "./memoryEngineService";
import { ensureMemoryEngineV1Migration } from "./memoryEngineMigration";

const backupDb = fs.existsSync(MEMORY_ENGINE_DB_PATH) ? fs.readFileSync(MEMORY_ENGINE_DB_PATH, "utf8") : null;
const backupBak = fs.existsSync(MEMORY_ENGINE_BACKUP_PATH) ? fs.readFileSync(MEMORY_ENGINE_BACKUP_PATH, "utf8") : null;
const backupMigration = fs.existsSync(MEMORY_ENGINE_MIGRATION_PATH) ? fs.readFileSync(MEMORY_ENGINE_MIGRATION_PATH, "utf8") : null;

function restore(pathName: string, content: string | null) {
  if (content === null) {
    if (fs.existsSync(pathName)) fs.unlinkSync(pathName);
    return;
  }
  fs.mkdirSync(path.dirname(pathName), { recursive: true });
  fs.writeFileSync(pathName, content);
}

try {
  resetMemoryEngineRuntime();
  resetMemoryEngineDatabaseForDemo();
  ensureMemoryEngineV1Migration();

  const savedMemories: any[] = [];
  for (let index = 1; index <= 10; index++) {
    savedMemories.push(saveMemory({
      id: `memory-${index}`,
      title: `Memory ${index}`,
      summary: `Summary ${index}`,
      body: `Detailed memory body ${index} about EchoFrame and operational planning.`,
      memoryType: index % 2 === 0 ? "Project Note" : "Strategic Brain",
      source: "test",
      confidence: 0.8,
      tags: index % 2 === 0 ? ["echoframe", "product"] : ["strategy", "brain"],
      projectIds: index <= 5 ? ["project-alpha"] : ["project-beta"],
      taskIds: index <= 3 ? ["task-1"] : ["task-2"],
      contactIds: index <= 2 ? ["contact-cole"] : ["contact-apollo"],
      actor: "QA",
    }));
  }

  assertEqual(savedMemories.length, 10);
  assertEqual(getMemoryEngineStatistics().memories, 10);

  for (let index = 1; index <= 10; index++) {
    const memory = getMemoryById(`memory-${index}`);
    assertEqual(memory.id, `memory-${index}`);
    assertEqual(memory.tags.length >= 1, true);
  }

  assertEqual(searchMemories("EchoFrame").length, 10);
  assertEqual(searchMemories("strategy", { tags: ["strategy"] }).length >= 1, true);
  assertEqual(searchMemories("project-alpha", { linkedObjectId: "project-alpha", linkedObjectType: "Project" }).length, 5);

  const updated = updateMemory("memory-1", { summary: "Updated summary", confidence: 0.9 }, "QA");
  assertEqual(updated.summary, "Updated summary");
  assertEqual(updated.confidence, 0.9);

  const tagged = tagMemory("memory-1", ["daily", "brain", "daily"], "QA");
  assertEqual(tagged.tags.indexOf("daily") >= 0, true);
  assertEqual(tagged.tags.filter((tag) => tag === "daily").length, 1);

  const removed = removeMemoryTag("memory-1", "daily", "QA");
  assertEqual(removed.tags.indexOf("daily") >= 0, false);

  const relinkedProject = linkMemoryToProject("memory-1", "project-gamma", "supports", "QA");
  const relinkedTask = linkMemoryToTask("memory-1", "task-gamma", "followsUpOn", "QA");
  const relinkedContact = linkMemoryToContact("memory-1", "contact-gamma", "references", "QA");
  assertEqual(relinkedProject.links.some((link) => link.linkedObjectId === "project-gamma"), true);
  assertEqual(relinkedTask.links.some((link) => link.linkedObjectId === "task-gamma"), true);
  assertEqual(relinkedContact.links.some((link) => link.linkedObjectId === "contact-gamma"), true);

  const journal = saveJournalEntry({
    id: "journal-1",
    entryDate: "2026-06-11",
    title: "Nightly Debrief",
    summary: "Reviewed EchoFrame progress.",
    body: "Completed memory checks and capture planning.",
    mood: "Focused",
    energy: "Medium",
    memoryIds: ["memory-1"],
    projectIds: ["project-alpha"],
    taskIds: ["task-1"],
    contactIds: ["contact-cole"],
    actor: "QA",
  });
  assertEqual(journal.links.length >= 1, true);
  assertEqual(getJournalEntryById("journal-1").id, "journal-1");
  assertEqual(searchJournalEntries("EchoFrame").length >= 1, true);

  const actions = listMemoryActions();
  assertEqual(actions.length >= 10, true);
  assertEqual(actions.some((action) => action.actionType === "Memory Created"), true);
  assertEqual(actions.some((action) => action.actionType === "Journal Created"), true);

  deleteMemory("memory-10", "QA");
  assertThrows(() => getMemoryById("memory-10"));
  assertEqual(searchMemories("memory-10").length, 0);

  resetMemoryEngineRuntime();
  const restartView = getMemoryById("memory-1");
  assertEqual(restartView.id, "memory-1");
  assertEqual(getJournalEntryById("journal-1").id, "journal-1");

  assertThrows(() => saveMemory({ id: "bad", title: "", summary: "", body: "", memoryType: "", source: "QA", actor: "QA" } as any));
  assertThrows(() => linkMemoryToProject("memory-1", "project-gamma", "supports", "QA"));
  assertThrows(() => removeMemoryTag("memory-1", "missing-tag", "QA"));
  assertThrows(() => deleteMemory("missing-memory", "QA"));

  console.log("All Memory Engine V1 tests passed.");
} finally {
  restore(MEMORY_ENGINE_DB_PATH, backupDb);
  restore(MEMORY_ENGINE_BACKUP_PATH, backupBak);
  restore(MEMORY_ENGINE_MIGRATION_PATH, backupMigration);
  resetMemoryEngineRuntime();
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

