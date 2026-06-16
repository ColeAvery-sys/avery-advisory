import { createFactoryGate, ensureColeApproval } from "./marketplaceFactorySafety";

const orders: any[] = [];

export function createOrder(order: any) {
  const stored = { ...order, ...createFactoryGate("Order tracking"), status: order.status || "New", riskLevel: order.riskLevel || classifyOrderRisk(order) };
  orders.push(stored);
  return stored;
}

export function updateOrderStatus(orderId: string, status: string) {
  const order = findOrder(orderId);
  order.status = status;
  if (/refund|problem|dispute|angry/i.test(status)) order.riskLevel = "High";
  return order;
}

export function generateCustomerUpdateDraft(order: any) {
  return { orderId: order.orderId || order.id, subject: `Update on ${order.productOrService}`, body: "Draft customer update only. Do not send without approval.", approvalRequired: true, riskLevel: order.riskLevel || classifyOrderRisk(order) };
}

export function generateDeliveryChecklist(order: any): string[] {
  return ["payment status checked", "delivery files ready", "license/instructions included", "internal notes removed", "Cole approval received if custom/client work"];
}

export function generateRefundReview(order: any) {
  return { orderId: order.orderId || order.id, refundStatus: order.refundStatus || "Review Needed", questions: ["What did customer request?", "Was product delivered?", "What platform rules apply?", "Does this need Cole approval?"], approvalRequired: true };
}

export function escalateOrderIssue(orderId: string, reason: string) {
  const order = findOrder(orderId);
  order.status = "Problem";
  order.riskLevel = "High";
  return { orderId, reason, escalationTarget: "Cole", approvalRequired: true };
}

export function markOrderCompletedManually(orderId: string, approval?: { approvedByCole?: boolean }) {
  ensureColeApproval(approval, "Cole approval required before marking order completed manually.");
  const order = findOrder(orderId);
  if (/refund requested|problem|dispute/i.test(`${order.refundStatus} ${order.status}`)) throw new Error("Disputes/refunds must be resolved before completion.");
  order.status = "Completed";
  return order;
}

function classifyOrderRisk(order: any): string {
  const text = `${order.status || ""} ${order.refundStatus || ""} ${order.customerMessageStatus || ""} ${order.notes || ""}`.toLowerCase();
  if (/refund|dispute|angry|legal|chargeback|problem/.test(text)) return "High";
  if (/waiting on cole|waiting on contractor|revision/.test(text)) return "Medium";
  return "Low";
}

function findOrder(orderId: string) {
  const order = orders.find((entry) => entry.id === orderId || entry.orderId === orderId);
  if (!order) throw new Error(`Order ${orderId} not found.`);
  return order;
}

