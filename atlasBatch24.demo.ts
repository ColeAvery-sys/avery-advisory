import { generateExecutiveCommandCenter } from "./executiveCommandEngine";
import { generateDailyExecutiveBriefing } from "./dailyBriefingEngine";
import { generateExecutiveWeeklyReport } from "./weeklyCeoReportEngine";
import { arbitratePriorities } from "./priorityArbitrationEngine";
import { generateFocusProtectionReport } from "./focusProtectionEngine";
import { createDecisionCard, getNextDecision } from "./decisionQueueEngine";
import { createGoalRecord, generateGoalDashboard } from "./goalTrackingEngine";
import { createDelegationPlan } from "./delegationEngine";
import { activateCrisisMode } from "./crisisModeEngine";
import { generateStrategicPlan } from "./strategicPlanningEngine";

console.log("Executive Command Center");
console.log(generateExecutiveCommandCenter({
  tasks: [{ title: "Creator Logistics client delivery", urgency: 8, revenue: 1000 }, { title: "Godot experiment", urgency: 8 }],
  opportunities: [{ title: "ATLAS Assist grant", urgency: 7 }],
  risks: [{ title: "Cash risk", urgency: 10 }],
  cashStatus: "Medium",
  clientStatus: "One delivery active",
}));

console.log("\nDaily Executive Briefing");
console.log(generateDailyExecutiveBriefing({
  name: "Cole",
  revenueTasks: [{ title: "Creator Logistics lead", revenue: 1000, urgency: 9 }],
  grantTasks: [{ title: "ATLAS Assist grant packet", urgency: 8 }],
  productTasks: [{ title: "ATLAS HQ Easy Mode", urgency: 7 }],
  openProjects: 21,
}));

console.log("\nWeekly CEO Report");
console.log(generateExecutiveWeeklyReport({
  dateRange: "May 2026 week",
  revenue: [{ amount: 500 }, { amount: 300 }],
  leads: [{}, {}],
  approvals: [{}, {}, {}, {}, {}, {}],
  openTasks: new Array(26).fill({}),
}));

console.log("\nPriority Arbitration");
console.log(arbitratePriorities({
  tasks: [{ title: "Creator Logistics cash follow-up", revenue: 1000, urgency: 10 }, { title: "experimental merch idea", distractionRisk: 8 }],
}));

console.log("\nFocus Protection");
console.log(generateFocusProtectionReport({ activeProjects: 21, openCommitments: 10, pendingApprovals: 5, missedDeadlines: 1 }));

console.log("\nDecision Queue");
createDecisionCard({ id: "demo-decision", problemTitle: "Lead wants 30 clips", problemSummary: "Scope unclear", urgency: "High", riskLevel: "High", optionA: "Accept", optionB: "Decline", optionC: "Ask questions", optionD: "Archive", atlasRecommendation: "C" });
console.log(getNextDecision());

console.log("\nGoal Tracking");
createGoalRecord({ id: "demo-goal", goalName: "First $10k month" });
console.log(generateGoalDashboard());

console.log("\nDelegation Engine");
console.log(createDelegationPlan([{ title: "Fix backend bug" }, { title: "Polish frontend layout" }, { title: "Edit client footage" }]));

console.log("\nCrisis Mode");
console.log(activateCrisisMode({ cashDays: 7, grantDeadlineDays: 2, overwhelmScore: 85 }));

console.log("\nStrategic Planning");
console.log(generateStrategicPlan({ priorities: [{ title: "Creator Logistics revenue", revenue: 1000 }, { title: "ATLAS Assist grant" }, { title: "New Prometheus content" }] }));

