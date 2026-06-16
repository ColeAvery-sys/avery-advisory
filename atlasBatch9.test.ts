import { generateAtlasSelfImprovementReport } from "./atlasSelfImprovementEngine";
import { addInteractionRecord, analyzeAudienceResponses, generateNextBestMessage, clearInteractionsForDemo } from "./clientFunderIntelligenceEngine";
import { createDecisionRecord, generateDecisionLesson, updateDecisionOutcome, clearDecisionsForDemo } from "./decisionHistoryEngine";
import { consolidateMemory, exportMemorySummary, markMemoryDeprecated } from "./memoryConsolidatorEngine";
import { createOutcomeRecord, calculateOutcomeImpact, getRevenueImpactSummary, clearOutcomesForDemo } from "./outcomeTrackerEngine";
import { detectPatterns } from "./patternDetectorEngine";
import { addPreference, applyPreferencesToText, confirmPreference, getActivePreferences, rejectPreference, clearPreferencesForDemo } from "./preferenceProfileEngine";
import { analyzeScoringAccuracy, applyWeightUpdate, clearScoringVersionsForDemo, suggestWeightUpdates } from "./recommendationScoringLab";
import { generateStrategyReview } from "./strategyIntelligenceEngine";
import { generateLessonFromOutcome, convertLessonToRule, clearLessonsForDemo } from "./lessonsLearnedEngine";

clearPreferencesForDemo();
addPreference({ id: "p1", category: "Writing Style", preference: "Use direct, practical language", source: "test", confidence: 0.8, status: "Needs Confirmation" });
confirmPreference("p1");
assertEqual(applyPreferencesToText("Perhaps this works — maybe.", getActivePreferences()).includes("—"), false);
addPreference({ id: "p2", category: "Visual Style", preference: "unused", source: "test", confidence: 0.2, status: "Needs Confirmation" });
rejectPreference("p2");
assertEqual(getActivePreferences().some((preference) => preference.id === "p2"), false);

clearDecisionsForDemo();
const decision = createDecisionRecord({
  id: "d1",
  decisionTitle: "Prioritize Creator Logistics",
  decisionType: "Client/Sales",
  department: "Sales",
  context: "Need cash",
  optionsConsidered: ["Creator Logistics", "Moonshot"],
  recommendationGiven: "Creator Logistics",
  decisionMade: "Creator Logistics",
  decidedBy: "Cole",
  dateDecided: "2099-01-01",
  confidenceAtTime: 0.8,
  expectedOutcome: "Win client cash",
  relatedTasks: [],
  relatedMoneyItems: [],
  relatedGrants: [],
  relatedClients: [],
  relatedProducts: [],
  tags: ["cash"],
});
assertEqual(decision.outcomeStatus, "Pending");
updateDecisionOutcome("d1", "Worked", "Won a client.");
assertEqual(generateDecisionLesson("d1").includes("Expected"), true);

clearOutcomesForDemo();
const outcome = createOutcomeRecord({
  id: "o1",
  relatedDecision: "d1",
  actionTaken: "Followed warm creator lead",
  expectedOutcome: "Response",
  actualOutcome: "Client won",
  resultType: "Client Won",
  revenueImpact: 1200,
  timeCost: 2,
  emotionalCost: 1,
  strategicValue: 8,
  whatWorked: "Clear content pain",
  whatFailed: "",
  whatToRepeat: "Warm creator follow-up",
  whatToAvoid: "Broad cold pitch",
  dateMeasured: "2099-01-02",
});
assertEqual(calculateOutcomeImpact(outcome).score > 0, true);
assertEqual(getRevenueImpactSummary().totalRevenueImpact, 1200);

clearLessonsForDemo();
const lesson = generateLessonFromOutcome(outcome);
assertEqual(convertLessonToRule(lesson.id).includes("Repeat"), true);

const memories = consolidateMemory({ Revenue: [outcome], Strategy: [] });
assertEqual(memories.some((memory) => memory.status === "Low Confidence"), true);
markMemoryDeprecated(memories[0].id, memories);
assertEqual(exportMemorySummary(memories).includes(memories[0].title), false);

const patterns = detectPatterns({
  outcomes: [outcome],
  clients: [{ id: "c1", status: "warm replied" }],
  grants: [{ id: "g1", risk: "missing budget" }],
  tasks: [{ id: "t1", title: "moonshot distraction" }],
  decisions: [],
  products: [],
  approvals: [],
  logs: [],
  preferences: [],
});
assertEqual(patterns.detectedPatterns.some((pattern) => pattern.status === "Low Confidence"), true);

const strategy = generateStrategyReview({
  currentStrategy: "Build ATLAS",
  moneyPipeline: [{ title: "Creator Logistics", score: 90 }],
  grants: [{ title: "Disability Aid AI", score: 80 }],
  products: [{ title: "ATLAS HQ", score: 85 }, { title: "Moonshot", score: 20 }],
  blockers: [{ title: "Approval backlog" }],
  patterns: patterns.detectedPatterns,
});
assertEqual(strategy.decisionItems[0].approvalRequired, true);

clearInteractionsForDemo();
addInteractionRecord({ id: "i1", audienceType: "Creator", contactOrOrganization: "Creator", messageUsed: "clips", offerUsed: "Creator Logistics", response: "interested reply", outcome: "call booked", objections: ["price"], interests: ["clips"], whatWorked: "clear offer", whatDidNotWork: "", tags: ["warm"] });
const intelligence = analyzeAudienceResponses([{ id: "i1", audienceType: "Creator", contactOrOrganization: "Creator", messageUsed: "clips", offerUsed: "Creator Logistics", response: "interested reply", outcome: "call booked", objections: ["price"], interests: ["clips"], whatWorked: "clear offer", whatDidNotWork: "", tags: ["warm"] }]);
assertEqual(intelligence.warning !== undefined, true);
assertEqual(generateNextBestMessage({ name: "Creator", audienceType: "Creator" }, intelligence).approvalRequired, true);

clearScoringVersionsForDemo();
const analysis = analyzeScoringAccuracy("Product Roadmap Scoring", [{ id: "r1", score: 90 }], [{ relatedRecommendation: "r1", resultType: "Failed" }]);
const update = suggestWeightUpdates("Product Roadmap Scoring", analysis);
assertThrows(() => applyWeightUpdate("Product Roadmap Scoring", { weights: update.suggestedWeightChanges, reason: update.reason }, { approvedByCole: false }));
assertEqual(applyWeightUpdate("Product Roadmap Scoring", { weights: update.suggestedWeightChanges, reason: update.reason }, { approvedByCole: true }).status, "Active");

const self = generateAtlasSelfImprovementReport({
  recommendations: [{ id: "r1", title: "Bad rec" }],
  outcomes: [{ relatedRecommendation: "r1", resultType: "Failed" }],
  failedRuns: [{ title: "Loop failed" }],
  userCorrections: ["too broad", "too broad"],
  blockedTasks: [],
  errorLogs: [],
  workflowUsage: [],
  scoringHistory: [],
  featureRequests: [{ title: "Decision History UI" }],
});
assertEqual(self.repeatedUserCorrections.includes("too broad"), true);

console.log("All ATLAS Batch 9 tests passed.");

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
