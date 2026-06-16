export type HandoffStatus = "Draft" | "Sent" | "Accepted" | "Needs Clarification" | "Completed" | "Rejected" | "Archived";
export type AgentHandoff = {
  id: string;
  fromAgent: string;
  toAgent: string;
  title: string;
  context: string;
  reasonForHandoff: string;
  requiredAction: string;
  relatedItem?: string;
  priority: number;
  deadline?: string;
  status: HandoffStatus;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  log: string[];
  escalated?: boolean;
};

const handoffs: AgentHandoff[] = [];

export function createHandoff(handoff: Omit<AgentHandoff, "createdAt" | "log" | "escalated">): AgentHandoff {
  if (!handoff.context || !handoff.requiredAction) throw new Error("Handoffs require clear context and requiredAction.");
  const escalated = handoff.priority >= 8 || /risk|legal|money|approval|client|grant/i.test(`${handoff.context} ${handoff.requiredAction}`);
  const stored = { ...handoff, createdAt: new Date().toISOString(), log: ["Handoff created."], escalated };
  handoffs.push(stored);
  return stored;
}

export function acceptHandoff(handoffId: string): AgentHandoff {
  return updateHandoff(handoffId, { status: "Accepted", acceptedAt: new Date().toISOString() }, "Handoff accepted.");
}

export function requestClarification(handoffId: string, note: string): AgentHandoff {
  return updateHandoff(handoffId, { status: "Needs Clarification" }, `Clarification requested: ${note}`);
}

export function completeHandoff(handoffId: string): AgentHandoff {
  return updateHandoff(handoffId, { status: "Completed", completedAt: new Date().toISOString() }, "Handoff completed.");
}

export function rejectHandoff(handoffId: string, reason: string): AgentHandoff {
  return updateHandoff(handoffId, { status: "Rejected" }, `Handoff rejected: ${reason}`);
}

export function convertHandoffToTask(handoffId: string) {
  const handoff = findHandoff(handoffId);
  return { id: `task-${handoff.id}`, title: handoff.title, assignedAgent: handoff.toAgent, context: handoff.context, nextAction: handoff.requiredAction, requiresColeApproval: handoff.escalated };
}

export function getHandoffsForAgent(agentName: string): AgentHandoff[] {
  return handoffs.filter((handoff) => handoff.toAgent === agentName || handoff.fromAgent === agentName);
}

export function clearHandoffsForDemo(): void {
  handoffs.length = 0;
}

function findHandoff(handoffId: string): AgentHandoff {
  const handoff = handoffs.find((item) => item.id === handoffId);
  if (!handoff) throw new Error(`Handoff ${handoffId} not found.`);
  return handoff;
}

function updateHandoff(handoffId: string, updates: Partial<AgentHandoff>, logEntry: string): AgentHandoff {
  const handoff = findHandoff(handoffId);
  Object.assign(handoff, updates);
  handoff.log.push(logEntry);
  return handoff;
}
