import { clamp, daysUntil, round } from "./atlasUtils";

export type ClientLead = {
  name: string;
  platform: string;
  niche: string;
  budget: number;
  contentVolume: number;
  urgency: number;
  responseStatus: string;
  fitForCreatorLogistics: number;
  probability: number;
  nextFollowUpDate?: string;
};

export type ClientLeadScore = {
  leadScore: number;
  statusRecommendation: string;
  packageRecommendation: string;
  nextAction: string;
  followUpUrgency: string;
  riskFlags: string[];
};

export function scoreClientLead(lead: ClientLead): ClientLeadScore {
  const budgetScore = lead.budget >= 750 ? 100 : clamp((lead.budget / 750) * 100, 0, 100);
  const volumeScore = clamp(lead.contentVolume * 5, 0, 100);
  const responseScore = getResponseScore(lead.responseStatus);
  const fitScore = clamp(lead.fitForCreatorLogistics * 10, 0, 100);
  const urgencyScore = clamp(lead.urgency * 10, 0, 100);
  const followUpBoost = getFollowUpBoost(lead.nextFollowUpDate);

  const leadScore = round(clamp(budgetScore * 0.25 + volumeScore * 0.2 + responseScore * 0.2 + fitScore * 0.2 + urgencyScore * 0.1 + lead.probability * 100 * 0.05 + followUpBoost, 0, 100));
  const riskFlags = getRiskFlags(lead);

  return {
    leadScore,
    statusRecommendation: leadScore >= 75 ? "Pursue now" : leadScore >= 55 ? "Follow up" : "Nurture or pause",
    packageRecommendation: getPackageRecommendation(lead),
    nextAction: getClientNextAction(lead, leadScore),
    followUpUrgency: getFollowUpUrgency(lead.nextFollowUpDate),
    riskFlags,
  };
}

function getResponseScore(status: string): number {
  const normalized = status.toLowerCase();
  if (normalized.includes("warm") || normalized.includes("interested")) return 100;
  if (normalized.includes("replied") || normalized.includes("opened")) return 75;
  if (normalized.includes("cold")) return 35;
  return 50;
}

function getFollowUpBoost(date?: string): number {
  const days = daysUntil(date);
  if (days === undefined) return 0;
  if (days <= 0) return 10;
  if (days <= 2) return 5;
  return 0;
}

function getFollowUpUrgency(date?: string): string {
  const days = daysUntil(date);
  if (days === undefined) return "No follow-up date set";
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days <= 2) return "Soon";
  return "Scheduled";
}

function getPackageRecommendation(lead: ClientLead): string {
  if (lead.contentVolume >= 20 || /monthly|ongoing|operator/i.test(lead.niche)) return "Operator";
  if (lead.contentVolume >= 10 || lead.budget >= 750) return "Growth";
  return "Starter";
}

function getClientNextAction(lead: ClientLead, score: number): string {
  if (score >= 75) return "Prepare a client-safe proposal draft for Cole approval.";
  if (lead.nextFollowUpDate) return "Send a follow-up draft to Cole for review.";
  return "Set a follow-up date and clarify budget, volume, and delivery needs.";
}

function getRiskFlags(lead: ClientLead): string[] {
  const risks: string[] = [];
  if (lead.budget < 500) risks.push("low budget");
  if (lead.probability < 0.4) risks.push("low probability");
  if (lead.fitForCreatorLogistics < 6) risks.push("weak logistics fit");
  if (/cold|no response/i.test(lead.responseStatus)) risks.push("cold response");
  return risks;
}
