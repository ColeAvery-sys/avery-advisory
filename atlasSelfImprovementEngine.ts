export function generateAtlasSelfImprovementReport(data: Record<string, any[]>) {
  const recommendations = data.recommendations || [];
  const outcomes = data.outcomes || [];
  const failedRuns = data.failedRuns || [];
  const userCorrections = data.userCorrections || [];
  const blockedTasks = data.blockedTasks || [];
  const errorLogs = data.errorLogs || [];
  const featureRequests = data.featureRequests || [];

  const badRecommendations = recommendations.filter((recommendation) =>
    outcomes.some((outcome) => (outcome.relatedRecommendation === recommendation.id || outcome.relatedDecision === recommendation.id) && /Failed|Wasted|Lost|No Response|Blocked/i.test(outcome.resultType || outcome.actualOutcome || "")),
  );
  const goodRecommendations = recommendations.filter((recommendation) =>
    outcomes.some((outcome) => (outcome.relatedRecommendation === recommendation.id || outcome.relatedDecision === recommendation.id) && /Won|Saved|Progress|Worked|Client Won/i.test(outcome.resultType || outcome.actualOutcome || "")),
  );

  return {
    whatAtlasHelpedWith: goodRecommendations.map(label),
    whatAtlasMissed: [...blockedTasks, ...failedRuns].map(label),
    badRecommendations: badRecommendations.map(label),
    goodRecommendations: goodRecommendations.map(label),
    bottlenecks: blockedTasks.map(label),
    missingData: findMissingData(data),
    brokenWorkflows: failedRuns.concat(errorLogs).map(label),
    repeatedUserCorrections: findRepeated(userCorrections.map(label)),
    suggestedSystemImprovements: [
      "Improve scoring with measured outcomes before expanding autonomy.",
      "Add clearer approval routing for risky strategy changes.",
      "Reduce workflow friction where repeated corrections appear.",
    ],
    suggestedCodexTasks: ["Add tests for repeated failure patterns.", "Create safer scoring-version audit helpers."],
    suggestedCursorTasks: featureRequests.map((request) => `Improve UI for ${label(request)}`),
    logEntry: { loopName: "ATLAS Self-Improvement", timestamp: new Date().toISOString(), summary: "Generated honest self-improvement report from recorded failures, corrections, and outcomes." },
  };
}

function findMissingData(data: Record<string, any[]>): string[] {
  return Object.entries(data).filter(([, values]) => values.length === 0).map(([key]) => key);
}

function findRepeated(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) || 0) + 1);
  return Array.from(counts.entries()).filter(([, count]) => count > 1).map(([value]) => value);
}

function label(item: any): string {
  return typeof item === "string" ? item : item?.title || item?.name || item?.summary || item?.id || "";
}
