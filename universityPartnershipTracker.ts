import { createResearchGate } from "./researchInstituteSafety";

const universityPartners: any[] = [];

export function createUniversityPartner(partner: any) {
  const stored = { ...partner, id: partner.id || `university-${universityPartners.length + 1}`, status: partner.status || "Prospect" };
  universityPartners.push(stored);
  return stored;
}

export function logUniversityMeeting(partnerId: string, meeting: any) {
  const partner = findPartner(partnerId);
  partner.meetings = [...(partner.meetings || []), meeting];
  return partner;
}

export function identifyUniversityOpportunities() {
  return universityPartners.map((partner) => ({
    organization: partner.organization,
    opportunities: partner.partnershipOpportunities || partner.researchInterests || ["Pilot collaboration", "Student project", "Grant partner"],
    approvalRequiredBeforeOutreach: true,
  }));
}

export function generateUniversityOutreachBrief(partnerId: string) {
  const partner = findPartner(partnerId);
  return {
    organization: partner.organization,
    contacts: partner.contacts || [],
    researchInterests: partner.researchInterests || [],
    suggestedAsk: "Explore accessibility research/pilot collaboration.",
    ...createResearchGate("University outreach brief", ["External partner outreach requires Cole approval."]),
  };
}

function findPartner(partnerId: string) {
  const partner = universityPartners.find((entry) => entry.id === partnerId);
  if (!partner) throw new Error(`University partner ${partnerId} not found.`);
  return partner;
}
