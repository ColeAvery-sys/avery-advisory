declare const require: any;
declare const __dirname: string;

import { ToolMetadata, ToolRegistryState } from "./toolFrameworkTypes";

const fs = require("fs");
const path = require("path");

export const TOOL_FRAMEWORK_STATE_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_tool_framework_v1.json");
export const TOOL_FRAMEWORK_BACKUP_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_tool_framework_v1.backup.json");

let toolFrameworkCache: ToolRegistryState | null = null;

export function createEmptyToolFrameworkState(): ToolRegistryState {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    tools: [],
  };
}

export function loadToolFrameworkState(): ToolRegistryState {
  if (toolFrameworkCache) {
    return cloneToolFrameworkState(toolFrameworkCache);
  }

  if (!fs.existsSync(TOOL_FRAMEWORK_STATE_PATH)) {
    toolFrameworkCache = createEmptyToolFrameworkState();
    return cloneToolFrameworkState(toolFrameworkCache);
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(TOOL_FRAMEWORK_STATE_PATH, "utf8"));
    toolFrameworkCache = normalizeToolFrameworkState(parsed);
    return cloneToolFrameworkState(toolFrameworkCache);
  } catch (primaryError) {
    if (fs.existsSync(TOOL_FRAMEWORK_BACKUP_PATH)) {
      try {
        const parsedBackup = JSON.parse(fs.readFileSync(TOOL_FRAMEWORK_BACKUP_PATH, "utf8"));
        toolFrameworkCache = normalizeToolFrameworkState(parsedBackup);
        persistToolFrameworkState(toolFrameworkCache);
        return cloneToolFrameworkState(toolFrameworkCache);
      } catch (_backupError) {
        throw primaryError;
      }
    }
    throw primaryError;
  }
}

export function saveToolFrameworkState(state: ToolRegistryState): ToolRegistryState {
  const normalized = normalizeToolFrameworkState(state);
  persistToolFrameworkState(normalized);
  toolFrameworkCache = normalized;
  return cloneToolFrameworkState(normalized);
}

export function resetToolFrameworkRuntime(): void {
  toolFrameworkCache = null;
}

export function upsertToolMetadata(metadata: ToolMetadata): ToolRegistryState {
  const state = loadToolFrameworkState();
  const index = state.tools.findIndex((item) => item.name === metadata.name);
  if (index >= 0) {
    state.tools[index] = { ...state.tools[index], ...metadata };
  } else {
    state.tools.push(metadata);
  }
  state.updatedAt = new Date().toISOString();
  return saveToolFrameworkState(state);
}

export function updateToolEnabled(name: string, enabled: boolean): ToolRegistryState {
  const state = loadToolFrameworkState();
  const tool = state.tools.find((item) => item.name === name);
  if (!tool) {
    throw new Error(`Tool ${name} not found.`);
  }
  tool.enabled = enabled;
  state.updatedAt = new Date().toISOString();
  return saveToolFrameworkState(state);
}

export function cloneToolFrameworkState(state: ToolRegistryState): ToolRegistryState {
  return JSON.parse(JSON.stringify(state));
}

export function normalizeToolFrameworkState(payload: any): ToolRegistryState {
  const fallback = createEmptyToolFrameworkState();
  const normalizedTools = Array.isArray(payload && payload.tools) ? payload.tools : [];
  return {
    schemaVersion: Number(payload && payload.schemaVersion) || 1,
    createdAt: String(payload && payload.createdAt ? payload.createdAt : fallback.createdAt),
    updatedAt: String(payload && payload.updatedAt ? payload.updatedAt : fallback.updatedAt),
    tools: normalizedTools.map(normalizeToolMetadata),
  };
}

export function persistToolFrameworkState(state: ToolRegistryState): void {
  fs.mkdirSync(path.dirname(TOOL_FRAMEWORK_STATE_PATH), { recursive: true });
  if (fs.existsSync(TOOL_FRAMEWORK_STATE_PATH)) {
    fs.copyFileSync(TOOL_FRAMEWORK_STATE_PATH, TOOL_FRAMEWORK_BACKUP_PATH);
    fs.unlinkSync(TOOL_FRAMEWORK_STATE_PATH);
  }
  if (fs.existsSync(TOOL_FRAMEWORK_STATE_PATH)) {
    fs.unlinkSync(TOOL_FRAMEWORK_STATE_PATH);
  }
  fs.writeFileSync(TOOL_FRAMEWORK_STATE_PATH, JSON.stringify(state, null, 2));
}

function normalizeToolMetadata(record: any): ToolMetadata {
  return {
    name: String(record && record.name ? record.name : "Unnamed Tool"),
    description: String(record && record.description ? record.description : ""),
    category: normalizeCategory(record && record.category),
    permission: normalizePermission(record && record.permission),
    enabled: record && record.enabled === false ? false : true,
    version: String(record && record.version ? record.version : "1.0.0"),
    argsSchema: record && record.argsSchema ? String(record.argsSchema) : undefined,
  };
}

function normalizeCategory(value: any): ToolMetadata["category"] {
  if (value === "File" || value === "Memory" || value === "System") return value;
  return "System";
}

function normalizePermission(value: any): ToolMetadata["permission"] {
  if (value === "Denied" || value === "Read Only" || value === "Allowed" || value === "Admin") return value;
  return "Allowed";
}
