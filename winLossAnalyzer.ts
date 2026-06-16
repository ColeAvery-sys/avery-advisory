import { confidenceFromEvidence, countBy, createIntelligenceGate } from "./companyIntelligenceSafety";

export function analyzeWinsLosses(data: any) {
  const wins = (data.records || []).filter((record: any) => /won|sold|approved|success|published manually|closed/i.test(record.outcome || record.status || ""));
  const losses = (data.records || []).filter((record: any) => /lost|failed|denied|no response|refunded|blocked/i.test(record.outcome || record.status || ""));
  return {
    wins,
    losses,
    successPatterns: detectOutcomePatterns(wins),
    failurePatterns: detectOutcomePatterns(losses),
    recommendations: generateWinLossRecommendations(wins, losses),
    ...createIntelligenceGate("Win/loss analysis", confidenceFromEvidence(wins.length + losses.length)),
  };
}

export function detectOutcomePatterns(records: any[]) {
  return {
    byChannel: countBy(records, (record: any) => record.channel || record.source),
    byOffer: countBy(records, (record: any) => record.offer || record.product || record.service),
    byAudience: countBy(records, (record: any) => record.audience || record.clientType),
  };
}

export function generateWinLossRecommendations(wins: any[], losses: any[]) {
  const recommendations: string[] = [];
  if (wins.length > losses.length) recommendations.push("Do more of the channels/offers represented in recent wins.");
  if (losses.length) recommendations.push("Review losses before repeating similar offers, pricing, or timelines.");
  if (!wins.length && !losses.length) recommendations.push("Track outcomes before changing strategy.");
  return recommendations;
}

