import { connectorLog, ensureApproval, requireFields } from "./platformConnectorSafety";

const invoices: any[] = [];
const invoiceLogs: any[] = [];

export function validateInvoiceDraft(invoice: any) {
  const missing = requireFields(invoice, ["invoiceId", "clientName", "clientEmail", "serviceOrProduct", "amount", "lineItems"]);
  const errors = missing.map((field) => `${field} missing`);
  if (Number(invoice.amount) <= 0) errors.push("amount must be positive");
  if (invoice.approvalStatus !== "Approved") errors.push("payment links require Cole approval");
  return { valid: errors.length === 0, errors, approvalRequired: true };
}

export function generateStripeInvoiceDraftData(invoice: any) {
  const validation = validateInvoiceDraft(invoice);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  return { platform: "Stripe", customerEmail: invoice.clientEmail, amount: invoice.amount, lineItems: invoice.lineItems, dueDate: invoice.dueDate, requestPaymentAutomatically: false };
}

export function generatePaypalInvoiceDraftData(invoice: any) {
  const validation = validateInvoiceDraft(invoice);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  return { platform: "PayPal", recipient: invoice.clientEmail, amount: invoice.amount, lineItems: invoice.lineItems, note: "Draft only. Do not request payment automatically." };
}

export function generateManualInvoiceNotes(invoice: any) {
  return { clientName: invoice.clientName, serviceOrProduct: invoice.serviceOrProduct, amount: invoice.amount, lineItems: invoice.lineItems || [], approvalRequired: true, warning: "No automatic payment request." };
}

export function markInvoiceCreatedManually(invoiceId: string, platformLink: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before logging invoice created manually.");
  const invoice = { invoiceId, platformLink, status: "Created Manually" };
  invoices.push(invoice);
  logInvoiceConnectorAction({ invoiceId, action: "invoice created manually", platformLink });
  return invoice;
}

export function markInvoiceSentManually(invoiceId: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before logging invoice sent manually.");
  const invoice = findInvoice(invoiceId);
  invoice.sentStatus = "Sent Manually";
  return invoice;
}

export function markInvoicePaid(invoiceId: string) {
  const invoice = findInvoice(invoiceId);
  invoice.paidStatus = "Paid";
  return invoice;
}

export function logInvoiceConnectorAction(action: any) {
  const log = connectorLog({ platform: "Invoice", ...action });
  invoiceLogs.push(log);
  return log;
}

function findInvoice(invoiceId: string) {
  const invoice = invoices.find((entry) => entry.invoiceId === invoiceId);
  if (!invoice) throw new Error(`Invoice ${invoiceId} not found.`);
  return invoice;
}

