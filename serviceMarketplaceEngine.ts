import { createPlatformAction } from "./mediaBaronSafety";

const services: any[] = [];
const requests: any[] = [];

export function createServiceListing(service: any) {
  const stored = { ...service, ...createPlatformAction("Service listing"), queueStatus: service.queueStatus || "Draft" };
  services.push(stored);
  return stored;
}

export function generateServiceCopy(service: any) {
  return { title: service.serviceName, description: `${service.description || service.serviceName}. Scope, final price, and acceptance require Cole approval.`, approvalRequired: true };
}

export function generateIntakeQuestions(service: any): string[] {
  return ["What do you need made?", "What is your deadline?", "What files or links are required?", "What is your budget range?", "What examples should we match or avoid?"].concat(service.requiredInputs || []);
}

export function submitServiceRequest(request: any) {
  const stored = { ...request, status: "New", approvalStatus: "Needs Cole Approval" };
  requests.push(stored);
  return stored;
}

export function generateQuoteDraft(request: any) {
  return { requestedService: request.requestedService, estimate: request.budget || "Quote required", body: "Draft quote only. Final price and service acceptance require Cole approval.", approvalRequired: true };
}

export function convertRequestToDeal(requestId: string) {
  const request = findRequest(requestId);
  return { dealName: `${request.requestedService} for ${request.clientName}`, contact: request.clientName, estimatedValue: Number(request.budget) || 0, stage: "Discovery Needed", approvalRequired: true };
}

export function convertRequestToFulfillmentProject(requestId: string) {
  const request = findRequest(requestId);
  return { clientName: request.clientName, projectName: request.requestedService, rawInputs: request.fileLinks || [], status: "Needs Cole Approval", approvalRequired: true };
}

function findRequest(requestId: string) {
  const request = requests.find((entry) => entry.id === requestId);
  if (!request) throw new Error(`Service request ${requestId} not found.`);
  return request;
}
