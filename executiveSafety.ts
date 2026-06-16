export const MASTER_PRIORITY_TIERS = [
  { tier: 1, label: "Creator Logistics Revenue / Client Fulfillment / Cash Flow", keywords: ["creator logistics", "client", "cash", "revenue", "invoice", "fulfillment"], weight: 100 },
  { tier: 2, label: "ATLAS HQ / Executive Systems / Easy Mode", keywords: ["atlas hq", "executive", "easy mode", "approval", "company os"], weight: 85 },
  { tier: 3, label: "ATLAS Assist / Accessibility / Grant Readiness", keywords: ["atlas assist", "accessibility", "grant", "pilot", "disability"], weight: 75 },
  { tier: 4, label: "Media Baron / Content Studio / Audience Growth", keywords: ["media", "content", "audience", "youtube", "new prometheus"], weight: 60 },
  { tier: 5, label: "Digital Products / Books / Merch", keywords: ["digital product", "book", "kdp", "etsy", "merch"], weight: 45 },
  { tier: 6, label: "Godot / Blender / 3D Printing / Smart Glasses", keywords: ["godot", "blender", "3d printing", "smart glasses"], weight: 25 },
  { tier: 7, label: "Experimental Ideas", keywords: ["experiment", "side quest", "moonshot"], weight: 10 },
];

export function classifyPriorityTier(item: any) {
  const text = `${item.title || item.name || item.goalName || ""} ${item.category || ""} ${item.description || ""}`.toLowerCase();
  return MASTER_PRIORITY_TIERS.find((tier) => tier.keywords.some((keyword) => text.indexOf(keyword) >= 0)) || MASTER_PRIORITY_TIERS[6];
}

export function executiveRiskFlags(item: any): string[] {
  const text = `${item.title || item.name || ""} ${item.description || ""} ${item.notes || ""}`.toLowerCase();
  const flags: string[] = [];
  if (/legal|contract|tax|loan|compliance|lawsuit/.test(text)) flags.push("Legal/compliance approval required.");
  if (/payment|invoice|spend|price|refund|cash|money|contractor pay/.test(text)) flags.push("Financial approval required.");
  if (/publish|public|client|customer|email|send|grant submit|hire|fire/.test(text)) flags.push("External or irreversible action approval required.");
  if (/burnout|crisis|overwhelm|missed deadline|emergency/.test(text)) flags.push("Executive bandwidth or crisis risk.");
  return flags;
}

export function scoreExecutiveItem(item: any): number {
  const tier = classifyPriorityTier(item);
  const revenue = Number(item.revenue || item.estimatedValue || item.cashValue || 0) > 0 ? 20 : 0;
  const urgency = Math.min(20, Number(item.urgency || item.priority || 0) * 2);
  const mission = Math.min(15, Number(item.missionValue || item.atlasValue || item.grantValue || 0) * 1.5);
  const overwhelmPenalty = Math.min(25, Number(item.overwhelmCost || 0) * 2 + Number(item.distractionRisk || 0) * 2);
  const timePenalty = Math.min(10, Number(item.timeRequired || 0));
  return Math.max(0, Math.min(100, tier.weight + revenue + urgency + mission - overwhelmPenalty - timePenalty));
}

export function label(item: any): string {
  return typeof item === "string" ? item : item?.title || item?.name || item?.goalName || item?.projectName || "Untitled";
}

export function approvalRequired(item: any): boolean {
  return executiveRiskFlags(item).length > 0 || /needs cole|approval/i.test(`${item.approvalStatus || ""}`);
}

export function pickTop(items: any[], limit: number): any[] {
  return items.slice().sort((a, b) => scoreExecutiveItem(b) - scoreExecutiveItem(a)).slice(0, limit);
}

