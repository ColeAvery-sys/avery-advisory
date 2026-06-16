import { createFactoryGate, detectProductRisks, ensureColeApproval, rightsAreClear } from "./marketplaceFactorySafety";

const etsyProducts: any[] = [];

export function createEtsyProduct(product: any) {
  const risks = detectProductRisks(`${product.productName} ${product.category || ""} ${product.descriptionDraft || ""}`);
  const rightsBlocked = !rightsAreClear(product.rightsStatus);
  const stored = { ...product, ...createFactoryGate("Etsy product", risks.concat(rightsBlocked ? ["Unknown rights block Etsy listing."] : [])), productionStatus: product.productionStatus || "Draft", publishStatus: "Draft" };
  etsyProducts.push(stored);
  return stored;
}

export function generateEtsyProductIdea(input: any) {
  return { productName: input.productName || `${input.audience || "Creator"} Planning Printable`, category: input.category || "printable planners", targetBuyer: input.targetBuyer || input.audience || "busy creators", approvalRequired: true };
}

export function generateEtsyListing(product: any) {
  const risks = detectProductRisks(`${product.productName} ${product.category || ""}`);
  return { titleDraft: generateEtsySeoTags(product).slice(0, 3).join(" "), descriptionDraft: `${product.productName} is a digital product for ${product.targetBuyer || "buyers"}.\n\nIncludes: ${(product.filesIncluded || []).join(", ") || "files listed in the product preview"}.\n\nNo guaranteed outcomes.`, approvalRequired: true, risks };
}

export function generateEtsySeoTags(product: any): string[] {
  const base = [product.category, product.targetBuyer, "printable", "planner", "template", "organization", "digital download"].filter(Boolean);
  return base.slice(0, 13).map((tag) => String(tag).toLowerCase().slice(0, 20));
}

export function generateMockupChecklist(product: any): string[] {
  return ["cover mockup", "inside page preview", "included files graphic", "usage example", "license note image"].concat(product.mockupsNeeded || []);
}

export function generateFilePackagingChecklist(product: any): string[] {
  return ["PDF final", "source/editable file if included", "readme instructions", "license terms", "compressed delivery folder"].concat(product.filesIncluded || []);
}

export function generateBuyerInstructions(product: any) {
  return `Thank you for your purchase of ${product.productName}. Download the files, read the included instructions, and use them for the approved personal/commercial scope shown in the listing.`;
}

export function markPublishedManually(productId: string, approval?: { approvedByCole?: boolean }) {
  ensureColeApproval(approval, "Cole approval required before marking Etsy product published manually.");
  const product = findProduct(productId);
  if (!rightsAreClear(product.rightsStatus)) throw new Error("Etsy listing blocked until rights are clear.");
  product.publishStatus = "Published Manually";
  return product;
}

function findProduct(productId: string) {
  const product = etsyProducts.find((entry) => entry.id === productId || entry.productId === productId);
  if (!product) throw new Error(`Etsy product ${productId} not found.`);
  return product;
}

