import { createIntelligenceGate, confidenceFromEvidence, detectStrategicRisk } from "./companyIntelligenceSafety";
import { createCompanyMemory, attachLessonToMemory, summarizeCompanyMemory } from "./companyMemoryEngine";
import { createCompanyLesson, attachLessonToSop as attachLessonToExistingSop, applyLessonToFutureProjects } from "./lessonsLearnedEngine";
import { analyzeWinsLosses } from "./winLossAnalyzer";
import { discoverOpportunities, identifyRevenueOpportunities } from "./opportunityDiscoveryEngine";
import { detectCompanyPatterns } from "./patternDetectionEngine";
import { createKnowledgeNode, createKnowledgeEdge, getRelatedNodes, traceCausalPath, generateKnowledgeGraphSummary } from "./knowledgeGraphEngine";
import { generateSopFromRepeatedProcess, attachLessonToSop, generateSopChecklist, markSopApproved } from "./sopBuilderEngine";
import { predictClientClose, predictDeadlineRisk } from "./predictionEngine";
import { generateCompanyRecommendations, markRecommendationApproved } from "./recommendationEngine";
import { storeVaultItem, attachTemplateToVault, generateContinuityPacket, searchVault } from "./institutionalMemoryVault";

assertEqual(createIntelligenceGate("Strategy shift").approvalStatus, "Needs Cole Approval");
assertEqual(confidenceFromEvidence(3) > confidenceFromEvidence(1), true);
assertEqual(detectStrategicRisk("change pricing and hire editor").length > 0, true);

const memory = createCompanyMemory({
  memoryId: "memory-1",
  category: "Sales",
  title: "Thumbnail requests kept showing up",
  description: "Multiple Creator Logistics leads asked about thumbnails.",
  outcome: "won opportunity",
  relatedProjects: ["creator-logistics"],
});
assertEqual(memory.importanceScore >= 55, true);
assertEqual(attachLessonToMemory("memory-1", "lesson-1").lessonsAttached.length, 1);
assertEqual(summarizeCompanyMemory().totalMemories >= 1, true);

const lesson = createCompanyLesson({
  id: "lesson-1",
  lessonTitle: "Slow client updates create anxiety",
  category: "Client Work",
  lesson: "Draft weekly status updates.",
  futureRule: "Every service order needs a status update checkpoint.",
  confidence: 0.8,
});
const existingSopLesson = attachLessonToExistingSop("lesson-1", "sop-existing") as any;
assertEqual(existingSopLesson.attachedSops[0], "sop-existing");
assertEqual(applyLessonToFutureProjects("lesson-1").approvalRequiredForPolicyChange, true);
assertEqual(lesson.status, "Needs Review");

const winLoss = analyzeWinsLosses({
  records: [
    { outcome: "won", channel: "YouTube Shorts", offer: "Creator Logistics" },
    { outcome: "lost", channel: "Cold DM", offer: "Large retainer" },
  ],
});
assertEqual(winLoss.wins.length, 1);
assertEqual(winLoss.losses.length, 1);

const opportunities = discoverOpportunities({
  clientRequests: [{ id: "req-1", text: "Do you offer thumbnails?" }, { id: "req-2", text: "thumbnail help please" }],
  comments: [{ topic: "ATLAS Assist" }, { topic: "ATLAS Assist" }, { text: "accessibility planning" }],
  supportMessages: [{ text: "Need status update" }],
});
assertEqual(opportunities.revenueOpportunities.length, 1);
assertEqual(opportunities.revenueOpportunities[0].recommendation, "Create Thumbnail Service");
assertEqual(identifyRevenueOpportunities({ clientRequests: [{ text: "thumbnail" }] }).length, 1);

const patterns = detectCompanyPatterns({
  revenue: [{ source: "YouTube Shorts" }, { source: "YouTube Shorts" }],
  content: [{ topic: "ATLAS Assist", views: 200, baseline: 100 }, { topic: "ATLAS Assist", leads: 5, baseline: 1 }],
  clients: [{ notes: "slow communication complaint" }, { notes: "missing update complaint" }],
  grants: [{ notes: "missing docs" }, { notes: "budget missing" }],
});
assertEqual(patterns.patterns.length >= 4, true);

createKnowledgeNode({ id: "client-1", type: "Client", label: "Creator client" });
createKnowledgeNode({ id: "product-1", type: "Product", label: "Thumbnail service" });
createKnowledgeEdge({ from: "client-1", to: "product-1", relationship: "requested" });
const relatedNodes = getRelatedNodes("client-1");
assertEqual(relatedNodes.length, 1);
assertEqual(relatedNodes[0].id, "product-1");
assertEqual(traceCausalPath("client-1", "product-1").indexOf("requested") >= 0, true);
assertEqual(generateKnowledgeGraphSummary().nodeCount >= 2, true);

const sop = generateSopFromRepeatedProcess({
  sopName: "Creator Logistics Editing SOP v1",
  projects: [{ id: "p1", status: "complete" }, { id: "p2", outcome: "profitable", notes: "missing source files" }],
});
assertEqual(generateSopChecklist(sop.id).indexOf("QC") >= 0, true);
assertEqual(attachLessonToSop(sop.id, { id: "lesson-1" }).lessons[0], "lesson-1");
assertEqual(markSopApproved(sop.id, { approvedBy: "Cole", approvalStatus: "Approved" }).status, "Approved");

assertEqual(predictClientClose({ budgetFit: "high", warmth: "strong", urgency: "high", decisionMaker: "yes" }).label, "Likely");
assertEqual(predictDeadlineRisk({ timeAvailable: "low", complexity: "high", blockers: "high", overwhelm: "high" }).label, "High Risk");

const recommendations = generateCompanyRecommendations({
  wins: [{ channel: "Creator Logistics shorts" }],
  lowYield: [{ title: "random merch experiments" }],
  failures: [{ title: "unscoped service calls", repeats: 2 }],
  repeatedTasks: [{ title: "client status updates", frequency: 4 }],
  overloadTasks: [{ title: "raw footage cleanup" }],
  opportunities: [{ recommendation: "thumbnail add-on" }],
});
assertEqual(recommendations.recommendations.length, 6);
assertEqual(markRecommendationApproved("rec-1", { approvedBy: "Cole", approvalStatus: "Approved" }).approvalStatus, "Approved");

const vault = storeVaultItem({ id: "vault-1", type: "SOP", title: "Creator Logistics Editing SOP", importance: "Critical" });
assertEqual(attachTemplateToVault(vault.id, "template-1").templates[0], "template-1");
assertEqual(searchVault("editing").length >= 1, true);
assertEqual(generateContinuityPacket().title, "Avery Industries LLC Brain");

console.log("All ATLAS Batch 25 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
