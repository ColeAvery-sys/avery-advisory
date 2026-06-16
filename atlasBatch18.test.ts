import { createChannelRecord, createVideoRecord, generateUploadPackage, markUploadedManually } from "./youtubeChannelManagerEngine";
import { createSourceIdea, generatePlatformVariations } from "./multiPlatformPostingEngine";
import { createServiceListing, submitServiceRequest, generateQuoteDraft, convertRequestToDeal } from "./serviceMarketplaceEngine";
import { createEtsyListingDraft, calculateEtsySeoScore, markPublishedManually as markEtsyPublished } from "./etsyListingEngine";
import { createBookProject, generateKdpKeywords, generateAmazonAdsDraft } from "./amazonBookListingEngine";
import { createMerchStore, createMerchProduct, generatePromoPost } from "./merchStoreEngine";
import { createFacebookPageRecord, generateFacebookPost, generateAdDraft } from "./facebookPageEngine";
import { createInstagramAccountRecord, generateReelScript, createInstagramPostDraft } from "./instagramPageEngine";
import { createSubredditRecord, generateCommunitySafePost, flagRedditSpamRisk } from "./redditGrowthEngine";
import { recordPlatformMetric, generateMediaEmpireReport, saveFindingsToLessonsLearned } from "./mediaBaronAnalyticsEngine";

createChannelRecord({ channelName: "The New Prometheus" });
const video = createVideoRecord({ id: "video-1", channelName: "The New Prometheus", videoTitle: "Technology as Fire", videoType: "Essay", targetAudience: "founders", relatedLandingPage: "/demo" });
assertEqual(generateUploadPackage(video).approvalStatus, "Needs Cole Approval");
assertThrows(() => markUploadedManually("video-1"));

const idea = createSourceIdea({ title: "Creator Logistics offer", brand: "Creator Logistics", content: "Turn one long video into a content system.", goal: "lead", link: "/creator-logistics" });
const variations = generatePlatformVariations(idea, ["YouTube Shorts", "Reddit", "Instagram Reels"]);
assertEqual(variations.length, 3);
assertEqual(variations[1].riskWarnings.length > 0, true);

const service = createServiceListing({ id: "service-1", serviceName: "Short-Form Clip Package", category: "Video Editing", startingPrice: 750 });
assertEqual(service.approvalStatus, "Needs Cole Approval");
const request = submitServiceRequest({ id: "request-1", clientName: "Client", requestedService: "Short-Form Clip Package", budget: 1000 });
assertEqual(generateQuoteDraft(request).approvalRequired, true);
assertEqual(convertRequestToDeal("request-1").approvalRequired, true);

const etsy = createEtsyListingDraft({ id: "etsy-1", productName: "Creator Content Planner", productType: "printable PDF", description: "creator workflow planner" });
assertEqual(calculateEtsySeoScore(etsy) > 0, true);
assertThrows(() => markEtsyPublished("etsy-1"));

const book = createBookProject({ id: "book-1", bookTitle: "Creator Planning Workbook", bookType: "workbook" });
assertEqual(generateKdpKeywords(book).length > 0, true);
assertEqual(generateAmazonAdsDraft(book).approvalRequired, true);

createMerchStore({ storeName: "AveryTech" });
const merch = createMerchProduct({ id: "merch-1", productName: "Build the System Shirt", storeName: "AveryTech", productType: "t-shirt" });
assertEqual(generatePromoPost(merch).approvalRequired, true);

createFacebookPageRecord({ pageName: "AveryTech" });
assertEqual(generateFacebookPost({ pageName: "AveryTech", message: "New demo draft" }).approvalStatus, "Needs Cole Approval");
assertEqual(generateAdDraft({ campaignName: "Demo", offer: "AveryTech demo" }).budgetApprovalRequired, true);

createInstagramAccountRecord({ accountName: "AveryTech" });
assertEqual(generateReelScript({ topic: "Creator Logistics" }).approvalRequired, true);
assertEqual(createInstagramPostDraft({ topic: "Creator Logistics" }).approvalStatus, "Needs Cole Approval");

createSubredditRecord({ subreddit: "r/VideoEditing", rulesSummary: "No spam" });
const reddit = generateCommunitySafePost({ subreddit: "r/VideoEditing", context: "I am organizing creator footage", question: "What workflow helps?" });
assertEqual(reddit.approvalStatus, "Needs Cole Approval");
assertEqual(flagRedditSpamRisk({ draftPost: "buy now click here" }).riskLevel, "High");

recordPlatformMetric({ platform: "YouTube", date: "2099-01-01", views: 1000, leads: 2, revenue: 0, engagement: 100 });
recordPlatformMetric({ platform: "Service Marketplace", date: "2099-01-01", views: 100, leads: 3, revenue: 1200, engagement: 20 });
const report = generateMediaEmpireReport({});
assertEqual(report.bestPlatform.platform, "Service Marketplace");
assertEqual(saveFindingsToLessonsLearned(report).confidence, "Medium");

console.log("All ATLAS Batch 18 tests passed.");

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
