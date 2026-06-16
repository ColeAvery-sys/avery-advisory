import { createResearchGate, detectResearchRisks } from "./researchInstituteSafety";

const healthcarePartners: any[] = [];

export function createHealthcarePartner(partner: any) {
  const stored = { ...partner, id: partner.id || `healthcare-${healthcarePartners.length + 1}`, status: partner.status || "Prospect", riskFlags: detectResearchRisks(partner) };
  healthcarePartners.push(stored);
  return stored;
}

export function logHealthcareMeeting(partnerId: string, meeting: any) {
  const partner = findPartner(partnerId);
  partner.meetings = [...(partner.meetings || []), meeting];
  return partner;
}

export function identifyHealthcarePilotPotential() {
  return healthcarePartners.map((partner) => ({
    organization: partner.organization,
    pilotPotential: partner.pilotPotential || "Needs discovery",
    interests: partner.interests || [],
    clinicalClaimsAllowed: false,
    approvalRequiredBeforeOutreach: true,
  }));
}

export function generateHealthcareOutreachBrief(partnerId: string) {
  const partner = findPartner(partnerId);
  return {
    organization: partner.organization,
    contacts: partner.contacts || [],
    interests: partner.interests || [],
    suggestedAsk: "Discuss non-clinical accessibility pilot feedback opportunities.",
    ...createResearchGate("Healthcare outreach brief", detectResearchRisks(partner).concat(["Healthcare partner outreach requires Cole approval."])),
  };
}

function findPartner(partnerId: string) {
  const partner = healthcarePartners.find((entry) => entry.id === partnerId);
  if (!partner) throw new Error(`Healthcare partner ${partnerId} not found.`);
  return partner;
}
