import { PermissionLevel, RiskLevel } from "./automationPermissionEngine";

export type AtlasActionStatus = "Logged" | "Awaiting Approval" | "Approved" | "Rejected" | "Completed" | "Failed";

export type AtlasAction = {
  id: string;
  timestamp: string;
  actor: string;
  department: string;
  actionType: string;
  description: string;
  permissionLevel: PermissionLevel;
  riskLevel: RiskLevel;
  status: AtlasActionStatus;
  relatedItemId?: string;
  notes?: string;
};

const actionLog: AtlasAction[] = [];

export function logAction(action: Omit<AtlasAction, "timestamp" | "status"> & Partial<Pick<AtlasAction, "timestamp" | "status">>): AtlasAction {
  if (!action.id) throw new TypeError("Action id is required.");

  const loggedAction: AtlasAction = {
    ...action,
    timestamp: action.timestamp || new Date().toISOString(),
    status: action.status || (action.permissionLevel === "Approval Required" ? "Awaiting Approval" : "Logged"),
  };

  actionLog.push(loggedAction);
  return loggedAction;
}

export function getActionLog(): AtlasAction[] {
  return [...actionLog];
}

export function getActionsByDepartment(department: string): AtlasAction[] {
  return actionLog.filter((action) => action.department.toLowerCase() === department.toLowerCase());
}

export function getActionsByDateRange(startDate: string, endDate: string): AtlasAction[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return actionLog.filter((action) => {
    const timestamp = new Date(action.timestamp).getTime();
    return timestamp >= start && timestamp <= end;
  });
}

export function getActionsRequiringApproval(): AtlasAction[] {
  return actionLog.filter((action) => action.status === "Awaiting Approval" || action.permissionLevel === "Approval Required");
}

export function markActionApproved(id: string): AtlasAction {
  return updateActionStatus(id, "Approved");
}

export function markActionRejected(id: string): AtlasAction {
  return updateActionStatus(id, "Rejected");
}

function updateActionStatus(id: string, status: AtlasActionStatus): AtlasAction {
  const action = actionLog.find((item) => item.id === id);
  if (!action) throw new Error(`Action ${id} not found.`);

  action.status = status;
  return action;
}

export function clearActionLogForDemo(): void {
  actionLog.length = 0;
}
