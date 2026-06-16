export type AutomationLog = {
  id: string;
  timestamp: string;
  actor: string;
  actionType: string;
  department: string;
  relatedItem?: string;
  permissionLevel: "Auto" | "Approval Required" | "Blocked";
  riskLevel: "Low" | "Medium" | "High";
  approvalStatus: string;
  outcome: string;
  notes?: string;
};

const automationLogs: AutomationLog[] = [];

export function logAutomationAction(action: AutomationLog): AutomationLog {
  automationLogs.push(action);
  return action;
}

export function getAutomationLogs(): AutomationLog[] {
  return [...automationLogs];
}

export function getLogsByDateRange(startDate: string, endDate: string): AutomationLog[] {
  return automationLogs.filter((log) => log.timestamp >= startDate && log.timestamp <= endDate);
}

export function getLogsByDepartment(department: string): AutomationLog[] {
  return automationLogs.filter((log) => log.department.toLowerCase() === department.toLowerCase());
}

export function getHighRiskLogs(): AutomationLog[] {
  return automationLogs.filter((log) => log.riskLevel === "High");
}

export function getExternalFacingLogs(): AutomationLog[] {
  return automationLogs.filter((log) => /external|client|grant|public|email|invoice/i.test(`${log.actionType} ${log.notes || ""}`));
}

export function generateAuditSummary(logs: AutomationLog[]): string {
  const approvals = logs.filter((log) => log.permissionLevel === "Approval Required").length;
  const blocked = logs.filter((log) => log.permissionLevel === "Blocked").length;
  const highRisk = logs.filter((log) => log.riskLevel === "High").length;
  return `Audit summary: ${logs.length} logs, ${approvals} approval-required, ${blocked} blocked, ${highRisk} high-risk.`;
}

export function clearAutomationLogsForDemo(): void {
  automationLogs.length = 0;
}
