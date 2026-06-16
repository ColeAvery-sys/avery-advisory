import { generateAtlasSelfImprovementReport } from "./atlasSelfImprovementEngine";
import { addInteractionRecord, analyzeAudienceResponses, generateNextBestMessage, clearInteractionsForDemo } from "./clientFunderIntelligenceEngine";
import { createDecisionRecord, updateDecisionOutcome, clearDecisionsForDemo } from "./decisionHistoryEngine";
import { consolidateMemory, exportMemorySummary } from "./memoryConsolidatorEngine";
import { createOutcomeRecord, clearOutcomesForDemo } from "./outcomeTrackerEngine";
import { detectPatterns } from "./patternDetectorEngine";
import { applyPreferencesToRecommendation, getActivePreferences } from "./preferenceProfileEngine";
import { analyzeScoringAccuracy, suggestWeightUpdates } from "./recommendationScoringLab";
import { generateStrategyReview } from "./strategyIntelligenceEngine";
import { generateLessonFromOutcome, clearLessonsForDemo } from "./lessonsLearnedEngine";

clearDecisionsForDemo();
clearOutcomesForDemo();
clearLessonsForDemo();
clearInteractionsForDemo();

console.log("Decision History");
const decision = createDecisionRecord({
  id: "demo-decision",
  decisionTitle: "Prioritize Creator Logistics",
  decisionType: "Client/Sales",
  department: "Sales",
  context: "Need fastest early cash.",
  optionsConsidered: ["Creator Logistics", "Aphantasia VR"],
  recommendationGiven: "Creator Logistics",
  decisionMade: "Creator Logistics",
  decidedBy: "Cole",
  dateDecided: "2099-01-01",
  confidenceAtTime: 0.82,
  expectedOutcome: "Warm lead converts to paid work.",
  relatedTasks: [],
  relatedMoneyItems: [],
  relatedGrants: [],
  relatedClients: [],
  relatedProducts: [],
  tags: ["cash", "creator"],
});
console.log(updateDecisionOutcome(decision.id, "Worked", "Generated paid client interest."));

console.log("\nOutcome Tracker");
const outcome = createOutcomeRecord({
  id: "demo-outcome",
  relatedDecision: decision.id,
  actionTaken: "Followed up with warm creator lead.",
  expectedOutcome: "Get response.",
  actualOutcome: "Client replied and asked for package.",
  resultType: "Got Response",
  revenueImpact: 750,
  timeCost: 1,
  emotionalCost: 1,
  strategicValue: 8,
  whatWorked: "Specific clips/timestamps pain.",
  whatFailed: "Generic broad pitch.",
  whatToRepeat: "Lead with concrete content operations relief.",
  whatToAvoid: "Broad business-owner messaging.",
  dateMeasured: "2099-01-02",
});
console.log(outcome);

console.log("\nLessons Learned");
console.log(generateLessonFromOutcome(outcome));

console.log("\nMemory Consolidator");
const memory = consolidateMemory({ Revenue: [outcome], Strategy: [decision], EmptyArea: [] });
console.log(exportMemorySummary(memory));

console.log("\nPattern Detector");
const patterns = detectPatterns({ outcomes: [outcome], clients: [{ id: "creator", status: "warm replied" }], grants: [{ id: "grant", note: "missing budget" }], tasks: [{ id: "task", title: "moonshot distraction" }], decisions: [], products: [], approvals: [], logs: [], preferences: [] });
console.log(patterns);

console.log("\nStrategy Intelligence");
console.log(generateStrategyReview({ currentStrategy: "Build ATLAS HQ while finding cash.", moneyPipeline: [{ title: "Creator Logistics", score: 90 }], grants: [{ title: "Disability Aid AI", score: 85 }], products: [{ title: "ATLAS HQ", score: 88 }, { title: "Moonshot", score: 20 }], blockers: [{ title: "Approval backlog" }], patterns: patterns.detectedPatterns }));

console.log("\nPreference Profile");
console.log(applyPreferencesToRecommendation("Recommendation — pursue fast cash first.", getActivePreferences()));

console.log("\nClient/Funder Intelligence");
addInteractionRecord({ id: "interaction-1", audienceType: "Creator", contactOrOrganization: "Creator", messageUsed: "clips offer", offerUsed: "Creator Logistics", response: "interested", outcome: "call booked", objections: ["price"], interests: ["clips"], whatWorked: "specific pain", whatDidNotWork: "long pitch", tags: ["warm"] });
const intelligence = analyzeAudienceResponses([{ id: "interaction-1", audienceType: "Creator", contactOrOrganization: "Creator", messageUsed: "clips offer", offerUsed: "Creator Logistics", response: "interested", outcome: "call booked", objections: ["price"], interests: ["clips"], whatWorked: "specific pain", whatDidNotWork: "long pitch", tags: ["warm"] }]);
console.log(generateNextBestMessage({ name: "Creator", audienceType: "Creator" }, intelligence));

console.log("\nRecommendation Scoring Lab");
const scoringAnalysis = analyzeScoringAccuracy("Product Roadmap Scoring", [{ id: "rec-1", score: 90 }], [{ relatedRecommendation: "rec-1", resultType: "Failed" }]);
console.log(suggestWeightUpdates("Product Roadmap Scoring", scoringAnalysis));

console.log("\nATLAS Self-Improvement");
console.log(generateAtlasSelfImprovementReport({ recommendations: [{ id: "rec-1", title: "Bad recommendation" }], outcomes: [{ relatedRecommendation: "rec-1", resultType: "Failed" }], failedRuns: [{ title: "Loop failure" }], userCorrections: ["too broad", "too broad"], blockedTasks: [], errorLogs: [], workflowUsage: [], scoringHistory: [], featureRequests: [{ title: "Learning UI" }] }));
