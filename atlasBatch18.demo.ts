import { createChannelRecord, createVideoRecord, generateUploadPackage } from "./youtubeChannelManagerEngine";
import { createSourceIdea, generatePlatformVariations } from "./multiPlatformPostingEngine";
import { createServiceListing, submitServiceRequest, generateQuoteDraft } from "./serviceMarketplaceEngine";
import { createEtsyListingDraft } from "./etsyListingEngine";
import { createBookProject, generateBookListingCopy } from "./amazonBookListingEngine";
import { createMerchStore, createMerchProduct, generatePromoPost } from "./merchStoreEngine";
import { createFacebookPageRecord, generateFacebookPost } from "./facebookPageEngine";
import { createInstagramAccountRecord, generateReelScript } from "./instagramPageEngine";
import { createSubredditRecord, generateCommunitySafePost } from "./redditGrowthEngine";
import { recordPlatformMetric, generateMediaEmpireReport } from "./mediaBaronAnalyticsEngine";

console.log("YouTube Channel Manager");
createChannelRecord({ channelName: "The New Prometheus" });
const video = createVideoRecord({ id: "video-demo", channelName: "The New Prometheus", videoTitle: "Technology as Fire", videoType: "Essay", targetAudience: "founders", relatedLandingPage: "/demo" });
console.log(generateUploadPackage(video));

console.log("\nMulti-Platform Posting");
const idea = createSourceIdea({ title: "Creator Logistics offer", brand: "Creator Logistics", content: "Turn one long video into a content system.", goal: "lead", link: "/creator-logistics" });
console.log(generatePlatformVariations(idea, ["YouTube Shorts", "Reddit", "Instagram Reels"]));

console.log("\nService Marketplace");
console.log(createServiceListing({ id: "service-demo", serviceName: "Short-Form Clip Package", category: "Video Editing", startingPrice: 750 }));
const request = submitServiceRequest({ id: "request-demo", clientName: "Client", requestedService: "Short-Form Clip Package", budget: 1000 });
console.log(generateQuoteDraft(request));

console.log("\nEtsy Listing");
console.log(createEtsyListingDraft({ id: "etsy-demo", productName: "Creator Content Planner", productType: "printable PDF", description: "creator workflow planner" }));

console.log("\nAmazon Book Listing");
const book = createBookProject({ id: "book-demo", bookTitle: "Creator Planning Workbook", bookType: "workbook" });
console.log(generateBookListingCopy(book));

console.log("\nMerch Store");
createMerchStore({ storeName: "AveryTech" });
const merch = createMerchProduct({ id: "merch-demo", productName: "Build the System Shirt", storeName: "AveryTech", productType: "t-shirt" });
console.log(generatePromoPost(merch));

console.log("\nFacebook and Instagram");
createFacebookPageRecord({ pageName: "AveryTech" });
console.log(generateFacebookPost({ pageName: "AveryTech", message: "New demo draft" }));
createInstagramAccountRecord({ accountName: "AveryTech" });
console.log(generateReelScript({ topic: "Creator Logistics" }));

console.log("\nReddit Growth");
createSubredditRecord({ subreddit: "r/VideoEditing", rulesSummary: "No spam" });
console.log(generateCommunitySafePost({ subreddit: "r/VideoEditing", context: "I am organizing creator footage", question: "What workflow helps?" }));

console.log("\nMedia Baron Analytics");
recordPlatformMetric({ platform: "YouTube", date: "2099-01-01", views: 1000, leads: 2, revenue: 0, engagement: 100 });
recordPlatformMetric({ platform: "Service Marketplace", date: "2099-01-01", views: 100, leads: 3, revenue: 1200, engagement: 20 });
console.log(generateMediaEmpireReport({}));
