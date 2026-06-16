import { createFactoryGate, ensureColeApproval, paymentVerified } from "./marketplaceFactorySafety";

const orders: any[] = [];

export function createServiceOrder(order: any) {
  const stored = { ...order, ...createFactoryGate("Service order fulfillment"), internalStatus: order.internalStatus || "Request Received", clientVisibleStatus: order.clientVisibleStatus || "In Review", revisionCount: order.revisionCount || 0, revisionLimit: order.revisionLimit || 3 };
  orders.push(stored);
  return stored;
}

export function generateFulfillmentChecklist(order: any): string[] {
  return ["quote approved", "client accepted manually", "payment verified", "inputs received", "scope confirmed", "delivery date confirmed", "revision limit acknowledged"];
}

export function generateContractorPacket(order: any) {
  return { orderName: order.orderName, clientName: order.clientName, deliverables: order.deliverables || [], requiredInputs: order.requiredInputs || [], warning: "Contractor assignment requires Cole approval.", approvalRequired: true };
}

export function generateQualityChecklist(order: any): string[] {
  return ["instructions followed", "files complete", "format correct", "client/private info protected", "revision count checked", "delivery packet reviewed"];
}

export function generateClientUpdateDraft(order: any) {
  return { subject: `Update on ${order.orderName}`, body: `Draft update for ${order.clientName}. This message is not sent automatically and requires approval.`, approvalRequired: true };
}

export function generateDeliveryPacket(order: any) {
  return { orderName: order.orderName, includedFiles: order.deliverables || [], messageDraft: "Draft delivery message. Cole approval required before delivery.", approvalRequired: true };
}

export function markDeliveredManually(orderId: string, approval?: { approvedByCole?: boolean; paymentExceptionApproved?: boolean }) {
  ensureColeApproval(approval, "Cole approval required before marking service order delivered manually.");
  const order = findOrder(orderId);
  if (!paymentVerified(order.paymentStatus) && !approval!.paymentExceptionApproved) throw new Error("Payment must be verified unless Cole approves an exception.");
  order.internalStatus = "Delivered Manually";
  order.clientVisibleStatus = "Delivered";
  return order;
}

function findOrder(orderId: string) {
  const order = orders.find((entry) => entry.id === orderId || entry.orderId === orderId);
  if (!order) throw new Error(`Service order ${orderId} not found.`);
  return order;
}

