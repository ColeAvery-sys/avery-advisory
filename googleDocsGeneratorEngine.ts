export type GoogleDocStatus = "Draft" | "Needs Cole Approval" | "Approved for Doc Creation" | "Google Doc Created" | "Exported Manually" | "Archived";
export type GoogleDocRecord = {
  id: string;
  title: string;
  documentType: string;
  department: string;
  targetAudience: string;
  sourceData: string;
  body: string;
  approvalStatus: GoogleDocStatus;
  docsStatus: "Not Created" | "Placeholder Created" | "Exported";
  relatedGrant?: string;
  relatedClient?: string;
  relatedProduct?: string;
  sensitivity: "Public" | "Internal" | "Client Confidential" | "Legal/Financial" | "Personal" | "High Risk";
  createdAt: string;
  updatedAt: string;
};

const docs: GoogleDocRecord[] = [];

export function generateGoogleDocRecord(input: Omit<GoogleDocRecord, "approvalStatus" | "docsStatus" | "createdAt" | "updatedAt">): GoogleDocRecord {
  const now = new Date().toISOString();
  const needsApproval = input.sensitivity !== "Internal" || /grant|client|investor|contractor/i.test(`${input.documentType} ${input.targetAudience}`);
  const record: GoogleDocRecord = { ...input, body: sanitize(input.body), approvalStatus: needsApproval ? "Needs Cole Approval" : "Draft", docsStatus: "Not Created", createdAt: now, updatedAt: now };
  docs.push(record);
  return record;
}

export function markGoogleDocApproved(id: string): GoogleDocRecord {
  return updateDoc(id, { approvalStatus: "Approved for Doc Creation" });
}

export function createGoogleDocPlaceholder(id: string): GoogleDocRecord {
  const doc = findDoc(id);
  if (doc.approvalStatus === "Needs Cole Approval") throw new Error("Cole approval required before creating Google Doc placeholder.");
  return updateDoc(id, { approvalStatus: "Google Doc Created", docsStatus: "Placeholder Created" });
}

export function exportGoogleDocMarkdown(id: string): string {
  const doc = findDoc(id);
  return `# ${doc.title}\n\n${doc.body}`;
}

export function exportGoogleDocText(id: string): string {
  return findDoc(id).body;
}

export function clearGoogleDocsGeneratorForDemo(): void {
  docs.length = 0;
}

function findDoc(id: string): GoogleDocRecord {
  const doc = docs.find((item) => item.id === id);
  if (!doc) throw new Error(`Google Doc ${id} not found.`);
  return doc;
}

function updateDoc(id: string, updates: Partial<GoogleDocRecord>): GoogleDocRecord {
  const doc = findDoc(id);
  Object.assign(doc, updates, { updatedAt: new Date().toISOString() });
  return doc;
}

function sanitize(value: string): string {
  return value.replace(/—/g, "-");
}
