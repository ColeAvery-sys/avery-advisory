export type ScoringVersion = {
  versionId: string;
  scoringSystem: string;
  weights: Record<string, number>;
  reason: string;
  createdAt: string;
  status: "Active" | "Archived";
};

const versions: ScoringVersion[] = [];

export function analyzeScoringAccuracy(scoringSystem: string, recommendations: any[], outcomes: any[]) {
  const joined = recommendations.map((recommendation) => {
    const outcome = outcomes.find((item) => item.relatedRecommendation === recommendation.id || item.relatedDecision === recommendation.id);
    return { recommendation, outcome };
  });
  const misses = joined.filter(({ recommendation, outcome }) => outcome && recommendation.score >= 70 && /Failed|Lost|Wasted|No Response|Blocked/i.test(outcome.resultType || outcome.actualOutcome || ""));
  return {
    scoringSystem,
    sampleSize: joined.length,
    misses: misses.length,
    accuracy: joined.length === 0 ? 0 : Math.round(((joined.length - misses.length) / joined.length) * 100) / 100,
    reason: "Accuracy compares high-scored recommendations against measured outcomes. Low sample sizes reduce confidence.",
    confidence: joined.length >= 5 ? 0.75 : 0.35,
  };
}

export function suggestWeightUpdates(scoringSystem: string, analysis: any) {
  const suggestedWeightChanges: Record<string, number> =
    analysis.misses > 0 ? { moonshotPenalty: 0.1, provenRevenueWeight: 0.1 } : { provenPatternWeight: 0.05 };

  return {
    scoringSystem,
    suggestedWeightChanges,
    reason: analysis.misses > 0 ? "High-scored recommendations produced weak outcomes, so reduce overvalued speculative work and boost proven revenue evidence." : "Current scoring looks acceptable, but proven patterns can receive a small boost.",
    confidence: analysis.confidence,
    status: "Needs Cole Approval",
  };
}

export function applyWeightUpdate(scoringSystem: string, update: { weights: Record<string, number>; reason: string }, approval: { approvedByCole: boolean }): ScoringVersion {
  if (!approval.approvedByCole) throw new Error("Cole approval required before changing core scoring rules.");
  for (const version of versions.filter((item) => item.scoringSystem === scoringSystem)) version.status = "Archived";
  const version = saveScoringVersion(scoringSystem, update.weights, update.reason);
  version.status = "Active";
  return version;
}

export function revertWeightUpdate(scoringSystem: string, versionId: string): ScoringVersion {
  const version = versions.find((item) => item.scoringSystem === scoringSystem && item.versionId === versionId);
  if (!version) throw new Error(`Version ${versionId} not found.`);
  for (const item of versions.filter((candidate) => candidate.scoringSystem === scoringSystem)) item.status = "Archived";
  version.status = "Active";
  return version;
}

export function saveScoringVersion(scoringSystem: string, weights: Record<string, number> = {}, reason = "Manual save"): ScoringVersion {
  const version = { versionId: `version-${versions.length + 1}`, scoringSystem, weights, reason, createdAt: new Date().toISOString(), status: "Archived" as const };
  versions.push(version);
  return version;
}

export function clearScoringVersionsForDemo(): void {
  versions.length = 0;
}
