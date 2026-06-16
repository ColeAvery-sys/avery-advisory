import { createDebate, addAgentPosition, generateConsensusRecommendation, createActionItemsFromDebate, clearDebatesForDemo } from "./agentDebateEngine";
import { createHandoff, acceptHandoff, convertHandoffToTask, clearHandoffsForDemo } from "./agentHandoffEngine";
import { createInboxItem, assignInboxItem, convertInboxItemToTask, clearInboxForDemo } from "./agentInboxEngine";
import { addAgentMemory, markAgentMemoryDeprecated, promoteToCompanyMemory, searchAgentMemory, clearAgentMemoryForDemo } from "./agentMemoryEngine";
import { calculateAgentPerformance } from "./agentPerformanceEngine";
import { seedDefaultAgents, getAgentByName, pauseAgent, assignTaskToAgent, clearAgentsForDemo } from "./agentRegistryEngine";
import { generateAgentReport } from "./agentReportEngine";
import { generateDepartmentDashboard } from "./departmentDashboardEngine";
import { calculateDepartmentKPIs } from "./departmentKpiEngine";
import { seedDefaultEscalationRules, testEscalationRules, createActionItemFromEscalation, clearEscalationRulesForDemo } from "./escalationRulesEngine";

clearAgentsForDemo();
const agents = seedDefaultAgents();
assertEqual(agents.length, 12);
const grantOfficer = getAgentByName("ATLAS Grant Officer");
pauseAgent(grantOfficer.id);
assertThrows(() => assignTaskToAgent(grantOfficer.id, "task-1"));
assertEqual(assignTaskToAgent(grantOfficer.id, "task-1", true).activeTasks.includes("task-1"), true);

clearInboxForDemo();
createInboxItem({ id: "inbox-1", title: "Send client delivery", source: "Client Pipeline", department: "Creator Logistics", priority: 9, status: "New", nextAction: "Prepare approval item for client delivery" });
assignInboxItem("ATLAS Creator Logistics Manager", "inbox-1");
assertEqual(convertInboxItemToTask("inbox-1").requiresColeApproval, true);

clearAgentMemoryForDemo();
addAgentMemory({ id: "mem-1", agentName: "ATLAS Grant Officer", department: "Grants and Funding", memoryTitle: "Disability-aid framing", memoryType: "Funder Insight", summary: "Accessibility-first AI is strong.", fullText: "Use disability-aid and independent living framing.", source: "Batch 9", confidence: 0.8, status: "Active", lastUpdated: "2099-01-01", shouldUseInRecommendations: true });
assertEqual(searchAgentMemory("ATLAS Grant Officer", "accessibility").length, 1);
assertEqual(promoteToCompanyMemory("mem-1").title, "Disability-aid framing");
markAgentMemoryDeprecated("mem-1");
assertEqual(searchAgentMemory("ATLAS Grant Officer", "accessibility").length, 0);

clearEscalationRulesForDemo();
const rules = seedDefaultEscalationRules();
const matches = testEscalationRules({ title: "money action for client", department: "Sales and Outreach" });
assertEqual(matches.length > 0, true);
assertEqual(createActionItemFromEscalation(rules[0]).target, "Action Center");

const dashboard = generateDepartmentDashboard("Creator Logistics", {
  agents,
  tasks: [{ title: "Client delivery", department: "Creator Logistics", priority: 9, requiresColeApproval: true }],
  approvals: [{ title: "Client approval", department: "Creator Logistics" }],
  documents: [],
  deadlines: [],
  workflows: [],
  kpis: {},
});
assertEqual(dashboard.waitingOnCole.length, 2);

clearHandoffsForDemo();
const handoff = createHandoff({ id: "h1", fromAgent: "ATLAS Sales Operator", toAgent: "ATLAS Creator Logistics Manager", title: "Won client", context: "Warm lead became client.", reasonForHandoff: "Delivery setup", requiredAction: "Create delivery workflow", priority: 8, status: "Sent" });
assertEqual(handoff.escalated, true);
acceptHandoff("h1");
assertEqual(convertHandoffToTask("h1").requiresColeApproval, true);

const report = generateAgentReport("ATLAS Creator Logistics Manager", {
  agents,
  tasks: [{ title: "Client delivery", assignedAgent: "ATLAS Creator Logistics Manager", status: "Active", requiresColeApproval: true }],
  approvals: [{ title: "Client approval", assignedAgent: "ATLAS Creator Logistics Manager" }],
  blockers: [],
}, "Daily Agent Report");
assertEqual(report.approvalsNeeded.length, 2);

const kpis = calculateDepartmentKPIs("Creator Logistics", {
  tasks: [{ title: "Client delivery", department: "Creator Logistics", status: "Active" }],
  approvals: [{ title: "Client approval", department: "Creator Logistics" }],
  deadlines: [{ title: "delivery due", department: "Creator Logistics", daysRemaining: 2 }],
  blockers: [],
  clients: [{ title: "Client A" }],
});
assertEqual(kpis.warnings.length > 0, true);

clearDebatesForDemo();
const debate = createDebate("Should we take this client?", "Client has revenue upside and delivery risk.", ["ATLAS Sales Operator", "ATLAS Legal/Finance Reviewer"]);
addAgentPosition(debate.id, "ATLAS Sales Operator", { departmentPerspective: "Revenue", recommendation: "Take client if scope is clear.", opportunities: ["cash"], risks: [], confidence: 0.8, reasoning: "Revenue potential is strong." });
addAgentPosition(debate.id, "ATLAS Legal/Finance Reviewer", { departmentPerspective: "Risk", recommendation: "Require approval and clear contract.", opportunities: [], risks: ["contract risk"], confidence: 0.7, reasoning: "Client terms need review." });
assertEqual(generateConsensusRecommendation(debate.id).approvalRequired, true);
assertEqual(createActionItemsFromDebate(debate.id).every((item) => item.requiresColeApproval), true);

const performance = calculateAgentPerformance("ATLAS Creator Logistics Manager", {
  agents,
  tasks: [{ assignedAgent: "ATLAS Creator Logistics Manager", status: "Completed" }, { assignedAgent: "ATLAS Creator Logistics Manager", status: "Overdue" }],
  recommendations: [{ agentName: "ATLAS Creator Logistics Manager", status: "Rejected" }],
  handoffs: [{ toAgent: "ATLAS Creator Logistics Manager", status: "Rejected" }],
  responseTimes: [2, 4],
  blockers: [{ assignedAgent: "ATLAS Creator Logistics Manager" }],
});
assertEqual(performance.improvementSuggestions.length > 0, true);

console.log("All ATLAS Batch 10 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}

function assertThrows(callback: () => void): void {
  let threw = false;
  try {
    callback();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("Expected function to throw.");
}
