export type DealStage =
  | "New Lead"
  | "Qualified"
  | "Discovery Needed"
  | "Discovery Scheduled"
  | "Proposal Drafting"
  | "Proposal Sent Manually"
  | "Negotiating"
  | "Verbal Yes"
  | "Awaiting Payment"
  | "Active Client"
  | "Won"
  | "Lost"
  | "Paused";

export type DealRecord = {
  id: string;
  dealName: string;
  contact: string;
  organization?: string;
  offer: string;
  estimatedValue: number;
  probability?: number;
  expectedCloseDate?: string;
  stage: DealStage;
  nextAction?: string;
  lastContacted?: string;
  followUpDate?: string;
  proposalStatus?: string;
  quoteStatus?: string;
  paymentStatus?: string;
  riskLevel?: string;
  notes?: string;
};

const deals: DealRecord[] = [];

export function createDeal(deal: DealRecord): DealRecord {
  const stored = { ...deal, probability: deal.probability || calculateDealProbability(deal) };
  deals.push(stored);
  return stored;
}

export function updateDealStage(dealId: string, stage: DealStage): DealRecord {
  const deal = findDeal(dealId);
  deal.stage = stage;
  deal.probability = calculateDealProbability(deal);
  return deal;
}

export function calculateDealProbability(deal: DealRecord): number {
  const map: Record<string, number> = {
    "New Lead": 0.1,
    Qualified: 0.25,
    "Discovery Needed": 0.2,
    "Discovery Scheduled": 0.35,
    "Proposal Drafting": 0.45,
    "Proposal Sent Manually": 0.55,
    Negotiating: 0.65,
    "Verbal Yes": 0.8,
    "Awaiting Payment": 0.85,
    "Active Client": 0.95,
    Won: 1,
    Lost: 0,
    Paused: 0.1,
  };
  return map[deal.stage] || 0.1;
}

export function getDealsByStage(stage: DealStage): DealRecord[] {
  return deals.filter((deal) => deal.stage === stage);
}

export function getFollowUpDeals(date: string): DealRecord[] {
  return deals.filter((deal) => !!deal.followUpDate && deal.followUpDate <= date && deal.stage !== "Won" && deal.stage !== "Lost");
}

export function markDealWon(dealId: string, approval: { approvedByCole: boolean }): DealRecord {
  if (!approval.approvedByCole) throw new Error("Cole approval required before marking a deal won.");
  const deal = findDeal(dealId);
  deal.stage = "Won";
  deal.probability = 1;
  return deal;
}

export function markDealLost(dealId: string, reason: string): DealRecord {
  const deal = findDeal(dealId);
  deal.stage = "Lost";
  deal.probability = 0;
  deal.notes = `${deal.notes || ""} Lost reason: ${reason}`.trim();
  return deal;
}

export function generateNextDealAction(dealId: string) {
  const deal = findDeal(dealId);
  const action = deal.stage === "New Lead" ? "Qualify budget, timeline, decision maker, and fit." : deal.nextAction || "Draft next client-facing step for Cole approval.";
  return { dealId, action, weightedRevenue: Math.round(deal.estimatedValue * calculateDealProbability(deal)), approvalRequired: true };
}

export function clearDealsForDemo(): void {
  deals.length = 0;
}

function findDeal(dealId: string): DealRecord {
  const deal = deals.find((entry) => entry.id === dealId);
  if (!deal) throw new Error(`Deal ${dealId} not found.`);
  return deal;
}
