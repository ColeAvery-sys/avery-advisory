export type OfferRecord = {
  id: string;
  offerName: string;
  brand: string;
  audience: string;
  stage: string;
  priceRange?: string;
  valuePromise: string;
  requiredInputs?: string[];
  deliverables?: string[];
  landingPage?: string;
  CTA?: string;
  followUpSequence?: string;
  upsellPath?: string[];
  riskFlags?: string[];
  approvalStatus?: string;
};

const offers: OfferRecord[] = [];
const ladderStages = ["Free Content", "Lead Magnet", "Low-Ticket Product", "Service Offer", "Premium Package", "Subscription / Retainer", "Partnership / Pilot", "Funding / Patron / Grant"];

export function createOffer(offer: OfferRecord): OfferRecord {
  const validation = validateOfferClaims(offer);
  const stored = { ...offer, approvalStatus: offer.approvalStatus || (isPaidOrPublic(offer) ? "Needs Cole Approval" : "Draft"), riskFlags: (offer.riskFlags || []).concat(validation.warnings) };
  offers.push(stored);
  return stored;
}

export function generateOfferLadder(brand: string, audience: string) {
  const brandOffers = offers.filter((offer) => offer.brand === brand && offer.audience === audience);
  return ladderStages.map((stage) => ({ stage, offers: brandOffers.filter((offer) => offer.stage === stage) }));
}

export function identifyMissingOffers(ladder: Array<{ stage: string; offers: OfferRecord[] }>): string[] {
  return ladder.filter((step) => step.offers.length === 0).map((step) => step.stage);
}

export function generateLeadMagnetIdea(offer: OfferRecord) {
  return { title: `${offer.audience} checklist for ${offer.offerName}`, CTA: offer.landingPage || "Join the list", approvalRequired: true };
}

export function generateUpsellPath(offer: OfferRecord): string[] {
  return offer.upsellPath && offer.upsellPath.length ? offer.upsellPath : ["Lead magnet", offer.offerName, "Premium package", "Retainer or partner conversation"];
}

export function validateOfferClaims(offer: OfferRecord) {
  const text = `${offer.offerName} ${offer.valuePromise} ${(offer.deliverables || []).join(" ")}`.toLowerCase();
  const warnings: string[] = [];
  if (/guarantee|guaranteed|viral|income|funding/.test(text)) warnings.push("Guaranteed results or funding claim requires review.");
  if (/medical|diagnose|treat|therapy|clinical/.test(text)) warnings.push("Medical or clinical claim requires review.");
  return { valid: warnings.length === 0, warnings, approvalRequired: warnings.length > 0 || isPaidOrPublic(offer) };
}

function isPaidOrPublic(offer: OfferRecord): boolean {
  return !!offer.priceRange || /Product|Service|Package|Subscription|Pilot|Funding|Grant/i.test(offer.stage);
}
