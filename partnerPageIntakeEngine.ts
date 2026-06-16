export type PartnerInquiryForm = {
  name: string;
  email: string;
  organization?: string;
  partnerType: string;
  message: string;
  consentToContact: boolean;
};

const partnerTypes = ["Clinic", "Therapist", "Coach", "Disability Advocate", "College", "Workforce Program", "Nonprofit", "Accessibility Organization", "Local Business", "Other"];

export function submitPartnerInquiry(form: PartnerInquiryForm) {
  validatePartnerInquiry(form);
  return {
    partnerType: classifyPartnerType(form),
    partnerRecord: createPartnerRecord(form),
    summary: generatePartnerSummary(form),
    replyDraft: generatePartnerReplyDraft(form),
  };
}

export function validatePartnerInquiry(form: PartnerInquiryForm): void {
  if (!form.name || !form.email || !form.consentToContact) throw new Error("Partner inquiry requires name, email, and consent.");
  if (/clinical outcome|guarantee|diagnosis/i.test(form.message)) throw new Error("Partner inquiry cannot include clinical promises.");
}

export function classifyPartnerType(form: PartnerInquiryForm): string {
  return partnerTypes.find((type) => type.toLowerCase() === form.partnerType.toLowerCase()) || "Other";
}

export function createPartnerRecord(form: PartnerInquiryForm) {
  return { name: form.name, email: form.email, organization: form.organization, partnerType: classifyPartnerType(form), status: "Needs Review" };
}

export function generatePartnerSummary(form: PartnerInquiryForm): string {
  return `${form.organization || form.name} is a ${classifyPartnerType(form)} partner inquiry. Partner terms require Cole approval.`;
}

export function generatePartnerReplyDraft(form: PartnerInquiryForm) {
  return { body: `Hi ${form.name}, thanks for your interest in AveryTech. Cole will review before any partner conversation or terms are sent.`, approvalRequired: true };
}
