import { clearAgentsForDemo, createCivilizationAgent, generateAgentRegistrySummary } from "./agentRegistryEngine";
import { createAgentProfile } from "./agentCreationFactory";
import { createAgentTrainingRecord, awardAgentCertification } from "./agentTrainingEngine";
import { createAgentSkillTree, calculateAgentLevel } from "./agentSkillTreeEngine";
import { createAgentMessage } from "./agentCommunicationEngine";
import { createMarketplaceTask, generateMarketplaceSummary } from "./agentMarketplaceEngine";
import { createAgentReputation, rankAgentReputations } from "./agentReputationEngine";
import { createResourceUsageRequest, generateAgentBudgetReport } from "./agentBudgetEngine";
import { createCouncilReview, generateCouncilRecommendation } from "./agentOversightCouncil";
import { generateAgentCivilizationDashboard } from "./agentCivilizationDashboard";

clearAgentsForDemo();
createCivilizationAgent({
  id: "orion",
  agentName: "ORION",
  department: "Revenue",
  roleSummary: "Revenue Analyst",
  responsibilities: ["Analyze revenue", "Recommend offers"],
  allowedActions: ["draft", "recommend"],
  blockedActions: ["spend money", "publish"],
  approvalRequiredActions: ["pricing", "customer message"],
  currentWorkload: 0,
  activeTasks: [],
  overdueTasks: [],
  waitingOnCole: [],
  riskLevel: "Low",
  status: "Idle",
});

createAgentProfile({ roleNeeded: "Accessibility Engineer", department: "Research", agentName: "CIRCUIT", skills: ["accessibility review", "research support"] });
createAgentTrainingRecord({ agentId: "orion", topic: "Revenue", knowledgeLevel: 2 });
awardAgentCertification("orion", "Revenue Basics");
const tree = createAgentSkillTree({ id: "revenue-tree", category: "Revenue", levels: ["Revenue Analyst", "Revenue Strategist", "Revenue Manager", "Revenue Director"] });
createAgentMessage({ fromAgentId: "orion", toAgentId: "muse", message: "Need more Creator Logistics leads" });
createMarketplaceTask({ title: "Analyze revenue opportunity", status: "Available" });
const reputation = createAgentReputation("orion", { accuracy: 9, reliability: 9, usefulness: 8, approvalRate: 8, successRate: 8 });
createResourceUsageRequest({ agentId: "muse", resource: "image generation credits", estimatedCost: 12, action: "spend generation credits" });
const council = createCouncilReview({ action: "Approve Project A and delay Project B", notes: "critical action" });

console.log("Batch 31 Agent Civilization Snapshot");
console.log({
  registry: generateAgentRegistrySummary(),
  currentLevel: calculateAgentLevel({ trustScore: reputation.trustScore, certifications: ["Revenue Basics"] }, tree.id),
  marketplace: generateMarketplaceSummary(),
  reputations: rankAgentReputations(),
  budget: generateAgentBudgetReport(),
  council: generateCouncilRecommendation(council.id),
  dashboard: generateAgentCivilizationDashboard({
    agents: [{ department: "Revenue" }, { department: "Research" }, { department: "Content" }],
    tasks: [{ status: "Available" }, { status: "Waiting" }],
    reputations: rankAgentReputations(),
    costs: [{ estimatedCost: 12 }],
    recommendations: ["Approve Project A", "Delay Project B", "Archive Project C"],
    alerts: ["Council review waiting"],
  }),
});
