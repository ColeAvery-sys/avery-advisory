declare const require: any;
declare const __dirname: string;

import { CalendarEventRecord, CalendarState } from "./calendarIntegrationTypes";

const fs = require("fs");
const path = require("path");

export const CALENDAR_STATE_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_calendar_v1.json");
export const CALENDAR_BACKUP_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_calendar_v1.backup.json");

let calendarCache: CalendarState | null = null;

export function createEmptyCalendarState(): CalendarState {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    events: [],
  };
}

export function loadCalendarState(): CalendarState {
  if (calendarCache) {
    return cloneCalendarState(calendarCache);
  }

  if (!fs.existsSync(CALENDAR_STATE_PATH)) {
    calendarCache = createEmptyCalendarState();
    return cloneCalendarState(calendarCache);
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(CALENDAR_STATE_PATH, "utf8"));
    calendarCache = normalizeCalendarState(parsed);
    return cloneCalendarState(calendarCache);
  } catch (primaryError) {
    if (fs.existsSync(CALENDAR_BACKUP_PATH)) {
      try {
        const parsedBackup = JSON.parse(fs.readFileSync(CALENDAR_BACKUP_PATH, "utf8"));
        calendarCache = normalizeCalendarState(parsedBackup);
        persistCalendarState(calendarCache);
        return cloneCalendarState(calendarCache);
      } catch (_backupError) {
        throw primaryError;
      }
    }
    throw primaryError;
  }
}

export function saveCalendarState(state: CalendarState): CalendarState {
  const normalized = normalizeCalendarState(state);
  persistCalendarState(normalized);
  calendarCache = normalized;
  return cloneCalendarState(normalized);
}

export function resetCalendarRuntime(): void {
  calendarCache = null;
}

export function cloneCalendarState(state: CalendarState): CalendarState {
  return JSON.parse(JSON.stringify(state));
}

export function normalizeCalendarState(payload: any): CalendarState {
  const fallback = createEmptyCalendarState();
  return {
    schemaVersion: Number(payload && payload.schemaVersion) || 1,
    createdAt: String(payload && payload.createdAt ? payload.createdAt : fallback.createdAt),
    updatedAt: String(payload && payload.updatedAt ? payload.updatedAt : fallback.updatedAt),
    events: Array.isArray(payload && payload.events) ? payload.events.map(normalizeCalendarEventRecord) : [],
  };
}

export function persistCalendarState(state: CalendarState): void {
  fs.mkdirSync(path.dirname(CALENDAR_STATE_PATH), { recursive: true });
  if (fs.existsSync(CALENDAR_STATE_PATH)) {
    try {
      fs.chmodSync(CALENDAR_STATE_PATH, 0o666);
    } catch {
      // ignore
    }
    fs.copyFileSync(CALENDAR_STATE_PATH, CALENDAR_BACKUP_PATH);
  }
  try {
    fs.chmodSync(CALENDAR_STATE_PATH, 0o666);
  } catch {
    // ignore
  }
  const tempPath = CALENDAR_STATE_PATH + ".tmp";
  fs.writeFileSync(tempPath, JSON.stringify(state, null, 2));
  if (fs.existsSync(CALENDAR_STATE_PATH)) {
    try {
      fs.unlinkSync(CALENDAR_STATE_PATH);
    } catch {
      // ignore and continue with replace
    }
  }
  fs.renameSync(tempPath, CALENDAR_STATE_PATH);
}

export function upsertCalendarEventRecord(record: CalendarEventRecord): CalendarState {
  const state = loadCalendarState();
  const index = state.events.findIndex((item) => item.id === record.id);
  if (index >= 0) {
    state.events[index] = record;
  } else {
    state.events.push(record);
  }
  state.updatedAt = new Date().toISOString();
  return saveCalendarState(state);
}

export function removeCalendarEventRecord(eventId: string): CalendarState {
  const state = loadCalendarState();
  state.events = state.events.filter((item) => item.id !== eventId);
  state.updatedAt = new Date().toISOString();
  return saveCalendarState(state);
}

export function getCalendarEventRecord(eventId: string) {
  const state = loadCalendarState();
  return state.events.find((item) => item.id === eventId) || null;
}

function normalizeCalendarEventRecord(record: any): CalendarEventRecord {
  return {
    id: String(record && record.id ? record.id : `calendar-${Date.now()}`),
    title: String(record && record.title ? record.title : ""),
    date: String(record && record.date ? record.date : new Date().toISOString().slice(0, 10)),
    startTime: record && record.startTime ? String(record.startTime) : undefined,
    endTime: record && record.endTime ? String(record.endTime) : undefined,
    kind: record && (record.kind === "Reminder" || record.kind === "Recurring") ? record.kind : "Event",
    participants: Array.isArray(record && record.participants) ? record.participants.map(String) : [],
    location: record && record.location ? String(record.location) : undefined,
    notes: record && record.notes ? String(record.notes) : undefined,
    recurrenceRule: record && record.recurrenceRule ? String(record.recurrenceRule) : undefined,
    status: record && record.status === "Cancelled" ? "Cancelled" : "Scheduled",
    linkedProjectIds: Array.isArray(record && record.linkedProjectIds) ? record.linkedProjectIds.map(String) : [],
    linkedTaskIds: Array.isArray(record && record.linkedTaskIds) ? record.linkedTaskIds.map(String) : [],
    linkedMemoryIds: Array.isArray(record && record.linkedMemoryIds) ? record.linkedMemoryIds.map(String) : [],
    links: Array.isArray(record && record.links) ? record.links.map(normalizeLink) : [],
    memoryId: record && record.memoryId ? String(record.memoryId) : undefined,
    createdAt: String(record && record.createdAt ? record.createdAt : new Date().toISOString()),
    updatedAt: String(record && record.updatedAt ? record.updatedAt : new Date().toISOString()),
  };
}

function normalizeLink(link: any) {
  return {
    targetType: link && (link.targetType === "Project" || link.targetType === "Task" || link.targetType === "Memory") ? link.targetType : "Memory",
    targetId: String(link && link.targetId ? link.targetId : ""),
  };
}
