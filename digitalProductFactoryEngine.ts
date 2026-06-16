import { createFactoryGate, detectProductRisks, readinessScore, rightsAreClear } from "./marketplaceFactorySafety";

const products: any[] = [];

export function createDigitalProduct(product: any) {
  const risks = detectProductRisks(`${product.productName} ${product.problemSolved || ""} ${product.notes || ""}`);
  const stored = { ...product, ...createFactoryGate("Digital product", risks), listingStatus: product.listingStatus || "Draft", QAStatus: product.QAStatus || "Not Started" };
  products.push(stored);
  return stored;
}

export function generateProductConcept(input: any) {
  return {
    productName: input.productName || `${input.topic || "ATLAS"} Starter Kit`,
    productType: input.productType || "checklist",
    targetAudience: input.targetAudience || "overwhelmed creators and builders",
    problemSolved: input.problemSolved || "turns a messy idea into a small usable next step",
    approvalRequired: true,
  };
}

export function generateProductOutline(product: any): string[] {
  return [
    "Quick start page",
    `Problem: ${product.problemSolved || "unclear problem"}`,
    "Step-by-step checklist",
    "Examples or filled-in sample",
    "Use notes and limitations",
    "Delivery/readme instructions",
  ];
}

export function generateProductFileChecklist(product: any): string[] {
  return ["final PDF or source file", "readme/instructions", "preview image", "license/use notes", "asset rights proof"].concat(product.includedFiles || []);
}

export function generateListingDraft(product: any) {
  const risks = detectProductRisks(`${product.productName} ${product.problemSolved || ""}`);
  return {
    title: product.productName,
    description: `${product.productName} helps ${product.targetAudience || "the buyer"} with ${product.problemSolved || "a focused workflow"}. Results are not guaranteed.`,
    platform: product.platform || "TBD",
    approvalRequired: true,
    risks,
  };
}

export function generatePreviewMockupChecklist(product: any): string[] {
  return [`Show ${product.productName} cover/first page`, "Show included files", "Show use example", "Avoid fake customer results", "Confirm rights for all images/fonts"];
}

export function calculateProductReadiness(product: any) {
  const risks = detectProductRisks(`${product.productName} ${product.problemSolved || ""} ${product.notes || ""}`);
  const score = readinessScore([
    !!product.productName,
    !!product.productType,
    !!product.targetAudience,
    !!product.problemSolved,
    (product.includedFiles || []).length > 0,
    rightsAreClear(product.assetRightsStatus),
    /ready|complete/i.test(product.deliveryFileStatus || ""),
    /passed|ready/i.test(product.QAStatus || ""),
    risks.length === 0,
  ]);
  return { productName: product.productName, readinessScore: score, readyForApproval: score >= 80, approvalRequired: true, risks };
}

export function sendProductToApproval(productId: string) {
  const product = findProduct(productId);
  product.approvalStatus = "Needs Cole Approval";
  return { productId, requestedAction: "Approve public listing/product use", approvalRequired: true, riskWarnings: product.riskWarnings || [] };
}

function findProduct(productId: string) {
  const product = products.find((entry) => entry.id === productId || entry.productId === productId);
  if (!product) throw new Error(`Digital product ${productId} not found.`);
  return product;
}

