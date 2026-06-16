export type ClientDeliveryPacket = {
  id: string;
  clientName: string;
  projectName: string;
  deliverables: string[];
  completedDeliverables: string[];
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  revisionCount: number;
  approvalStatus: "Draft" | "Needs Cole Approval" | "Delivered Manually";
};

const clientPackets: ClientDeliveryPacket[] = [];

export function createClientDeliveryPacket(project: Omit<ClientDeliveryPacket, "approvalStatus">): ClientDeliveryPacket {
  const packet = { ...project, approvalStatus: "Needs Cole Approval" as const };
  clientPackets.push(packet);
  return packet;
}

export function generateDeliveryPacket(packetId: string): string {
  const packet = findPacket(packetId);
  return [`Client: ${packet.clientName}`, `Project: ${packet.projectName}`, `Deliverables: ${packet.completedDeliverables.join(", ")}`, `Flags: ${getFlags(packet).join(", ") || "None"}`, "Approval warning: Delivery requires Cole approval."].join("\n");
}

export function generateDeliveryEmail(packetId: string): string {
  const packet = findPacket(packetId);
  return `Subject: ${packet.projectName} delivery ready\n\nHi ${packet.clientName},\n\nThe delivery packet is prepared for review. Cole approval is required before this client-facing email is sent manually.\n\nDeliverables:\n${packet.completedDeliverables.map((item) => `- ${item}`).join("\n")}`;
}

export function generateRevisionPolicyReminder(packetId: string): string {
  const packet = findPacket(packetId);
  return packet.revisionCount > 3 ? "Revision count is over 3. Confirm scope before more revisions." : "Revision count is within the standard range.";
}

export function generateQualityChecklist(packetId: string): string[] {
  const packet = findPacket(packetId);
  return ["Confirm all deliverables are attached", "Check file names and links", "Confirm payment status", "Get Cole approval", ...getFlags(packet)];
}

export function markDeliveredManually(packetId: string): ClientDeliveryPacket {
  const packet = findPacket(packetId);
  packet.approvalStatus = "Delivered Manually";
  return packet;
}

export function clearClientDeliveryPacketsForDemo(): void {
  clientPackets.length = 0;
}

function findPacket(id: string): ClientDeliveryPacket {
  const packet = clientPackets.find((item) => item.id === id);
  if (!packet) throw new Error(`Client packet ${id} not found.`);
  return packet;
}

function getFlags(packet: ClientDeliveryPacket): string[] {
  const missing = packet.deliverables.filter((item) => !packet.completedDeliverables.includes(item));
  const flags: string[] = [];
  if (packet.paymentStatus !== "Paid") flags.push("payment not fully paid");
  if (packet.revisionCount > 3) flags.push("revision count over 3");
  if (missing.length) flags.push(`missing deliverables: ${missing.join(", ")}`);
  return flags;
}
