import { clearActionLogForDemo, getActionLog, logAction } from "./atlasActionLogger";
import { checkAutomationPermission } from "./automationPermissionEngine";
import { scoreClientLead } from "./clientPipelineScorer";
import { generateBusinessDocument } from "./documentDraftEngine";
import { scoreGrantReadiness } from "./grantReadinessScorer";
import { addKnowledgeItem, attachKnowledgeToTask, clearKnowledgeBaseForDemo, searchKnowledge } from "./knowledgeBaseSearch";
import { generateMissionBrief } from "./missionBriefGenerator";
import { scoreMoneyOpportunity } from "./moneyPipelineScorer";
import { scoreProductIdea } from "./productRoadmapScorer";
import { generateWeeklyReview } from "./weeklyReviewGenerator";

clearActionLogForDemo();
clearKnowledgeBaseForDemo();

console.log("Automation Permission");
console.log(
  checkAutomationPermission({
    actionType: "send email",
    department: "Sales",
    externalFacing: true,
  }),
);

console.log("\nAction Logger");
logAction({
  id: "demo-action-1",
  actor: "ATLAS",
  department: "Sales",
  actionType: "send email",
  description: "Prepare creator outreach email.",
  permissionLevel: "Approval Required",
  riskLevel: "Medium",
});
console.log(getActionLog());

console.log("\nKnowledge Base");
addKnowledgeItem({
  id: "demo-kb-1",
  title: "Disability Aid Grant Angle",
  category: "Grants",
  summary: "Position ATLAS Assist around AI-assisted independent living.",
  fullText: "Strong fit for accessibility technology, disability aid, and local economic development.",
  tags: ["grant", "disability", "accessibility"],
  relatedDepartment: "Grants and Funding",
  source: "demo",
  confidence: 0.85,
  status: "Active",
  lastUpdated: new Date().toISOString(),
});
attachKnowledgeToTask("demo-kb-1", "demo-task-1");
console.log(searchKnowledge("accessibility grant"));

console.log("\nMoney Pipeline");
console.log(
  scoreMoneyOpportunity({
    title: "Creator logistics client",
    type: "client",
    amountPotential: 1500,
    probability: 0.75,
    timeToCashDays: 7,
    effortRequired: 3,
    strategicValue: 8,
    requiresColeApproval: true,
  }),
);

console.log("\nGrant Readiness");
console.log(
  scoreGrantReadiness({
    grantName: "WV Accessibility Grant",
    amount: 25000,
    deadline: "2099-01-01",
    eligibilityFit: 8,
    projectFit: 8,
    disabilityAidFit: 10,
    requiredDocuments: ["budget", "business plan", "project summary"],
    completedDocuments: ["project summary"],
    businessStageFit: 7,
    locationFit: 9,
    timeRequiredHours: 14,
  }),
);

console.log("\nClient Pipeline");
console.log(
  scoreClientLead({
    name: "YouTube creator",
    platform: "YouTube",
    niche: "monthly content operations",
    budget: 1200,
    contentVolume: 24,
    urgency: 8,
    responseStatus: "warm",
    fitForCreatorLogistics: 9,
    probability: 0.75,
    nextFollowUpDate: "2000-01-01",
  }),
);

console.log("\nProduct Roadmap");
console.log(
  scoreProductIdea({
    productName: "ATLAS HQ",
    earlyRevenuePotential: 8,
    grantPotential: 8,
    buildDifficulty: 5,
    personalUsefulness: 10,
    longTermValue: 10,
    marketClarity: 8,
    demoPotential: 9,
    timeToMVPDays: 21,
  }),
);

console.log("\nDocument Draft");
console.log(
  generateBusinessDocument({
    documentType: "Codex prompt",
    department: "Product and Engineering",
    targetAudience: "Codex",
    sourceData: "Build the next safe backend function for ATLAS HQ.",
    tone: "direct",
    keyPoints: ["Use local data", "Require Cole approval for risky actions", "Include tests"],
  }),
);

console.log("\nWeekly Review");
console.log(
  generateWeeklyReview({
    tasks: [{ title: "Low-value research", score: 25 }],
    moneyPipeline: [{ title: "Creator logistics client", score: 90 }],
    grants: [{ title: "WV Accessibility Grant", score: 78 }],
    clients: [{ title: "YouTube creator follow-up", score: 86 }],
    products: [{ title: "ATLAS automation unlock", score: 75 }],
    approvals: [{ title: "Client proposal", score: 70 }],
    completedItems: [{ title: "Agent router", score: 80 }],
    blockedItems: [{ title: "Grant budget approval", blocked: true }],
  }),
);

console.log("\nMission Brief");
console.log(
  generateMissionBrief({
    companyMission: "Make ATLAS HQ the operating system for Avery Industries LLC.",
    ninetyDayGoal: "Create a repeatable workflow for cash, grants, clients, and products.",
    monthlyRevenueTarget: 5000,
    currentCashPriority: "Creator logistics revenue",
    currentProductPriority: "ATLAS HQ",
    currentFundingPriority: "Disability aid funding",
    moneyPipeline: [{ title: "Creator logistics client", score: 90 }],
    grants: [{ title: "WV Accessibility Grant", score: 78 }],
    products: [{ title: "ATLAS HQ", score: 84 }],
    clients: [{ title: "YouTube creator", score: 86 }],
    approvals: [{ title: "Send client proposal", requiresColeApproval: true }],
    blockers: [{ title: "Waiting on Cole proposal approval" }],
  }),
);
