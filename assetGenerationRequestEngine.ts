import { approved, createStudioGate, ensureApproval, rightsClear } from "./contentStudioSafety";

const requests: any[] = [];

export function createAssetRequest(request: any) {
  const stored = { ...request, ...createStudioGate("Asset generation request"), generatedStatus: request.generatedStatus || "Not Generated" };
  requests.push(stored);
  return stored;
}

export function generateAssetBrief(request: any) {
  return { requestTitle: request.requestTitle, purpose: request.purpose, outputFormat: request.outputFormat || "PNG/MP4 as needed", rightsNeeded: "Public/commercial use requires clear rights.", approvalRequired: true };
}

export function generateImagePrompt(request: any) {
  return `Create a ${request.assetType || "image"} for ${request.brand || "AveryTech"}: ${request.promptOrBrief || request.purpose}. Avoid copyrighted characters and unapproved likeness.`;
}

export function generateBlenderPrompt(request: any) {
  return `Create a Blender asset brief for ${request.requestTitle}. Target format: ${request.outputFormat || "GLB/PNG"}. Include clean geometry, named objects, and usage notes.`;
}

export function generateAnimationPrompt(request: any) {
  return `Create an animation brief for ${request.requestTitle}: purpose ${request.purpose || "support content"}. Keep it simple and reusable.`;
}

export function markAssetGeneratedManually(requestId: string, fileLink: string, approval?: { approvedByCole?: boolean }) {
  const request = findRequest(requestId);
  if (/paid|credits|generation/i.test(`${request.tool || ""} ${request.notes || ""}`)) ensureApproval(approval, "Cole approval required before paid asset generation.");
  request.generatedStatus = "Generated Manually";
  request.fileLink = fileLink;
  return request;
}

export function attachAssetToProject(requestId: string, projectId: string) {
  const request = findRequest(requestId);
  if (/public|commercial/i.test(`${request.purpose} ${request.platform}`) && !rightsClear(request.rightsStatus)) throw new Error("Public/commercial asset needs clear rights before project use.");
  request.attachedProjectId = projectId;
  return request;
}

export function sendAssetToRightsTracker(requestId: string) {
  const request = findRequest(requestId);
  return { assetName: request.requestTitle, assetType: request.assetType, relatedBrand: request.brand, source: request.fileLink || "pending", licenseType: approved(request.approvalStatus) ? "Needs Review" : "Unknown", commercialUseAllowed: rightsClear(request.rightsStatus), approvalRequired: true };
}

function findRequest(requestId: string) {
  const request = requests.find((entry) => entry.id === requestId || entry.requestId === requestId);
  if (!request) throw new Error(`Asset request ${requestId} not found.`);
  return request;
}

