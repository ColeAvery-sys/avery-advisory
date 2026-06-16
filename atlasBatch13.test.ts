import { generateWeeklyMarketingPlan } from "./marketingCommandEngine";
import { createCampaign, generateThirtyDayContentPlan, clearCampaignsForDemo } from "./campaignPlannerEngine";
import { createContentItem, getContentNeedingApproval, markPublishedManually, clearContentCalendarForDemo } from "./contentCalendarEngine";
import { generatePromoBatch, generatePackageComparisonPost } from "./creatorLogisticsPromoEngine";
import { createVideoProject, generateUploadPackage, generateShortsFromVideo, clearVideoProjectsForDemo } from "./youtubePipelineEngine";
import { generateClipBatch, sendClipBatchToApproval, clearClipsForDemo } from "./shortFormClipEngine";
import { generateNewPrometheusVideoIdeas, createChannelContentCalendar } from "./newPrometheusChannelEngine";
import { generateThoughtLeadershipPost, validateThoughtLeadershipClaims } from "./thoughtLeadershipEngine";
import { createArticlePlan, generateArticleOutline, validateSeoDraft } from "./seoArticlePlannerEngine";
import { recordMarketingEvent, calculateCampaignPerformance, generateMarketingReport, clearMarketingAnalyticsForDemo } from "./marketingAnalyticsEngine";

clearCampaignsForDemo();
clearContentCalendarForDemo();
clearVideoProjectsForDemo();
clearClipsForDemo();
clearMarketingAnalyticsForDemo();

const weeklyPlan = generateWeeklyMarketingPlan({
  creatorLeads: [{ id: "lead-1" }],
  content: [{ id: "content-1", approvalStatus: "Needs Cole Approval" }],
});
assertEqual(weeklyPlan.priorities[0], "Creator Logistics lead conversion");
assertEqual(weeklyPlan.contentWaitingOnCole.length, 1);
assertEqual(weeklyPlan.tasks[0].approvalRequired, true);

const campaign = createCampaign({
  id: "camp-1",
  campaignName: "Creator Logistics Sprint",
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
  targetKPIs: ["creator leads"],
  status: "Draft",
  approvalStatus: "Needs Cole Approval",
});
assertEqual(generateThirtyDayContentPlan(campaign).length, 30);

const riskyContent = createContentItem({
  id: "content-risk",
  title: "Disability grant update",
  brand: "AveryTech",
  platform: "LinkedIn",
  contentType: "LinkedIn Post",
  status: "Drafting",
  approvalStatus: "Needs Cole Approval",
  assetLinks: [],
  callToAction: "/demo",
});
assertEqual(riskyContent.reviewLevel, "High Review");
assertEqual(getContentNeedingApproval().length, 1);
assertThrows(() => markPublishedManually("content-risk"));

const promo = generatePromoBatch("You have footage, not a system.", 2);
assertEqual(promo.length, 2);
assertEqual(generatePackageComparisonPost().approvalRequired, true);

const video = createVideoProject({
  id: "video-1",
  videoTitle: "Ethical Automation",
  channel: "AveryTech",
  concept: "human-approved automation",
  targetAudience: "founders",
  purpose: "Build trust",
  status: "Script Draft",
  approvalStatus: "Needs Cole Approval",
  landingPage: "/demo",
});
assertEqual(generateUploadPackage(video).approvalRequired, true);
assertEqual(generateShortsFromVideo(video).length, 3);

const clips = generateClipBatch("Creator Logistics workflow", 3);
assertEqual(clips.length, 3);
assertEqual(sendClipBatchToApproval(clips)[0].approvalRequired, true);

const ideas = generateNewPrometheusVideoIdeas(4);
assertEqual(ideas.length, 4);
assertEqual(createChannelContentCalendar(ideas)[0].approvalRequired, true);

assertEqual(generateThoughtLeadershipPost("ethical automation").approvalRequired, true);
assertEqual(validateThoughtLeadershipClaims("This will guarantee funding").valid, false);

const article = createArticlePlan({
  id: "article-1",
  title: "Creator content systems",
  keyword: "creator content workflow",
  relatedOffer: "Creator Logistics",
  relatedLandingPage: "/creator-logistics",
});
assertEqual(generateArticleOutline(article).length > 0, true);
assertEqual(validateSeoDraft({ ...article, draft: "This will guarantee growth." }).valid, false);

recordMarketingEvent({ eventType: "page viewed", campaignId: "camp-1", contentId: "content-a", timestamp: "2099-01-01" });
recordMarketingEvent({ eventType: "page viewed", campaignId: "camp-1", contentId: "content-a", timestamp: "2099-01-02" });
recordMarketingEvent({ eventType: "creator lead submitted", campaignId: "camp-1", contentId: "content-a", leadId: "lead-1", timestamp: "2099-01-02", evidenceStrength: "Medium" });
assertEqual(calculateCampaignPerformance("camp-1").leads, 1);
assertEqual(generateMarketingReport({ start: "2099-01-01", end: "2099-12-31" }).metrics.creatorLeads, 1);

console.log("All ATLAS Batch 13 tests passed.");

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
