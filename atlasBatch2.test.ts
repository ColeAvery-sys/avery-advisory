import { logAction, clearActionLogForDemo, getActionsRequiringApproval, markActionApproved } from "./atlasActionLogger";
import { checkAutomationPermission } from "./automationPermissionEngine";
import { generateBusinessDocument } from "./documentDraftEngine";
import { scoreGrantReadiness } from "./grantReadinessScorer";
import { addKnowledgeItem, attachKnowledgeToTask, clearKnowledgeBaseForDemo, markDeprecated, searchKnowledge } from "./knowledgeBaseSearch";
import { generateMissionBrief } from "./missionBriefGenerator";
import { scoreMoneyOpportunity } from "./moneyPipelineScorer";
import { scoreClientLead } from "./clientPipelineScorer";
import { scoreProductIdea } from "./productRoadmapScorer";
import { generateWeeklyReview } from "./weeklyReviewGenerator";

const permission = checkAutomationPermission({
  actionType: "drafting",
  department: "Sales",
});
assertEqual(permission.permissionLevel, "Auto");

const blocked = checkAutomationPermission({
  actionType: "automatic spend",
  department: "Finance",
  moneyRelated: true,
  amount: 500,
});
assertEqual(blocked.permissionLevel, "Blocked");

assertEqual(
  checkAutomationPermission({
    actionType: "automatic send email",
    department: "Sales",
    externalFacing: true,
  }).permissionLevel,
  "Blocked",
);

assertEqual(
  checkAutomationPermission({
    actionType: "automatic submit grant",
    department: "Grants",
    submitsApplication: true,
  }).permissionLevel,
  "Blocked",
);

assertEqual(
  checkAutomationPermission({
    actionType: "delete files",
    department: "Operations",
    deletesData: true,
  }).permissionLevel,
  "Blocked",
);

assertEqual(
  checkAutomationPermission({
    actionType: "create invoice",
    department: "Finance",
    financialRelated: true,
  }).permissionLevel,
  "Approval Required",
);

clearActionLogForDemo();
const action = logAction({
  id: "act-1",
  actor: "ATLAS",
  department: "Sales",
  actionType: "client proposal",
  description: "Draft proposal for client.",
  permissionLevel: "Approval Required",
  riskLevel: "Medium",
});
assertEqual(action.status, "Awaiting Approval");
assertEqual(getActionsRequiringApproval().length, 1);
assertEqual(markActionApproved("act-1").status, "Approved");

clearKnowledgeBaseForDemo();
addKnowledgeItem({
  id: "kb-1",
  title: "WV Disability Funding Notes",
  category: "Grants",
  summary: "West Virginia funding angle for disability aid.",
  fullText: "Accessibility technology and AI-assisted independent living.",
  tags: ["wv", "disability", "funding"],
  relatedDepartment: "Grants and Funding",
  source: "manual",
  confidence: 0.9,
  status: "Active",
  lastUpdated: "2026-05-27",
});
assertEqual(searchKnowledge("disability funding").length, 1);
assertEqual(attachKnowledgeToTask("kb-1", "task-1").attachedTaskIds?.includes("task-1"), true);
assertEqual(markDeprecated("kb-1").status, "Deprecated");
assertEqual(searchKnowledge("disability funding").length, 0);

const money = scoreMoneyOpportunity({
  title: "Fast client package",
  type: "client",
  amountPotential: 1500,
  probability: 0.8,
  timeToCashDays: 5,
  effortRequired: 3,
  strategicValue: 7,
  requiresColeApproval: true,
});
assertEqual(money.expectedValue, 1200);
assertEqual(money.rankLabel, "Top Priority");

const grant = scoreGrantReadiness({
  grantName: "Accessibility Grant",
  amount: 25000,
  deadline: "2099-01-01",
  eligibilityFit: 8,
  projectFit: 8,
  disabilityAidFit: 10,
  requiredDocuments: ["budget", "business plan"],
  completedDocuments: ["budget"],
  businessStageFit: 7,
  locationFit: 9,
  timeRequiredHours: 12,
});
assertEqual(grant.strongestAngle, "disability aid");
assertEqual(grant.missingDocuments[0], "business plan");

const client = scoreClientLead({
  name: "Creator Lead",
  platform: "YouTube",
  niche: "monthly content operations",
  budget: 1200,
  contentVolume: 24,
  urgency: 8,
  responseStatus: "warm",
  fitForCreatorLogistics: 9,
  probability: 0.75,
  nextFollowUpDate: "2000-01-01",
});
assertEqual(client.packageRecommendation, "Operator");
assertEqual(client.followUpUrgency, "Overdue");

const product = scoreProductIdea({
  productName: "ATLAS HQ",
  earlyRevenuePotential: 8,
  grantPotential: 8,
  buildDifficulty: 5,
  personalUsefulness: 10,
  longTermValue: 10,
  marketClarity: 8,
  demoPotential: 9,
  timeToMVPDays: 21,
});
assertEqual(["Build Now", "Revenue-Ready"].includes(product.category), true);

const doc = generateBusinessDocument({
  documentType: "outreach email",
  department: "Sales",
  targetAudience: "client",
  sourceData: "Creator logistics offer.",
  tone: "professional",
  keyPoints: ["Organize clips", "Confirm delivery schedule"],
});
assertEqual(doc.approvalRequired, true);
assertEqual(doc.draft.includes("Use classification: external-facing."), true);

const weekly = generateWeeklyReview({
  tasks: [{ title: "Old idea", score: 20 }],
  moneyPipeline: [{ title: "Client cash", score: 90 }],
  grants: [{ title: "Grant deadline", score: 80 }],
  clients: [{ title: "Creator follow-up", score: 85 }],
  products: [{ title: "Automation unlock", score: 70 }],
  approvals: [{ title: "Proposal send", score: 75 }],
  completedItems: [{ title: "Router shipped", score: 80 }],
  blockedItems: [{ title: "Waiting on approval", blocked: true }],
});
assertEqual(weekly.nextWeekTopFive[0], "Client cash");
assertEqual(weekly.killOrPauseSuggestions.includes("Old idea"), true);

const mission = generateMissionBrief({
  companyMission: "Build ATLAS HQ for Avery Industries LLC.",
  ninetyDayGoal: "Reach stable workflow.",
  monthlyRevenueTarget: 5000,
  currentCashPriority: "Client cash",
  currentProductPriority: "ATLAS HQ",
  currentFundingPriority: "Disability aid grant",
  moneyPipeline: [{ title: "Client cash", score: 80 }],
  grants: [{ title: "Disability aid grant", score: 70 }],
  products: [{ title: "Aphantasia VR", score: 35 }],
  clients: [{ title: "Creator follow-up", score: 75 }],
  approvals: [{ title: "Client proposal", requiresColeApproval: true }],
  blockers: [],
});
assertEqual(mission.todayBestMove, "Review and decide approval: Client proposal.");
assertEqual(mission.delayOrIgnore.includes("Aphantasia VR"), true);

console.log("All ATLAS Batch 2 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}
