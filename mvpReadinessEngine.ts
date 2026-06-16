export function calculateMvpReadiness(product: Record<string, any>, data: Record<string, any>) {
  const missingCoreFeatures = data.missingCoreFeatures || [];
  const blockingBugs = (data.bugs || []).filter((bug: any) => /Critical|High/.test(bug.severity || ""));
  const unresolvedRisks = (data.risks || []).filter((risk: any) => !/Resolved|Mitigated/.test(risk.status || ""));
  const requiredDocs = data.requiredDocs || [];
  let score = 100;
  if (!data.coreFlowWorks) score -= 25;
  if (!data.dataSavesCorrectly) score -= 20;
  score -= missingCoreFeatures.length * 8;
  score -= blockingBugs.length * 18;
  score -= unresolvedRisks.length * 10;
  if (!data.privacyReviewed) score -= 10;
  if (!data.accessibilityReviewed) score -= 10;
  if (requiredDocs.length) score -= requiredDocs.length * 4;
  const readinessScore = Math.max(0, Math.min(100, score));
  return {
    productName: product.productName || product.name,
    readinessScore,
    status: statusForScore(readinessScore, product),
    missingCoreFeatures,
    blockingBugs,
    unresolvedRisks,
    requiredDocs,
    demoNeeded: !data.demoScriptExists,
    recommendation: readinessScore >= 70 ? "Prepare demo approval package." : "Fix missing core flow, QA, privacy, accessibility, and blocker items first.",
    approvalRequired: /Public|Client|Pilot|Grant|Funder/i.test(statusForScore(readinessScore, product)),
  };
}

function statusForScore(score: number, product: Record<string, any>): string {
  if (score < 40) return "Not Ready";
  if (score < 60) return "Internal Alpha";
  if (score < 75) return "Demo Ready";
  if (/client/i.test(product.targetUse || "")) return "Client Ready";
  if (/public/i.test(product.targetUse || "")) return "Public Ready";
  return "Pilot Ready";
}
