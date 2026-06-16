import { connectorLog, ensureApproval, qaPassed, requireFields, rightsClear } from "./platformConnectorSafety";

const etsyListings: any[] = [];
const etsyLogs: any[] = [];

export function validateEtsyListingForExport(listing: any) {
  const missing = requireFields(listing, ["listingId", "productName", "title", "description", "price"]);
  const errors = missing.map((field) => `${field} missing`);
  if (!rightsClear(listing.rightsStatus)) errors.push("unknown rights block export");
  if (!qaPassed(listing.QAStatus)) errors.push("failed Listing QA blocks export");
  if (listing.priceChanged && listing.approvalStatus !== "Approved") errors.push("price changes require approval");
  return { valid: errors.length === 0, errors, approvalRequired: true };
}

export function generateEtsyListingExport(listing: any) {
  const validation = validateEtsyListingForExport(listing);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const packet = { ...listing, exportType: "Etsy JSON", connectorStatus: "Export Ready", manualPublishOnly: true };
  etsyListings.push(packet);
  logEtsyConnectorAction({ listingId: listing.listingId, action: "generate Etsy export", status: "Ready" });
  return packet;
}

export function generateEtsyCsv(listing: any) {
  const packet = generateEtsyListingExport(listing);
  return `listingId,productName,title,description,tags,category,price\n${packet.listingId},${packet.productName},${packet.title},${packet.description},"${(packet.tags || []).join("|")}",${packet.category || ""},${packet.price}`;
}

export function generateCopyPasteListingPacket(listing: any) {
  const packet = generateEtsyListingExport(listing);
  return { title: packet.title, description: packet.description, tags: packet.tags || [], price: packet.price, checklist: ["upload files manually", "add mockups", "review price", "publish manually after approval"] };
}

export function markEtsyListingCreatedManually(listingId: string, url: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before logging Etsy manual listing creation.");
  const listing = etsyListings.find((entry) => entry.listingId === listingId);
  if (!listing) throw new Error(`Etsy listing ${listingId} not exported.`);
  listing.connectorStatus = "Created Manually";
  listing.publishedUrl = url;
  return listing;
}

export function logEtsyConnectorAction(action: any) {
  const log = connectorLog({ platform: "Etsy", ...action });
  etsyLogs.push(log);
  return log;
}

