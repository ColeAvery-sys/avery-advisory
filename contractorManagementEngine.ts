import { createWorkforceGate, detectWorkforceRisks, scoreWorkQuality, unique } from "./workforceSafety";

const contractors: any[] = [];

export function createContractorRecord(contractor: any) {
  const stored = { ...contractor, id: contractor.id || `contractor-${contractors.length + 1}`, qualityIndex: scoreWorkQuality(contractor), riskFlags: detectWorkforceRisks(contractor) };
  contractors.push(stored);
  return stored;
}

export function updateContractorAvailability(contractorId: string, availability: string) {
  const contractor = findContractor(contractorId);
  contractor.availability = availability;
  return contractor;
}

export function matchContractorToWork(work: any) {
  return contractors
    .map((contractor) => ({ contractor, fitScore: scoreFit(contractor, work) }))
    .sort((a, b) => b.fitScore - a.fitScore)
    .map((match) => ({ contractorId: match.contractor.id, contractorName: match.contractor.contractorName || match.contractor.name, fitScore: match.fitScore, approvalRequiredBeforeAssignment: true }));
}

export function generateContractorProfile(contractorId: string) {
  const contractor = findContractor(contractorId);
  const risks = detectWorkforceRisks(contractor);
  return {
    contractorId,
    skills: contractor.skills || [],
    preferredWorkTypes: contractor.preferredWorkTypes || [],
    pastProjects: contractor.pastProjects || [],
    rate: contractor.rate,
    ...createWorkforceGate("Contractor profile", risks),
  };
}

export function identifyContractorSkillCoverage() {
  return unique(contractors.reduce((skills: string[], contractor: any) => skills.concat(contractor.skills || []), []));
}

function scoreFit(contractor: any, work: any): number {
  const skills = contractor.skills || [];
  const needed = work.requiredSkills || [];
  const matches = needed.filter((skill: string) => skills.indexOf(skill) >= 0).length;
  return Math.round((matches / Math.max(1, needed.length)) * 70 + Math.min(30, contractor.qualityIndex || 0) * 0.3);
}

function findContractor(contractorId: string) {
  const contractor = contractors.find((item) => item.id === contractorId);
  if (!contractor) throw new Error(`Contractor ${contractorId} not found.`);
  return contractor;
}
