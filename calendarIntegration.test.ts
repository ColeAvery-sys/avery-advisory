declare const require: any;
declare const __dirname: string;
declare const process: any;

const fs = require("fs");
const path = require("path");

import { listMemoryActions, getMemoryById } from "./memoryEngineService";
import { MEMORY_ENGINE_BACKUP_PATH, MEMORY_ENGINE_DB_PATH, MEMORY_ENGINE_MIGRATION_PATH, resetMemoryEngineRuntime } from "./memoryEngineRepository";
import { CALENDAR_BACKUP_PATH, CALENDAR_STATE_PATH, resetCalendarRuntime } from "./calendarIntegrationRepository";
import {
  cancelEvent,
  createEvent,
  createRecurringEvent,
  createReminder,
  detectCalendarConflicts,
  findEventByDate,
  findEventByName,
  findEventByParticipant,
  getEventById,
  moveEvent,
  readTodaySchedule,
  readUpcomingEvents,
  readWeeklySchedule,
  resetCalendarForDemo,
  searchEvents,
  updateEvent,
  deleteEvent,
} from "./calendarIntegrationService";

const memoryBackup = readBackup(MEMORY_ENGINE_DB_PATH);
const memoryBakBackup = readBackup(MEMORY_ENGINE_BACKUP_PATH);
const memoryMigrationBackup = readBackup(MEMORY_ENGINE_MIGRATION_PATH);
const calendarBackup = readBackup(CALENDAR_STATE_PATH);
const calendarBakBackup = readBackup(CALENDAR_BACKUP_PATH);

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  try {
    restoreState();

    const today = isoDateOffset(0);
    const tomorrow = isoDateOffset(1);
    const yesterday = isoDateOffset(-1);
    const weekDate = isoDateOffset(2);

    const created = createEvent({
      title: "AveryTech Grant Review",
      date: today,
      startTime: "09:00",
      endTime: "10:00",
      participants: ["Cole Avery", "Jordan"],
      location: "Conference Room",
      notes: "Grant notes review for EchoFrame.",
      linkedProjectIds: ["echoframe"],
      linkedTaskIds: ["grant-submission"],
      linkedMemoryIds: ["grant-notes"],
      actor: "QA",
    });
    assertEqual(created.title, "AveryTech Grant Review");
    assertEqual(!!created.memoryId, true);
    assertEqual(getEventById(created.id).title, "AveryTech Grant Review");
    assertEqual(getMemoryById(created.memoryId as string).memoryType, "Calendar Event");

    const memory = getMemoryById(created.memoryId as string);
    assertEqual(memory.links.some((link) => link.linkedObjectType === "Project" && link.linkedObjectId === "echoframe"), true);
    assertEqual(memory.links.some((link) => link.linkedObjectType === "Task" && link.linkedObjectId === "grant-submission"), true);

    const reminder = createReminder({
      title: "Submit Grant Application",
      date: weekDate,
      startTime: "14:00",
      endTime: "14:15",
      notes: "Reminder for proposal follow-through.",
      actor: "QA",
    });
    assertEqual(reminder.kind, "Reminder");

    const recurring = createRecurringEvent({
      title: "Weekly CEO Review",
      date: weekDate,
      startTime: "15:00",
      endTime: "16:00",
      recurrenceRule: "FREQ=WEEKLY;COUNT=4",
      participants: ["Cole Avery"],
      actor: "QA",
    });
    assertEqual(recurring.kind, "Recurring");

    const overlapping = createEvent({
      title: "EchoFrame Sync",
      date: today,
      startTime: "09:30",
      endTime: "10:30",
      participants: ["Cole Avery"],
      notes: "Conflict check.",
      actor: "QA",
    });
    const conflicts = detectCalendarConflicts(overlapping.id);
    assertEqual(conflicts.some((conflict) => conflict.conflictType === "Overlap"), true);
    assertEqual(conflicts.some((conflict) => conflict.conflictType === "Double Booking"), true);

    const deadline = createEvent({
      title: "Grant Submission Deadline",
      date: yesterday,
      startTime: "11:00",
      endTime: "11:30",
      notes: "Past deadline test.",
      actor: "QA",
    });
    assertEqual(detectCalendarConflicts(deadline.id).some((conflict) => conflict.conflictType === "Missing Deadline"), true);

    const updated = updateEvent(created.id, { title: "AveryTech Grant Review Updated", notes: "Updated notes." }, { actor: "QA" });
    assertEqual(updated.title, "AveryTech Grant Review Updated");

    const moved = moveEvent(created.id, tomorrow, "11:00", "12:00", { actor: "QA" });
    assertEqual(moved.date, tomorrow);
    assertEqual(moved.startTime, "11:00");

    const todaySchedule = readTodaySchedule(today);
    assertEqual(todaySchedule.some((event) => event.id === overlapping.id), true);
    assertEqual(readUpcomingEvents(7).length >= 4, true);
    assertEqual(readWeeklySchedule(today).length >= 4, true);
    assertEqual(findEventByName("Grant Review").length >= 1, true);
    assertEqual(findEventByDate(today).length >= 1, true);
    assertEqual(findEventByParticipant("Cole Avery").length >= 2, true);
    assertEqual(searchEvents("Jordan", { participant: "Jordan" }).length >= 1, true);

    const cancelled = cancelEvent(overlapping.id, { actor: "QA" });
    assertEqual(cancelled.status, "Cancelled");

    const deleted = deleteEvent(deadline.id, { actor: "QA" });
    assertEqual(deleted.status, "Cancelled");

    const actions = listMemoryActions().filter((item) => item.objectType === "Calendar");
    assertEqual(actions.some((item) => item.actionType === "Calendar Event Created"), true);
    assertEqual(actions.some((item) => item.actionType === "Calendar Event Updated"), true);
    assertEqual(actions.some((item) => item.actionType === "Calendar Event Deleted"), true);
    assertEqual(actions.some((item) => item.actionType === "Calendar Event Read"), true);
    assertEqual(actions.some((item) => item.actionType === "Calendar Event Searched"), true);
    assertEqual(actions.some((item) => item.actionType === "Calendar Conflict Detected"), true);

    console.log("All Calendar Integration V1 tests passed.");
  } finally {
    restoreFile(MEMORY_ENGINE_DB_PATH, memoryBackup);
    restoreFile(MEMORY_ENGINE_BACKUP_PATH, memoryBakBackup);
    restoreFile(MEMORY_ENGINE_MIGRATION_PATH, memoryMigrationBackup);
    restoreFile(CALENDAR_STATE_PATH, calendarBackup);
    restoreFile(CALENDAR_BACKUP_PATH, calendarBakBackup);
    resetMemoryEngineRuntime();
    resetCalendarRuntime();
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
  resetCalendarRuntime();
  resetCalendarForDemo();
}

function isoDateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}
