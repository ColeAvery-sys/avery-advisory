export type RevisionRequest = {
  id: string;
  projectId: string;
  clientName: string;
  projectName: string;
  deliveryItem: string;
  timestampOrClipName?: string;
  requestedChange: string;
  reason: string;
  priority: string;
  submittedAt: string;
  revisionNumber?: number;
  status: "Submitted" | "In Review" | "Accepted" | "Needs Clarification" | "Out of Scope" | "In Progress" | "Complete" | "Rejected";
  approvalRequired?: boolean;
};

const revisionRequests: RevisionRequest[] = [];

export function submitRevisionRequest(request: RevisionRequest): RevisionRequest {
  validateRevisionRequest(request);
  const revisionNumber = calculateRevisionNumber(request.projectId);
  const scope = classifyRevisionScope(request);
  const stored = { ...request, revisionNumber, status: request.status || "Submitted", approvalRequired: revisionNumber > 3 || scope === "Out of Scope" };
  revisionRequests.push(stored);
  return stored;
}

export function validateRevisionRequest(request: RevisionRequest): void {
  if (!request.clientName || !request.projectName || !request.deliveryItem || !request.requestedChange) throw new Error("Revision request is missing required fields.");
}

export function calculateRevisionNumber(projectId: string): number {
  return revisionRequests.filter((request) => request.projectId === projectId).length + 1;
}

export function checkRevisionLimit(projectId: string): { overLimit: boolean; includedLimit: number; nextRevisionNumber: number } {
  const nextRevisionNumber = calculateRevisionNumber(projectId);
  return { overLimit: nextRevisionNumber > 3, includedLimit: 3, nextRevisionNumber };
}

export function classifyRevisionScope(request: RevisionRequest): "In Scope" | "Out of Scope" {
  return /new video|new deliverable|different project|full re-edit|extra clips/i.test(`${request.requestedChange} ${request.reason}`) ? "Out of Scope" : "In Scope";
}

export function generateRevisionResponseDraft(request: RevisionRequest) {
  return {
    body: `Hi ${request.clientName}, thanks for the revision note on ${request.deliveryItem}. Cole will review the request before any response or scope decision is sent.`,
    approvalRequired: true,
  };
}

export function updateRevisionStatus(requestId: string, status: RevisionRequest["status"]): RevisionRequest {
  const request = findRequest(requestId);
  request.status = status;
  return request;
}

export function clearRevisionRequestsForDemo(): void {
  revisionRequests.length = 0;
}

function findRequest(requestId: string): RevisionRequest {
  const request = revisionRequests.find((item) => item.id === requestId);
  if (!request) throw new Error(`Revision request ${requestId} not found.`);
  return request;
}
