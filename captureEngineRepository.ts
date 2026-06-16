declare const require: any;
declare const __dirname: string;

import { CaptureEngineState } from "./captureEngineTypes";

const fs = require("fs");
const path = require("path");

export const CAPTURE_ENGINE_STATE_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_capture_engine_v1.json");
export const CAPTURE_ENGINE_BACKUP_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_capture_engine_v1.backup.json");

let captureEngineCache: CaptureEngineState | null = null;

export function createEmptyCaptureEngineState(): CaptureEngineState {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    captures: [],
  };
}

export function loadCaptureEngineState(): CaptureEngineState {
  if (captureEngineCache) {
    return cloneCaptureEngineState(captureEngineCache);
  }

  if (!fs.existsSync(CAPTURE_ENGINE_STATE_PATH)) {
    captureEngineCache = createEmptyCaptureEngineState();
    return cloneCaptureEngineState(captureEngineCache);
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(CAPTURE_ENGINE_STATE_PATH, "utf8"));
    captureEngineCache = normalizeCaptureEngineState(parsed);
    return cloneCaptureEngineState(captureEngineCache);
  } catch (primaryError) {
    if (fs.existsSync(CAPTURE_ENGINE_BACKUP_PATH)) {
      try {
        const parsedBackup = JSON.parse(fs.readFileSync(CAPTURE_ENGINE_BACKUP_PATH, "utf8"));
        captureEngineCache = normalizeCaptureEngineState(parsedBackup);
        persistCaptureEngineState(captureEngineCache);
        return cloneCaptureEngineState(captureEngineCache);
      } catch (_backupError) {
        throw primaryError;
      }
    }
    throw primaryError;
  }
}

export function saveCaptureEngineState(state: CaptureEngineState): CaptureEngineState {
  const normalized = normalizeCaptureEngineState(state);
  persistCaptureEngineState(normalized);
  captureEngineCache = normalized;
  return cloneCaptureEngineState(normalized);
}

export function resetCaptureEngineRuntime(): void {
  captureEngineCache = null;
}

export function cloneCaptureEngineState(state: CaptureEngineState): CaptureEngineState {
  return JSON.parse(JSON.stringify(state));
}

export function normalizeCaptureEngineState(payload: any): CaptureEngineState {
  const fallback = createEmptyCaptureEngineState();
  return {
    schemaVersion: Number(payload && payload.schemaVersion) || 1,
    createdAt: String(payload && payload.createdAt ? payload.createdAt : fallback.createdAt),
    updatedAt: String(payload && payload.updatedAt ? payload.updatedAt : fallback.updatedAt),
    captures: Array.isArray(payload && payload.captures) ? payload.captures.map(normalizeCaptureRecord) : [],
  };
}

export function persistCaptureEngineState(state: CaptureEngineState): void {
  fs.mkdirSync(path.dirname(CAPTURE_ENGINE_STATE_PATH), { recursive: true });
  if (fs.existsSync(CAPTURE_ENGINE_STATE_PATH)) {
    fs.copyFileSync(CAPTURE_ENGINE_STATE_PATH, CAPTURE_ENGINE_BACKUP_PATH);
    fs.unlinkSync(CAPTURE_ENGINE_STATE_PATH);
  }
  if (fs.existsSync(CAPTURE_ENGINE_STATE_PATH)) {
    fs.unlinkSync(CAPTURE_ENGINE_STATE_PATH);
  }
  fs.writeFileSync(CAPTURE_ENGINE_STATE_PATH, JSON.stringify(state, null, 2));
}

function normalizeCaptureRecord(record: any) {
  return {
    id: String(record && record.id ? record.id : `capture-${Date.now()}`),
    source: normalizeSource(record && record.source),
    originalInput: String(record && record.originalInput ? record.originalInput : ""),
    timestamp: String(record && record.timestamp ? record.timestamp : new Date().toISOString()),
    confidence: typeof record && typeof record.confidence === "number" ? record.confidence : 0.5,
    classification: record && record.classification ? record.classification : {
      type: "Memory",
      priority: "Medium",
      category: "General",
      title: "Capture",
      confidence: 0.5,
      summary: "",
      rationale: [],
      entities: [],
    },
    createdMemoryId: record && record.createdMemoryId ? String(record.createdMemoryId) : undefined,
    createdJournalId: record && record.createdJournalId ? String(record.createdJournalId) : undefined,
    status: record && record.status === "Failed" ? "Failed" : "Success",
    error: record && record.error ? String(record.error) : undefined,
  };
}

function normalizeSource(value: any): CaptureEngineState["captures"][number]["source"] {
  if (value === "Voice" || value === "Dashboard" || value === "Telegram" || value === "Discord" || value === "Email") return value;
  return "Text";
}
