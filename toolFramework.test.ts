declare const require: any;
declare const __dirname: string;
declare const process: any;

const fs = require("fs");
const path = require("path");

import { MEMORY_ENGINE_BACKUP_PATH, MEMORY_ENGINE_DB_PATH, MEMORY_ENGINE_MIGRATION_PATH, resetMemoryEngineRuntime } from "./memoryEngineRepository";
import { listMemoryActions, searchMemories } from "./memoryEngineService";
import {
  TOOL_FRAMEWORK_BACKUP_PATH,
  TOOL_FRAMEWORK_STATE_PATH,
  resetToolFrameworkRuntime,
} from "./toolFrameworkRepository";
import {
  discoverTools,
  enableTool,
  executeTool,
  initializeToolFramework,
  registerTool,
  resetToolFrameworkForDemo,
  disableTool,
} from "./toolFrameworkService";

const memoryBackup = readBackup(MEMORY_ENGINE_DB_PATH);
const memoryBakBackup = readBackup(MEMORY_ENGINE_BACKUP_PATH);
const memoryMigrationBackup = readBackup(MEMORY_ENGINE_MIGRATION_PATH);
const toolBackup = readBackup(TOOL_FRAMEWORK_STATE_PATH);
const toolBakBackup = readBackup(TOOL_FRAMEWORK_BACKUP_PATH);

const tempFile = path.resolve(__dirname, "..", "atlas_ops", "logs", "tool-framework-test.txt");
const tempDir = path.dirname(tempFile);

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
try {
  restoreTooling();
  cleanupTempFile();

  const registry = initializeToolFramework();
  assertEqual(registry.tools.length >= 8, true);
  assertEqual(discoverTools().some((tool) => tool.name === "Create Memory"), true);

  const customTool = registerTool({
    name: "Echo Tool",
    description: "Echo test payloads.",
    category: "System",
    permission: "Allowed",
    enabled: true,
    version: "1.0.0",
    argsSchema: "{ text: string }",
    validate: (args: any) => {
      if (!args || typeof args.text !== "string" || !args.text.trim()) throw new Error("Invalid Arguments");
    },
    execute: (args: any) => ({ echo: args.text }),
  });
  assertEqual(customTool.name, "Echo Tool");
  assertEqual(discoverTools(true).some((tool) => tool.name === "Echo Tool"), true);

  const createdMemory = await executeTool("Create Memory", {
    title: "Tool memory",
    summary: "Created by tool framework",
    body: "Memory created through the tool executor.",
    memoryType: "Operational",
    tags: ["tool", "memory"],
    projectIds: ["project-tool"],
    actor: "QA",
  }, { actor: "QA", permission: "Allowed", timeoutMs: 1000 });
  assertEqual(createdMemory.status, "Success");
  assertEqual((createdMemory.result as any).tags.indexOf("tool") >= 0, true);
  assertEqual(searchMemories("Tool memory").length >= 1, true);

  const timeResult = await executeTool("Get Time", {}, { actor: "QA", permission: "Allowed", timeoutMs: 1000 });
  assertEqual(timeResult.status, "Success");
  assertEqual(typeof (timeResult.result as any).iso, "string");

  const fileCreated = await executeTool("Create File", {
    path: "atlas_ops/logs/tool-framework-test.txt",
    content: "tool framework content",
  }, { actor: "QA", permission: "Admin", timeoutMs: 1000 });
  assertEqual(fileCreated.status, "Success");

  const fileRead = await executeTool("Read File", {
    path: "atlas_ops/logs/tool-framework-test.txt",
  }, { actor: "QA", permission: "Read Only", timeoutMs: 1000 });
  assertEqual(fileRead.status, "Success");
  assertEqual((fileRead.result as any).content.indexOf("tool framework content") >= 0, true);

  const fileSearch = await executeTool("Search Files", {
    query: "tool framework content",
    root: "atlas_ops/logs",
  }, { actor: "QA", permission: "Read Only", timeoutMs: 1000 });
  assertEqual(fileSearch.status, "Success");
  assertEqual((fileSearch.result as any[]).length >= 1, true);

  const memoryUpdate = await executeTool("Update Memory", {
    id: (createdMemory.result as any).id,
    patch: { summary: "Updated by tool executor" },
  }, { actor: "QA", permission: "Allowed", timeoutMs: 1000 });
  assertEqual(memoryUpdate.status, "Success");
  assertEqual((memoryUpdate.result as any).summary, "Updated by tool executor");

  const deniedWrite = await executeTool("Write File", {
    path: "atlas_ops/logs/tool-framework-denied.txt",
    content: "should not write",
  }, { actor: "QA", permission: "Read Only", timeoutMs: 1000 });
  assertEqual(deniedWrite.status, "Failure");
  assertEqual(deniedWrite.error && deniedWrite.error.code, "Permission Denied");

  const invalidArgs = await executeTool("Create Memory", {
    title: "",
    summary: "",
    body: "",
    memoryType: "",
  }, { actor: "QA", permission: "Allowed", timeoutMs: 1000 });
  assertEqual(invalidArgs.status, "Failure");
  assertEqual(invalidArgs.error && invalidArgs.error.code, "Invalid Arguments");

  registerTool({
    name: "Slow Tool",
    description: "Test timeout handling.",
    category: "System",
    permission: "Allowed",
    enabled: true,
    version: "1.0.0",
    execute: async () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 50)),
  });
  const timeoutResult = await executeTool("Slow Tool", {}, { actor: "QA", permission: "Allowed", timeoutMs: 1 });
  assertEqual(timeoutResult.status, "Failure");
  assertEqual(timeoutResult.error && timeoutResult.error.code, "Timeout");

  disableTool("Echo Tool", "QA");
  const disabledTool = await executeTool("Echo Tool", { text: "hello" }, { actor: "QA", permission: "Allowed", timeoutMs: 1000 });
  assertEqual(disabledTool.status, "Failure");
  enableTool("Echo Tool", "QA");
  const echoTool = await executeTool("Echo Tool", { text: "hello" }, { actor: "QA", permission: "Allowed", timeoutMs: 1000 });
  assertEqual(echoTool.status, "Success");
  assertEqual((echoTool.result as any).echo, "hello");

  restoreTooling();
  const restarted = initializeToolFramework();
  assertEqual(restarted.tools.some((tool) => tool.name === "Create Memory"), true);

  const toolActions = listMemoryActions().filter((item) => item.objectType === "Tool");
  assertEqual(toolActions.some((item) => item.actionType === "Tool Executed"), true);
  assertEqual(toolActions.some((item) => item.actionType === "Tool Failed"), true);
  assertEqual(toolActions.some((item) => item.actionType === "Tool Registered"), true);

  console.log("All Tool Framework V1 tests passed.");
} finally {
  cleanupTempFile();
  restoreFile(MEMORY_ENGINE_DB_PATH, memoryBackup);
  restoreFile(MEMORY_ENGINE_BACKUP_PATH, memoryBakBackup);
  restoreFile(MEMORY_ENGINE_MIGRATION_PATH, memoryMigrationBackup);
  restoreFile(TOOL_FRAMEWORK_STATE_PATH, toolBackup);
  restoreFile(TOOL_FRAMEWORK_BACKUP_PATH, toolBakBackup);
  resetMemoryEngineRuntime();
  resetToolFrameworkRuntime();
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

function cleanupTempFile() {
  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
}

function restoreTooling() {
  resetMemoryEngineRuntime();
  resetToolFrameworkRuntime();
  resetToolFrameworkForDemo();
}

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}
