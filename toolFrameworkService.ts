declare const require: any;
declare const __dirname: string;

import { logMemoryAction, saveMemory, searchMemories, updateMemory as updateAtlasMemory } from "./memoryEngineService";
import { getMemoryEngineStatistics } from "./memoryEngineService";
import { ToolContext, ToolDefinition, ToolExecutionResult, ToolFailureCode, ToolMetadata, ToolPermission, ToolRegistryState } from "./toolFrameworkTypes";
import {
  cloneToolFrameworkState,
  loadToolFrameworkState,
  resetToolFrameworkRuntime,
  saveToolFrameworkState,
  upsertToolMetadata,
  updateToolEnabled,
} from "./toolFrameworkRepository";

const fs = require("fs");
const path = require("path");

const TOOL_TIMEOUT_MS = 5000;
const TOOL_FILE_ROOT = path.resolve(__dirname, "..");

const toolDefinitions = new Map<string, ToolDefinition<any, any>>();

export type ToolRegistrationInput<TArgs = any, TResult = any> = ToolDefinition<TArgs, TResult>;

export function initializeToolFramework(): ToolRegistryState {
  const state = loadToolFrameworkState();
  if (toolDefinitions.size === 0) {
    registerBuiltInTools();
  }
  return loadToolFrameworkState();
}

export function registerTool<TArgs = any, TResult = any>(definition: ToolDefinition<TArgs, TResult>): ToolMetadata {
  validateToolDefinition(definition);
  toolDefinitions.set(definition.name, definition);
  const metadata: ToolMetadata = {
    name: definition.name,
    description: definition.description,
    category: definition.category,
    permission: definition.permission,
    enabled: definition.enabled,
    version: definition.version,
    argsSchema: definition.argsSchema,
  };
  upsertToolMetadata(metadata);
  logMemoryAction("Tool Registered", "Tool", definition.name, "ATLAS", "Success", {
    category: definition.category,
    permission: definition.permission,
    version: definition.version,
  });
  return metadata;
}

export function discoverTools(includeDisabled: boolean = false): ToolMetadata[] {
  const state = initializeToolFramework();
  return state.tools.filter((tool) => includeDisabled || tool.enabled).map((tool) => ({ ...tool }));
}

export function enableTool(name: string, actor: string = "ATLAS"): ToolMetadata {
  ensureToolDefinition(name);
  const state = updateToolEnabled(name, true);
  logMemoryAction("Tool Enabled", "Tool", name, actor, "Success", { enabled: true });
  return getToolMetadata(state, name);
}

export function disableTool(name: string, actor: string = "ATLAS"): ToolMetadata {
  ensureToolDefinition(name);
  const state = updateToolEnabled(name, false);
  logMemoryAction("Tool Disabled", "Tool", name, actor, "Success", { enabled: false });
  return getToolMetadata(state, name);
}

export async function executeTool<TArgs = any, TResult = any>(name: string, args: TArgs, context: ToolContext): Promise<ToolExecutionResult> {
  const startedAt = Date.now();
  try {
    const tool = ensureToolDefinition(name);
    const toolState = initializeToolFramework().tools.find((item) => item.name === name);
    if (!toolState || !toolState.enabled) {
      throw toolError("Missing Tool", `Tool ${name} is disabled or not registered.`);
    }
    enforcePermission(tool.permission, context.permission);
    if (tool.validate) {
      tool.validate(args);
    }

    const execution = Promise.resolve(tool.execute(args, context));
    const result = await withTimeout(execution, context.timeoutMs || TOOL_TIMEOUT_MS);
    const durationMs = Date.now() - startedAt;
    logMemoryAction("Tool Executed", "Tool", name, context.actor || "ATLAS", "Success", {
      args: sanitizeLogValue(args),
      result: sanitizeLogValue(result),
      durationMs: durationMs,
    });
    return {
      toolName: name,
      status: "Success",
      durationMs: durationMs,
      result: result,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startedAt;
    const code = normalizeFailureCode(error);
    logMemoryAction("Tool Failed", "Tool", name, context && context.actor ? context.actor : "ATLAS", "Failed", {
      args: sanitizeLogValue(args),
      code: code,
      message: error && error.message ? error.message : String(error),
      durationMs: durationMs,
    });
    return {
      toolName: name,
      status: "Failure",
      durationMs: durationMs,
      error: {
        code: code,
        message: error && error.message ? error.message : String(error),
      },
    };
  }
}

export function resetToolFrameworkForDemo(): void {
  resetToolFrameworkRuntime();
  toolDefinitions.clear();
  const state = loadToolFrameworkState();
  state.tools = [];
  state.updatedAt = new Date().toISOString();
  saveToolFrameworkState(state);
  registerBuiltInTools();
}

function registerBuiltInTools() {
  registerTool({
    name: "Read File",
    description: "Read a text file from disk.",
    category: "File",
    permission: "Read Only",
    enabled: true,
    version: "1.0.0",
    argsSchema: "{ path: string }",
    validate: (args: any) => {
      if (!args || typeof args.path !== "string" || !args.path.trim()) throw toolError("Invalid Arguments", "path is required.");
    },
    execute: (args: any) => {
      const filePath = resolveWorkspacePath(args.path);
      return {
        path: filePath,
        content: fs.readFileSync(filePath, "utf8"),
      };
    },
  });

  registerTool({
    name: "Write File",
    description: "Write text to an existing file.",
    category: "File",
    permission: "Admin",
    enabled: true,
    version: "1.0.0",
    argsSchema: "{ path: string, content: string, overwrite?: boolean }",
    validate: (args: any) => {
      if (!args || typeof args.path !== "string" || !args.path.trim()) throw toolError("Invalid Arguments", "path is required.");
      if (typeof args.content !== "string") throw toolError("Invalid Arguments", "content must be a string.");
    },
    execute: (args: any) => {
      const filePath = resolveWorkspacePath(args.path);
      if (fs.existsSync(filePath) && args.overwrite === false) {
        throw toolError("Exception", "File already exists and overwrite is false.");
      }
      ensureParentDirectory(filePath);
      fs.writeFileSync(filePath, String(args.content), "utf8");
      return { path: filePath, bytesWritten: String(args.content).length };
    },
  });

  registerTool({
    name: "Search Files",
    description: "Search file names and contents beneath a root folder.",
    category: "File",
    permission: "Read Only",
    enabled: true,
    version: "1.0.0",
    argsSchema: "{ query: string, root?: string }",
    validate: (args: any) => {
      if (!args || typeof args.query !== "string" || !args.query.trim()) throw toolError("Invalid Arguments", "query is required.");
    },
    execute: (args: any) => {
      const root = resolveWorkspacePath(args.root || ".");
      return searchFiles(root, String(args.query));
    },
  });

  registerTool({
    name: "Create File",
    description: "Create a new file if it does not already exist.",
    category: "File",
    permission: "Admin",
    enabled: true,
    version: "1.0.0",
    argsSchema: "{ path: string, content?: string }",
    validate: (args: any) => {
      if (!args || typeof args.path !== "string" || !args.path.trim()) throw toolError("Invalid Arguments", "path is required.");
    },
    execute: (args: any) => {
      const filePath = resolveWorkspacePath(args.path);
      if (fs.existsSync(filePath)) {
        throw toolError("Exception", "File already exists.");
      }
      ensureParentDirectory(filePath);
      fs.writeFileSync(filePath, String(args.content || ""), "utf8");
      return { path: filePath, created: true };
    },
  });

  registerTool({
    name: "Create Memory",
    description: "Create a memory record in ATLAS Memory Engine V1.",
    category: "Memory",
    permission: "Allowed",
    enabled: true,
    version: "1.0.0",
    argsSchema: "{ title, summary, body, memoryType, tags?, projectIds?, taskIds?, contactIds? }",
    validate: (args: any) => {
      if (!args || typeof args.title !== "string" || !args.title.trim()) throw toolError("Invalid Arguments", "title is required.");
      if (typeof args.summary !== "string" || !args.summary.trim()) throw toolError("Invalid Arguments", "summary is required.");
      if (typeof args.body !== "string" || !args.body.trim()) throw toolError("Invalid Arguments", "body is required.");
      if (typeof args.memoryType !== "string" || !args.memoryType.trim()) throw toolError("Invalid Arguments", "memoryType is required.");
    },
    execute: (args: any, context: ToolContext) => {
      return saveMemory({
        title: args.title,
        summary: args.summary,
        body: args.body,
        memoryType: args.memoryType,
        source: args.source || "Tool Framework",
        confidence: args.confidence,
        visibility: args.visibility,
        tags: args.tags,
        projectIds: args.projectIds,
        taskIds: args.taskIds,
        contactIds: args.contactIds,
        actor: context.actor,
      });
    },
  });

  registerTool({
    name: "Search Memory",
    description: "Search ATLAS memories.",
    category: "Memory",
    permission: "Read Only",
    enabled: true,
    version: "1.0.0",
    argsSchema: "{ query: string, filters?: object }",
    validate: (args: any) => {
      if (!args || typeof args.query !== "string") throw toolError("Invalid Arguments", "query is required.");
    },
    execute: (args: any) => {
      return searchMemories(args.query, args.filters || {});
    },
  });

  registerTool({
    name: "Update Memory",
    description: "Update an existing ATLAS memory.",
    category: "Memory",
    permission: "Allowed",
    enabled: true,
    version: "1.0.0",
    argsSchema: "{ id: string, patch: object }",
    validate: (args: any) => {
      if (!args || typeof args.id !== "string" || !args.id.trim()) throw toolError("Invalid Arguments", "id is required.");
      if (!args.patch || typeof args.patch !== "object") throw toolError("Invalid Arguments", "patch is required.");
    },
    execute: (args: any) => {
      return updateAtlasMemory(args.id, args.patch || {});
    },
  });

  registerTool({
    name: "Get Time",
    description: "Return the current time information.",
    category: "System",
    permission: "Allowed",
    enabled: true,
    version: "1.0.0",
    execute: () => {
      const now = new Date();
      return {
        iso: now.toISOString(),
        unixMs: now.getTime(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      };
    },
  });

  registerTool({
    name: "Get Status",
    description: "Return a status snapshot for ATLAS Tool Framework V1.",
    category: "System",
    permission: "Read Only",
    enabled: true,
    version: "1.0.0",
    execute: () => {
      const state = initializeToolFramework();
      const enabledCount = state.tools.filter((tool) => tool.enabled).length;
      return {
        toolCount: state.tools.length,
        enabledCount: enabledCount,
        disabledCount: state.tools.length - enabledCount,
        memoryStats: getMemoryEngineStatistics(),
      };
    },
  });
}

function ensureToolDefinition(name: string): ToolDefinition<any, any> {
  initializeToolFramework();
  const definition = toolDefinitions.get(name);
  if (!definition) {
    throw toolError("Missing Tool", `Tool ${name} not found.`);
  }
  return definition;
}

function validateToolDefinition(definition: ToolDefinition<any, any>) {
  if (!definition || typeof definition !== "object") {
    throw toolError("Invalid Arguments", "Tool definition must be an object.");
  }
  if (typeof definition.name !== "string" || !definition.name.trim()) throw toolError("Invalid Arguments", "Tool name is required.");
  if (typeof definition.execute !== "function") throw toolError("Invalid Arguments", "Tool execute function is required.");
}

function getToolMetadata(state: ToolRegistryState, name: string) {
  const metadata = state.tools.find((item) => item.name === name);
  if (!metadata) throw toolError("Missing Tool", `Tool ${name} not found.`);
  return { ...metadata };
}

function enforcePermission(required: ToolPermission, granted: ToolPermission) {
  const requiredRank = permissionRank(required);
  const grantedRank = permissionRank(granted);
  if (grantedRank < requiredRank) {
    throw toolError("Permission Denied", `Permission ${granted} is insufficient for ${required}.`);
  }
}

function permissionRank(permission: ToolPermission) {
  switch (permission) {
    case "Denied":
      return 0;
    case "Read Only":
      return 1;
    case "Allowed":
      return 2;
    case "Admin":
      return 3;
    default:
      return 0;
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => reject(toolError("Timeout", `Tool execution exceeded ${timeoutMs}ms.`)), timeoutMs);
    promise.then((value) => {
      clearTimeout(timeout);
      resolve(value);
    }).catch((error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

function normalizeFailureCode(error: any): ToolFailureCode {
  if (error && error.code === "Missing Tool") return "Missing Tool";
  if (error && error.code === "Invalid Arguments") return "Invalid Arguments";
  if (error && error.code === "Timeout") return "Timeout";
  if (error && error.code === "Permission Denied") return "Permission Denied";
  return "Exception";
}

function toolError(code: ToolFailureCode, message: string) {
  const error = new Error(message) as Error & { code: ToolFailureCode; statusCode: number };
  error.code = code;
  error.statusCode = code === "Permission Denied" ? 403 : code === "Missing Tool" ? 404 : code === "Timeout" ? 504 : 400;
  return error;
}

function sanitizeLogValue(value: unknown) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return String(value);
  }
}

function resolveWorkspacePath(inputPath: string) {
  const resolved = path.resolve(TOOL_FILE_ROOT, inputPath);
  return resolved;
}

function ensureParentDirectory(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function searchFiles(root: string, query: string) {
  const results: Array<{ path: string; matchedOn: string; snippet?: string }> = [];
  walk(root, (filePath: string) => {
    if (filePath.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
      results.push({ path: filePath, matchedOn: "path" });
      return;
    }
    try {
      const text = fs.readFileSync(filePath, "utf8");
      const index = text.toLowerCase().indexOf(query.toLowerCase());
      if (index >= 0) {
        results.push({ path: filePath, matchedOn: "content", snippet: text.slice(Math.max(0, index - 40), Math.min(text.length, index + 120)) });
      }
    } catch {
      // Ignore binary or unreadable files.
    }
  });
  return results;
}

function walk(root: string, onFile: (filePath: string) => void) {
  if (!fs.existsSync(root)) return;
  const stat = fs.statSync(root);
  if (stat.isFile()) {
    onFile(root);
    return;
  }
  const entries = fs.readdirSync(root);
  for (const entry of entries) {
    const fullPath = path.join(root, entry);
    try {
      const entryStat = fs.statSync(fullPath);
      if (entryStat.isDirectory()) {
        walk(fullPath, onFile);
      } else if (entryStat.isFile()) {
        onFile(fullPath);
      }
    } catch {
      // Ignore unreadable paths.
    }
  }
}
