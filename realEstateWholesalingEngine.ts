import { createHqGate, detectHqRisks } from "./physicalHqSafety";

export type WholesalingStage =
  | "New Lead"
  | "Underwriting"
  | "Appointment Set"
  | "Offer Drafting"
  | "Offer Sent for Approval"
  | "Under Contract"
  | "Buyer Marketing"
  | "Assignment Ready"
  | "Closed"
  | "Dead"
  | "Paused";

export type WholesalingLeadInput = {
  id?: string;
  propertyName: string;
  address: string;
  sellerName?: string;
  contactSource?: string;
  askingPrice: number;
  arv: number;
  repairEstimate: number;
  desiredAssignmentFee?: number;
  distressLevel?: number;
  speedToClose?: number;
  accessScore?: number;
  titleClarity?: number;
  buyerDemand?: number;
  notes?: string;
  stage?: WholesalingStage;
};

export type WholesalingLeadRecord = WholesalingLeadInput & {
  id: string;
  stage: WholesalingStage;
  spread: number;
  maxOffer: number;
  recommendedOffer: number;
  score: number;
  riskFlags: string[];
  approvalGate: ReturnType<typeof createHqGate>;
  approvalRequiredBeforeOfferOrMarketing: boolean;
  nextAction: string;
};

const wholesalingLeads: WholesalingLeadRecord[] = [];

export function createWholesalingLead(lead: WholesalingLeadInput): WholesalingLeadRecord {
  const spread = calculateSpread(lead);
  const maxOffer = calculateMaximumAllowableOffer(lead);
  const recommendedOffer = clampOffer(lead.askingPrice, maxOffer);
  const riskFlags = detectHqRisks(lead).concat([
    "Wholesaling offers, assignments, and buyer outreach require Cole approval.",
  ]);
  const stored: WholesalingLeadRecord = {
    ...lead,
    id: lead.id || `wholesale-${wholesalingLeads.length + 1}`,
    stage: lead.stage || "New Lead",
    spread,
    maxOffer,
    recommendedOffer,
    score: scoreWholesalingLead(lead),
    riskFlags,
    approvalGate: createHqGate("Wholesaling lead review", riskFlags),
    approvalRequiredBeforeOfferOrMarketing: true,
    nextAction: "Underwrite the deal, validate title and access, then draft an offer for Cole approval.",
  };
  wholesalingLeads.push(stored);
  return stored;
}

export function scoreWholesalingLead(lead: WholesalingLeadInput): number {
  const spread = calculateSpread(lead);
  const spreadRatio = lead.arv > 0 ? spread / lead.arv : 0;
  const distress = score10(lead.distressLevel);
  const speed = score10(lead.speedToClose);
  const access = score10(lead.accessScore);
  const title = score10(lead.titleClarity);
  const demand = score10(lead.buyerDemand);
  const riskPenalty = detectHqRisks(lead).length * 6;
  const rawScore = 12 + spreadRatio * 240 + distress * 4 + speed * 3.5 + access * 3 + title * 4 + demand * 3;
  return clampNumber(Math.round(rawScore - riskPenalty), 0, 100);
}

export function calculateSpread(lead: Pick<WholesalingLeadInput, "askingPrice" | "arv" | "repairEstimate">): number {
  return Math.max(0, Math.round(lead.arv - lead.askingPrice - lead.repairEstimate));
}

export function calculateMaximumAllowableOffer(
  lead: Pick<WholesalingLeadInput, "arv" | "repairEstimate" | "desiredAssignmentFee">
): number {
  const assignmentFeeBuffer = clampNumber(Math.round(lead.desiredAssignmentFee ?? 10000), 0, Number.MAX_SAFE_INTEGER);
  return Math.max(0, Math.round(lead.arv * 0.7 - lead.repairEstimate - assignmentFeeBuffer));
}

export function rankWholesalingLeads() {
  return wholesalingLeads
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((lead) => ({
      id: lead.id,
      propertyName: lead.propertyName,
      address: lead.address,
      stage: lead.stage,
      score: lead.score,
      spread: lead.spread,
      maxOffer: lead.maxOffer,
      recommendedOffer: lead.recommendedOffer,
      approvalRequiredBeforeOfferOrMarketing: true,
    }));
}

export function generateWholesalingOfferDraft(leadId: string) {
  const lead = findWholesalingLead(leadId);
  return {
    leadId: lead.id,
    propertyName: lead.propertyName,
    address: lead.address,
    askingPrice: lead.askingPrice,
    arv: lead.arv,
    repairEstimate: lead.repairEstimate,
    assignmentFeeTarget: Math.round(lead.desiredAssignmentFee ?? 10000),
    maxOffer: lead.maxOffer,
    recommendedOffer: lead.recommendedOffer,
    approvalRequired: true,
    sendStatus: "Draft Only",
    nextAction: "Obtain Cole approval before any offer, signature, or buyer-facing outreach.",
  };
}

export function generateWholesalingDueDiligence(leadId: string) {
  const lead = findWholesalingLead(leadId);
  return {
    leadId: lead.id,
    propertyName: lead.propertyName,
    checklist: [
      "Seller authority and decision maker confirmed",
      "Title search and liens reviewed",
      "Comparable sales support the ARV",
      "Repair estimate validated",
      "Access for inspection confirmed",
      "Assignment clause reviewed",
      "Cash buyer exit plan mapped",
      "Closing timeline fits seller urgency",
    ],
    approvalGate: lead.approvalGate,
    approvalRequiredBeforeOfferOrMarketing: true,
  };
}

export function getWholesalingLeadById(leadId: string): WholesalingLeadRecord {
  return findWholesalingLead(leadId);
}

export function clearWholesalingLeadsForDemo(): void {
  wholesalingLeads.length = 0;
}

function findWholesalingLead(leadId: string): WholesalingLeadRecord {
  const lead = wholesalingLeads.find((entry) => entry.id === leadId);
  if (!lead) throw new Error(`Wholesaling lead ${leadId} not found.`);
  return lead;
}

function score10(value: number | undefined): number {
  return clampNumber(Math.round(Number(value ?? 5)), 0, 10);
}

function clampOffer(askingPrice: number, maxOffer: number): number {
  return clampNumber(Math.min(Math.round(askingPrice), Math.round(maxOffer)), 0, Number.MAX_SAFE_INTEGER);
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
