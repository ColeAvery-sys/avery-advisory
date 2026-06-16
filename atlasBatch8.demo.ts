import { resumeAutopilot, setAutopilotMode } from "./autopilotControlEngine";
import { createRunRecord, generateRunSummary, clearAutopilotRunHistoryForDemo } from "./autopilotRunHistoryEngine";
import { enterLocalOnlyMode, getSafetyState, resumeManualOnly } from "./autopilotSafetySwitch";
import { generateApprovalReminders } from "./approvalReminderEngine";
import { scanDeadlines } from "./deadlineMonitorEngine";
import { generateEveningShutdown } from "./eveningShutdownEngine";
import { createLoopSchedule, runScheduledLoop, clearLoopSchedulesForDemo } from "./loopSchedulerEngine";
import { generateMorningBrief } from "./morningBriefEngine";
import { runSystemHealthCheck } from "./systemHealthMonitorEngine";
import { generateWeeklyCeoReport } from "./weeklyCeoReportEngine";

resumeManualOnly();
clearAutopilotRunHistoryForDemo();
clearLoopSchedulesForDemo();

console.log("Autopilot Safety Switch");
console.log(enterLocalOnlyMode("Demo safety check"));
console.log(resumeManualOnly());

console.log("\nAutopilot Control Engine");
console.log(setAutopilotMode("Limited Autopilot"));

console.log("\nAutopilot Run History");
createRunRecord({ id: "demo-run-1", loopName: "Morning Brief", runType: "Manual", startedAt: new Date().toISOString(), status: "Success", outputsCreated: ["reports"], notificationsCreated: 0, approvalItemsCreated: 0, tasksCreated: 0, draftsCreated: 0, errors: [], summary: "Morning brief generated." });
console.log(generateRunSummary("demo-run-1"));

console.log("\nLoop Scheduler Engine");
createLoopSchedule({ id: "demo-schedule", loopName: "Daily Planning Loop", enabled: true, frequency: "Daily", daysOfWeek: [], timeOfDay: "08:00", timezone: "America/New_York", runMode: "Scheduled", allowedOutputs: ["tasks", "notifications"], failureBehavior: "create Codex debug prompt" });
console.log(runScheduledLoop("Daily Planning Loop", { outputs: ["tasks", "notifications"] }, "Limited Autopilot"));

console.log("\nMorning Brief Engine");
console.log(
  generateMorningBrief({
    date: "2099-01-01",
    dailyPlanningResult: { todayTopThree: [{ title: "Clear approval", score: 90 }] },
    calendarDrafts: [{ title: "Grant work block" }],
    notifications: [{ title: "Approval waiting" }],
    moneyPipeline: [{ title: "Creator client cash", score: 95 }],
    grantDeadlines: [{ title: "WV grant", deadline: "2099-01-01", score: 85 }],
    clientFollowUps: [{ title: "Warm creator lead", score: 80 }],
    productBuildTasks: [{ title: "ATLAS scheduler", score: 75 }],
    approvals: [{ title: "Client email approval" }],
    personalAdmin: [],
    systemHealth: "Healthy",
  }),
);

console.log("\nEvening Shutdown Engine");
console.log(
  generateEveningShutdown({
    date: "2099-01-01",
    completedTasks: [{ title: "Prepared grant packet" }],
    missedTasks: [{ title: "urgent invoice reminder" }],
    newIdeas: [{ title: "A future moonshot" }],
    approvalsHandled: [],
    messagesSentManually: [],
    moneyMovement: [],
    blockers: [{ title: "Waiting on approval" }],
    energyNote: "medium",
    tomorrowDeadlines: [{ title: "Grant deadline" }],
  }),
);

console.log("\nWeekly CEO Report Engine");
console.log(
  generateWeeklyCeoReport({
    dateRange: "Demo week",
    revenue: [{ title: "Creator logistics invoice", score: 90 }],
    clients: [{ title: "Warm client" }],
    grants: [{ title: "WV grant" }],
    products: [{ title: "ATLAS HQ", score: 85 }],
    content: [],
    operations: [],
    personalAdmin: [],
    risks: [{ title: "Approval backlog" }],
    blockers: [],
    approvals: [{ title: "Send client packet" }],
    kpis: { expectedRevenue: 1200 },
  }),
);

console.log("\nApproval Reminder Engine");
console.log(
  generateApprovalReminders(
    [{ id: "approval-1", title: "Grant submission", riskLevel: "High", createdAt: "2098-12-31T00:00:00.000Z", deadline: "2099-01-02T00:00:00.000Z", type: "grant submission", status: "Pending" }],
    "2099-01-01T00:00:00.000Z",
  ),
);

console.log("\nDeadline Monitor Engine");
console.log(
  scanDeadlines(
    {
      grants: [{ id: "grant-1", title: "WV grant", dueDate: "2099-01-02", riskLevel: "High" }],
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
  ),
);

console.log("\nSystem Health Monitor Engine");
console.log(
  runSystemHealthCheck({
    serverHealth: "Healthy",
    databaseHealth: "Healthy",
    integrationCredentials: "Warning",
    failedLoops: 1,
    failedIntegrations: 0,
    overdueApprovals: 2,
    notificationBacklog: 5,
    schedulerStatus: "Healthy",
    actionLogStatus: "Healthy",
    recentErrors: [],
  }),
);

console.log("\nCurrent Safety State");
console.log(getSafetyState());
console.log(resumeAutopilot("Manual Only"));
