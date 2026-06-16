export function createIntelligenceGate(actionType: string, confidence = 0.5) {
  return {
    actionType,
    confidence,
    approvalStatus: "Needs Cole Approval",
    recommendationOnly: true,
    cannotAutoChangeCompany: true,
  };
}

export function detectStrategicRisk(text: string): string[] {
  const value = text.toLowerCase();
  const risks: string[] = [];
  if (/strategy|pricing|price|hire|fire|policy|publish|financial|legal|contract|grant submit|spend|refund/.test(value)) risks.push("Company-changing recommendation requires approval.");
  if (/guarantee|guaranteed|certain|will win|will sell|will close/.test(value)) risks.push("Prediction must be framed as estimate, not guarantee.");
  if (/medical|therapy|diagnose|legal advice|financial advice/.test(value)) risks.push("Regulated claim risk.");
  return risks;
}

export function confidenceFromEvidence(count: number): number {
  if (count <= 0) return 0.2;
  return Math.min(0.95, Math.round((0.25 + count * 0.15) * 100) / 100);
}

export function label(item: any): string {
  return typeof item === "string" ? item : item?.title || item?.name || item?.memoryTitle || item?.projectName || item?.clientName || "Untitled";
}

export function countBy<T>(items: T[], getter: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const key = getter(item) || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

export function estimateProbability(scoreParts: number[]): number {
  if (!scoreParts.length) return 0.5;
  const average = scoreParts.reduce((sum, value) => sum + value, 0) / scoreParts.length;
  return Math.max(0.05, Math.min(0.95, Math.round(average * 100) / 100));
}

