export const RD_PRIORITY_TIERS = [
  { tier: 1, label: "ATLAS HQ / ATLAS Assist / EchoFrame / Creator Logistics Tools", keywords: ["atlas hq", "atlas assist", "echoframe", "creator logistics"], weight: 90 },
  { tier: 2, label: "Jax Mission Control / Executive Dysfunction App / Accessibility Utilities", keywords: ["jax mission control", "executive dysfunction", "accessibility utility", "accessibility utilities"], weight: 75 },
  { tier: 3, label: "Smart Glasses / Voice Systems / Research Projects", keywords: ["smart glasses", "voice", "research"], weight: 60 },
  { tier: 4, label: "Godot / VR / 3D Printing / Blender Assets", keywords: ["godot", "vr", "3d printing", "blender"], weight: 40 },
  { tier: 5, label: "Experimental Entertainment Projects", keywords: ["experimental", "entertainment", "game concept"], weight: 20 },
];

export function createRdGate(actionType: string, riskFlags: string[] = []) {
  return {
    actionType,
    riskFlags,
    approvalStatus: riskFlags.length ? "Needs Cole Approval" : "Draft",
    recommendationOnly: true,
    cannotDeployReleaseOrderSpendOrApproveClaims: true,
  };
}

export function detectRdRisks(item: any): string[] {
  const text = JSON.stringify(item || {}).toLowerCase();
  const risks: string[] = [];
  if (/deploy|production|release|launch|publish/.test(text)) risks.push("Production deployment or product release requires Cole approval.");
  if (/order|buy|purchase|hardware|printer|material|spend|budget/.test(text)) risks.push("Hardware, material, or spending action requires Cole approval.");
  if (/research claim|clinical|medical|proven|guarantee|evidence shows|study proves/.test(text)) risks.push("Research or health/accessibility claims require review.");
  if (/security|privacy|personal data|client data|sensitive/.test(text)) risks.push("Security/privacy review required.");
  return risks;
}

export function classifyRdPriority(item: any) {
  const text = JSON.stringify(item || {}).toLowerCase();
  return RD_PRIORITY_TIERS.find((tier) => tier.keywords.some((keyword) => text.indexOf(keyword) >= 0)) || RD_PRIORITY_TIERS[4];
}

export function prototypeFirstStatus(item: any) {
  const stage = String(item.stage || item.status || "").toLowerCase();
  const hasResearch = Boolean(item.researchSummary || item.researchComplete || item.researchStatus === "Complete");
  const hasPrototype = Boolean(item.prototypeStatus === "Validated" || item.prototypeValidated || /prototype|pilot|validated/.test(stage));
  const fullProduction = /full production|production|release|launch/.test(stage);
  const blocked = fullProduction && (!hasResearch || !hasPrototype);
  return {
    researchRequired: !hasResearch,
    prototypeRequired: !hasPrototype,
    validationRequired: !hasPrototype,
    blockedFromFullDevelopment: blocked,
    rule: "Research -> Prototype -> Validation before full development.",
  };
}

export function scorePrototype(item: any): number {
  const mission = score10(item.missionScore ?? item.missionValue);
  const revenue = score10(item.revenueScore ?? item.revenueValue);
  const accessibility = score10(item.accessibilityScore ?? item.accessibilityValue);
  const complexity = score10(item.complexityScore ?? item.complexity);
  const maintenance = score10(item.maintenanceCost);
  const time = score10(item.developmentTime ?? item.timeCost);
  const risk = score10(item.riskScore ?? item.risk);
  const tier = classifyRdPriority(item).weight / 10;
  return Math.max(0, Math.min(100, Math.round((mission * 2.2 + revenue * 1.4 + accessibility * 2 + tier * 1.5 - complexity * 1.1 - maintenance - time * 0.8 - risk) * 6)));
}

export function score10(value: any): number {
  if (typeof value === "number") return Math.max(0, Math.min(10, value));
  if (/high|strong|validated|complete|ready/i.test(value || "")) return 8;
  if (/medium|partial|some/i.test(value || "")) return 5;
  if (/low|weak|missing|none/i.test(value || "")) return 2;
  return 5;
}

export function rdLabel(item: any): string {
  return item.projectName || item.name || item.title || item.featureTitle || item.experimentName || item.assetName || "Untitled R&D Item";
}
