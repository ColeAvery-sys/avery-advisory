export type DetectedPattern = {
  patternTitle: string;
  category: string;
  evidence: string[];
  frequency: number;
  confidence: number;
  impact: string;
  recommendation: string;
  suggestedRuleChange: string;
  status: "Low Confidence" | "Suggested" | "Accepted" | "Rejected";
};

export function detectPatterns(data: Record<string, any[]>) {
  const detectedPatterns: DetectedPattern[] = [];
  const outcomes = data.outcomes || [];
  const tasks = data.tasks || [];
  const grants = data.grants || [];
  const clients = data.clients || [];

  addPattern(detectedPatterns, {
    category: "Money Patterns",
    evidence: outcomes.filter((outcome) => outcome.revenueImpact > 0).map((outcome) => outcome.id || outcome.actionTaken),
    title: "Positive revenue actions should be repeated before moonshots.",
    recommendation: "Prioritize actions similar to the recorded revenue wins.",
    suggestedRuleChange: "Boost priority for proven revenue paths.",
    impact: "money",
  });
  addPattern(detectedPatterns, {
    category: "Grant Patterns",
    evidence: grants.filter((grant) => /missing budget|budget/i.test(JSON.stringify(grant))).map((grant) => grant.id || grant.title),
    title: "Grant work stalls when budget documents are missing.",
    recommendation: "Create budget packet tasks before drafting final grant submissions.",
    suggestedRuleChange: "Require budget packet check for every grant.",
    impact: "funding",
  });
  addPattern(detectedPatterns, {
    category: "Client Patterns",
    evidence: clients.filter((client) => /warm|replied|interested/i.test(JSON.stringify(client))).map((client) => client.id || client.name),
    title: "Warm creator leads deserve priority over cold lists.",
    recommendation: "Rank warm creator follow-ups above broad cold outreach.",
    suggestedRuleChange: "Boost warm-response creator leads.",
    impact: "delivery and revenue",
  });
  addPattern(detectedPatterns, {
    category: "Distraction Patterns",
    evidence: tasks.filter((task) => /moonshot/i.test(JSON.stringify(task))).map((task) => task.id || task.title),
    title: "Moonshot work can distract when cash tasks are overdue.",
    recommendation: "Defer moonshots until daily cash and deadline tasks are clear.",
    suggestedRuleChange: "Lower moonshot priority when overdue cash tasks exist.",
    impact: "stability",
  });

  return {
    detectedPatterns,
    confidenceWarnings: detectedPatterns.filter((pattern) => pattern.status === "Low Confidence").map((pattern) => `${pattern.patternTitle} has limited evidence.`),
    recommendedRuleChanges: detectedPatterns.filter((pattern) => pattern.confidence >= 0.6).map((pattern) => pattern.suggestedRuleChange),
    suggestedStrategyUpdates: detectedPatterns.filter((pattern) => /money|funding|revenue/.test(pattern.impact)).map((pattern) => pattern.recommendation),
    logEntry: { loopName: "Pattern Detector", timestamp: new Date().toISOString(), summary: `Detected ${detectedPatterns.length} candidate patterns.` },
  };
}

function addPattern(patterns: DetectedPattern[], input: { category: string; evidence: string[]; title: string; recommendation: string; suggestedRuleChange: string; impact: string }) {
  if (input.evidence.length === 0) return;
  const confidence = Math.min(0.95, input.evidence.length / 4);
  patterns.push({
    patternTitle: input.title,
    category: input.category,
    evidence: input.evidence,
    frequency: input.evidence.length,
    confidence,
    impact: input.impact,
    recommendation: confidence >= 0.6 ? input.recommendation : `Low confidence: ${input.recommendation}`,
    suggestedRuleChange: input.suggestedRuleChange,
    status: confidence >= 0.6 ? "Suggested" : "Low Confidence",
  });
}
