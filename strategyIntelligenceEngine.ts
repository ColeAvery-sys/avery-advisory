export function generateStrategyReview(data: Record<string, any>) {
  const money = data.moneyPipeline || [];
  const grants = data.grants || [];
  const products = data.products || [];
  const blockers = data.blockers || [];
  const patterns = data.patterns || [];
  const bestRevenuePath = pickTop(money, "Creator Logistics revenue");
  const bestFundingPath = pickTop(grants, "Accessibility-first AI for independent living");
  const bestProductPath = pickTop(products.filter((product: any) => /atlas|creator logistics|assist/i.test(JSON.stringify(product))), "ATLAS HQ infrastructure");
  const biggestWasteOfTime = pickLow(products, "Unproven moonshot work");
  const biggestRisk = label(blockers[0]) || "Approval or cash-flow delay";
  const recommendedStrategyShift = `Double down on ${bestRevenuePath}, protect ${bestFundingPath}, and keep ${bestProductPath} moving. Pause ${biggestWasteOfTime} until evidence improves.`;

  return {
    currentStrategySummary: data.currentStrategy || "No strategy provided.",
    whatIsWorking: patterns.filter((pattern: any) => /money|revenue|funding|client/i.test(pattern.impact || pattern.category || "")).map(label),
    whatIsNotWorking: [...blockers.map(label), biggestWasteOfTime],
    bestRevenuePath,
    bestFundingPath,
    bestProductPath,
    biggestWasteOfTime,
    biggestRisk,
    recommendedStrategyShift,
    confidence: patterns.length >= 3 ? 0.75 : 0.5,
    decisionItems: [{ title: "Approve or reject recommended strategy shift", approvalRequired: true, reason: "Risky strategy changes require Cole approval." }],
    actionItems: [`Advance ${bestRevenuePath}`, `Prepare next funding step for ${bestFundingPath}`, `Move next build task for ${bestProductPath}`],
    logEntry: { loopName: "Strategy Intelligence", timestamp: new Date().toISOString(), summary: "Generated strategy review with explicit approval requirement." },
  };
}

function pickTop(items: any[], fallback: string): string {
  return label([...items].sort((a, b) => (b.score || b.revenueImpact || 0) - (a.score || a.revenueImpact || 0))[0]) || fallback;
}

function pickLow(items: any[], fallback: string): string {
  return label([...items].sort((a, b) => (a.score || 50) - (b.score || 50))[0]) || fallback;
}

function label(item: any): string {
  return typeof item === "string" ? item : item?.patternTitle || item?.title || item?.name || "";
}
