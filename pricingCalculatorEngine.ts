export type QuoteInput = {
  serviceType: string;
  numberOfVideos?: number;
  numberOfShortClips?: number;
  deadline?: string;
  rush?: boolean;
  complexity: number;
  captionsNeeded?: boolean;
  uploadCalendarNeeded?: boolean;
  scriptRepurposingNeeded?: boolean;
  contractorNeeded?: boolean;
  estimatedHours: number;
  desiredMargin: number;
  clientBudget?: number;
  revisionRisk: number;
};

export function calculateQuote(input: QuoteInput) {
  const packageRecommendation = recommendPackage(input);
  const base = basePrice(packageRecommendation);
  const complexityFee = input.complexity * 45;
  const clipFee = (input.numberOfShortClips || 0) * 18;
  const videoFee = (input.numberOfVideos || 0) * 90;
  const addOns = (input.captionsNeeded ? 125 : 0) + (input.uploadCalendarNeeded ? 150 : 0) + (input.scriptRepurposingNeeded ? 175 : 0);
  const contractorFee = input.contractorNeeded ? 250 : 0;
  const rushFee = input.rush ? Math.round((base + clipFee + videoFee) * 0.25) : 0;
  const laborFloor = Math.round(input.estimatedHours * 50 * (1 + input.desiredMargin));
  const recommendedPrice = Math.max(base + complexityFee + clipFee + videoFee + addOns + contractorFee + rushFee, laborFloor);
  const riskWarnings = getQuoteWarnings(input, recommendedPrice);

  return {
    suggestedPriceLow: Math.round(recommendedPrice * 0.85),
    suggestedPriceHigh: Math.round(recommendedPrice * 1.2),
    recommendedPrice: Math.round(recommendedPrice),
    packageRecommendation,
    marginEstimate: Math.round(recommendedPrice - input.estimatedHours * 50 - contractorFee),
    rushFee,
    riskWarnings,
    scopeNotes: [
      "Final client-facing price requires Cole approval.",
      "Scope should define deliverables, revision limits, and turnaround assumptions.",
    ],
    approvalRequired: true,
  };
}

function recommendPackage(input: QuoteInput): string {
  if (/operator|monthly/i.test(input.serviceType)) return "Operator";
  if ((input.numberOfShortClips || 0) >= 20 || (input.numberOfVideos || 0) >= 2) return "Growth";
  if (/custom|consult/i.test(input.serviceType)) return "Custom";
  return "Starter";
}

function basePrice(pkg: string): number {
  if (pkg === "Starter") return 350;
  if (pkg === "Growth") return 950;
  if (pkg === "Operator") return 2400;
  return 1200;
}

function getQuoteWarnings(input: QuoteInput, price: number): string[] {
  const warnings: string[] = [];
  if (input.clientBudget && input.clientBudget < price * 0.8) warnings.push("Client budget may underprice the work.");
  if (input.rush) warnings.push("Rush timeline should add a fee and scope control.");
  if (input.revisionRisk >= 7) warnings.push("High revision risk. Clarify revision policy before quoting.");
  if (input.contractorNeeded) warnings.push("Contractor cost should be reviewed before final pricing.");
  if (input.complexity >= 8) warnings.push("High complexity. Scope may be unclear.");
  return warnings;
}
