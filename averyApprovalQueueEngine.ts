import { createAveryApprovalGate, priorityWeight } from "./averyOpsSafety";

const approvals: any[] = [];

export function createAveryApprovalRequest(request: any) {
  const gate = createAveryApprovalGate(request.requestType || "Approval request", request);
  const stored = {
    id: request.id || `avery-approval-${approvals.length + 1}`,
    requestType: request.requestType,
    title: request.title,
    department: request.department || "Executive",
    requestedBy: request.requestedBy || "ATLAS",
    priority: request.priority || "Normal",
    status: gate.approvalStatus === "Needs Cole Approval" ? "Pending Cole Approval" : "Draft",
    riskFlags: gate.riskFlags,
    notes: request.notes || "",
  };
  approvals.push(stored);
  return stored;
}

export function resolveAveryApproval(approvalId: string, resolution: any) {
  const approval = findApproval(approvalId);
  if (approval.status === "Pending Cole Approval" && resolution.approvedBy !== "Cole") {
    approval.status = "Still Needs Cole Approval";
    return approval;
  }
  approval.status = resolution.status || "Approved";
  approval.approvedBy = resolution.approvedBy;
  return approval;
}

export function getAveryApprovals() {
  return approvals.slice().sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));
}

export function getPendingAveryApprovals() {
  return getAveryApprovals().filter((approval) => /pending|needs/i.test(approval.status));
}

function findApproval(approvalId: string) {
  const approval = approvals.find((item) => item.id === approvalId);
  if (!approval) throw new Error(`Approval ${approvalId} not found.`);
  return approval;
}
