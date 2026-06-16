import { createBrandRecord, generatePlatformPlan, scoreBrandPriority } from "./brandEmpireMapEngine";
import { createOffer, generateOfferLadder } from "./offerLadderEngine";
import { createAssetRecord, generateRightsSummary } from "./assetRightsTrackerEngine";
import { createPolicyNote, generatePlatformRiskChecklist } from "./platformPolicyTrackerEngine";
import { createCrossPromoRecord, identifyBestTrafficRoute } from "./crossPromotionEngine";
import { repurposeIdea } from "./productRepurposingEngine";
import { createAuditTarget, runStorefrontAudit } from "./storefrontAuditEngine";
import { createAdTest, generateAdCopy, generateBudgetRecommendation } from "./adTestPlannerEngine";
import { createSupportMessage, generateSupportReply } from "./customerSupportDraftEngine";
import { createRevenueRecord, generateAttributionReport } from "./revenueAttributionEngine";

console.log("Brand Empire Map");
createBrandRecord({ id: "brand-demo", brandName: "ATLAS Creator Logistics", parentCompany: "Avery Industries LLC", brandType: "Service Division", mission: "Creator editing services", audience: "overwhelmed creators", mainOffers: ["Growth package"], platforms: ["Website", "YouTube"], relatedLandingPages: ["/creator-logistics"], monetizationPaths: ["services"] });
console.log(generatePlatformPlan("brand-demo"));
console.log(scoreBrandPriority("brand-demo", { revenue: 1200, strategicValue: 8, distractionRisk: 2 }));

console.log("\nOffer Ladder");
createOffer({ id: "offer-demo", offerName: "Growth package", brand: "ATLAS Creator Logistics", audience: "overwhelmed creators", stage: "Service Offer", priceRange: "$750 to $1,500", valuePromise: "organized clip workflow", landingPage: "/creator-logistics" });
console.log(generateOfferLadder("ATLAS Creator Logistics", "overwhelmed creators"));

console.log("\nAsset Rights");
createAssetRecord({ id: "asset-demo", assetName: "Unknown music", assetType: "Music", licenseType: "Unknown", commercialUseAllowed: false });
console.log(generateRightsSummary("asset-demo"));

console.log("\nPlatform Policy");
createPolicyNote({ id: "policy-demo", platform: "Reddit", policyCategory: "spam", plainLanguageSummary: "No spam", riskyActions: ["buy now"], prohibitedActions: ["fake engagement"] });
console.log(generatePlatformRiskChecklist("Reddit"));

console.log("\nCross Promotion");
const route = createCrossPromoRecord({ id: "route-demo", sourceBrand: "The New Prometheus", sourcePlatform: "YouTube", targetBrand: "AveryTech", targetOffer: "ATLAS Assist pilot", targetLandingPage: "/atlas-assist", CTA: "Request pilot info", audienceFit: 9, expectedValue: 8 });
console.log(identifyBestTrafficRoute({ records: [route] }));

console.log("\nProduct Repurposing");
console.log(repurposeIdea({ coreIdea: "Creator content system", brand: "Creator Logistics" }));

console.log("\nStorefront Audit");
console.log(runStorefrontAudit(createAuditTarget({ id: "audit-demo", targetName: "Creator Logistics page", platform: "Website", title: "Creator Logistics", description: "editing service", CTA: "Start intake" })));

console.log("\nAd Test");
const ad = createAdTest({ id: "ad-demo", campaignName: "Creator test", platform: "Facebook Ads", offer: "Growth package", audience: "creators", budget: 25, duration: "3 days", landingPage: "/creator-logistics" });
console.log(generateAdCopy(ad));
console.log(generateBudgetRecommendation(ad));

console.log("\nSupport Draft");
const support = createSupportMessage({ id: "msg-demo", senderName: "Buyer", platform: "Etsy", message: "I want a refund", urgency: 8 });
console.log(generateSupportReply(support));

console.log("\nRevenue Attribution");
createRevenueRecord({ revenueId: "rev-demo", amount: 1200, source: "Creator Logistics page", platform: "Website", landingPage: "/creator-logistics", offer: "Growth package", clientOrCustomer: "Client", date: "2099-01-01" });
console.log(generateAttributionReport({ start: "2099-01-01", end: "2099-12-31" }));
