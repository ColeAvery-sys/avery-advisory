import { saveMemory, updateMemory } from "./memoryEngineService";
import { logMemoryAction } from "./memoryEngineService";
import {
  CalendarConflictRecord,
  CalendarEventInput,
  CalendarEventPatch,
  CalendarEventRecord,
  CalendarEventStatus,
  CalendarPermissionContext,
  CalendarSearchFilters,
} from "./calendarIntegrationTypes";
import {
  cloneCalendarState,
  getCalendarEventRecord,
  loadCalendarState,
  removeCalendarEventRecord,
  resetCalendarRuntime,
  saveCalendarState,
  upsertCalendarEventRecord,
} from "./calendarIntegrationRepository";

export interface CalendarReadOptions {
  days?: number;
  date?: string;
}

export interface CalendarSearchResult extends CalendarEventRecord {
  conflictCount: number;
}

export function readUpcomingEvents(days: number = 7): CalendarEventRecord[] {
  const state = loadCalendarState();
  const today = stripTime(new Date());
  const end = new Date(today.getTime() + Math.max(0, days - 1) * 24 * 60 * 60 * 1000);
  const results = state.events.filter((event) => isInRange(event.date, today, end) && event.status === "Scheduled").map(cloneEvent);
  logMemoryAction("Calendar Event Read", "Calendar", "upcoming", "ATLAS", "Success", { count: results.length, days: days });
  return results;
}

export function readTodaySchedule(date: string = new Date().toISOString().slice(0, 10)): CalendarEventRecord[] {
  const state = loadCalendarState();
  const results = state.events.filter((event) => event.date === date && event.status === "Scheduled").map(cloneEvent);
  logMemoryAction("Calendar Event Read", "Calendar", "today", "ATLAS", "Success", { count: results.length, date: date });
  return results;
}

export function readWeeklySchedule(date: string = new Date().toISOString().slice(0, 10)): CalendarEventRecord[] {
  const state = loadCalendarState();
  const start = new Date(date + "T00:00:00");
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  const results = state.events.filter((event) => isInRange(event.date, start, end) && event.status === "Scheduled").map(cloneEvent);
  logMemoryAction("Calendar Event Read", "Calendar", "weekly", "ATLAS", "Success", { count: results.length, date: date });
  return results;
}

export function createEvent(input: CalendarEventInput): CalendarEventRecord {
  return saveCalendarItem("Event", input);
}

export function createReminder(input: CalendarEventInput): CalendarEventRecord {
  return saveCalendarItem("Reminder", input);
}

export function createRecurringEvent(input: CalendarEventInput): CalendarEventRecord {
  return saveCalendarItem("Recurring", input);
}

export function updateEvent(eventId: string, patch: CalendarEventPatch, context: CalendarPermissionContext): CalendarEventRecord {
  validateEventId(eventId);
  const state = loadCalendarState();
  const event = ensureEvent(state, eventId);
  applyPatch(event, patch);
  event.updatedAt = new Date().toISOString();
  syncMemoryFromEvent(event, context.actor);
  upsertCalendarEventRecord(event);
  const conflicts = detectConflictsForEvent(event);
  if (conflicts.length > 0) {
    logMemoryAction("Calendar Conflict Detected", "Calendar", event.id, context.actor || "ATLAS", "Success", {
      conflictCount: conflicts.length,
      conflicts: conflicts,
    });
  }
  logMemoryAction("Calendar Event Updated", "Calendar", event.id, context.actor || "ATLAS", "Success", {
    title: event.title,
    date: event.date,
  });
  return cloneEvent(event);
}

export function moveEvent(eventId: string, date: string, startTime: string | undefined, endTime: string | undefined, context: CalendarPermissionContext): CalendarEventRecord {
  return updateEvent(eventId, { date: date, startTime: startTime, endTime: endTime }, context);
}

export function cancelEvent(eventId: string, context: CalendarPermissionContext): CalendarEventRecord {
  validateEventId(eventId);
  const state = loadCalendarState();
  const event = ensureEvent(state, eventId);
  event.status = "Cancelled";
  event.updatedAt = new Date().toISOString();
  if (event.memoryId) {
    updateMemory(event.memoryId, { summary: "Cancelled calendar event: " + event.title, body: event.notes || event.title }, context.actor || "ATLAS");
  }
  upsertCalendarEventRecord(event);
  logMemoryAction("Calendar Event Deleted", "Calendar", event.id, context.actor || "ATLAS", "Success", {
    title: event.title,
    date: event.date,
  });
  return cloneEvent(event);
}

export function deleteEvent(eventId: string, context: CalendarPermissionContext): CalendarEventRecord {
  return cancelEvent(eventId, context);
}

export function getEventById(eventId: string): CalendarEventRecord {
  validateEventId(eventId);
  const event = getCalendarEventRecord(eventId);
  if (!event) throw new Error(`Calendar event ${eventId} not found.`);
  logMemoryAction("Calendar Event Read", "Calendar", event.id, "ATLAS", "Success", { title: event.title });
  return cloneEvent(event);
}

export function searchEvents(query: string, filters: CalendarSearchFilters = {}): CalendarSearchResult[] {
  const state = loadCalendarState();
  const needle = normalizeText(query).toLowerCase();
  const results = state.events
    .filter((event) => matchesFilters(event, filters))
    .filter((event) => {
      if (!needle) return true;
      return (
        event.title.toLowerCase().indexOf(needle) >= 0 ||
        (event.location || "").toLowerCase().indexOf(needle) >= 0 ||
        event.participants.some((participant) => participant.toLowerCase().indexOf(needle) >= 0) ||
        event.notes && event.notes.toLowerCase().indexOf(needle) >= 0
      );
    })
    .map((event) => ({
      ...cloneEvent(event),
      conflictCount: detectConflictsForEvent(event).length,
    }));

  logMemoryAction("Calendar Event Searched", "Calendar", query || "search", "ATLAS", "Success", {
    query: needle,
    resultCount: results.length,
  });
  return results;
}

export function findEventByName(name: string) {
  return searchEvents(name).filter((event) => event.title.toLowerCase().indexOf(name.toLowerCase()) >= 0);
}

export function findEventByDate(date: string) {
  return searchEvents("", { date: date });
}

export function findEventByParticipant(participant: string) {
  return searchEvents("", { participant: participant });
}

export function detectCalendarConflicts(eventId?: string): CalendarConflictRecord[] {
  const state = loadCalendarState();
  const targets = eventId ? state.events.filter((event) => event.id === eventId) : state.events;
  const conflicts: CalendarConflictRecord[] = [];

  for (const event of targets) {
    conflicts.push(...detectConflictsForEvent(event));
  }

  return dedupeConflicts(conflicts);
}

export function resetCalendarForDemo(): void {
  resetCalendarRuntime();
  const state = loadCalendarState();
  state.events = [];
  state.updatedAt = new Date().toISOString();
  saveCalendarState(state);
}

function saveCalendarItem(kind: "Event" | "Reminder" | "Recurring", input: CalendarEventInput): CalendarEventRecord {
  validateCalendarInput(input);
  const state = loadCalendarState();
  const event: CalendarEventRecord = {
    id: input.id || createId("calendar"),
    title: normalizeText(input.title),
    date: normalizeDate(input.date),
    startTime: input.startTime ? normalizeTime(input.startTime) : undefined,
    endTime: input.endTime ? normalizeTime(input.endTime) : undefined,
    kind: kind,
    participants: normalizeList(input.participants),
    location: input.location ? normalizeText(input.location) : undefined,
    notes: input.notes ? normalizeText(input.notes) : undefined,
    recurrenceRule: input.recurrenceRule ? normalizeText(input.recurrenceRule) : undefined,
    status: "Scheduled",
    linkedProjectIds: normalizeList(input.linkedProjectIds),
    linkedTaskIds: normalizeList(input.linkedTaskIds),
    linkedMemoryIds: normalizeList(input.linkedMemoryIds),
    links: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  event.links = buildLinks(event);
  event.memoryId = kind === "Recurring" ? undefined : syncMemoryFromEvent(event, input.actor || "ATLAS");
  const conflicts = detectConflictsForEvent(event, state.events);
  if (conflicts.length > 0) {
    logMemoryAction("Calendar Conflict Detected", "Calendar", event.id, input.actor || "ATLAS", "Success", {
      conflictCount: conflicts.length,
      conflicts: conflicts,
    });
  }
  state.events.push(event);
  saveCalendarState(state);
  logMemoryAction("Calendar Event Created", "Calendar", event.id, input.actor || "ATLAS", "Success", {
    title: event.title,
    date: event.date,
    conflictCount: conflicts.length,
  });
  return cloneEvent(event);
}

function buildLinks(event: CalendarEventRecord) {
  return [
    ...event.linkedProjectIds.map((id) => ({ targetType: "Project" as const, targetId: id })),
    ...event.linkedTaskIds.map((id) => ({ targetType: "Task" as const, targetId: id })),
    ...event.linkedMemoryIds.map((id) => ({ targetType: "Memory" as const, targetId: id })),
  ];
}

function syncMemoryFromEvent(event: CalendarEventRecord, actor: string): string {
  const summary = `${event.kind}: ${event.title} on ${event.date}${event.startTime ? " at " + event.startTime : ""}`;
  const existingMemoryId = event.memoryId;
  if (existingMemoryId) {
    return existingMemoryId;
  }

  const memory = saveMemory({
    title: event.title,
    summary: summary,
    body: event.notes || summary,
    memoryType: "Calendar Event",
    source: "Google Calendar",
    confidence: 0.8,
    tags: ["calendar", event.kind, event.status],
    projectIds: event.linkedProjectIds,
    taskIds: event.linkedTaskIds,
    contactIds: [],
    actor: actor,
  });
  return memory.id;
}

function detectConflictsForEvent(event: CalendarEventRecord, existingEvents: CalendarEventRecord[] = loadCalendarState().events): CalendarConflictRecord[] {
  const conflicts: CalendarConflictRecord[] = [];
  for (const other of existingEvents) {
    if (other.id === event.id || other.status === "Cancelled") continue;
    if (event.date !== other.date) continue;
    if (!timesOverlap(event.startTime, event.endTime, other.startTime, other.endTime)) continue;
    conflicts.push({
      eventId: event.id,
      conflictType: "Overlap",
      conflictingEventId: other.id,
      message: "Overlapping meetings detected.",
    });
    if (hasParticipantOverlap(event, other)) {
      conflicts.push({
        eventId: event.id,
        conflictType: "Double Booking",
        conflictingEventId: other.id,
        message: "Participant double booking detected.",
      });
    }
  }

  if (isDeadlineLike(event) && isPastDate(event.date)) {
    conflicts.push({
      eventId: event.id,
      conflictType: "Missing Deadline",
      message: "Deadline appears overdue.",
    });
  }

  return conflicts;
}

function matchesFilters(event: CalendarEventRecord, filters: CalendarSearchFilters): boolean {
  if (filters.date && event.date !== filters.date) return false;
  if (filters.participant && !event.participants.some((item) => item.toLowerCase().indexOf(filters.participant!.toLowerCase()) >= 0)) return false;
  return true;
}

function hasParticipantOverlap(a: CalendarEventRecord, b: CalendarEventRecord): boolean {
  return a.participants.some((participant) => b.participants.some((other) => other.toLowerCase() === participant.toLowerCase()));
}

function timesOverlap(startA?: string, endA?: string, startB?: string, endB?: string): boolean {
  if (!startA || !endA || !startB || !endB) return true;
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);
  return aStart < bEnd && bStart < aEnd;
}

function isDeadlineLike(event: CalendarEventRecord): boolean {
  return /deadline|due|submit/i.test(event.title) || event.kind === "Reminder";
}

function isPastDate(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date + "T00:00:00").getTime() < today.getTime();
}

function timeToMinutes(value: string): number {
  const parts = value.split(":");
  return Number(parts[0]) * 60 + Number(parts[1]);
}

function validateCalendarInput(input: CalendarEventInput) {
  if (!input || typeof input !== "object") throw new Error("Calendar input must be an object.");
  if (!normalizeText(input.title)) throw new Error("Calendar title is required.");
  if (!normalizeText(input.date)) throw new Error("Calendar date is required.");
}

function validateEventId(eventId: string) {
  if (!normalizeText(eventId)) throw new Error("Calendar event id is required.");
}

function ensureEvent(state: ReturnType<typeof loadCalendarState>, eventId: string): CalendarEventRecord {
  const event = state.events.find((item) => item.id === eventId);
  if (!event) throw new Error(`Calendar event ${eventId} not found.`);
  return event;
}

function applyPatch(event: CalendarEventRecord, patch: CalendarEventPatch) {
  if (patch.title !== undefined) event.title = normalizeText(patch.title);
  if (patch.date !== undefined) event.date = normalizeDate(patch.date);
  if (patch.startTime !== undefined) event.startTime = patch.startTime ? normalizeTime(patch.startTime) : undefined;
  if (patch.endTime !== undefined) event.endTime = patch.endTime ? normalizeTime(patch.endTime) : undefined;
  if (patch.participants !== undefined) event.participants = normalizeList(patch.participants);
  if (patch.location !== undefined) event.location = patch.location ? normalizeText(patch.location) : undefined;
  if (patch.notes !== undefined) event.notes = patch.notes ? normalizeText(patch.notes) : undefined;
  if (patch.recurrenceRule !== undefined) event.recurrenceRule = patch.recurrenceRule ? normalizeText(patch.recurrenceRule) : undefined;
  if (patch.linkedProjectIds !== undefined) event.linkedProjectIds = normalizeList(patch.linkedProjectIds);
  if (patch.linkedTaskIds !== undefined) event.linkedTaskIds = normalizeList(patch.linkedTaskIds);
  if (patch.linkedMemoryIds !== undefined) event.linkedMemoryIds = normalizeList(patch.linkedMemoryIds);
  event.links = buildLinks(event);
}

function dedupeConflicts(conflicts: CalendarConflictRecord[]) {
  const seen = new Set<string>();
  const unique: CalendarConflictRecord[] = [];
  for (const conflict of conflicts) {
    const key = conflict.eventId + "|" + conflict.conflictType + "|" + (conflict.conflictingEventId || "");
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(conflict);
  }
  return unique;
}

function stripTime(value: Date) {
  const date = new Date(value.getTime());
  date.setHours(0, 0, 0, 0);
  return date;
}

function isInRange(dateString: string, start: Date, end: Date) {
  const date = new Date(dateString + "T00:00:00");
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

function normalizeText(value: any) {
  return String(value == null ? "" : value).trim();
}

function normalizeDate(value: string) {
  return normalizeText(value).slice(0, 10);
}

function normalizeTime(value: string) {
  return normalizeText(value).slice(0, 5);
}

function normalizeList(values?: string[]) {
  const list: string[] = [];
  for (const value of values || []) {
    const cleaned = normalizeText(value);
    if (!cleaned) continue;
    if (list.some((item) => item.toLowerCase() === cleaned.toLowerCase())) continue;
    list.push(cleaned);
  }
  return list;
}

function cloneEvent(event: CalendarEventRecord): CalendarEventRecord {
  return cloneCalendarState({ schemaVersion: 1, createdAt: "", updatedAt: "", events: [event] }).events[0];
}

function createId(prefix: string) {
  return prefix + "-" + new Date().getTime().toString(36) + "-" + Math.random().toString(16).slice(2, 8);
}
