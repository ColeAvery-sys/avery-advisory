export type LeadMagnetRecord = {
  id: string;
  title: string;
  category: string;
  description: string;
};

export type LeadMagnetRequest = {
  email: string;
  name: string;
  interestCategory: string;
  selectedLeadMagnet: string;
  consentToContact: boolean;
  notes?: string;
};

const leadMagnets: LeadMagnetRecord[] = [];

export function createLeadMagnetRecord(leadMagnet: LeadMagnetRecord): LeadMagnetRecord {
  leadMagnets.push(leadMagnet);
  return leadMagnet;
}

export function submitLeadMagnetRequest(form: LeadMagnetRequest) {
  validateConsent(form);
  if (/diagnosis|medical record|patient/i.test(form.notes || "")) throw new Error("Avoid sensitive medical details.");
  return {
    crmContact: createLeadMagnetCrmContact(form),
    tags: tagLeadMagnetInterest(form),
    followUpDraft: generateLeadMagnetFollowUpDraft(form),
  };
}

export function validateConsent(form: LeadMagnetRequest): void {
  if (!form.email || !form.consentToContact) throw new Error("Lead magnet request requires email and consent.");
}

export function createLeadMagnetCrmContact(form: LeadMagnetRequest) {
  return { name: form.name, email: form.email, source: "Lead Magnet", interestCategory: form.interestCategory };
}

export function tagLeadMagnetInterest(form: LeadMagnetRequest): string[] {
  return ["lead-magnet", form.interestCategory.toLowerCase().replace(/\W+/g, "-"), form.selectedLeadMagnet.toLowerCase().replace(/\W+/g, "-")];
}

export function generateLeadMagnetFollowUpDraft(form: LeadMagnetRequest) {
  return { body: `Hi ${form.name}, thanks for requesting ${form.selectedLeadMagnet}. Cole will review before any email is sent.`, approvalRequired: true };
}

export function clearLeadMagnetsForDemo(): void {
  leadMagnets.length = 0;
}
