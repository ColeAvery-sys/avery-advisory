import { createAgentGate, detectAgentRisks } from "./agentCivilizationSafety";

const usageRecords: any[] = [];

export function createResourceUsageRequest(request: any) {
  const riskFlags = detectAgentRisks(request);
  const stored = { ...request, id: request.id || `resource-${usageRecords.length + 1}`, status: riskFlags.length ? "Needs Approval" : "Draft", riskFlags };
  usageRecords.push(stored);
  return stored;
}

export function approveResourceUsage(requestId: string, approval: any) {
  const request = findRequest(requestId);
  if (approval?.approvedBy !== "Cole") {
    request.status = "Needs Cole Approval";
    return request;
  }
  request.status = "Approved";
  request.approvedBy = "Cole";
  return request;
}

export function logResourceUsage(agentId: string, usage: any) {
  const stored = { ...usage, id: usage.id || `usage-${usageRecords.length + 1}`, agentId, status: "Logged" };
  usageRecords.push(stored);
  return stored;
}

export function generateAgentBudgetReport(agentId?: string) {
  const records = agentId ? usageRecords.filter((record) => record.agentId === agentId) : usageRecords;
  return {
    recordCount: records.length,
    estimatedCost: records.reduce((sum, record) => sum + Number(record.estimatedCost || record.actualCost || 0), 0),
    pendingApprovals: records.filter((record) => /approval/i.test(record.status || "")).length,
    ...createAgentGate("Agent budget report", ["Expensive resource use requires approval."]),
  };
}

function findRequest(requestId: string) {
  const request = usageRecords.find((item) => item.id === requestId);
  if (!request) throw new Error(`Resource request ${requestId} not found.`);
  return request;
}
