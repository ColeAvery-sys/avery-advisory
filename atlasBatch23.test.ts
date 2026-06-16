import { createAudienceSnapshot, generateAudienceDashboard, identifyTopAudienceSegments, identifyCommunityRisks, generateAudienceRecommendation } from "./audienceCommandEngine";
import { createCommunityContact, updateRelationship, getContactsByRelationship, createFollowUpDraft, generateThankYouDraft, generateCollaborationDraft } from "./communityCrmEngine";
import { createCommentRecord, classifyComment, analyzeComments, generateCommentInsights } from "./commentIntelligenceEngine";
import { createSupporterRecord, calculateSupporterScore, classifySupporter, identifySuperfans, generateSupporterActionDraft } from "./fanSupporterEngine";
import { createNewsletterRecord, calculateNewsletterHealth, generateNewsletterIdeas, generateSubjectLines, generateWelcomeSequence, generateLeadMagnetIdeas } from "./newsletterGrowthEngine";
import { createCommunityHubPlan, generateCommunityChannels, generateCommunityRules, generateModerationPlan, generateCommunityEventIdeas } from "./communityHubPlanner";
import { createResearchDataset, identifyTopTopics, identifyFastestGrowingInterests, generateAudienceResearchOutputs } from "./audienceResearchEngine";
import { createFeedbackRecord, classifyFeedback, mineFeedback, generateOpportunityReport } from "./feedbackMiningEngine";
import { createSurvey, generateSurvey, generatePoll, analyzeSurveyResults, generateSurveyInsights } from "./pollSurveyEngine";
import { createSuperfanRecord, recommendSuperfanStage, advanceSuperfanStage, generateSuperfanAction, identifyAdvocates } from "./superfanPipelineEngine";

createAudienceSnapshot({ id: "snap-1", platforms: [{ platform: "YouTube", followers: 100 }] });
const dashboard = generateAudienceDashboard({
  platforms: [{ platform: "YouTube", followers: 100 }, { platform: "Newsletter", subscribers: 20 }],
  contacts: [{ relationshipType: "Client" }, { relationshipType: "Superfan" }],
  comments: [{ text: "I love this" }, { text: "refund complaint" }],
});
assertEqual(dashboard.audienceSize, 120);
assertEqual(identifyTopAudienceSegments({ contacts: [{ relationshipType: "Fan" }, { relationshipType: "Fan" }, { relationshipType: "Client" }] })[0].segment, "Fan");
assertEqual(identifyCommunityRisks({ comments: [{ text: "angry refund" }] }).length, 1);
assertEqual(generateAudienceRecommendation({ contacts: [{ relationshipType: "Client" }], comments: [] }).approvalRequired, true);

const contact = createCommunityContact({ id: "contact-1", name: "Avery Fan", platform: "YouTube", username: "fan1", relationshipType: "Fan", interests: ["ATLAS"], brandsFollowed: ["AveryTech"] });
assertEqual(updateRelationship("contact-1", { relationshipType: "Superfan" }).relationshipType, "Superfan");
assertEqual(getContactsByRelationship("Superfan").length, 1);
assertEqual(createFollowUpDraft("contact-1").approvalRequired, true);
assertEqual(generateThankYouDraft("contact-1").body.indexOf("Draft thank-you") >= 0, true);
assertEqual(generateCollaborationDraft("contact-1").approvalRequired, true);

assertEqual(classifyComment({ text: "How much is editing?" }), "Potential Lead");
const comment = createCommentRecord({ id: "comment-1", text: "Can you add a beta?", topic: "ATLAS Assist" });
assertEqual(comment.category, "Feature Request");
const analysis = analyzeComments([{ text: "How does this work?", topic: "ATLAS" }, { text: "I need editing quote", topic: "Creator Logistics" }]);
assertEqual(analysis.commonQuestions.length, 1);
assertEqual(analysis.potentialClients.length, 1);
assertEqual(generateCommentInsights({ comments: analysis.commonQuestions }).contentIdeas.length, 1);

const supporter = createSupporterRecord({ id: "supporter-1", name: "Supporter", commentFrequency: 3, shares: 2, purchases: 1, newsletterOpens: 4, communityActivity: 2, referrals: 1 });
assertEqual(calculateSupporterScore(supporter) >= 85, true);
assertEqual(classifySupporter(90), "Superfan");
assertEqual(identifySuperfans({ supporters: [supporter] }).length, 1);
assertEqual(generateSupporterActionDraft("supporter-1", "invite to beta").approvalRequired, true);

const newsletter = createNewsletterRecord({ id: "news-1", subscribers: 50, openRate: 0.5, clickRate: 0.2, growthRate: 0.1 });
assertEqual(calculateNewsletterHealth(newsletter).status, "Weak");
assertEqual(generateNewsletterIdeas({ bestTopics: ["ATLAS Assist"] }).indexOf("ATLAS Assist") >= 0, true);
assertEqual(generateSubjectLines("Creator Logistics").length, 3);
assertEqual(generateWelcomeSequence("creators").length, 4);
assertEqual(generateLeadMagnetIdeas("Creator").length, 4);

const hub = createCommunityHubPlan({ id: "hub-1", communityName: "ATLAS Assist Feedback Group" });
assertEqual(generateCommunityChannels(hub).indexOf("accessibility-feedback") >= 0, true);
assertEqual(generateCommunityRules(hub).indexOf("No spam or fake engagement") >= 0, true);
assertEqual(generateModerationPlan(hub).approvalRequired, true);
assertEqual(generateCommunityEventIdeas(hub).length, 5);

const dataset = createResearchDataset({ items: [{ topic: "ATLAS" }, { topic: "ATLAS" }, { topic: "Creator Logistics" }], interests: [{ interest: "AI", previous: 1, current: 5 }], productRequests: ["planner"], painPoints: ["too much footage"], communityQuestions: ["How do I start?"] });
assertEqual(identifyTopTopics(dataset)[0].topic, "ATLAS");
assertEqual(identifyFastestGrowingInterests(dataset)[0].interest, "AI");
assertEqual(generateAudienceResearchOutputs(dataset).leadMagnetIdeas.length, 2);

assertEqual(classifyFeedback({ feedbackText: "I wish you would add a planner" }), "Feature Request");
createFeedbackRecord({ id: "fb-1", feedbackText: "This problem is hard", source: "comment" });
const mined = mineFeedback({ feedback: [{ feedbackText: "Please make a template product" }, { feedbackText: "This problem is hard" }] });
assertEqual(mined.productRequests.length, 1);
assertEqual(generateOpportunityReport({ feedback: [{ feedbackText: "This problem is hard" }] }).topCategory, "Pain Point");

const survey = createSurvey({ id: "survey-1", surveyName: "Audience Research", questions: ["What next?"] });
assertEqual(survey.status, "Draft");
assertEqual(generateSurvey({ id: "survey-2", surveyType: "Product Research" }).questions.length, 4);
assertEqual(generatePoll("ATLAS").approvalRequired, true);
assertEqual(analyzeSurveyResults([{ answer: "template" }, { answer: "template" }, { answer: "video" }]).topAnswer[0], "template");
assertEqual(generateSurveyInsights([{ answer: "template" }]).insight.indexOf("template") >= 0, true);

const superfan = createSuperfanRecord({ id: "sf-1", name: "Fan", stage: "Community Member", commentFrequency: 4, shares: 2, purchases: 2, newsletterOpens: 5, communityActivity: 3, referrals: 1 });
assertEqual(recommendSuperfanStage(90), "Advocate");
assertThrows(() => advanceSuperfanStage("sf-1"));
assertEqual(advanceSuperfanStage("sf-1", { approvedByCole: true }).stage, "Supporter");
assertEqual(generateSuperfanAction("sf-1", "invite to launch").approvalRequired, true);
assertEqual(identifyAdvocates({ records: [{ stage: "Advocate" }, superfan] }).length, 1);

console.log("All ATLAS Batch 23 tests passed.");

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
