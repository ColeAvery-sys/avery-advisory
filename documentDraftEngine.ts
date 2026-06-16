import { includesAny } from "./atlasUtils";

export type BusinessDocumentInput = {
  documentType: string;
  department: string;
  targetAudience: string;
  sourceData: string;
  tone: string;
  keyPoints: string[];
  requiresColeApproval?: boolean;
};

export type BusinessDocumentResult = {
  title: string;
  draft: string;
  checklistBeforeUse: string[];
  approvalRequired: boolean;
  riskWarnings: string[];
};

const SUPPORTED_DOCUMENT_TYPES = [
  "creator logistics proposal",
  "outreach email",
  "weekly delivery email",
  "grant project summary",
  "grant budget outline",
  "investor patron letter",
  "product brief",
  "MVP scope",
  "contractor task packet",
  "internal memo",
  "Codex prompt",
  "Cursor prompt",
];

export function generateBusinessDocument(input: BusinessDocumentInput): BusinessDocumentResult {
  const supportedType = SUPPORTED_DOCUMENT_TYPES.find((type) => type.toLowerCase() === input.documentType.toLowerCase());
  if (!supportedType) throw new Error(`Unsupported document type: ${input.documentType}.`);

  const externalFacing = isExternalFacing(input);
  const legalOrFinancial = isLegalOrFinancial(input);
  const approvalRequired = Boolean(input.requiresColeApproval || externalFacing || legalOrFinancial);
  const title = `${supportedType}: ${input.department} for ${input.targetAudience}`;
  const draft = buildDraft({ ...input, documentType: supportedType });

  return {
    title,
    draft,
    checklistBeforeUse: getChecklist(supportedType, approvalRequired),
    approvalRequired,
    riskWarnings: getRiskWarnings(externalFacing, legalOrFinancial, supportedType),
  };
}

function buildDraft(input: BusinessDocumentInput): string {
  const keyPointText = input.keyPoints.map((point) => `- ${point}`).join("\n");

  if (/codex prompt|cursor prompt/i.test(input.documentType)) {
    return [
      "North Star: ATLAS HQ is the operating system for Avery Industries LLC.",
      "",
      `Task: ${input.sourceData}`,
      "",
      "Build for early cash flow, disability-aid funding, creator logistics revenue, productized AI systems, and safe semi-autonomous operations.",
      "",
      "Key requirements:",
      keyPointText,
      "",
      "Keep risky actions behind Cole approval.",
    ].join("\n");
  }

  return [
    `Use classification: ${isExternalFacing(input) ? "external-facing" : "internal-only"}.`,
    `Tone: ${input.tone}.`,
    `Audience: ${input.targetAudience}.`,
    `Department: ${input.department}.`,
    "",
    `Summary: ${input.sourceData}`,
    "",
    "Key points:",
    keyPointText,
    "",
    "Recommended close: confirm the next step, owner, and approval requirement before action.",
  ].join("\n");
}

function isExternalFacing(input: BusinessDocumentInput): boolean {
  return includesAny(`${input.documentType} ${input.targetAudience}`, [
    "email",
    "proposal",
    "grant",
    "investor",
    "client",
    "contractor",
    "patron",
    "public",
  ]);
}

function isLegalOrFinancial(input: BusinessDocumentInput): boolean {
  return includesAny(`${input.documentType} ${input.sourceData} ${input.keyPoints.join(" ")}`, [
    "legal",
    "contract",
    "budget",
    "invoice",
    "tax",
    "loan",
    "financial",
    "investment",
  ]);
}

function getChecklist(documentType: string, approvalRequired: boolean): string[] {
  const checklist = ["Confirm the draft classification is correct.", "Confirm facts, names, dates, and numbers.", "Check tone against the audience.", "Verify the next action is specific."];

  if (/grant/i.test(documentType)) checklist.push("Confirm eligibility and required documents.");
  if (/codex prompt|cursor prompt/i.test(documentType)) checklist.push("Confirm scope is small enough to execute.");
  if (approvalRequired) checklist.push("Get Cole approval before external use.");

  return checklist;
}

function getRiskWarnings(externalFacing: boolean, legalOrFinancial: boolean, documentType: string): string[] {
  const warnings: string[] = [];
  if (externalFacing) warnings.push("External-facing document. Cole approval required before sending or publishing.");
  if (legalOrFinancial) warnings.push("Legal or financial content. Review carefully before use.");
  if (/grant/i.test(documentType)) warnings.push("Grant submissions must not be sent externally without Cole approval.");
  return warnings;
}
