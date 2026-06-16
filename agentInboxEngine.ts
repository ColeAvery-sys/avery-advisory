export type InboxStatus = "New" | "In Review" | "Needs Info" | "Ready to Act" | "Waiting on Cole" | "Dispatched" | "Completed" | "Archived";
export type AgentInboxItem = {
  id: string;
  title: string;
  source: string;
  department: string;
  assignedAgent?: string;
  priority: number;
  status: InboxStatus;
  dueDate?: string;
  relatedClient?: string;
  relatedGrant?: string;
  relatedProduct?: string;
  relatedApproval?: string;
  relatedWorkflow?: string;
  nextAction: string;
  notes?: string;
  requiresColeApproval?: boolean;
  log?: string[];
};

const inboxItems: AgentInboxItem[] = [];

export function createInboxItem(item: AgentInboxItem): AgentInboxItem {
  const requiresColeApproval = item.requiresColeApproval ?? /money|legal|grant|client|contractor|external|public|approval/i.test(`${item.title} ${item.nextAction} ${item.source}`);
  const stored = { ...item, requiresColeApproval, log: item.log || [`Created from ${item.source}.`] };
  inboxItems.push(stored);
  return stored;
}

export function assignInboxItem(agentName: string, itemId: string): AgentInboxItem {
  return updateInboxItem(itemId, { assignedAgent: agentName, log: appendLog(itemId, `Assigned to ${agentName}.`) });
}

export function getInboxForAgent(agentName: string): AgentInboxItem[] {
  return inboxItems.filter((item) => item.assignedAgent === agentName && item.status !== "Archived");
}

export function updateInboxItemStatus(itemId: string, status: InboxStatus): AgentInboxItem {
  return updateInboxItem(itemId, { status, log: appendLog(itemId, `Status changed to ${status}.`) });
}

export function reassignInboxItem(itemId: string, newAgentName: string): AgentInboxItem {
  return updateInboxItem(itemId, { assignedAgent: newAgentName, log: appendLog(itemId, `Reassigned to ${newAgentName}.`) });
}

export function convertInboxItemToTask(itemId: string) {
  const item = findInboxItem(itemId);
  return { id: `task-${item.id}`, title: item.title, department: item.department, assignedAgent: item.assignedAgent, nextAction: item.nextAction, requiresColeApproval: item.requiresColeApproval };
}

export function archiveInboxItem(itemId: string): AgentInboxItem {
  return updateInboxItemStatus(itemId, "Archived");
}

export function clearInboxForDemo(): void {
  inboxItems.length = 0;
}

function findInboxItem(itemId: string): AgentInboxItem {
  const item = inboxItems.find((entry) => entry.id === itemId);
  if (!item) throw new Error(`Inbox item ${itemId} not found.`);
  return item;
}

function updateInboxItem(itemId: string, updates: Partial<AgentInboxItem>): AgentInboxItem {
  const item = findInboxItem(itemId);
  Object.assign(item, updates);
  return item;
}

function appendLog(itemId: string, entry: string): string[] {
  const item = findInboxItem(itemId);
  return [...(item.log || []), entry];
}
