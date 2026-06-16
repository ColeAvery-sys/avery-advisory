export type QualityReview = { id: string; contractorName: string; projectName: string; submittedWorkLink?: string; deadlineMet?: boolean; instructionsFollowed?: boolean; technicalQuality?: number; creativeQuality?: number; fileOrganization?: number; clientReadiness?: number; revisionNeeded?: boolean; score?: number; reviewNotes?: string; approvedForClient?: boolean; paymentApprovalStatus?: string; missingFiles?: boolean; privateInfoExposed?: boolean };
const reviews: QualityReview[] = [];

export function createQualityReview(submission: QualityReview): QualityReview {
  const stored = { ...submission, score: scoreContractorSubmission(submission).score, approvedForClient: false, paymentApprovalStatus: "Needs Cole Approval" };
  reviews.push(stored);
  return stored;
}

export function generateQualityChecklist(project: Record<string, any>): string[] {
  return ["correct format", "correct length", "clear audio", "clean cuts", "captions checked if required", "client instructions followed", "assets organized", "no missing files", "no copyright issue", "no private/internal info exposed", "export settings correct"];
}

export function scoreContractorSubmission(review: QualityReview) {
  const score = Math.max(0, Math.round(((review.technicalQuality || 5) + (review.creativeQuality || 5) + (review.fileOrganization || 5) + (review.clientReadiness || 5)) * 2.5 - (review.missingFiles ? 25 : 0) - (review.privateInfoExposed ? 40 : 0)));
  return { score, passed: score >= 75 && !review.missingFiles && !review.privateInfoExposed, approvalRequired: true };
}

export function requestContractorRevision(reviewId: string, reason: string) {
  const review = findReview(reviewId);
  review.revisionNeeded = true;
  review.reviewNotes = `${review.reviewNotes || ""} Revision requested: ${reason}`.trim();
  return review;
}

export function approveForColeReview(reviewId: string) {
  const review = findReview(reviewId);
  if (!scoreContractorSubmission(review).passed) throw new Error("QC must pass before Cole review.");
  review.approvedForClient = false;
  review.reviewNotes = `${review.reviewNotes || ""} Ready for Cole review.`.trim();
  return review;
}

export function flagContractorIssue(reviewId: string) {
  const review = findReview(reviewId);
  review.reviewNotes = `${review.reviewNotes || ""} Contractor issue flagged.`.trim();
  return review;
}

export function sendPaymentToApproval(reviewId: string) {
  const review = findReview(reviewId);
  review.paymentApprovalStatus = "Sent to Cole Approval";
  return { reviewId, approvalRequired: true, reason: "Contractor payment requires Cole approval." };
}

function findReview(reviewId: string): QualityReview {
  const review = reviews.find((entry) => entry.id === reviewId);
  if (!review) throw new Error(`Quality review ${reviewId} not found.`);
  return review;
}
