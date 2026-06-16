import { createCompanyMemory, summarizeCompanyMemory } from "./companyMemoryEngine";
import { createCompanyLesson } from "./lessonsLearnedEngine";
import { analyzeWinsLosses } from "./winLossAnalyzer";
import { discoverOpportunities } from "./opportunityDiscoveryEngine";
import { detectCompanyPatterns } from "./patternDetectionEngine";
import { createKnowledgeNode, createKnowledgeEdge, generateKnowledgeGraphSummary } from "./knowledgeGraphEngine";
import { generateSopFromRepeatedProcess } from "./sopBuilderEngine";
import { predictClientClose, predictVideoPerformance } from "./predictionEngine";
import { generateCompanyRecommendations } from "./recommendationEngine";
import { storeVaultItem, generateContinuityPacket } from "./institutionalMemoryVault";

createCompanyMemory({
  memoryId: "memory-demo-1",
  category: "Creator Logistics",
  title: "YouTube Shorts created warm service leads",
  description: "Shorts brought repeated editing and thumbnail questions.",
  outcome: "won lead",
  relatedBrands: ["Creator Logistics"],
  relatedProjects: ["service-marketplace"],
});

createCompanyLesson({
  id: "lesson-demo-1",
  lessonTitle: "Repeated thumbnail requests deserve an offer",
  category: "Sales",
  whatHappened: "Multiple leads asked for thumbnails alongside editing.",
  lesson: "Package thumbnail direction as a Creator Logistics add-on.",
  futureRule: "When a request repeats three times, evaluate it as an offer.",
  confidence: 0.8,
  status: "Active",
});

const winLoss = analyzeWinsLosses({
  records: [
    { outcome: "won", channel: "YouTube Shorts", offer: "Creator Logistics" },
    { outcome: "denied", channel: "Grant portal", offer: "ATLAS Assist pilot" },
  ],
});

const opportunities = discoverOpportunities({
  clientRequests: [{ text: "Can you also handle thumbnails?" }, { text: "Need thumbnail help too." }],
  comments: [{ topic: "ATLAS Assist" }, { topic: "ATLAS Assist" }],
});

const patterns = detectCompanyPatterns({
  revenue: [{ source: "YouTube Shorts" }, { source: "YouTube Shorts" }],
  content: [{ topic: "Creator Logistics", views: 500, baseline: 150 }, { topic: "Creator Logistics", leads: 3, baseline: 1 }],
});

createKnowledgeNode({ id: "channel-youtube-shorts", type: "Channel", label: "YouTube Shorts" });
createKnowledgeNode({ id: "offer-creator-logistics", type: "Offer", label: "Creator Logistics" });
createKnowledgeEdge({ from: "channel-youtube-shorts", to: "offer-creator-logistics", relationship: "drives leads to" });

const sop = generateSopFromRepeatedProcess({
  sopName: "Creator Logistics Editing SOP v1",
  projects: [{ id: "project-1", status: "complete" }, { id: "project-2", outcome: "profitable" }],
});

storeVaultItem({ type: "SOP", title: sop.sopName, importance: "Critical" });

console.log("Batch 25 Intelligence Snapshot");
console.log({
  memory: summarizeCompanyMemory(),
  winLoss: winLoss.recommendations,
  opportunities: opportunities.revenueOpportunities,
  patterns: patterns.recommendedActions,
  knowledgeGraph: generateKnowledgeGraphSummary(),
  clientCloseEstimate: predictClientClose({ budgetFit: "high", warmth: "strong", urgency: "high", decisionMaker: "yes" }),
  videoEstimate: predictVideoPerformance({ topicDemand: "high", hookStrength: "medium", channelFit: "high", productionReadiness: "medium" }),
  recommendations: generateCompanyRecommendations({
    wins: [{ channel: "YouTube Shorts" }],
    repeatedTasks: [{ title: "client status updates", frequency: 4 }],
    opportunities: [{ recommendation: "thumbnail add-on" }],
  }).recommendations,
  vault: generateContinuityPacket(),
});
