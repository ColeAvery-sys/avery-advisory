export type PublicRequestForm = {
  name: string;
  email: string;
  organization?: string;
  requestType: string;
  message: string;
  urgency?: number;
  budgetRange?: string;
  timeline?: string;
  websiteOrSocial?: string;
  consentToContact: boolean;
};

const agentMap: Record<string, string> = {
  "Creator Logistics": "ATLAS Sales Operator",
  "ATLAS Assist": "ATLAS Product Manager",
  "Accessibility Tech": "ATLAS Product Manager",
  "Grant/Funding": "ATLAS Grant Officer",
  Partnership: "ATLAS Chief of Staff",
  "Speaking/Media": "ATLAS Content Director",
  "Contractor Interest": "ATLAS Personal Admin",
  "General Business": "ATLAS Chief of Staff",
  "Support Request": "ATLAS Chief of Staff",
};

export function submitPublicRequest(form: PublicRequestForm) {
  validatePublicRequest(form);
  const requestType = classifyRequestType(form);
  const agent = routeRequestToAgent({ ...form, requestType });
  return {
    requestType,
    assignedAgent: agent,
    crmContact: createCrmContact(form),
    inboxItem: createAgentInboxItem(form, agent),
    draftReply: generateDraftReply(form, agent),
  };
}

export function validatePublicRequest(form: PublicRequestForm): void {
  if (!form.name || !form.email || !form.message) throw new Error("Public request requires name, email, and message.");
  if (!form.consentToContact) throw new Error("Consent to contact is required before follow-up.");
  if (/diagnosis|medical record|ssn|social security/i.test(form.message)) throw new Error("Do not collect unnecessary sensitive medical or personal details.");
}

export function classifyRequestType(form: PublicRequestForm): string {
  if (agentMap[form.requestType]) return form.requestType;
  if (/creator|clips|video/i.test(form.message)) return "Creator Logistics";
  if (/grant|funding/i.test(form.message)) return "Grant/Funding";
  if (/accessibility|assist|disability/i.test(form.message)) return "ATLAS Assist";
  return "General Business";
}

export function routeRequestToAgent(form: PublicRequestForm): string {
  return agentMap[classifyRequestType(form)] || "ATLAS Chief of Staff";
}

export function createCrmContact(form: PublicRequestForm) {
  return { name: form.name, email: form.email, organization: form.organization, relationshipType: form.requestType, consentToContact: form.consentToContact };
}

export function createAgentInboxItem(form: PublicRequestForm, agent: string) {
  return { title: `${form.requestType}: ${form.name}`, assignedAgent: agent, priority: form.urgency || 5, requiresColeApproval: true, nextAction: "Review request and draft safe response." };
}

export function generateDraftReply(form: PublicRequestForm, agent: string) {
  return { body: `Hi ${form.name}, thanks for reaching out. ${agent} will prepare a response for Cole review before anything is sent.`, approvalRequired: true };
}
