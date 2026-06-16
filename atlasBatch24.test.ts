import { classifyPriorityTier, scoreExecutiveItem, executiveRiskFlags } from "./executiveSafety";
import { generateExecutiveCommandCenter, createExecutiveActionItems } from "./executiveCommandEngine";
import { generateDailyExecutiveBriefing, identifyThingsToAvoidToday, createDailyCheckInTasks } from "./dailyBriefingEngine";
import { generateExecutiveWeeklyReport, identifyWeeklyBottlenecks } from "./weeklyCeoReportEngine";
import { arbitratePriorities, generatePriorityDecision } from "./priorityArbitrationEngine";
import { calculateOverwhelmScore, generateFocusProtectionReport, shouldAcceptNewProject } from "./focusProtectionEngine";
import { createDecisionCard, getNextDecision, answerDecision, generateEasyModeQueue } from "./decisionQueueEngine";
import { createGoalRecord, breakGoalIntoTimeframes, updateGoalProgress, generateGoalDashboard } from "./goalTrackingEngine";
import { decideDelegation, createDelegationPlan } from "./delegationEngine";
import { detectCrisisTriggers, activateCrisisMode, generateEmergencyPriorities } from "./crisisModeEngine";
import { generateStrategicPlan, generateGrowthPlan, generateHiringPlan, generateFundingPlan, generateMediaPlan, generateProductPlan } from "./strategicPlanningEngine";

assertEqual(classifyPriorityTier({ title: "Creator Logistics client fulfillment" }).tier, 1);
assertEqual(classifyPriorityTier({ title: "Godot side prototype" }).tier, 6);
assertEqual(scoreExecutiveItem({ title: "Creator Logistics lead", revenue: 1200, urgency: 9 }) > scoreExecutiveItem({ title: "Godot experiment", urgency: 9 }), true);
assertEqual(executiveRiskFlags({ title: "Send client invoice payment email" }).length > 0, true);

const command = generateExecutiveCommandCenter({
  tasks: [{ title: "Godot experiment", urgency: 8 }, { title: "Creator Logistics client delivery", urgency: 8, revenue: 1000 }],
  opportunities: [{ title: "ATLAS Assist grant", urgency: 7 }],
  risks: [{ title: "Cash risk", urgency: 10 }],
  cashStatus: "Medium",
});
assertEqual(command.topThree[0].title, "Creator Logistics client delivery");
assertEqual(createExecutiveActionItems(command).length, 3);

const daily = generateDailyExecutiveBriefing({
  name: "Cole",
  revenueTasks: [{ title: "Creator Logistics lead", revenue: 1000, urgency: 9 }],
  grantTasks: [{ title: "ATLAS Assist grant packet", urgency: 8 }],
  productTasks: [{ title: "ATLAS HQ Easy Mode", urgency: 7 }],
  openProjects: 21,
});
assertEqual(daily.today.length, 3);
assertEqual(identifyThingsToAvoidToday({ openProjects: 21 })[0], "Adding new commitments");
assertEqual(createDailyCheckInTasks(daily).length, 3);

const weekly = generateExecutiveWeeklyReport({
  dateRange: "May 2026 week",
  revenue: [{ amount: 500 }, { amount: 300 }],
  leads: [{}, {}],
  approvals: [{}, {}, {}, {}, {}, {}],
  openTasks: new Array(26).fill({}),
});
assertEqual(weekly.revenue, 800);
assertEqual(identifyWeeklyBottlenecks({ approvals: [{}, {}, {}, {}, {}, {}], openTasks: new Array(26).fill({}) }).indexOf("Approval backlog") >= 0, true);

const arbitration = arbitratePriorities({
  tasks: [{ title: "Creator Logistics cash follow-up", revenue: 1000, urgency: 10 }, { title: "experimental merch idea", distractionRisk: 8 }],
});
assertEqual(arbitration.doNow[0].title, "Creator Logistics cash follow-up");
assertEqual(generatePriorityDecision({ title: "Godot moonshot", distractionRisk: 10, overwhelmCost: 10 }).bucket, "Archive");

assertEqual(calculateOverwhelmScore({ activeProjects: 21, openCommitments: 10, pendingApprovals: 5, missedDeadlines: 1 }) >= 70, true);
assertEqual(generateFocusProtectionReport({ activeProjects: 21, openCommitments: 10, pendingApprovals: 5, missedDeadlines: 1 }).noNewProjectsRecommendedDays, 5);
assertEqual(shouldAcceptNewProject({ activeProjects: 21, openCommitments: 10 }).accept, false);

createDecisionCard({ id: "decision-1", problemTitle: "Lead wants 30 clips", problemSummary: "Scope unclear", urgency: "High", riskLevel: "High", optionA: "Accept", optionB: "Decline", optionC: "Ask questions", optionD: "Archive", atlasRecommendation: "C" });
assertEqual(getNextDecision().id, "decision-1");
assertEqual(answerDecision("decision-1", "C").approvalRequired, true);
assertEqual(generateEasyModeQueue([{ id: "decision-2", title: "Pick focus" }]).length, 1);

const goal = createGoalRecord({ id: "goal-1", goalName: "First $10k month" });
assertEqual(breakGoalIntoTimeframes(goal).today, "Take the smallest useful step.");
assertEqual(updateGoalProgress("goal-1", 100).status, "Complete");
assertEqual(generateGoalDashboard().completedGoals.length, 1);

assertEqual(decideDelegation({ title: "Fix backend bug" }).owner, "Codex");
assertEqual(decideDelegation({ title: "Polish frontend layout" }).owner, "Cursor");
assertEqual(decideDelegation({ title: "Edit client footage" }).owner, "Editor");
assertEqual(createDelegationPlan([{ title: "Research grants" }, { title: "Fix tests" }]).length, 2);

const triggers = detectCrisisTriggers({ cashDays: 7, grantDeadlineDays: 2, overwhelmScore: 85 });
assertEqual(triggers.indexOf("Cash emergency") >= 0, true);
assertEqual(activateCrisisMode({ cashDays: 7 }).taskFreeze, true);
assertEqual(generateEmergencyPriorities(["Cash emergency"])[0], "Stop new work");

const plan = generateStrategicPlan({ priorities: [{ title: "Creator Logistics revenue", revenue: 1000 }, { title: "ATLAS Assist grant" }, { title: "New Prometheus content" }] });
assertEqual(plan.focus[0], "Creator Logistics revenue");
assertEqual(generateGrowthPlan({}).length, 3);
assertEqual(generateHiringPlan({ hiringNeeds: ["first editor"] })[0].approvalRequired, true);
assertEqual(generateFundingPlan({}).length, 3);
assertEqual(generateMediaPlan({}).length, 3);
assertEqual(generateProductPlan({}).length, 3);

console.log("All ATLAS Batch 24 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}

