import { createBrandRecord, generateBrandBrief, scoreBrandPriority } from "./brandEmpireMapEngine";
import { createOffer, generateOfferLadder, identifyMissingOffers, validateOfferClaims } from "./offerLadderEngine";
import { createAssetRecord, checkCommercialUse, approvePublicUse, attachProofOfRights } from "./assetRightsTrackerEngine";
import { createPolicyNote, generatePlatformRiskChecklist, flagRiskyPostOrListing } from "./platformPolicyTrackerEngine";
import { createCrossPromoRecord, identifyBestTrafficRoute, identifyBrandConfusionRisk } from "./crossPromotionEngine";
import { repurposeIdea, validateRepurposedAsset } from "./productRepurposingEngine";
import { createAuditTarget, runStorefrontAudit } from "./storefrontAuditEngine";
import { createAdTest, generateBudgetRecommendation, markLaunchedManually } from "./adTestPlannerEngine";
import { createSupportMessage, generateSupportReply, markReplySentManually } from "./customerSupportDraftEngine";
import { createRevenueRecord, generateAttributionReport, calculateAttributionConfidence } from "./revenueAttributionEngine";

const brand = createBrandRecord({ id: "brand-1", brandName: "ATLAS Creator Logistics", parentCompany: "Avery Industries LLC", brandType: "Service Division", mission: "Creator editing services", audience: "overwhelmed creators", mainOffers: ["Growth package"], platforms: ["Website", "YouTube"], relatedLandingPages: ["/creator-logistics"], monetizationPaths: ["services"] });
assertEqual(generateBrandBrief("brand-1").brandName, "ATLAS Creator Logistics");
assertEqual(scoreBrandPriority("brand-1", { revenue: 1200, strategicValue: 8, distractionRisk: 2 }).priorityLabel, "High");

const offer = createOffer({ id: "offer-1", offerName: "Growth package", brand: "ATLAS Creator Logistics", audience: "overwhelmed creators", stage: "Service Offer", priceRange: "$750 to $1,500", valuePromise: "organized clip workflow", landingPage: "/creator-logistics" });
const ladder = generateOfferLadder("ATLAS Creator Logistics", "overwhelmed creators");
assertEqual(identifyMissingOffers(ladder).indexOf("Lead Magnet") >= 0, true);
assertEqual(validateOfferClaims({ ...offer, valuePromise: "guaranteed viral growth" }).valid, false);

const asset = createAssetRecord({ id: "asset-1", assetName: "Unknown music", assetType: "Music", licenseType: "Unknown", commercialUseAllowed: false });
assertEqual(checkCommercialUse("asset-1").allowed, false);
assertThrows(() => approvePublicUse("asset-1", { approvedByCole: true }));
attachProofOfRights("asset-1", "proof-link");

createPolicyNote({ id: "policy-1", platform: "Reddit", policyCategory: "spam", plainLanguageSummary: "No spam", riskyActions: ["buy now"], prohibitedActions: ["fake engagement"] });
assertEqual(generatePlatformRiskChecklist("Reddit").length > 1, true);
assertEqual(flagRiskyPostOrListing({ draft: "buy now" }, "Reddit").manualReviewRequired, true);

const route = createCrossPromoRecord({ id: "route-1", sourceBrand: "The New Prometheus", sourcePlatform: "YouTube", targetBrand: "AveryTech", targetOffer: "ATLAS Assist pilot", targetLandingPage: "/atlas-assist", CTA: "Request pilot info", audienceFit: 9, expectedValue: 8 });
assertEqual(identifyBestTrafficRoute({}).id, route.id);
assertEqual(identifyBrandConfusionRisk([route]).riskLevel, "Low");

const repurposed = repurposeIdea({ coreIdea: "Creator content system", brand: "Creator Logistics" });
assertEqual(repurposed.assets.length, 12);
assertEqual(validateRepurposedAsset({ title: "AI", description: "guarantee income" }).valid, false);

const audit = runStorefrontAudit(createAuditTarget({ id: "audit-1", targetName: "Creator Logistics page", platform: "Website", title: "Creator Logistics", description: "editing service", CTA: "Start intake" }));
assertEqual(audit.approvalRequired, true);

const ad = createAdTest({ id: "ad-1", campaignName: "Creator test", platform: "Facebook Ads", offer: "Growth package", audience: "creators", budget: 25, duration: "3 days", landingPage: "/creator-logistics" });
assertEqual(generateBudgetRecommendation(ad).approvalRequired, true);
assertThrows(() => markLaunchedManually("ad-1"));

const support = createSupportMessage({ id: "msg-1", senderName: "Buyer", platform: "Etsy", message: "I want a refund", urgency: 8 });
assertEqual(generateSupportReply(support).escalationRequired, true);
assertThrows(() => markReplySentManually("msg-1"));

const revenue = createRevenueRecord({ revenueId: "rev-1", amount: 1200, source: "Creator Logistics page", platform: "Website", landingPage: "/creator-logistics", offer: "Growth package", clientOrCustomer: "Client", date: "2099-01-01" });
assertEqual(calculateAttributionConfidence(revenue), "Confirmed");
assertEqual(generateAttributionReport({ start: "2099-01-01", end: "2099-12-31" }).bestRevenueChannel.source, "Creator Logistics page");

console.log("All ATLAS Batch 19 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}

function assertThrows(callback: () => void): void {
  let threw = false;
  try {
    callback();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("Expected function to throw.");
}
