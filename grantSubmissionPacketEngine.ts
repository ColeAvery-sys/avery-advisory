export type GrantPacket = {
  id: string;
  grantName: string;
  amount: number;
  eligibilitySummary: string;
  companySummary: string;
  projectSummary: string;
  disabilityAidImpactStatement: string;
  budgetOutline: string;
  timeline: string;
  requiredDocuments: string[];
  completedDocuments: string[];
  evidenceAttachments: string[];
  approvalStatus: "Draft" | "Ready for Cole Approval" | "Submitted Manually";
};

const grantPackets: GrantPacket[] = [];

export function createGrantPacket(grant: Omit<GrantPacket, "approvalStatus">): GrantPacket {
  const packet = { ...grant, approvalStatus: "Draft" as const };
  grantPackets.push(packet);
  return packet;
}

export function generateFullGrantPacket(packetId: string): string {
  const packet = findPacket(packetId);
  return [
    `Grant overview: ${packet.grantName} for $${packet.amount}.`,
    `Eligibility summary: ${packet.eligibilitySummary}`,
    `Company summary: ${packet.companySummary}`,
    `Project summary: ${packet.projectSummary}`,
    `Disability-aid impact statement: ${sanitizeClaims(packet.disabilityAidImpactStatement)}`,
    `Budget outline: ${packet.budgetOutline}`,
    `Timeline: ${packet.timeline}`,
    `Required documents: ${packet.requiredDocuments.join(", ")}`,
    `Missing documents: ${generateMissingItemsList(packetId).join(", ") || "None"}`,
    `Evidence attachments: ${packet.evidenceAttachments.join(", ") || "None"}`,
    `Final checklist: ${generateFinalSubmissionChecklist(packetId).join(" | ")}`,
    "Approval warning: Grant submission requires Cole approval. Funding is not guaranteed.",
  ].join("\n");
}

export function generateMissingItemsList(packetId: string): string[] {
  const packet = findPacket(packetId);
  return packet.requiredDocuments.filter((doc) => !packet.completedDocuments.includes(doc));
}

export function generateFinalSubmissionChecklist(packetId: string): string[] {
  const missing = generateMissingItemsList(packetId);
  return ["Confirm eligibility", "Review budget", "Review claims", "Get Cole approval", missing.length ? `Resolve missing items: ${missing.join(", ")}` : "All required documents attached"];
}

export function markReadyToSubmit(packetId: string): GrantPacket {
  const packet = findPacket(packetId);
  packet.approvalStatus = "Ready for Cole Approval";
  return packet;
}

export function markSubmittedManually(packetId: string): GrantPacket {
  const packet = findPacket(packetId);
  packet.approvalStatus = "Submitted Manually";
  return packet;
}

export function clearGrantPacketsForDemo(): void {
  grantPackets.length = 0;
}

function findPacket(id: string): GrantPacket {
  const packet = grantPackets.find((item) => item.id === id);
  if (!packet) throw new Error(`Grant packet ${id} not found.`);
  return packet;
}

function sanitizeClaims(text: string): string {
  return text.replace(/\b(cure|treat|guarantee|guaranteed)\b/gi, "support");
}
