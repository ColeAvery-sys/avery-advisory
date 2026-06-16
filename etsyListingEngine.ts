import { createPlatformAction, detectRightsRisks, ensureApproved, seoScore } from "./mediaBaronSafety";

const listings: any[] = [];

export function createEtsyListingDraft(listing: any) {
  const stored = { ...listing, title: listing.title || generateEtsyTitle(listing), tags: listing.tags || generateEtsyTags(listing), SEOScore: calculateEtsySeoScore(listing), approvalStatus: "Needs Cole Approval", publishStatus: "Draft", riskWarnings: detectRightsRisks(`${listing.productName} ${listing.description || ""}`) };
  listings.push(stored);
  return stored;
}

export function generateEtsyTitle(listing: any): string {
  return `${listing.productName} ${listing.productType || "digital download"} for creators`.slice(0, 140);
}

export function generateEtsyDescription(listing: any): string {
  return `${listing.productName} is a ${listing.productType || "digital product"} prepared for ${listing.category || "organization and creative workflows"}. No copyrighted or trademarked references should be used unless owned or licensed.`;
}

export function generateEtsyTags(listing: any): string[] {
  return unique(["creator tools", "planner", "digital download", "content system", listing.productType, listing.category].filter(Boolean)).slice(0, 13);
}

export function calculateEtsySeoScore(listing: any): number {
  return seoScore([listing.title || listing.productName || "", listing.description || "", (listing.tags || []).join(" ")]);
}

export function generatePhotoChecklist(listing: any): string[] {
  return ["main mockup", "close-up preview", "use-case image", "dimensions/info graphic", "license/use note"];
}

export function generatePricingSuggestion(listing: any) {
  return { suggestedPrice: listing.price || 9, approvalRequired: true, note: "Price changes require Cole approval." };
}

export function markPublishedManually(listingId: string) {
  const listing = listings.find((entry) => entry.id === listingId);
  if (!listing) throw new Error(`Etsy listing ${listingId} not found.`);
  ensureApproved(listing.approvalStatus);
  listing.publishStatus = "Published Manually";
  return listing;
}

function unique(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}
