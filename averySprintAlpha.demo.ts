import { seedAveryDepartments } from "./averyDepartmentRegistry";
import { seedFoundationAgents, assignAveryTask, getAveryAgents } from "./averyAgentArmyEngine";
import { createSharedMemoryRecord, generateMemorySummary } from "./averySharedMemoryEngine";
import { createAgentDailyReport, generateDailyReportDigest } from "./averyDailyReportEngine";
import { createAveryApprovalRequest, getAveryApprovals } from "./averyApprovalQueueEngine";
import { generateAgentDashboardApiSpec, handleAgentDashboardRequest } from "./averyAgentDashboardApi";
import { captureIdea, expandCapturedIdea } from "./ideaVaultEngine";
import { generateExecutiveMorningBrief } from "./executiveMorningBriefEngine";

seedAveryDepartments();
seedFoundationAgents();
assignAveryTask({ title: "Create one-page Creator Logistics offer", department: "Creator Logistics", assignedAgent: "ATLAS Prime", priority: "High" });
createSharedMemoryRecord({ type: "Decision", title: "Sprint Alpha focus", body: "Revenue, ATLAS Core, hiring/outsourcing, and accessibility mission." });
createAgentDailyReport({
  agentName: "ATLAS Prime",
  completed: ["Seeded foundation agents"],
  blocked: ["UI not connected yet"],
  needsApproved: ["Creator outreach"],
  recommendedNextActions: ["One revenue move today"],
});
createAveryApprovalRequest({ requestType: "Outreach", title: "Contact first creator prospect", priority: "Critical", notes: "send email" });
const idea = captureIdea({ title: "Food Truck", category: "Products", description: "Potential mobile content and revenue concept." });
expandCapturedIdea(idea.id);

console.log("Avery Industries Sprint Alpha Snapshot");
console.log({
  departments: seedAveryDepartments().length,
  agents: getAveryAgents().map((agent) => `${agent.name} / ${agent.department}`),
  memory: generateMemorySummary(),
  reports: generateDailyReportDigest(),
  approvals: getAveryApprovals(),
  api: generateAgentDashboardApiSpec(),
  apiAgentsPreview: (handleAgentDashboardRequest("/agents").data as any[]).length,
  idea,
  morningBrief: generateExecutiveMorningBrief({
    revenue: [],
    clients: [],
    leads: [{ name: "Creator prospect" }],
    projects: [{ projectName: "Executive Dashboard" }],
    agents: getAveryAgents(),
    approvals: getAveryApprovals(),
    opportunities: [{ title: "Creator Logistics offer", priority: "High" }],
    risks: [{ title: "No revenue action yet", priority: "Critical" }],
  }),
});
