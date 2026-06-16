import { createFactoryGate, ensureColeApproval, paymentVerified, readinessScore, rightsAreClear } from "./marketplaceFactorySafety";

const packets: any[] = [];

export function createDeliveryPacket(packet: any) {
  const stored = { ...packet, ...createFactoryGate("Customer delivery packet"), internalQCStatus: packet.internalQCStatus || "Not Started", ColeApprovalStatus: packet.ColeApprovalStatus || "Needs Cole Approval", deliveryStatus: packet.deliveryStatus || "Draft" };
  packets.push(stored);
  return stored;
}

export function generateDeliveryMessage(packet: any) {
  return { subject: `Delivery: ${packet.packetName}`, body: `Draft delivery message for ${packet.customerName}. Review included files, instructions, license terms, and revision policy before manual delivery.`, approvalRequired: true };
}

export function generateFileChecklist(packet: any): string[] {
  return ["all included files attached", "file names are clear", "internal notes removed", "instructions included", "license/use notes included"].concat(packet.includedFiles || []);
}

export function generateLicenseUseNotes(packet: any) {
  return { packetName: packet.packetName, licenseTerms: packet.licenseTerms || "License/use terms must match asset rights before delivery.", approvalRequired: true };
}

export function runDeliveryQa(packet: any) {
  const failedChecks: string[] = [];
  if (!(packet.includedFiles || []).length) failedChecks.push("included files missing");
  if (!packet.instructions) failedChecks.push("instructions missing");
  if (!packet.revisionPolicy) failedChecks.push("revision policy missing");
  if (!rightsAreClear(packet.assetRightsStatus || packet.rightsStatus)) failedChecks.push("asset rights unclear");
  if (/internal|private|contractor note/i.test(packet.deliveryMessage || "")) failedChecks.push("possible internal notes in delivery message");
  const score = readinessScore([failedChecks.length === 0, /passed|ready/i.test(packet.internalQCStatus || ""), !!packet.deliveryMessage, !!packet.licenseTerms]);
  return { packetName: packet.packetName, QAStatus: failedChecks.length ? "Failed" : "Passed", failedChecks, deliveryReadinessScore: score, approvalRequired: true };
}

export function sendDeliveryToApproval(packetId: string) {
  const packet = findPacket(packetId);
  packet.ColeApprovalStatus = "Needs Cole Approval";
  return { packetId, requestedAction: "Approve customer delivery", approvalRequired: true };
}

export function markDeliveredManually(packetId: string, approval?: { approvedByCole?: boolean; paymentExceptionApproved?: boolean }) {
  ensureColeApproval(approval, "Cole approval required before marking delivery packet delivered manually.");
  const packet = findPacket(packetId);
  if (!paymentVerified(packet.paymentStatus) && !approval!.paymentExceptionApproved) throw new Error("Payment must be verified unless Cole approves an exception.");
  const qa = runDeliveryQa(packet);
  if (qa.failedChecks.length) throw new Error("Delivery QA must pass before manual delivery.");
  packet.deliveryStatus = "Delivered Manually";
  packet.ColeApprovalStatus = "Approved";
  return packet;
}

function findPacket(packetId: string) {
  const packet = packets.find((entry) => entry.id === packetId || entry.packetId === packetId);
  if (!packet) throw new Error(`Delivery packet ${packetId} not found.`);
  return packet;
}

