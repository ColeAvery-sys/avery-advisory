export type GrantPartnerForm = {
  organizationName: string;
  contactName: string;
  email: string;
  website?: string;
  organizationType: string;
  fundingOrPartnershipType: string;
  amountRange?: string;
  eligibilityNotes?: string;
  deadline?: string;
  requiredDocuments: string[];
  interestArea: string;
  accessibilityFocus?: string;
  notes?: string;
};

export function submitGrantPartnerIntake(form: GrantPartnerForm) {
  validateGrantPartnerIntake(form);
  const score = scoreFundingFit(form);
  return {
    funderContact: createFunderContact(form),
    grantWarRoomItem: createGrantWarRoomItem(form),
    score,
    summary: generateGrantPartnerSummary(form, score),
    followUpDraft: generateFunderFollowUpDraft(form),
    notification: { agent: "ATLAS Grant Officer", title: `New grant partner intake: ${form.organizationName}` },
  };
}

export function validateGrantPartnerIntake(form: GrantPartnerForm): void {
  if (!form.organizationName || !form.contactName || !form.email) throw new Error("Grant partner intake requires organization, contact, and email.");
}

export function createFunderContact(form: GrantPartnerForm) {
  return { name: form.contactName, organization: form.organizationName, email: form.email, relationshipType: "Grant Contact", tags: [form.organizationType, form.interestArea] };
}

export function createGrantWarRoomItem(form: GrantPartnerForm) {
  return { title: form.organizationName, deadline: form.deadline, requiredDocuments: form.requiredDocuments, status: "Needs Review" };
}

export function scoreFundingFit(form: GrantPartnerForm): number {
  let score = 40;
  if (/accessibility|disability|independent living/i.test(`${form.interestArea} ${form.accessibilityFocus}`)) score += 30;
  if (form.amountRange && !/unknown/i.test(form.amountRange)) score += 10;
  if (form.deadline) score += 10;
  if (/eligible|fit/i.test(form.eligibilityNotes || "")) score += 10;
  return Math.min(100, score);
}

export function generateGrantPartnerSummary(form: GrantPartnerForm, score: number): string {
  return `${form.organizationName} funding fit score: ${score}/100. No application, follow-up, or partnership terms are automatic.`;
}

export function generateFunderFollowUpDraft(form: GrantPartnerForm) {
  return { body: `Hi ${form.contactName}, thanks for sharing information about ${form.organizationName}. Cole will review before any follow-up or partnership discussion is sent.`, approvalRequired: true };
}
