import { createFactoryGate, detectProductRisks, ensureColeApproval, rightsAreClear } from "./marketplaceFactorySafety";

const designs: any[] = [];

export function createMerchDesign(design: any) {
  const risks = detectProductRisks(`${design.designName} ${design.slogan || ""} ${design.visualDirection || ""}`);
  const stored = { ...design, ...createFactoryGate("Merch design", risks), publishStatus: "Draft" };
  designs.push(stored);
  return stored;
}

export function generateMerchConcept(input: any) {
  return { designName: input.designName || `${input.brand || "AveryTech"} Signal Design`, brand: input.brand || "AveryTech", slogan: input.slogan || "Build tools that give people room to breathe", approvalRequired: true };
}

export function generateSloganVariations(input: any): string[] {
  const base = input.theme || input.brand || "AveryTech";
  return [`${base}: build with care`, "One next step counts", "Ethical automation, human approval", "Give people room to breathe", "Systems for the overloaded"];
}

export function generateVisualBrief(design: any) {
  return { designName: design.designName, direction: design.visualDirection || "clean, high-contrast, merch-readable from a distance", avoid: ["copyrighted characters", "client likenesses", "tiny unreadable text"], approvalRequired: true };
}

export function generateProductCopy(design: any) {
  return { title: design.designName, description: `${design.slogan || design.designName}. Final product setup and price require approval.`, approvalRequired: true, risks: detectProductRisks(`${design.slogan || ""} ${design.visualDirection || ""}`) };
}

export function generateMockupChecklist(design: any): string[] {
  return ["shirt mockup", "hoodie mockup", "sticker mockup", "mobile preview", "rights-safe design file"].concat(design.mockupsNeeded || []);
}

export function sendToAssetRightsCheck(designId: string) {
  const design = findDesign(designId);
  design.rightsStatus = design.rightsStatus || "Needs Review";
  return { designId, requestedAction: "Asset rights check", approvalRequired: true, rightsStatus: design.rightsStatus };
}

export function markPublishedManually(designId: string, approval?: { approvedByCole?: boolean }) {
  ensureColeApproval(approval, "Cole approval required before marking merch published manually.");
  const design = findDesign(designId);
  if (!rightsAreClear(design.rightsStatus)) throw new Error("Merch design blocked until public/commercial rights are approved.");
  design.publishStatus = "Published Manually";
  return design;
}

function findDesign(designId: string) {
  const design = designs.find((entry) => entry.id === designId || entry.designId === designId);
  if (!design) throw new Error(`Merch design ${designId} not found.`);
  return design;
}

