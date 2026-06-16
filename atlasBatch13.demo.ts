import { generateWeeklyMarketingPlan } from "./marketingCommandEngine";
import { createCampaign, generateCampaignStrategy, generateThirtyDayContentPlan, clearCampaignsForDemo } from "./campaignPlannerEngine";
import { createContentItem, getContentNeedingApproval, clearContentCalendarForDemo } from "./contentCalendarEngine";
import { generatePromoBatch, generateSalesPost } from "./creatorLogisticsPromoEngine";
import { createVideoProject, generateUploadPackage, clearVideoProjectsForDemo } from "./youtubePipelineEngine";
import { generateClipBatch, sendClipBatchToApproval, clearClipsForDemo } from "./shortFormClipEngine";
import { generateNewPrometheusVideoIdeas, generateEssayOutline } from "./newPrometheusChannelEngine";
import { generateThoughtLeadershipPost, generatePrStatement } from "./thoughtLeadershipEngine";
import { createArticlePlan, generateArticleOutline, generateMetaDescription } from "./seoArticlePlannerEngine";
import { recordMarketingEvent, generateMarketingReport, clearMarketingAnalyticsForDemo } from "./marketingAnalyticsEngine";

clearCampaignsForDemo();
clearContentCalendarForDemo();
clearVideoProjectsForDemo();
clearClipsForDemo();
clearMarketingAnalyticsForDemo();

console.log("Marketing Command");
console.log(generateWeeklyMarketingPlan({ creatorLeads: [{ id: "lead-demo" }], content: [{ status: "Needs Cole Review" }] }));

console.log("\nCampaign Planner");
const campaign = createCampaign({
  id: "campaign-demo",
  campaignName: "Creator Logistics Cash Sprint",
  campaignType: "Creator Logistics Client Acquisition",
  goal: "Generate creator leads and sales",
  targetAudience: "Overwhelmed creators",
  offer: "Creator Logistics review",
  landingPage: "/creator-logistics",
  coreMessage: "Content infrastructure for overwhelmed creators",
  contentPillars: ["Pain", "Workflow", "Offer"],
  channels: ["LinkedIn", "YouTube Shorts"],
  startDate: "2099-01-01",
  endDate: "2099-01-30",
  targetKPIs: ["creator leads", "demo requests"],
  status: "Draft",
  approvalStatus: "Needs Cole Approval",
});
console.log(generateCampaignStrategy(campaign));
console.log(generateThirtyDayContentPlan(campaign).slice(0, 3));

console.log("\nContent Calendar");
createContentItem({
  id: "calendar-demo",
  title: "Creator Logistics promo",
  brand: "ATLAS Creator Logistics",
  platform: "LinkedIn",
  contentType: "LinkedIn Post",
  status: "Drafting",
  approvalStatus: "Needs Cole Approval",
  assetLinks: [],
  callToAction: "/creator-logistics",
});
console.log(getContentNeedingApproval());

console.log("\nCreator Logistics Promo");
console.log(generatePromoBatch("You have footage, not a system.", 2));
console.log(generateSalesPost("Creator Logistics Growth"));

console.log("\nYouTube Pipeline");
const video = createVideoProject({
  id: "video-demo",
  videoTitle: "The Human-Approved Automation Rule",
  channel: "AveryTech",
  concept: "human-approved automation",
  targetAudience: "founders and accessibility partners",
  purpose: "Build trust in AveryTech",
  status: "Outline",
  approvalStatus: "Needs Cole Approval",
  landingPage: "/demo",
});
console.log(generateUploadPackage(video));

console.log("\nShort-Form Clip Pipeline");
const clips = generateClipBatch("AveryTech safety rules", 3);
console.log(clips);
console.log(sendClipBatchToApproval(clips));

console.log("\nThe New Prometheus");
console.log(generateNewPrometheusVideoIdeas(3));
console.log(generateEssayOutline("ethical AI and human dignity"));

console.log("\nThought Leadership");
console.log(generateThoughtLeadershipPost("accessibility-first AI"));
console.log(generatePrStatement({ project: "ATLAS Assist" }));

console.log("\nSEO Article Planner");
const article = createArticlePlan({
  id: "article-demo",
  title: "How creators can organize long-form video",
  keyword: "creator content workflow",
  relatedOffer: "Creator Logistics",
  relatedLandingPage: "/creator-logistics",
});
console.log(generateArticleOutline(article));
console.log(generateMetaDescription(article));

console.log("\nMarketing Analytics");
recordMarketingEvent({ eventType: "page viewed", campaignId: "campaign-demo", contentId: "calendar-demo", timestamp: "2099-01-01" });
recordMarketingEvent({ eventType: "creator lead submitted", campaignId: "campaign-demo", contentId: "calendar-demo", leadId: "lead-demo", timestamp: "2099-01-02", evidenceStrength: "Medium" });
console.log(generateMarketingReport({ start: "2099-01-01", end: "2099-12-31" }));
