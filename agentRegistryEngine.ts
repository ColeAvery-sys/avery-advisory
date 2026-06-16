export type AgentStatus = "Active" | "Idle" | "Blocked" | "Needs Cole" | "Paused" | "Error";
export type AgentRecord = {
  id: string;
  agentName: string;
  department: string;
  roleSummary: string;
  responsibilities: string[];
  allowedActions: string[];
  blockedActions: string[];
  approvalRequiredActions: string[];
  currentWorkload: number;
  activeTasks: string[];
  overdueTasks: string[];
  waitingOnCole: string[];
  riskLevel: "Low" | "Medium" | "High";
  status: AgentStatus;
  lastReport?: string;
  nextRecommendedAction?: string;
};

const agents: AgentRecord[] = [];

const defaultAgentNames = [
  ["ATLAS Chief of Staff", "Executive / Chief of Staff"],
  ["ATLAS Grant Officer", "Grants and Funding"],
  ["ATLAS Sales Operator", "Sales and Outreach"],
  ["ATLAS Creator Logistics Manager", "Creator Logistics"],
  ["ATLAS Product Manager", "Product Development"],
  ["ATLAS Content Director", "Content and Marketing"],
  ["ATLAS Legal/Finance Reviewer", "Legal and Finance"],
  ["ATLAS Personal Admin", "Personal Admin / College"],
  ["ATLAS Codex Dispatcher", "Engineering Dispatch"],
  ["ATLAS Cursor Dispatcher", "Engineering Dispatch"],
  ["ATLAS Evidence Librarian", "Evidence and Knowledge"],
  ["ATLAS Automation Engineer", "Automation and Integrations"],
];

export function createAgent(agent: AgentRecord): AgentRecord {
  agents.push(agent);
  return agent;
}

export function seedDefaultAgents(): AgentRecord[] {
  if (agents.length > 0) return agents;
  return defaultAgentNames.map(([agentName, department], index) =>
    createAgent({
      id: `agent-${index + 1}`,
      agentName,
      department,
      roleSummary: `${agentName} handles ${department} work as a structured ATLAS role.`,
      responsibilities: [`Manage ${department} inbox`, "Create recommendations", "Route risky work to approval"],
      allowedActions: ["organize", "draft", "recommend", "route", "report", "create approval item"],
      blockedActions: ["send email", "submit grant", "spend money", "publish content", "delete file", "hire", "pay contractor"],
      approvalRequiredActions: ["external-facing message", "money action", "legal/financial action", "client delivery", "grant submission"],
      currentWorkload: 0,
      activeTasks: [],
      overdueTasks: [],
      waitingOnCole: [],
      riskLevel: "Low",
      status: "Idle",
      nextRecommendedAction: "Review inbox.",
    }),
  );
}

export function updateAgent(agentId: string, updates: Partial<AgentRecord>): AgentRecord {
  const agent = findAgentById(agentId);
  Object.assign(agent, updates);
  return agent;
}

export function getAgentByName(agentName: string): AgentRecord {
  const agent = agents.find((item) => item.agentName === agentName);
  if (!agent) throw new Error(`Agent ${agentName} not found.`);
  return agent;
}

export function getAgentsByDepartment(department: string): AgentRecord[] {
  return agents.filter((agent) => agent.department === department);
}

export function pauseAgent(agentId: string): AgentRecord {
  return updateAgent(agentId, { status: "Paused" });
}

export function resumeAgent(agentId: string): AgentRecord {
  return updateAgent(agentId, { status: "Active" });
}

export function getAgentWorkload(agentId: string) {
  const agent = findAgentById(agentId);
  return {
    activeTasks: agent.activeTasks.length,
    overdueTasks: agent.overdueTasks.length,
    waitingOnCole: agent.waitingOnCole.length,
    currentWorkload: agent.currentWorkload,
  };
}

export function assignTaskToAgent(agentId: string, taskId: string, manualOverride = false): AgentRecord {
  const agent = findAgentById(agentId);
  if (agent.status === "Paused" && !manualOverride) throw new Error("Paused agents cannot receive new tasks without manual override.");
  agent.activeTasks.push(taskId);
  agent.currentWorkload = agent.activeTasks.length;
  agent.status = "Active";
  return agent;
}

export function createCivilizationAgent(agent: AgentRecord & { rank?: string; capabilities?: string[]; manager?: string; successRate?: number; cost?: number }) {
  const stored = createAgent({
    ...agent,
    allowedActions: agent.allowedActions || ["draft", "recommend", "report", "complete approved task"],
    blockedActions: agent.blockedActions || ["spend money", "hire", "fire", "publish", "approve critical action"],
    approvalRequiredActions: agent.approvalRequiredActions || ["resource use", "public/customer-facing output", "critical action"],
  });
  return {
    ...stored,
    rank: agent.rank || "Worker",
    capabilities: agent.capabilities || agent.responsibilities,
    manager: agent.manager || "ATLAS",
    successRate: agent.successRate || 0,
    cost: agent.cost || 0,
    humanSovereigntyRequired: true,
  };
}

export function generateAgentRegistrySummary() {
  return {
    totalAgents: agents.length,
    byDepartment: countBy(agents, (agent) => agent.department),
    activeAgents: agents.filter((agent) => agent.status === "Active").length,
    blockedAgents: agents.filter((agent) => agent.status === "Blocked" || agent.status === "Needs Cole").length,
    coleFinalAuthority: true,
  };
}

export function clearAgentsForDemo(): void {
  agents.length = 0;
}

function countBy(items: AgentRecord[], getter: (item: AgentRecord) => string) {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const key = getter(item) || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function findAgentById(agentId: string): AgentRecord {
  const agent = agents.find((item) => item.id === agentId);
  if (!agent) throw new Error(`Agent ${agentId} not found.`);
  return agent;
}
