import { createNetworkGate, detectNetworkRisks } from "./atlasNetworkSafety";

const approvals: any[] = [];

export function createApprovalRequest(request: any) {
  const riskFlags = detectNetworkRisks(request);
  const stored = { ...request, id: request.id || `approval-${approvals.length + 1}`, riskFlags, decision: classifyApproval(request), status: "Pending" };
  approvals.push(stored);
  return stored;
}

export function classifyApproval(request: any): "Cole Approval Required" | "Manager Approval Required" | "Auto Approved" | "Blocked" {
  const risks = detectNetworkRisks(request);
  if (/delete|unsafe|illegal|medical advice|fake|fraud/i.test(JSON.stringify(request))) return "Blocked";
  if (risks.length) return "Cole Approval Required";
  if (/department|manager|internal/i.test(JSON.stringify(request))) return "Manager Approval Required";
  return "Auto Approved";
}

export function resolveApproval(approvalId: string, resolution: any) {
  const approval = findApproval(approvalId);
  if (approval.decision === "Cole Approval Required" && resolution.approvedBy !== "Cole") {
    approval.status = "Still Requires Cole Approval";
    return approval;
  }
  approval.status = resolution.status || "Approved";
  approval.approvedBy = resolution.approvedBy;
  return approval;
}

export function getPendingApprovals() {
  return approvals.filter((approval) => /pending|requires/i.test(approval.status || ""));
}

export function generateApprovalSummary() {
  return { totalApprovals: approvals.length, pending: getPendingApprovals().length, coleRequired: approvals.filter((approval) => approval.decision === "Cole Approval Required").length, ...createNetworkGate("Approval summary") };
}

function findApproval(approvalId: string) {
  const approval = approvals.find((entry) => entry.id === approvalId);
  if (!approval) throw new Error(`Approval ${approvalId} not found.`);
  return approval;
}
