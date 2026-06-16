import { createWorkforceGate, scoreWorkQuality } from "./workforceSafety";

export function createPerformanceReview(person: any, data: any) {
  const score = scoreWorkQuality({ ...person, ...data });
  return {
    personId: person.id || person.personId,
    personName: person.name || person.editorName || person.contractorName,
    reviewScore: score,
    summary: score >= 80 ? "Strong performance with room for focused growth." : score >= 60 ? "Solid but needs targeted improvement." : "Needs support, clearer scope, or reassignment review.",
    strengths: identifyStrengths(data),
    weaknesses: identifyWeaknesses(data),
    trainingSuggestions: generateTrainingSuggestions(data),
    approvalRequiredForDisciplineOrCompChange: true,
    ...createWorkforceGate("Performance review", ["Reviews cannot discipline, terminate, or change compensation without Cole approval."]),
  };
}

export function identifyStrengths(data: any) {
  const strengths: string[] = [];
  if (Number(data.qualityScore || 0) >= 8) strengths.push("Quality");
  if (Number(data.reliabilityScore || 0) >= 8) strengths.push("Reliability");
  if (Number(data.communicationScore || 0) >= 8) strengths.push("Communication");
  return strengths.length ? strengths : ["Needs more evidence"];
}

export function identifyWeaknesses(data: any) {
  const weaknesses: string[] = [];
  if (Number(data.qualityScore || 10) < 6) weaknesses.push("Quality");
  if (Number(data.reliabilityScore || 10) < 6) weaknesses.push("Reliability");
  if (Number(data.communicationScore || 10) < 6) weaknesses.push("Communication");
  return weaknesses;
}

export function generateTrainingSuggestions(data: any) {
  return identifyWeaknesses(data).map((weakness) => `Assign ${weakness} improvement module.`);
}
