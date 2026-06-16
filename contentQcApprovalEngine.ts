import { approved, createStudioGate, detectContentRisks, ensureApproval, readinessScore, rightsClear } from "./contentStudioSafety";

const qcRecords: any[] = [];

export function createContentQcRecord(content: any) {
  const stored = { ...content, ...createStudioGate("Content QC"), QCStatus: content.QCStatus || "Not Run" };
  qcRecords.push(stored);
  return stored;
}

export function runContentQc(contentId: string) {
  const content = findContent(contentId);
  const failedChecks = generateContentFixList(contentId);
  content.QCStatus = failedChecks.length ? "Failed" : "Passed";
  return { contentTitle: content.contentTitle, QCStatus: content.QCStatus, failedChecks, readinessScore: readinessScore([failedChecks.length === 0, !!content.finalFile, !!content.uploadPackage, !!content.CTA || !!content.relatedLandingPage]), approvalRequired: true };
}

export function validateAssetRights(contentId: string) {
  const content = findContent(contentId);
  const valid = rightsClear(content.assetRightsStatus);
  return { valid, reason: valid ? "Asset rights clear." : "Failed rights check blocks approval." };
}

export function validateClaims(contentId: string) {
  const content = findContent(contentId);
  const risks = detectContentRisks(`${content.script || ""} ${content.title || ""} ${content.uploadPackage || ""}`);
  const valid = risks.length === 0 && /passed|approved|not needed/i.test(content.claimsReviewStatus || "Not Needed");
  return { valid, risks, reason: valid ? "Claims review passed or not needed." : "Failed claims check blocks approval." };
}

export function validatePlatformPolicy(contentId: string) {
  const content = findContent(contentId);
  const issues: string[] = [];
  if (/sponsor|affiliate|ad/i.test(`${content.contentType} ${content.script}`) && !content.sponsorDisclosureNeeded && !content.disclosureIncluded) issues.push("sponsor/affiliate disclosure must be flagged");
  if (/client/i.test(content.contentType || "") && !content.clientInfoRemoved) issues.push("client info removal must be confirmed");
  return { valid: issues.length === 0, issues };
}

export function generateContentFixList(contentId: string): string[] {
  const content = findContent(contentId);
  const fixes: string[] = [];
  if (!approved(content.scriptApprovalStatus)) fixes.push("script approval missing");
  if (!validateAssetRights(contentId).valid) fixes.push("asset rights failed");
  if (!validateClaims(contentId).valid) fixes.push("claims review failed");
  fixes.push(...validatePlatformPolicy(contentId).issues);
  if (!content.finalFile) fixes.push("final file missing");
  if (/misleading/i.test(`${content.thumbnail} ${content.title}`)) fixes.push("thumbnail/title may be misleading");
  return fixes;
}

export function approveForManualPublish(contentId: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before approving manual publish.");
  const content = findContent(contentId);
  const qc = runContentQc(contentId);
  if (qc.failedChecks.length) throw new Error(qc.failedChecks.join("; "));
  content.approvalStatus = "Approved for Manual Publish";
  return content;
}

export function approveForClientDelivery(contentId: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before approving client delivery.");
  const content = findContent(contentId);
  const qc = runContentQc(contentId);
  if (qc.failedChecks.length) throw new Error(qc.failedChecks.join("; "));
  content.approvalStatus = "Approved for Client Delivery";
  return content;
}

function findContent(contentId: string) {
  const content = qcRecords.find((entry) => entry.id === contentId || entry.contentId === contentId);
  if (!content) throw new Error(`Content QC record ${contentId} not found.`);
  return content;
}

