import { createPlatformAction, detectRightsRisks, ensureApproved, seoScore } from "./mediaBaronSafety";

const stores: any[] = [];
const products: any[] = [];

export function createMerchStore(store: any) {
  const stored = { ...store, approvalStatus: "Needs Cole Approval" };
  stores.push(stored);
  return stored;
}

export function createMerchProduct(product: any) {
  const stored = { ...product, ...createPlatformAction("Merch product", detectRightsRisks(`${product.productName} ${product.title || ""} ${product.description || ""}`)), publishStatus: "Draft" };
  products.push(stored);
  return stored;
}

export function generateProductCopy(product: any) {
  return { title: product.title || product.productName, description: `${product.productName} for ${product.targetAudience || "AveryTech supporters"}. Rights-safe design only.`, approvalRequired: true };
}

export function generateSeoTags(product: any): string[] {
  return unique([product.storeName, product.collection, product.productType, "AveryTech", "creator", "tech"].filter(Boolean)).slice(0, 10);
}

export function generateCollection(store: any, items: any[]) {
  return { storeName: store.storeName, collectionName: `${store.storeName} core collection`, products: items.map((item) => item.productName), approvalRequired: true };
}

export function generateMockupChecklist(product: any): string[] {
  return ["front mockup", "detail mockup", "size/color variants", "design file checked", "no unapproved likeness/client design"];
}

export function generatePromoPost(product: any) {
  return { caption: `${product.productName} is drafted for the ${product.storeName} store. Manual publishing only after approval.`, approvalRequired: true, seoScore: seoScore([product.productName, product.description || ""]) };
}

export function markPublishedManually(productId: string) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) throw new Error(`Merch product ${productId} not found.`);
  ensureApproved(product.approvalStatus);
  product.publishStatus = "Published Manually";
  return product;
}

function unique(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}
