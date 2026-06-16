import { createRdGate, detectRdRisks, prototypeFirstStatus, scorePrototype } from "./rdSafety";

export function scorePrototypeIdea(item: any) {
  const finalScore = scorePrototype(item);
  const prototypeRule = prototypeFirstStatus(item);
  return {
    itemName: item.projectName || item.title || item.name,
    missionScore: item.missionScore || item.missionValue || 5,
    revenueScore: item.revenueScore || item.revenueValue || 5,
    accessibilityScore: item.accessibilityScore || item.accessibilityValue || 5,
    complexityScore: item.complexityScore || item.complexity || 5,
    maintenanceCost: item.maintenanceCost || 5,
    developmentTime: item.developmentTime || item.timeCost || 5,
    riskScore: item.riskScore || item.risk || 5,
    finalScore,
    finalRecommendation: recommendFromScore(finalScore, prototypeRule),
    prototypeFirst: prototypeRule,
    ...createRdGate("Prototype scoring", detectRdRisks(item)),
  };
}

export function comparePrototypes(items: any[]) {
  return items.map(scorePrototypeIdea).sort((a, b) => b.finalScore - a.finalScore);
}

export function enforcePrototypeFirstRule(item: any) {
  const status = prototypeFirstStatus(item);
  return {
    itemName: item.projectName || item.title || item.name,
    allowedNextStage: status.blockedFromFullDevelopment ? "Research or Prototype" : "Proceed cautiously",
    blockedFromFullDevelopment: status.blockedFromFullDevelopment,
    missing: [
      status.researchRequired ? "Research" : "",
      status.prototypeRequired ? "Prototype" : "",
      status.validationRequired ? "Validation" : "",
    ].filter(Boolean),
    rule: status.rule,
  };
}

function recommendFromScore(score: number, rule: any): "Build" | "Prototype" | "Research" | "Archive" {
  if (rule.blockedFromFullDevelopment || rule.researchRequired) return "Research";
  if (rule.prototypeRequired || rule.validationRequired) return "Prototype";
  if (score >= 75) return "Build";
  if (score >= 55) return "Prototype";
  if (score >= 35) return "Research";
  return "Archive";
}
