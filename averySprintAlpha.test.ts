import { createAveryApprovalGate, detectAveryOpsRisk } from "./averyOpsSafety";
import { getDepartmentByName, getDepartments, seedAveryDepartments } from "./averyDepartmentRegistry";
import { assignAveryTask, createAveryAgent, getAveryAgents, getAveryTasks, seedFoundationAgents, updateAveryTaskStatus } from "./averyAgentArmyEngine";
import { createSharedMemoryRecord, generateMemorySummary, searchSharedMemory } from "./averySharedMemoryEngine";
import { createAgentDailyReport, generateDailyReportDigest, getDailyReports } from "./averyDailyReportEngine";
import { createAveryApprovalRequest, getPendingAveryApprovals, resolveAveryApproval } from "./averyApprovalQueueEngine";
import { AVERY_AGENT_DASHBOARD_ENDPOINTS, generateAgentDashboardApiSpec, handleAgentDashboardRequest } from "./averyAgentDashboardApi";
import { captureIdea, distributeIdeaToDepartments, expandCapturedIdea, expandIdea, getIdeas } from "./ideaVaultEngine";
import { determineRecommendedFocus, generateExecutiveMorningBrief } from "./executiveMorningBriefEngine";

assertEqual(detectAveryOpsRisk({ action: "send email and spend money" }).length, 2);
assertEqual(createAveryApprovalGate("Outreach", { action: "contact creator" }).approvalStatus, "Needs Cole Approval");

assertEqual(seedAveryDepartments().length, 10);
assertEqual(getDepartmentByName("Creator Logistics").departmentName, "Creator Logistics");
assertEqual(getDepartments().some((department) => department.departmentName === "Academy"), true);

const atlasPrime = createAveryAgent({ id: "alpha-atlas", name: "ATLAS Prime", department: "Executive", role: "CEO Agent", manager: "Cole" });
assertEqual(atlasPrime.manager, "Cole");
assertEqual(seedFoundationAgents().length >= 1, true);
const task = assignAveryTask({ id: "task-1", title: "Contact creator lead", department: "Creator Logistics", assignedAgent: "ATLAS Prime", priority: "High" });
assertEqual(task.approvalStatus, "Needs Cole Approval");
assertEqual(updateAveryTaskStatus("task-1", "Review").status, "Review");
assertEqual(getAveryTasks().length, 1);
assertEqual(getAveryAgents().some((agent) => agent.name === "ATLAS Prime"), true);

createSharedMemoryRecord({ id: "mem-1", type: "Decision", title: "Freeze roadmap expansion", body: "Focus on revenue and OS foundation." });
createSharedMemoryRecord({ id: "mem-2", type: "SOP", title: "Daily revenue move", body: "One revenue action before roadmap work." });
assertEqual(searchSharedMemory("revenue").length, 2);
assertEqual(generateMemorySummary().decisions, 1);

createAgentDailyReport({ id: "report-1", agentName: "ATLAS Prime", completed: ["Built registry"], blocked: ["Needs UI"], needsApproved: ["Creator outreach"], recommendedNextActions: ["Move one lead forward"] });
assertEqual(getDailyReports().length, 1);
assertEqual(generateDailyReportDigest().needsApproved[0], "Creator outreach");

const approval = createAveryApprovalRequest({ id: "approval-1", requestType: "Outreach", title: "Email creator lead", priority: "Critical", notes: "send email" });
assertEqual(approval.status, "Pending Cole Approval");
assertEqual(resolveAveryApproval("approval-1", { approvedBy: "Manager" }).status, "Still Needs Cole Approval");
assertEqual(resolveAveryApproval("approval-1", { approvedBy: "Cole", status: "Approved" }).status, "Approved");
assertEqual(getPendingAveryApprovals().length, 0);

assertEqual(AVERY_AGENT_DASHBOARD_ENDPOINTS.length, 6);
assertEqual(handleAgentDashboardRequest("/agents").status, 200);
assertEqual(handleAgentDashboardRequest("/bad").status, 404);
assertEqual(generateAgentDashboardApiSpec()[0].mode, "local in-memory contract");

const foodTruck = captureIdea({ id: "idea-1", title: "Food Truck", category: "Products", description: "Potential mobile revenue and content idea." });
assertEqual(getIdeas().length, 1);
assertEqual(distributeIdeaToDepartments(foodTruck).indexOf("Sales") >= 0, true);
assertEqual(expandIdea("Food Truck").revenueIdeas.length, 3);
assertEqual(expandCapturedIdea("idea-1").expansions.marketingIdeas.length, 3);

const brief = generateExecutiveMorningBrief({
  revenue: [{ title: "$500 proposal" }],
  clients: [{ clientName: "Client A", status: "Waiting" }],
  leads: [{ name: "Creator lead" }],
  projects: [{ projectName: "ATLAS Core" }],
  agents: [{ status: "Working" }],
  approvals: [{ title: "Creator outreach", priority: "High" }],
  opportunities: [{ title: "Creator Logistics lead", priority: "High" }],
  risks: [{ title: "No revenue action today", priority: "Critical" }],
});
assertEqual(brief.onePageConstraint, true);
assertEqual(brief.recommendedFocus, "Clear high-priority approvals.");
assertEqual(determineRecommendedFocus({ leads: [{}], approvals: [] }), "Move one Creator Logistics lead forward.");

console.log("All Avery Industries Sprint Alpha tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
