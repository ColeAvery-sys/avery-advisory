import { createDebate, addAgentPosition, generateConsensusRecommendation } from "./agentDebateEngine";
import { createHandoff, acceptHandoff, convertHandoffToTask, clearHandoffsForDemo } from "./agentHandoffEngine";
import { createInboxItem, assignInboxItem, convertInboxItemToTask, clearInboxForDemo } from "./agentInboxEngine";
import { addAgentMemory, searchAgentMemory, clearAgentMemoryForDemo } from "./agentMemoryEngine";
import { calculateAgentPerformance } from "./agentPerformanceEngine";
import { seedDefaultAgents, getAgentByName, assignTaskToAgent, clearAgentsForDemo } from "./agentRegistryEngine";
import { generateAgentReport } from "./agentReportEngine";
import { generateDepartmentDashboard } from "./departmentDashboardEngine";
import { calculateDepartmentKPIs } from "./departmentKpiEngine";
import { seedDefaultEscalationRules, testEscalationRules, createActionItemFromEscalation, clearEscalationRulesForDemo } from "./escalationRulesEngine";

clearAgentsForDemo();
clearInboxForDemo();
clearAgentMemoryForDemo();
clearEscalationRulesForDemo();
clearHandoffsForDemo();

console.log("Agent Registry");
const agents = seedDefaultAgents();
console.log(agents.map((agent) => agent.agentName));
console.log(assignTaskToAgent(getAgentByName("ATLAS Codex Dispatcher").id, "backend-bug"));

console.log("\nAgent Inbox");
createInboxItem({ id: "demo-inbox", title: "Fix scoring bug", source: "Automation Logs", department: "Engineering Dispatch", priority: 8, status: "New", nextAction: "Dispatch to Codex" });
assignInboxItem("ATLAS Codex Dispatcher", "demo-inbox");
console.log(convertInboxItemToTask("demo-inbox"));

console.log("\nAgent Memory");
addAgentMemory({ id: "demo-memory", agentName: "ATLAS Grant Officer", department: "Grants and Funding", memoryTitle: "Accessibility-first AI", memoryType: "Funder Insight", summary: "Strongest funding angle.", fullText: "Disability-aid independent living framing is promising.", source: "Batch 9", confidence: 0.8, status: "Active", lastUpdated: new Date().toISOString(), shouldUseInRecommendations: true });
console.log(searchAgentMemory("ATLAS Grant Officer", "independent living"));

console.log("\nEscalation Rules");
seedDefaultEscalationRules();
const escalation = testEscalationRules({ title: "grant submission", department: "Grants and Funding" })[0];
console.log(createActionItemFromEscalation(escalation));

console.log("\nDepartment Dashboard");
console.log(generateDepartmentDashboard("Engineering Dispatch", { agents, tasks: [{ title: "Backend bug", department: "Engineering Dispatch", priority: 8 }], approvals: [], documents: [], deadlines: [], workflows: [], kpis: {} }));

console.log("\nAgent Handoff");
const handoff = createHandoff({ id: "demo-handoff", fromAgent: "ATLAS Product Manager", toAgent: "ATLAS Codex Dispatcher", title: "Backend scoring bug", context: "Bug blocks workflow.", reasonForHandoff: "Backend fix needed", requiredAction: "Create Codex task", priority: 8, status: "Sent" });
acceptHandoff(handoff.id);
console.log(convertHandoffToTask(handoff.id));

console.log("\nAgent Report");
console.log(generateAgentReport("ATLAS Codex Dispatcher", { agents, tasks: [{ title: "Backend bug", assignedAgent: "ATLAS Codex Dispatcher", status: "Active" }], approvals: [], blockers: [] }, "Daily Agent Report"));

console.log("\nDepartment KPIs");
console.log(calculateDepartmentKPIs("Engineering Dispatch", { tasks: [{ title: "bug", department: "Engineering Dispatch", status: "Active" }], approvals: [], deadlines: [], blockers: [], logs: [] }));

console.log("\nAgent Debate");
const debate = createDebate("Should ATLAS Assist be prioritized this week?", "Funding and product opportunity.", ["ATLAS Grant Officer", "ATLAS Product Manager", "ATLAS Chief of Staff"]);
addAgentPosition(debate.id, "ATLAS Grant Officer", { departmentPerspective: "Funding", recommendation: "Prioritize ATLAS Assist grant-ready scope.", opportunities: ["funding"], risks: ["missing budget"], confidence: 0.75, reasoning: "Strong disability-aid funding angle." });
addAgentPosition(debate.id, "ATLAS Product Manager", { departmentPerspective: "Build", recommendation: "Build smallest demo.", opportunities: ["demo readiness"], risks: ["scope creep"], confidence: 0.7, reasoning: "MVP can support grants." });
console.log(generateConsensusRecommendation(debate.id));

console.log("\nAgent Performance");
console.log(calculateAgentPerformance("ATLAS Codex Dispatcher", { agents, tasks: [{ assignedAgent: "ATLAS Codex Dispatcher", status: "Completed" }], recommendations: [], handoffs: [{ toAgent: "ATLAS Codex Dispatcher", status: "Completed" }], responseTimes: [1, 3], blockers: [] }));
