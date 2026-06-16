import { createFactoryGate, detectProductRisks, ensureColeApproval } from "./marketplaceFactorySafety";

const templates: any[] = [];

export function createTemplate(template: any) {
  const risks = detectProductRisks(`${template.templateName} ${template.purpose || ""}`);
  const stored = { ...template, ...createFactoryGate("Template", risks), version: template.version || "1.0", approvalStatus: template.approvalStatus || "Draft" };
  templates.push(stored);
  return stored;
}

export function generateTemplate(input: any) {
  return createTemplate({
    id: input.id,
    templateName: input.templateName || `${input.category || "ATLAS"} Template`,
    category: input.category || "operations",
    targetUser: input.targetUser || "Cole/ATLAS operator",
    purpose: input.purpose || "make repeatable work easier",
    sections: input.sections || ["Purpose", "Inputs", "Checklist", "Output", "Approval needed"],
    format: input.format || "Markdown",
    outputFileType: input.outputFileType || "md",
  });
}

export function generatePdfReadyVersion(template: any) {
  return { templateName: template.templateName, format: "PDF-ready", content: renderTemplate(template), approvalRequired: true };
}

export function generateGoogleDocVersion(template: any) {
  return { templateName: template.templateName, format: "Google Doc-ready", content: renderTemplate(template), approvalRequired: true };
}

export function generateSheetVersion(template: any) {
  return { templateName: template.templateName, format: "Google Sheet-ready", columns: template.sections || ["section", "instructions", "status"], approvalRequired: true };
}

export function versionTemplate(templateId: string) {
  const template = findTemplate(templateId);
  const current = parseFloat(template.version || "1.0");
  template.version = (current + 0.1).toFixed(1);
  return template;
}

export function saveTemplateToProductFactory(templateId: string, approval?: { approvedByCole?: boolean }) {
  ensureColeApproval(approval, "Cole approval required before saving sellable/public template to product factory.");
  const template = findTemplate(templateId);
  return { productName: template.templateName, productType: "template", includedFiles: [template.outputFileType || "md"], approvalStatus: "Needs Listing QA" };
}

function renderTemplate(template: any): string {
  return [`# ${template.templateName}`, "", ...(template.sections || []).map((section: string) => `## ${section}\n\nInstructions: ${template.instructions || "Fill this section in."}`)].join("\n");
}

function findTemplate(templateId: string) {
  const template = templates.find((entry) => entry.id === templateId || entry.templateId === templateId);
  if (!template) throw new Error(`Template ${templateId} not found.`);
  return template;
}

