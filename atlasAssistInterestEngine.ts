export type AtlasAssistInterestForm = {
  name: string;
  email: string;
  userType: string;
  organization?: string;
  accessibilityInterest: string;
  supportNeed: string;
  consentToContact: boolean;
  notes?: string;
};

export function submitAtlasAssistInterest(form: AtlasAssistInterestForm) {
  validateAtlasAssistInterest(form);
  return {
    userType: classifyUserType(form),
    productInterestRecord: createProductInterestRecord(form),
    partnerOpportunity: createPartnerOpportunityIfRelevant(form),
    followUpDraft: generateSafeFollowUpDraft(form),
    complianceConcerns: flagSensitiveMedicalDetails(form),
  };
}

export function validateAtlasAssistInterest(form: AtlasAssistInterestForm): void {
  if (!form.name || !form.email || !form.consentToContact) throw new Error("ATLAS Assist interest requires name, email, and consent.");
  if (flagSensitiveMedicalDetails(form).length) throw new Error("Avoid collecting unnecessary sensitive medical details.");
}

export function classifyUserType(form: AtlasAssistInterestForm): string {
  const type = form.userType.toLowerCase();
  if (/caregiver|support/.test(type)) return "caregiver/support person";
  if (/clinic/.test(type)) return "clinic";
  if (/therapist|coach/.test(type)) return "therapist/coach";
  if (/advocate/.test(type)) return "disability advocate";
  if (/college|workforce/.test(type)) return "college/workforce program";
  if (/nonprofit/.test(type)) return "nonprofit";
  if (/individual/.test(type)) return "individual user";
  return "other";
}

export function createProductInterestRecord(form: AtlasAssistInterestForm) {
  return { name: form.name, email: form.email, product: "ATLAS Assist", userType: classifyUserType(form), status: "Needs Review" };
}

export function createPartnerOpportunityIfRelevant(form: AtlasAssistInterestForm) {
  return /clinic|therapist|coach|advocate|college|workforce|nonprofit/i.test(form.userType) ? { organization: form.organization, opportunityType: classifyUserType(form), approvalRequired: true } : undefined;
}

export function generateSafeFollowUpDraft(form: AtlasAssistInterestForm) {
  return { body: `Hi ${form.name}, thanks for your interest in ATLAS Assist. Cole will review before any follow-up is sent. ATLAS Assist is an organizational support concept, not medical care or emergency support.`, approvalRequired: true };
}

export function flagSensitiveMedicalDetails(form: AtlasAssistInterestForm): string[] {
  return /diagnosis|medication|medical record|patient name|therapy notes/i.test(`${form.supportNeed} ${form.notes}`) ? ["Potential sensitive medical details"] : [];
}
