export function createHqGate(actionType: string, riskFlags: string[] = []) {
  return {
    actionType,
    riskFlags,
    approvalStatus: riskFlags.length ? "Needs Cole Approval" : "Draft",
    recommendationOnly: true,
    cannotBuyLeaseHireSpendOrBuild: true,
  };
}

export function detectHqRisks(item: any): string[] {
  const text = JSON.stringify(item || {}).toLowerCase();
  const risks: string[] = [];
  if (/buy property|purchase property|acquire|mortgage|lease|sign/.test(text)) risks.push("Property purchase, lease, or signature requires Cole approval.");
  if (/contractor|construction|renovation|buildout|permit/.test(text)) risks.push("Contractor, construction, or permit decisions require Cole approval.");
  if (/spend|budget|deposit|down payment|loan|debt|payment/.test(text)) risks.push("Spending or debt requires Cole approval.");
  if (/safety|emergency|hazard|fire|electrical|security/.test(text)) risks.push("Safety issue requires review.");
  return risks;
}

export function hqBeforeEmpireStatus(item: any) {
  const revenueReady = Boolean(item.revenueReady || Number(item.monthlyRevenue || 0) >= Number(item.requiredMonthlyRevenue || 1));
  const teamReady = Boolean(item.teamReady || Number(item.teamSize || 0) >= Number(item.requiredTeamSize || 1));
  const capacityNeed = Boolean(item.capacityNeed || Number(item.currentCapacityUse || 0) >= 80);
  const expansionRequested = /expand|larger space|new hq|buy|lease|scale/i.test(`${item.stage || ""} ${item.request || ""} ${item.recommendation || ""}`);
  return {
    revenueRequired: !revenueReady,
    teamRequired: !teamReady,
    capacityNeedRequired: !capacityNeed,
    blockedFromExpansion: expansionRequested && (!revenueReady || !teamReady || !capacityNeed),
    rule: "Revenue -> Team -> Capacity Need -> Expansion. Not Dream -> Debt.",
  };
}

export function scorePropertyFit(property: any): number {
  const mission = score10(property.missionFit);
  const affordability = score10(property.affordability);
  const accessibility = score10(property.accessibility);
  const expansion = score10(property.expansionPotential);
  const location = score10(property.location);
  const infrastructure = score10(property.infrastructure || property.internetAvailability);
  const riskPenalty = detectHqRisks(property).length * 8;
  return Math.max(0, Math.min(100, Math.round((mission * 1.8 + affordability * 2 + accessibility * 1.8 + expansion * 1.2 + location + infrastructure * 1.2) * 7 - riskPenalty)));
}

export function score10(value: any): number {
  if (typeof value === "number") return Math.max(0, Math.min(10, value));
  if (/high|strong|excellent|ready|good/i.test(value || "")) return 8;
  if (/medium|partial|some|ok/i.test(value || "")) return 5;
  if (/low|weak|poor|missing|none/i.test(value || "")) return 2;
  return 5;
}

export function hqLabel(item: any): string {
  return item.propertyName || item.areaName || item.studioName || item.assetName || item.spaceName || item.vehicleName || item.planName || item.name || "Untitled HQ Item";
}
