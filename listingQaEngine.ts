import { createFactoryGate, detectProductRisks, ensureColeApproval, readinessScore, rightsAreClear } from "./marketplaceFactorySafety";

const listings: any[] = [];

export function createListingQaRecord(listing: any) {
  const stored = { ...listing, ...createFactoryGate("Listing QA"), QAStatus: listing.QAStatus || "Not Started" };
  listings.push(stored);
  return stored;
}

export function runListingQa(listing: any) {
  const failedChecks = collectFailedChecks(listing);
  return { listingName: listing.listingName, platform: listing.platform, QAStatus: failedChecks.length ? "Failed" : "Passed", failedChecks, recommendedFixes: generateListingFixes(listing), approvalStatus: "Needs Cole Approval", publishReadinessScore: calculatePublishReadiness(listing).score };
}

export function validateClaims(listing: any) {
  const risks = detectProductRisks(`${listing.title || ""} ${listing.description || ""} ${listing.claims || ""}`);
  return { valid: risks.length === 0, risks };
}

export function validateRightsStatus(listing: any) {
  const valid = rightsAreClear(listing.rightsStatus);
  return { valid, reason: valid ? "Rights appear clear for review." : "Rights must be clear before public listing." };
}

export function validateSeoRelevance(listing: any) {
  const tags = listing.tags || listing.seoTags || [];
  const text = `${listing.title || listing.listingName || ""} ${listing.description || ""}`.toLowerCase();
  const irrelevant = tags.filter((tag: string) => text.indexOf(String(tag).toLowerCase().split(" ")[0]) === -1);
  return { valid: irrelevant.length <= Math.max(1, Math.floor(tags.length / 2)), irrelevantTags: irrelevant };
}

export function generateListingFixes(listing: any): string[] {
  return collectFailedChecks(listing).map((check) => `Fix: ${check}`);
}

export function calculatePublishReadiness(listing: any) {
  const failed = collectFailedChecks(listing);
  const score = readinessScore([!!listing.title || !!listing.listingName, !!listing.description, rightsAreClear(listing.rightsStatus), !!listing.priceApproved, !!listing.filesAttached, !!listing.instructionsIncluded, failed.length === 0]);
  return { score, ready: score >= 85, failedChecks: failed, approvalRequired: true };
}

export function markReadyForManualPublish(listingId: string, approval?: { approvedByCole?: boolean }) {
  ensureColeApproval(approval, "Cole approval required before marking listing ready for manual publish.");
  const listing = findListing(listingId);
  const readiness = calculatePublishReadiness(listing);
  if (!readiness.ready) throw new Error("Listing QA must pass before manual publish readiness.");
  listing.QAStatus = "Ready for Manual Publish";
  return listing;
}

function collectFailedChecks(listing: any): string[] {
  const failed: string[] = [];
  if (!listing.title && !listing.listingName) failed.push("title missing");
  if (!listing.description) failed.push("description missing");
  if (detectProductRisks(`${listing.title || ""} ${listing.description || ""} ${listing.claims || ""}`).length) failed.push("forbidden or risky claim");
  if (!rightsAreClear(listing.rightsStatus)) failed.push("rights status not clear");
  if (!listing.priceApproved) failed.push("price not approved");
  if (!listing.filesAttached) failed.push("files not attached");
  if (!listing.instructionsIncluded) failed.push("instructions missing");
  if (!listing.refundPolicyIncluded && !listing.revisionPolicyIncluded) failed.push("refund/revision policy missing");
  return failed;
}

function findListing(listingId: string) {
  const listing = listings.find((entry) => entry.id === listingId || entry.listingId === listingId);
  if (!listing) throw new Error(`Listing QA record ${listingId} not found.`);
  return listing;
}

