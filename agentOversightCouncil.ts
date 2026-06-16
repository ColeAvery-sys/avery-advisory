import { createAgentGate, detectAgentRisks } from "./agentCivilizationSafety";

const reviews: any[] = [];
const defaultMembers = ["ATLAS", "SENTINEL", "ARCHIVE", "ORION", "CIRCUIT"];

export function createCouncilReview(review: any) {
  const riskFlags = detectAgentRisks(review);
  const stored = { ...review, id: review.id || `council-${reviews.length + 1}`, members: review.members || defaultMembers, riskFlags, status: "Open" };
  reviews.push(stored);
  return stored;
}

export function generateCouncilRecommendation(reviewId: string) {
  const review = findReview(reviewId);
  const riskFlags = detectAgentRisks(review);
  const recommendation = riskFlags.length ? "Delay or escalate to Cole" : review.recommendedAction || "Approve low-risk internal work";
  return {
    reviewId,
    members: review.members,
    recommendation,
    rationale: riskFlags.length ? riskFlags : ["Low-risk internal recommendation."],
    ...createAgentGate("Oversight council recommendation", riskFlags.concat(["Cole remains final authority."])),
  };
}

export function closeCouncilReview(reviewId: string, resolution: any) {
  const review = findReview(reviewId);
  review.status = resolution.status || "Closed";
  review.resolution = resolution;
  return review;
}

function findReview(reviewId: string) {
  const review = reviews.find((item) => item.id === reviewId);
  if (!review) throw new Error(`Council review ${reviewId} not found.`);
  return review;
}
