export function createPlatformAction(actionType: string, riskWarnings: string[] = []) {
  return {
    draftStatus: "Draft",
    approvalStatus: "Needs Cole Approval",
    riskWarnings,
    platformPolicyWarning: "Check platform rules before manual publishing.",
    manualPublishOnly: true,
    actionType,
  };
}

export function detectRightsRisks(text: string): string[] {
  const value = text.toLowerCase();
  const warnings: string[] = [];
  if (/disney|marvel|pokemon|nintendo|star wars|harry potter|trademark|copyright/.test(value)) warnings.push("Potential trademark/copyright risk.");
  if (/guarantee|guaranteed|make money|viral|rank #1|cure|medical treatment/.test(value)) warnings.push("Potential misleading or prohibited claim.");
  if (/fake review|fake engagement|astroturf/.test(value)) warnings.push("Fake engagement/review risk.");
  return warnings;
}

export function seoScore(parts: string[]): number {
  const text = parts.join(" ").trim();
  const lengthScore = Math.min(40, Math.round(text.length / 8));
  const keywordScore = /\b(creator|atlas|averytech|editing|workflow|accessibility|content|system|planner|demo)\b/i.test(text) ? 35 : 15;
  const ctaScore = /\b(request|learn|download|order|book|start|visit|demo|intake)\b/i.test(text) ? 25 : 10;
  return Math.min(100, lengthScore + keywordScore + ctaScore);
}

export function ensureApproved(status?: string): void {
  if (status !== "Approved") throw new Error("Cole approval required before marking platform-facing item published/uploaded manually.");
}
