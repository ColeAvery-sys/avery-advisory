export type ClientOnboardingRecord = {
  id: string;
  preferredName: string;
  businessName?: string;
  email: string;
  socialLinks: string[];
  brandDescription: string;
  targetAudience: string;
  contentExamples: string[];
  rawFootageLinks: string[];
  deliverablesRequested: string[];
  styleReferences: string[];
  mustAvoid: string[];
  deadline: string;
  revisionPolicyAcknowledged: boolean;
  paymentConfirmed: boolean;
  notes?: string;
  coleApprovedStart?: boolean;
};

const onboardingRecords: ClientOnboardingRecord[] = [];

export function createOnboardingRecord(client: ClientOnboardingRecord): ClientOnboardingRecord {
  onboardingRecords.push(client);
  return client;
}

export function validateOnboardingCompletion(record: ClientOnboardingRecord) {
  const missing: string[] = [];
  if (!record.email) missing.push("email");
  if (!record.rawFootageLinks.length) missing.push("raw footage links");
  if (!record.deliverablesRequested.length) missing.push("deliverables");
  if (!record.revisionPolicyAcknowledged) missing.push("revision policy acknowledgement");
  if (!record.paymentConfirmed) missing.push("verified payment");
  if (!record.coleApprovedStart) missing.push("Cole start approval");
  return { complete: missing.length === 0, missing, canBecomeActive: missing.length === 0 };
}

export function generateClientProfile(record: ClientOnboardingRecord) {
  return { clientName: record.preferredName, businessName: record.businessName, email: record.email, brandDescription: record.brandDescription, targetAudience: record.targetAudience };
}

export function generateProjectRecord(record: ClientOnboardingRecord) {
  return { projectName: `${record.preferredName} Creator Logistics`, status: record.coleApprovedStart ? "Ready to Start" : "Waiting on Cole Approval", deadline: record.deadline, deliverables: record.deliverablesRequested };
}

export function generateDeliveryChecklist(record: ClientOnboardingRecord): string[] {
  return ["Confirm payment", "Confirm revision policy", "Verify raw footage links", ...record.deliverablesRequested.map((item) => `Prepare ${item}`)];
}

export function generateContractorPacketDraft(record: ClientOnboardingRecord) {
  return { title: `${record.preferredName} contractor packet`, approvalRequired: true, instructions: `Use style references: ${record.styleReferences.join(", ")}. Avoid: ${record.mustAvoid.join(", ")}.` };
}

export function generateQualityChecklist(record: ClientOnboardingRecord): string[] {
  return ["Check brand fit", "Check captions/timestamps if requested", "Check must-avoid list", "Confirm deliverables against scope", "Send to Cole approval before delivery"];
}

export function sendStartApprovalToActionCenter(record: ClientOnboardingRecord) {
  return { title: `Start approval: ${record.preferredName}`, riskLevel: "High", approvalRequired: true, reason: "Client project cannot become Active until Cole approves." };
}

export function clearOnboardingForDemo(): void {
  onboardingRecords.length = 0;
}
