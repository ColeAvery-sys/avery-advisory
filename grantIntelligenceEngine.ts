import { createResearchGate, detectResearchRisks, score10 } from "./researchInstituteSafety";

const grants: any[] = [];

export function createGrantRecord(grant: any) {
  const stored = { ...grant, id: grant.id || `grant-${grants.length + 1}`, probabilityScore: calculateGrantProbability(grant), priorityScore: calculateGrantPriority(grant), riskFlags: detectResearchRisks(grant) };
  grants.push(stored);
  return stored;
}

export function calculateGrantProbability(grant: any) {
  return Math.round((score10(grant.eligibility) * 0.35 + score10(grant.missionFit) * 0.3 + score10(grant.requirementsReadiness) * 0.25 + score10(grant.partnerFit) * 0.1) * 10);
}

export function calculateGrantPriority(grant: any) {
  const award = Number(grant.awardSize || 0) > 50000 ? 10 : Number(grant.awardSize || 0) > 10000 ? 7 : 4;
  return Math.min(100, Math.round(calculateGrantProbability(grant) * 0.7 + award * 3));
}

export function rankGrants() {
  return grants.slice().sort((a, b) => b.priorityScore - a.priorityScore).map((grant) => ({
    grantName: grant.grantName,
    sponsor: grant.sponsor,
    probabilityScore: grant.probabilityScore,
    priorityScore: grant.priorityScore,
    approvalRequiredBeforeSubmission: true,
  }));
}

export function generateGrantReadinessPacket(grantId: string) {
  const grant = findGrant(grantId);
  return {
    grantName: grant.grantName,
    requirements: grant.requirements || [],
    missingItems: grant.missingItems || ["Outcome data", "Pilot summary", "Budget narrative"],
    recommendation: "Prepare materials; do not submit without Cole approval.",
    ...createResearchGate("Grant readiness packet", ["Grant submission requires Cole approval."]),
  };
}

function findGrant(grantId: string) {
  const grant = grants.find((entry) => entry.id === grantId);
  if (!grant) throw new Error(`Grant ${grantId} not found.`);
  return grant;
}
