import { AutopilotMode, canCreateOutput, canLoopRun } from "./autopilotControlEngine";
import { createRunRecord, AutopilotRunRecord } from "./autopilotRunHistoryEngine";

export type LoopFrequency = "Manual Only" | "Hourly" | "Daily" | "Weekdays" | "Weekly" | "Biweekly" | "Monthly";
export type FailureBehavior = "log only" | "notify Cole" | "create Codex debug prompt" | "disable loop after repeated failures";

export type LoopSchedule = {
  id: string;
  loopName: string;
  enabled: boolean;
  frequency: LoopFrequency;
  daysOfWeek: number[];
  timeOfDay: string;
  timezone: string;
  lastRun?: string;
  nextRun?: string;
  runMode: "Manual" | "Scheduled" | "Test";
  allowedOutputs: string[];
  failureBehavior: FailureBehavior;
  notes?: string;
  failureCount?: number;
};

const schedules: LoopSchedule[] = [];

export function createLoopSchedule(schedule: LoopSchedule): LoopSchedule {
  const nextRun = schedule.nextRun || calculateNextRun(schedule, new Date().toISOString());
  const stored = { ...schedule, nextRun, failureCount: schedule.failureCount || 0 };
  schedules.push(stored);
  return stored;
}

export function updateLoopSchedule(scheduleId: string, updates: Partial<LoopSchedule>): LoopSchedule {
  const schedule = findSchedule(scheduleId);
  Object.assign(schedule, updates);
  return schedule;
}

export function enableLoopSchedule(scheduleId: string): LoopSchedule {
  return updateLoopSchedule(scheduleId, { enabled: true });
}

export function disableLoopSchedule(scheduleId: string): LoopSchedule {
  return updateLoopSchedule(scheduleId, { enabled: false });
}

export function calculateNextRun(schedule: LoopSchedule, fromDate: string): string {
  const from = new Date(fromDate);
  const next = new Date(from);
  if (schedule.frequency === "Manual Only") return "";
  if (schedule.frequency === "Hourly") next.setHours(next.getHours() + 1);
  if (schedule.frequency === "Daily" || schedule.frequency === "Weekdays") next.setDate(next.getDate() + 1);
  if (schedule.frequency === "Weekly") next.setDate(next.getDate() + 7);
  if (schedule.frequency === "Biweekly") next.setDate(next.getDate() + 14);
  if (schedule.frequency === "Monthly") next.setMonth(next.getMonth() + 1);
  const [hours, minutes] = schedule.timeOfDay.split(":").map(Number);
  next.setHours(hours || 0, minutes || 0, 0, 0);
  return next.toISOString();
}

export function getDueLoops(currentDate: string): LoopSchedule[] {
  return schedules.filter((schedule) => schedule.enabled && schedule.nextRun && schedule.nextRun <= currentDate);
}

export function runScheduledLoop(loopName: string, data: { outputs?: string[]; shouldFail?: boolean }, autopilotMode: AutopilotMode): AutopilotRunRecord {
  const schedule = schedules.find((item) => item.loopName === loopName);
  const startedAt = new Date().toISOString();
  const outputs = data.outputs || ["log only"];

  if (!schedule || !schedule.enabled || !canLoopRun(loopName, autopilotMode)) {
    return recordLoopRun({
      id: `run-${Date.now()}`,
      loopName,
      runType: "Scheduled",
      startedAt,
      status: "Blocked by Safety Mode",
      outputsCreated: [],
      notificationsCreated: 0,
      approvalItemsCreated: 0,
      tasksCreated: 0,
      draftsCreated: 0,
      errors: ["Loop disabled, missing, or blocked by autopilot mode."],
      summary: "Run blocked by scheduler safety.",
    });
  }

  const blockedOutput = outputs.find((output) => !canCreateOutput(output, autopilotMode));
  if (blockedOutput) {
    return recordLoopRun({
      id: `run-${Date.now()}`,
      loopName,
      runType: "Scheduled",
      startedAt,
      status: "Blocked by Safety Mode",
      outputsCreated: [],
      notificationsCreated: 0,
      approvalItemsCreated: 0,
      tasksCreated: 0,
      draftsCreated: 0,
      errors: [`Output not allowed in ${autopilotMode}: ${blockedOutput}`],
      summary: "Run blocked because requested output is not allowed.",
    });
  }

  const status = data.shouldFail ? "Failed" : "Success";
  if (data.shouldFail) {
    schedule.failureCount = (schedule.failureCount || 0) + 1;
    if (schedule.failureBehavior === "disable loop after repeated failures" && schedule.failureCount >= 3) schedule.enabled = false;
  } else {
    schedule.failureCount = 0;
    schedule.lastRun = startedAt;
    schedule.nextRun = calculateNextRun(schedule, startedAt);
  }

  return recordLoopRun({
    id: `run-${Date.now()}`,
    loopName,
    runType: "Scheduled",
    startedAt,
    completedAt: new Date().toISOString(),
    status,
    outputsCreated: outputs,
    notificationsCreated: outputs.includes("notifications") ? 1 : 0,
    approvalItemsCreated: outputs.includes("approval items") ? 1 : 0,
    tasksCreated: outputs.includes("tasks") ? 1 : 0,
    draftsCreated: outputs.includes("drafts") ? 1 : 0,
    errors: data.shouldFail ? ["Mock scheduled run failed."] : [],
    summary: data.shouldFail ? "Mock scheduled run failed and was logged." : "Mock scheduled run completed safely.",
  });
}

export function recordLoopRun(result: AutopilotRunRecord): AutopilotRunRecord {
  return createRunRecord(result);
}

export function clearLoopSchedulesForDemo(): void {
  schedules.length = 0;
}

function findSchedule(scheduleId: string): LoopSchedule {
  const schedule = schedules.find((item) => item.id === scheduleId);
  if (!schedule) throw new Error(`Schedule ${scheduleId} not found.`);
  return schedule;
}
