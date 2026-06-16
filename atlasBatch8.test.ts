import { canCreateOutput, canLoopRun, pauseAllAutopilot, resumeAutopilot, setAutopilotMode } from "./autopilotControlEngine";
import { clearAutopilotRunHistoryForDemo, createDebugPromptFromFailedRun, createRunRecord, getFailedRuns } from "./autopilotRunHistoryEngine";
import { enterLocalOnlyMode, isActionAllowedUnderSafetyState, pauseAll, resumeManualOnly } from "./autopilotSafetySwitch";
import { generateApprovalReminders } from "./approvalReminderEngine";
import { scanDeadlines } from "./deadlineMonitorEngine";
import { generateEveningShutdown } from "./eveningShutdownEngine";
import { createLoopSchedule, clearLoopSchedulesForDemo, runScheduledLoop } from "./loopSchedulerEngine";
import { generateMorningBrief } from "./morningBriefEngine";
import { runSystemHealthCheck } from "./systemHealthMonitorEngine";
import { generateWeeklyCeoReport } from "./weeklyCeoReportEngine";

resumeManualOnly();
assertEqual(isActionAllowedUnderSafetyState("local task"), true);
assertEqual(isActionAllowedUnderSafetyState("send email"), false);
enterLocalOnlyMode("test");
assertEqual(isActionAllowedUnderSafetyState("gmail draft creation"), false);
assertEqual(isActionAllowedUnderSafetyState("local recommendation"), true);
pauseAll("test");
assertEqual(isActionAllowedUnderSafetyState("local log"), false);
resumeManualOnly();

setAutopilotMode("Draft Mode");
assertEqual(canCreateOutput("tasks", "Draft Mode"), true);
assertEqual(canCreateOutput("notifications", "Draft Mode"), false);
assertEqual(canCreateOutput("send email", "Limited Autopilot"), false);
assertEqual(canLoopRun("Daily Planning Loop", "Manual Only"), true);
pauseAllAutopilot("test pause");
assertEqual(canLoopRun("Daily Planning Loop", "Limited Autopilot"), false);
resumeAutopilot("Limited Autopilot");

clearAutopilotRunHistoryForDemo();
createRunRecord({ id: "r1", loopName: "Daily Planning Loop", runType: "Manual", startedAt: "2099-01-01T00:00:00.000Z", status: "Failed", outputsCreated: [], notificationsCreated: 0, approvalItemsCreated: 0, tasksCreated: 0, draftsCreated: 0, errors: ["boom"], summary: "failed" });
assertEqual(getFailedRuns().length, 1);
assertEqual(createDebugPromptFromFailedRun("r1").includes("boom"), true);

clearLoopSchedulesForDemo();
createLoopSchedule({ id: "s1", loopName: "Daily Planning Loop", enabled: true, frequency: "Daily", daysOfWeek: [], timeOfDay: "08:00", timezone: "America/New_York", runMode: "Scheduled", allowedOutputs: ["tasks"], failureBehavior: "log only" });
const run = runScheduledLoop("Daily Planning Loop", { outputs: ["tasks", "notifications"] }, "Limited Autopilot");
assertEqual(run.status, "Success");
assertEqual(run.notificationsCreated, 1);
const blockedRun = runScheduledLoop("Daily Planning Loop", { outputs: ["send email"] }, "Limited Autopilot");
assertEqual(blockedRun.status, "Blocked by Safety Mode");

const morning = generateMorningBrief({
  date: "2099-01-01",
  dailyPlanningResult: { todayTopThree: [{ title: "Clear approval", score: 90 }] },
  calendarDrafts: [{ title: "Grant block" }],
  notifications: [{ title: "Urgent risk" }],
  moneyPipeline: [{ title: "Client cash", score: 95 }],
  grantDeadlines: [{ title: "Grant due", deadline: "2099-01-01", score: 80 }],
  clientFollowUps: [{ title: "Warm lead", score: 85 }],
  productBuildTasks: [{ title: "ATLAS blocker", score: 70 }],
  approvals: [{ title: "Client send approval" }],
  personalAdmin: [],
  systemHealth: "Healthy",
});
assertEqual(morning.todayTopThree[0].title, "Client cash");

const shutdown = generateEveningShutdown({
  date: "2099-01-01",
  completedTasks: [{ title: "Shipped draft" }],
  missedTasks: [{ title: "urgent invoice follow-up" }],
  newIdeas: [{ title: "random moonshot" }],
  approvalsHandled: [],
  messagesSentManually: [],
  moneyMovement: [],
  blockers: [],
  energyNote: "low",
  tomorrowDeadlines: [],
});
assertEqual(shutdown.tasksToCreate.length, 1);

const ceo = generateWeeklyCeoReport({
  dateRange: "week",
  revenue: [{ title: "Client cash", score: 90 }],
  clients: [],
  grants: [],
  products: [{ title: "Pause this", score: 20 }],
  content: [],
  operations: [],
  personalAdmin: [],
  risks: [],
  blockers: [],
  approvals: [{ title: "Approval" }],
  kpis: {},
});
assertEqual(ceo.pauseKillList.includes("Pause this"), true);

const reminders = generateApprovalReminders(
  [{ id: "a1", title: "Grant submit", riskLevel: "High", createdAt: "2098-12-31T00:00:00.000Z", deadline: "2099-01-02T00:00:00.000Z", type: "grant submission", status: "Pending" }],
  "2099-01-01T00:00:00.000Z",
);
assertEqual(reminders.criticalReminders.length, 1);

const deadlines = scanDeadlines(
  {
    grants: [{ id: "g1", title: "Grant", dueDate: "2099-01-02", riskLevel: "High" }],
    clientDeliveries: [],
    invoices: [],
    contractorTasks: [],
    productSprints: [],
    collegeAdmin: [],
    calendarDrafts: [],
    followUps: [],
    legalFinance: [],
    personalAdmin: [],
  },
  "2099-01-01",
);
assertEqual(deadlines.critical.length, 1);

const health = runSystemHealthCheck({
  serverHealth: "Healthy",
  databaseHealth: "Healthy",
  integrationCredentials: "Warning",
  failedLoops: 1,
  failedIntegrations: 1,
  overdueApprovals: 2,
  notificationBacklog: 12,
  schedulerStatus: "Healthy",
  actionLogStatus: "Healthy",
  recentErrors: ["Scheduler dry-run error"],
});
assertEqual(health.overallStatus, "Critical");
assertEqual(health.codexDebugPrompts.length > 0, true);

console.log("All ATLAS Batch 8 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}
