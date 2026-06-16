export type MissionItem = {
  title: string;
  description: string;
  category: string;
  fastCashPotential: number;
  atlasHqValue: number;
  atlasAssistValue: number;
  grantFundingValue: number;
  salesMarketingValue: number;
  clientDeliveryValue: number;
  creativeAssetValue: number;
  distractionRisk: number;
  timeCost: number;
  overwhelmCost: number;
};

export function scoreMissionAlignment(item: MissionItem) {
  const positive =
    item.fastCashPotential * 0.22 +
    item.clientDeliveryValue * 0.18 +
    item.atlasHqValue * 0.16 +
    item.atlasAssistValue * 0.14 +
    item.grantFundingValue * 0.12 +
    item.salesMarketingValue * 0.1 +
    item.creativeAssetValue * 0.08;
  const penalty = item.distractionRisk * 0.25 + item.timeCost * 0.2 + item.overwhelmCost * 0.25;
  const supportBoost = item.creativeAssetValue >= 7 && (item.salesMarketingValue >= 8 || item.clientDeliveryValue >= 8 || item.atlasAssistValue >= 8) && item.distractionRisk <= 5 ? 45 : 0;
  const missionAlignmentScore = clamp(Math.round((positive - penalty + 3) * 10) + supportBoost);
  const missionSupport = item.fastCashPotential + item.salesMarketingValue + item.atlasAssistValue + item.clientDeliveryValue + item.atlasHqValue + item.grantFundingValue;
  const creativeWithoutMission = item.creativeAssetValue >= 7 && missionSupport < 8;
  const shouldArchive = missionAlignmentScore < 35 || creativeWithoutMission;
  const shouldDoNow = missionAlignmentScore >= 60 && item.distractionRisk <= 6 && item.overwhelmCost <= 7;
  const shouldScheduleLater = !shouldDoNow && !shouldArchive;

  return {
    missionAlignmentScore,
    distractionRisk: item.distractionRisk >= 8 ? "High" : item.distractionRisk >= 5 ? "Medium" : "Low",
    recommendedPriority: shouldDoNow ? "Do Now" : shouldScheduleLater ? "Schedule Later" : "Archive",
    shouldDoNow,
    shouldScheduleLater,
    shouldArchive,
    reason: reasonFor(item, missionAlignmentScore, creativeWithoutMission),
    recommendedNextAction: shouldDoNow ? "Create the next concrete task today." : shouldScheduleLater ? "Schedule a clear next action after cash/client/grant priorities." : "Archive as an idea until it supports the main mission.",
  };
}

function reasonFor(item: MissionItem, score: number, creativeWithoutMission: boolean): string {
  if (creativeWithoutMission) return "Creative value is high, but it does not clearly support cash, marketing, demo, product development, or funding.";
  if (item.fastCashPotential >= 8 || item.clientDeliveryValue >= 8) return "Fast cash or client delivery value is strong.";
  if (item.atlasHqValue >= 8 || item.atlasAssistValue >= 8) return "Core ATLAS infrastructure or ATLAS Assist value is strong.";
  if (score < 35) return "Distraction, time, or overwhelm cost is too high for the current mission.";
  return "Useful, but not urgent enough to displace cash, client, grant, or ATLAS infrastructure work.";
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
