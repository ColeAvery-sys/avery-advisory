import { executiveRiskFlags, label, pickTop, scoreExecutiveItem } from "./executiveSafety";

export function generateExecutiveCommandCenter(data: any) {
  const allItems = [...(data.tasks || []), ...(data.projects || []), ...(data.opportunities || [])];
  const topThree = pickTop(allItems, 3);
  const risks = [...(data.risks || []), ...allItems.filter((item) => executiveRiskFlags(item).length > 0)];
  const opportunities = pickTop(data.opportunities || [], 3);
  return {
    topThree,
    biggestRisk: label(pickTop(risks, 1)[0]) || "No major risk logged.",
    biggestOpportunity: label(opportunities[0]) || "No opportunity logged.",
    cashStatus: data.cashStatus || "Unknown",
    clientStatus: data.clientStatus || "Unknown",
    productStatus: data.productStatus || "Unknown",
    grantStatus: data.grantStatus || "Unknown",
    contentStatus: data.contentStatus || "Unknown",
    communityStatus: data.communityStatus || "Unknown",
    todaysDecisions: data.decisions || [],
    atlasRecommendation: topThree[0] ? `Do ${label(topThree[0])} first. Keep today's priorities to three or fewer.` : "Create today's top three before opening new work.",
  };
}

export function createExecutiveActionItems(commandCenter: any) {
  return (commandCenter.topThree || []).map((item: any) => ({ title: `Executive priority: ${label(item)}`, score: scoreExecutiveItem(item), approvalRequired: false }));
}

