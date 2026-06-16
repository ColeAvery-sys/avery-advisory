import { connectorLog, detectConnectorRisks, ensureApproval, qaPassed, requireFields, rightsClear } from "./platformConnectorSafety";

const merchProducts: any[] = [];

export function validateMerchProductForPrep(product: any) {
  const missing = requireFields(product, ["productId", "productName", "storeName", "productType", "designFile", "price"]);
  const risks = detectConnectorRisks(`${product.productName} ${product.title || ""} ${product.description || ""}`);
  const errors = missing.map((field) => `${field} missing`).concat(risks);
  if (!rightsClear(product.rightsStatus)) errors.push("rights must be clear");
  if (!qaPassed(product.QAStatus)) errors.push("QA must be passed/ready");
  if (product.priceApproved !== true) errors.push("price approval required");
  return { valid: errors.length === 0, errors, approvalRequired: true };
}

export function generateTeespringProductPacket(product: any) {
  const validation = validateMerchProductForPrep(product);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const packet = { ...product, prepStatus: "Upload Notes Ready", manualPublishOnly: true };
  merchProducts.push(packet);
  return packet;
}

export function generateTeespringProductCopy(product: any) {
  return { title: product.title || product.productName, description: product.description || `${product.productName} for ${product.storeName}. Final setup and price require approval.`, approvalRequired: true };
}

export function generateTeespringTags(product: any): string[] {
  return [product.storeName, product.productType, product.collection, "merch", "design"].filter(Boolean).map((tag) => String(tag).toLowerCase()).slice(0, 10);
}

export function generateMockupChecklist(product: any): string[] {
  return ["front mockup", "close detail mockup", "mobile listing preview", "design file proof", "rights note"];
}

export function exportTeespringUploadNotes(product: any) {
  const packet = generateTeespringProductPacket(product);
  return { productName: packet.productName, copy: generateTeespringProductCopy(packet), tags: generateTeespringTags(packet), mockups: generateMockupChecklist(packet), approvalRequired: true };
}

export function markTeespringPublishedManually(productId: string, url: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before logging Teespring manual publish.");
  const product = merchProducts.find((entry) => entry.productId === productId);
  if (!product) throw new Error(`Teespring product ${productId} not prepared.`);
  product.publishStatus = "Published Manually";
  product.productUrl = url;
  return connectorLog({ platform: "Teespring", productId, action: "mark published manually", url });
}

