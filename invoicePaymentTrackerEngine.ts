export type InvoiceRecord = {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "Draft" | "Sent Manually" | "Paid" | "Overdue";
  notes?: string;
};

export type ContractorPaymentRecord = {
  id: string;
  contractorName: string;
  amount: number;
  reason: string;
  approvalStatus: "Draft" | "Needs Cole Approval" | "Approved" | "Paid Manually";
};

const invoices: InvoiceRecord[] = [];
const payments: ContractorPaymentRecord[] = [];

export function createInvoiceRecord(invoice: InvoiceRecord): InvoiceRecord {
  invoices.push(invoice);
  return invoice;
}

export function generateInvoiceNotes(invoiceId: string): string {
  const invoice = findInvoice(invoiceId);
  return `Invoice draft for ${invoice.clientName}: $${invoice.amount}, due ${invoice.dueDate}. Cole approval required before sending or requesting payment.`;
}

export function generatePaymentReminder(invoiceId: string): string {
  const invoice = findInvoice(invoiceId);
  return `Payment reminder draft for ${invoice.clientName}. Amount due: $${invoice.amount}. This must be approved and sent manually by Cole.`;
}

export function markInvoiceSentManually(invoiceId: string): InvoiceRecord {
  return updateInvoice(invoiceId, { status: "Sent Manually" });
}

export function markInvoicePaid(invoiceId: string): InvoiceRecord {
  return updateInvoice(invoiceId, { status: "Paid" });
}

export function createContractorPaymentRecord(payment: ContractorPaymentRecord): ContractorPaymentRecord {
  payments.push(payment);
  return payment;
}

export function sendContractorPaymentToApproval(paymentId: string): ContractorPaymentRecord {
  const payment = payments.find((item) => item.id === paymentId);
  if (!payment) throw new Error(`Payment ${paymentId} not found.`);
  payment.approvalStatus = "Needs Cole Approval";
  return payment;
}

export function getExpectedCash(): number {
  return invoices.filter((invoice) => invoice.status !== "Paid").reduce((total, invoice) => total + invoice.amount, 0);
}

export function getOverdueInvoices(date: string): InvoiceRecord[] {
  return invoices.filter((invoice) => invoice.status !== "Paid" && invoice.dueDate < date);
}

export function clearInvoicePaymentTrackerForDemo(): void {
  invoices.length = 0;
  payments.length = 0;
}

function findInvoice(id: string): InvoiceRecord {
  const invoice = invoices.find((item) => item.id === id);
  if (!invoice) throw new Error(`Invoice ${id} not found.`);
  return invoice;
}

function updateInvoice(id: string, updates: Partial<InvoiceRecord>): InvoiceRecord {
  const invoice = findInvoice(id);
  Object.assign(invoice, updates);
  return invoice;
}
