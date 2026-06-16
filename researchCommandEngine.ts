import { createResearchGate, detectResearchRisks, evidenceBeforeExpansionStatus, researchLabel, scoreMissionFit } from "./researchInstituteSafety";

const researchEfforts: any[] = [];

export function createResearchEffort(effort: any) {
  const stored = { ...effort, id: effort.id || `research-effort-${researchEfforts.length + 1}`, evidenceStatus: evidenceBeforeExpansionStatus(effort), riskFlags: detectResearchRisks(effort) };
  researchEfforts.push(stored);
  return stored;
}

export function generateResearchCommandCenter(data: any = {}) {
  const efforts = data.efforts || researchEfforts;
  const blocked = efforts.filter((effort: any) => evidenceBeforeExpansionStatus(effort).blockedFromScale || detectResearchRisks(effort).length);
  return {
    totalEfforts: efforts.length,
    research: efforts.filter((effort: any) => /research/i.test(effort.stage || effort.status || "")).map(researchLabel),
    recruiting: efforts.filter((effort: any) => /recruit/i.test(effort.stage || effort.status || "")).map(researchLabel),
    pilot: efforts.filter((effort: any) => /pilot/i.test(effort.stage || effort.status || "")).map(researchLabel),
    testing: efforts.filter((effort: any) => /testing/i.test(effort.stage || effort.status || "")).map(researchLabel),
    analysis: efforts.filter((effort: any) => /analysis|outcome/i.test(effort.stage || effort.status || "")).map(researchLabel),
    publication: efforts.filter((effort: any) => /publication/i.test(effort.stage || effort.status || "")).map(researchLabel),
    grantReady: efforts.filter((effort: any) => /grant ready/i.test(effort.stage || effort.status || "")).map(researchLabel),
    blockedFromScale: blocked.map(researchLabel),
    topPriorities: efforts.slice().sort((a: any, b: any) => scoreMissionFit(b) - scoreMissionFit(a)).slice(0, 3).map(researchLabel),
    recommendation: generateResearchRecommendation(efforts),
    ...createResearchGate("Research command recommendation", ["Research priorities and external claims require approval."]),
  };
}

export function generateResearchRecommendation(efforts: any[]) {
  if (!efforts.length) return "Create research efforts for ATLAS Assist, EchoFrame, and Executive Dysfunction Tools.";
  if (efforts.some((effort) => evidenceBeforeExpansionStatus(effort).blockedFromScale)) return "Move scale requests back to pilot/outcome measurement before expansion.";
  return `Focus on evidence gathering for ${researchLabel(efforts.slice().sort((a, b) => scoreMissionFit(b) - scoreMissionFit(a))[0])}.`;
}
