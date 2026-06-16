export type DemoRequestForm = {
  name: string;
  email: string;
  organization?: string;
  role?: string;
  interestType: string;
  message: string;
  timeline?: string;
  budgetRange?: string;
  accessibilityInterest?: string;
  consentToContact: boolean;
};

export function submitDemoRequest(form: DemoRequestForm) {
  validateDemoRequest(form);
  const interestType = classifyDemoInterest(form);
  return {
    interestType,
    assignedAgent: routeDemoRequest({ ...form, interestType }),
    prepChecklist: generateDemoPrepChecklist(form),
    replyDraft: generateDemoReplyDraft(form),
  };
}

export function validateDemoRequest(form: DemoRequestForm): void {
  if (!form.name || !form.email || !form.consentToContact) throw new Error("Demo request requires name, email, and consent.");
  if (/diagnosis|medical record|patient/i.test(`${form.message} ${form.accessibilityInterest}`)) throw new Error("Do not collect sensitive medical details.");
}

export function classifyDemoInterest(form: DemoRequestForm): string {
  if (/creator/i.test(form.interestType)) return "Creator Logistics";
  if (/grant|funding/i.test(form.interestType)) return "Grant/Funding";
  if (/clinic|disability/i.test(form.interestType)) return "Clinic/Disability Partner";
  if (/assist|accessibility/i.test(`${form.interestType} ${form.message}`)) return "ATLAS Assist";
  return form.interestType || "General Inquiry";
}

export function routeDemoRequest(form: DemoRequestForm): string {
  const type = classifyDemoInterest(form);
  if (type === "Creator Logistics") return "ATLAS Sales Operator";
  if (type === "Grant/Funding") return "ATLAS Grant Officer";
  if (type === "Clinic/Disability Partner" || type === "ATLAS Assist") return "ATLAS Product Manager";
  return "ATLAS Chief of Staff";
}

export function generateDemoPrepChecklist(form: DemoRequestForm): string[] {
  return ["Review request", "Confirm safe scope", `Prepare ${classifyDemoInterest(form)} talking points`, "Get Cole approval before reply"];
}

export function generateDemoReplyDraft(form: DemoRequestForm) {
  return { body: `Hi ${form.name}, thanks for requesting a demo. Cole will review availability and scope before any reply is sent.`, approvalRequired: true };
}
