export type ActionApprovalStatus = "Auto-Safe" | "Needs Cole Approval" | "Approved" | "Rejected" | "Changes Requested";
export type ActionResultStatus = "Pending" | "Completed" | "Failed";

export type ActionCenterAction = {
  id: string;
  title: string;
  actionType: string;
  department: string;
  relatedItem?: string;
  proposedByAgent: string;
  riskLevel: "Low" | "Medium" | "High";
  approvalStatus?: ActionApprovalStatus;
  proposedAction: string;
  generatedDraft?: string;
  requiredInputs: string[];
  missingInputs: string[];
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  resultStatus?: ActionResultStatus;
  resultNotes?: string;
};

const actions: ActionCenterAction[] = [];
const riskyTerms = ["money", "legal", "financial", "grant", "client", "contractor", "public", "invoice", "payment", "email", "submit", "publish"];

export function createAction(action: ActionCenterAction): ActionCenterAction {
  const now = new Date().toISOString();
  const approvalStatus: ActionApprovalStatus = requiresApproval(action) ? "Needs Cole Approval" : "Auto-Safe";
  const resultStatus: ActionResultStatus = action.resultStatus || "Pending";
  const stored: ActionCenterAction = { ...action, approvalStatus, createdAt: action.createdAt || now, updatedAt: now, resultStatus };
  actions.push(stored);
  return stored;
}

export function approveAction(actionId: string): ActionCenterAction {
  return updateAction(actionId, { approvalStatus: "Approved" });
}

export function rejectAction(actionId: string, reason: string): ActionCenterAction {
  return updateAction(actionId, { approvalStatus: "Rejected", resultNotes: reason });
}

export function requestActionChanges(actionId: string, requestedChanges: string): ActionCenterAction {
  return updateAction(actionId, { approvalStatus: "Changes Requested", resultNotes: requestedChanges });
}

export function markActionCompleted(actionId: string, resultNotes: string): ActionCenterAction {
  return updateAction(actionId, { resultStatus: "Completed", resultNotes });
}

export function getActionsByApprovalStatus(status: ActionApprovalStatus): ActionCenterAction[] {
  return actions.filter((action) => action.approvalStatus === status);
}

export function getHighRiskActions(): ActionCenterAction[] {
  return actions.filter((action) => action.riskLevel === "High" || requiresApproval(action));
}

export function getActionsDueToday(date: string): ActionCenterAction[] {
  return actions.filter((action) => action.deadline === date);
}

export function clearActionCenterForDemo(): void {
  actions.length = 0;
}

function updateAction(actionId: string, updates: Partial<ActionCenterAction>): ActionCenterAction {
  const action = actions.find((item) => item.id === actionId);
  if (!action) throw new Error(`Action ${actionId} not found.`);
  Object.assign(action, updates, { updatedAt: new Date().toISOString() });
  return action;
}

function requiresApproval(action: ActionCenterAction): boolean {
  const text = `${action.actionType} ${action.department} ${action.title} ${action.proposedAction}`.toLowerCase();
  return action.riskLevel === "High" || riskyTerms.some((term) => text.includes(term));
}
