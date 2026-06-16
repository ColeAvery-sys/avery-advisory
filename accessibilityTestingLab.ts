import { createResearchGate, score10 } from "./researchInstituteSafety";

const tests: any[] = [];

export function createAccessibilityTest(test: any) {
  const stored = { ...test, id: test.id || `access-test-${tests.length + 1}`, status: test.status || "Planned" };
  tests.push(stored);
  return stored;
}

export function runAccessibilityScore(test: any) {
  const categories = ["navigation", "readability", "audio", "voiceControl", "executiveFunctionLoad", "visualClarity", "cognitiveLoad", "errorRecovery"];
  const scores = categories.map((category) => score10(test[category]));
  return Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length * 10);
}

export function generateUsabilityReport(test: any) {
  const score = runAccessibilityScore(test);
  return {
    productName: test.productName || test.projectName,
    accessibilityScore: score,
    recommendations: generateImprovementRecommendations(test),
    complianceNote: "Internal usability review only; do not claim formal compliance without professional audit.",
    ...createResearchGate("Accessibility usability report"),
  };
}

export function generateImprovementRecommendations(test: any) {
  const recs: string[] = [];
  if (score10(test.navigation) < 6) recs.push("Simplify navigation and keyboard flow.");
  if (score10(test.readability) < 6) recs.push("Increase readability and reduce text density.");
  if (score10(test.cognitiveLoad) < 6 || score10(test.executiveFunctionLoad) < 6) recs.push("Reduce cognitive load and choices per screen.");
  if (score10(test.errorRecovery) < 6) recs.push("Improve error recovery and plain-language guidance.");
  return recs.length ? recs : ["Continue testing with real users before expansion."];
}
