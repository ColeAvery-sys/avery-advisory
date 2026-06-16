export type WebsiteLeadForm = {
  name: string;
  email: string;
  organization?: string;
  interestType?: string;
  message: string;
  sourcePage?: string;
  consentToContact?: boolean;
};

const agentMap: Record<string, string> = {
  "Creator Logistics": "ATLAS Sales Operator",
  "ATLAS Assist": "ATLAS Product Manager",
  "Grant/Funding": "ATLAS Grant Officer",
  "Clinic Partner": "ATLAS Product Manager",
  "Accessibility Tech": "ATLAS Product Manager",
  "Investor/Patron": "ATLAS Chief of Staff",
  "Media/Speaking": "ATLAS Content Director",
  Contractor: "ATLAS Personal Admin",
  "General Inquiry": "ATLAS Chief of Staff",
};

export function routeWebsiteLead(form: WebsiteLeadForm) {
  validateLead(form);
  const interestType = classifyWebsiteInterest(form);
  return {
    interestType,
    tags: tagLeadByInterest({ ...form, interestType }),
    crmContact: createCrmContactFromWebsiteLead(form),
    inboxItem: createAgentInboxItemFromWebsiteLead({ ...form, interestType }),
    draftReply: createActionCenterDraftReply(form),
  };
}

export function classifyWebsiteInterest(form: WebsiteLeadForm): string {
  if (form.interestType && agentMap[form.interestType]) return form.interestType;
  if (/creator|clips|video|content/i.test(form.message)) return "Creator Logistics";
  if (/grant|funding|funder/i.test(form.message)) return "Grant/Funding";
  if (/clinic|therapist|disability partner/i.test(form.message)) return "Clinic Partner";
  if (/assist|accessibility|overwhelm|independent living/i.test(form.message)) return "ATLAS Assist";
  return "General Inquiry";
}

export function createCrmContactFromWebsiteLead(form: WebsiteLeadForm) {
  return { name: form.name, email: form.email, organization: form.organization, source: form.sourcePage || "Website", consentToContact: Boolean(form.consentToContact) };
}

export function createAgentInboxItemFromWebsiteLead(form: WebsiteLeadForm) {
  const interestType = classifyWebsiteInterest(form);
  return { title: `${interestType}: ${form.name}`, assignedAgent: agentMap[interestType], requiresColeApproval: true, source: "Website", nextAction: "Review and approve safe reply." };
}

export function createActionCenterDraftReply(form: WebsiteLeadForm) {
  return { subject: `Website inquiry from ${form.name}`, body: `Hi ${form.name}, thanks for reaching out. Cole will review your request before any reply is sent.`, approvalRequired: true };
}

export function tagLeadByInterest(form: WebsiteLeadForm): string[] {
  return ["website", classifyWebsiteInterest(form).toLowerCase().replace(/\W+/g, "-")];
}

function validateLead(form: WebsiteLeadForm): void {
  if (!form.name || !form.email || !form.message) throw new Error("Website lead requires name, email, and message.");
  if (/diagnosis|medical record|ssn|social security/i.test(form.message)) throw new Error("Avoid unnecessary sensitive medical or personal details.");
}
