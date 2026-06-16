export function createResearchGate(actionType: string, riskFlags: string[] = []) {
  return {
    actionType,
    riskFlags,
    approvalStatus: riskFlags.length ? "Needs Cole Approval" : "Draft",
    recommendationOnly: true,
    cannotProvideMedicalAdviceApproveStudiesOrSubmitGrants: true,
  };
}

export function detectResearchRisks(item: any): string[] {
  const text = JSON.stringify(item || {}).toLowerCase();
  const risks: string[] = [];
  if (/medical advice|diagnose|diagnosis|treatment|therapy|clinical claim|efficacy|cure|proven/.test(text)) risks.push("Medical, clinical, or efficacy claim requires professional review.");
  if (/approve study|irb|human subjects|consent process|participant data/.test(text)) risks.push("Study approval and consent process require Cole/professional review.");
  if (/submit grant|grant submission|federal grant|state grant|budget request/.test(text)) risks.push("Grant submission requires Cole approval.");
  if (/medical record|diagnosis tracking|protected health|phi|hipaa/.test(text)) risks.push("Do not store medical records, diagnosis tracking, or protected health information.");
  return risks;
}

export function evidenceBeforeExpansionStatus(item: any) {
  const stage = String(item.stage || item.status || "").toLowerCase();
  const hasResearch = Boolean(item.researchComplete || item.researchStatus === "Complete" || /research|prototype|pilot|outcome|grant ready/.test(stage));
  const hasPrototype = Boolean(item.prototypeComplete || item.prototypeStatus === "Complete" || /prototype|pilot|outcome|grant ready/.test(stage));
  const hasPilot = Boolean(item.pilotComplete || item.pilotStatus === "Complete" || /pilot|outcome|grant ready/.test(stage));
  const hasOutcomes = Boolean(item.outcomesMeasured || item.outcomeStatus === "Measured" || /outcome|grant ready/.test(stage));
  const hasGrantReadiness = Boolean(item.grantReady || item.grantStatus === "Ready" || /grant ready/.test(stage));
  const scaleRequested = /scale|large investment|production|public launch/.test(stage);
  return {
    researchRequired: !hasResearch,
    prototypeRequired: !hasPrototype,
    pilotRequired: !hasPilot,
    outcomeMeasurementRequired: !hasOutcomes,
    grantReadinessRequired: !hasGrantReadiness,
    blockedFromScale: scaleRequested && (!hasResearch || !hasPrototype || !hasPilot || !hasOutcomes || !hasGrantReadiness),
    rule: "Research -> Prototype -> Pilot -> Outcome Measurement -> Grant Readiness -> Scale.",
  };
}

export function scoreMissionFit(item: any): number {
  const accessibility = score10(item.accessibilityValue || item.accessibilityFit);
  const evidence = score10(item.evidenceStrength || item.outcomeQuality);
  const partner = score10(item.partnerFit || item.partnershipPotential);
  const grant = score10(item.grantFit || item.fundingPotential);
  const riskPenalty = detectResearchRisks(item).length * 10;
  return Math.max(0, Math.min(100, Math.round((accessibility * 2.5 + evidence * 2 + partner * 1.5 + grant * 1.5) * 6 - riskPenalty)));
}

export function score10(value: any): number {
  if (typeof value === "number") return Math.max(0, Math.min(10, value));
  if (/high|strong|ready|complete|excellent/i.test(value || "")) return 8;
  if (/medium|partial|some|moderate/i.test(value || "")) return 5;
  if (/low|weak|missing|none/i.test(value || "")) return 2;
  return 5;
}

export function researchLabel(item: any): string {
  return item.projectName || item.programName || item.title || item.name || item.grantName || item.organization || "Untitled Research Item";
}
