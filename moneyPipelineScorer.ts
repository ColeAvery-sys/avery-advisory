import { clamp, daysUntil, effortInverseScore, round, scoreFromDays } from "./atlasUtils";

export type MoneyOpportunity = {
  title: string;
  type: string;
  amountPotential: number;
  probability: number;
  timeToCashDays: number;
  effortRequired: number;
  strategicValue: number;
  requiresColeApproval: boolean;
  deadline?: string;
};

export type MoneyOpportunityScore = {
  expectedValue: number;
  speedScore: number;
  effortScore: number;
  strategicScore: number;
  totalScore: number;
  rankLabel: string;
  recommendation: string;
  nextAction: string;
};

export function scoreMoneyOpportunity(item: MoneyOpportunity): MoneyOpportunityScore {
  const expectedValue = round(item.amountPotential * item.probability, 2);
  const expectedValueScore = clamp((expectedValue / Math.max(item.amountPotential, 1)) * 100, 0, 100);
  const speedScore = round(scoreFromDays(item.timeToCashDays, 7, 90));
  const effortScore = round(effortInverseScore(item.effortRequired));
  const strategicScore = round(clamp(item.strategicValue * 10, 0, 100));
  const urgencyBoost = getDeadlineUrgencyBoost(item.deadline);
  const grantAdjustment = getGrantAdjustment(item);

  const totalScore = round(
    clamp(expectedValueScore * 0.35 + speedScore * 0.25 + effortScore * 0.2 + strategicScore * 0.2 + urgencyBoost + grantAdjustment, 0, 100),
  );

  return {
    expectedValue,
    speedScore,
    effortScore,
    strategicScore,
    totalScore,
    rankLabel: getRankLabel(totalScore),
    recommendation: getRecommendation(item, totalScore),
    nextAction: getNextAction(item, totalScore),
  };
}

function getDeadlineUrgencyBoost(deadline?: string): number {
  const days = daysUntil(deadline);
  if (days === undefined) return 0;
  if (days < 0) return -10;
  if (days <= 3) return 10;
  if (days <= 14) return 6;
  return 0;
}

function getGrantAdjustment(item: MoneyOpportunity): number {
  if (!item.type.toLowerCase().includes("grant")) return 0;
  if (item.probability >= 0.65 && item.amountPotential >= 10000) return 5;
  return -8;
}

function getRankLabel(score: number): string {
  if (score >= 80) return "Top Priority";
  if (score >= 65) return "Strong";
  if (score >= 45) return "Watch";
  return "Low Priority";
}

function getRecommendation(item: MoneyOpportunity, score: number): string {
  if (item.requiresColeApproval) return "Prepare for Cole approval before any external or financial action.";
  if (score >= 80) return "Move immediately because this has strong cash timing and upside.";
  if (score >= 65) return "Advance this week after confirming the next conversion step.";
  if (score >= 45) return "Keep warm, but do not let it block faster cash.";
  return "Defer unless new information improves probability or speed.";
}

function getNextAction(item: MoneyOpportunity, score: number): string {
  if (item.requiresColeApproval) return "Create a short approval brief with amount, risk, deadline, and recommended action.";
  if (score >= 65) return "Schedule the next outreach, invoice, proposal, or delivery step today.";
  return "Log the opportunity and revisit during weekly review.";
}
