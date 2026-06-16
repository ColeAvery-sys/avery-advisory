export type ClinicPartnerForm = {
  organizationName: string;
  contactName: string;
  role: string;
  email: string;
  website?: string;
  populationServed?: string;
  currentPainPoints: string;
  accessibilityNeeds: string;
  interestInPilot: boolean;
  interestInResearch: boolean;
  interestInReferral: boolean;
  budgetRange?: string;
  complianceConcerns?: string;
  notes?: string;
};

export function submitClinicPartnerIntake(form: ClinicPartnerForm) {
  validateClinicPartnerIntake(form);
  return {
    partnerContact: createPartnerContact(form),
    atlasAssistOpportunity: createAtlasAssistOpportunity(form),
    summary: generatePartnerSummary(form),
    followUpDraft: generateFollowUpDraft(form),
    complianceConcerns: flagComplianceConcerns(form),
    notifications: [{ agent: "ATLAS Product Manager" }, { agent: "ATLAS Grant Officer" }],
  };
}

export function validateClinicPartnerIntake(form: ClinicPartnerForm): void {
  if (!form.organizationName || !form.contactName || !form.email) throw new Error("Clinic partner intake requires organization, contact, and email.");
}

export function createPartnerContact(form: ClinicPartnerForm) {
  return { name: form.contactName, organization: form.organizationName, role: form.role, email: form.email, relationshipType: "Clinic/Disability Partner" };
}

export function createAtlasAssistOpportunity(form: ClinicPartnerForm) {
  return { title: `${form.organizationName} ATLAS Assist opportunity`, interests: { pilot: form.interestInPilot, research: form.interestInResearch, referral: form.interestInReferral }, status: "Needs Review" };
}

export function generatePartnerSummary(form: ClinicPartnerForm): string {
  return `${form.organizationName} is interested in accessibility support. Avoid medical claims, clinical approval language, and outcome promises.`;
}

export function generateFollowUpDraft(form: ClinicPartnerForm) {
  return { body: `Hi ${form.contactName}, thanks for sharing your accessibility needs. Cole will review before any follow-up is sent. We will not make clinical claims or promise outcomes.`, approvalRequired: true };
}

export function flagComplianceConcerns(form: ClinicPartnerForm): string[] {
  const concerns: string[] = [];
  if (form.complianceConcerns) concerns.push(form.complianceConcerns);
  if (/diagnosis|medical record|patient name|hipaa/i.test(`${form.notes} ${form.currentPainPoints}`)) concerns.push("Potential sensitive medical details. Minimize collection and review before use.");
  return concerns;
}
