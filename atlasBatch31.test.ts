import { createAgentGate, detectAgentRisks, enforceHumanSovereignty, scoreAgentTrust } from "./agentCivilizationSafety";
import { clearAgentsForDemo, createCivilizationAgent, generateAgentRegistrySummary } from "./agentRegistryEngine";
import { createAgentProfile, generateAgentTrainingPlan, listCreatedAgentProfiles } from "./agentCreationFactory";
import { awardAgentCertification, createAgentTrainingRecord, generateAgentTrainingPack, getAgentTrainingStatus } from "./agentTrainingEngine";
import { calculateAgentLevel, createAgentSkillTree, listSkillTrees, recommendNextSkill } from "./agentSkillTreeEngine";
import { createAgentMessage, escalateAgentDependency, getOpenAgentRequests, respondToAgentMessage } from "./agentCommunicationEngine";
import { claimMarketplaceTask, createMarketplaceTask, generateMarketplaceSummary, listAvailableTasks, updateMarketplaceTaskStatus } from "./agentMarketplaceEngine";
import { classifyResponsibility, createAgentReputation, rankAgentReputations, updateAgentReputation } from "./agentReputationEngine";
import { approveResourceUsage, createResourceUsageRequest, generateAgentBudgetReport, logResourceUsage } from "./agentBudgetEngine";
import { closeCouncilReview, createCouncilReview, generateCouncilRecommendation } from "./agentOversightCouncil";
import { generateAgentCivilizationDashboard } from "./agentCivilizationDashboard";

assertEqual(createAgentGate("Publish", ["risk"]).approvalStatus, "Cole Approval Required");
assertEqual(detectAgentRisks({ action: "spend credits and publish customer-facing post" }).length >= 2, true);
assertEqual(enforceHumanSovereignty({ action: "override human" }).coleFinalAuthority, true);
assertEqual(scoreAgentTrust({ accuracy: 9, reliability: 9, usefulness: 8, approvalRate: 8, successRate: 8 }) >= 80, true);

clearAgentsForDemo();
const orion = createCivilizationAgent({
  id: "orion",
  agentName: "ORION",
  department: "Revenue",
  roleSummary: "Revenue Analyst",
  responsibilities: ["Analyze revenue", "Recommend offers"],
  allowedActions: ["draft", "recommend"],
  blockedActions: ["spend money", "publish"],
  approvalRequiredActions: ["pricing", "customer-facing message"],
  currentWorkload: 0,
  activeTasks: [],
  overdueTasks: [],
  waitingOnCole: [],
  riskLevel: "Low",
  status: "Idle",
  rank: "Manager",
  capabilities: ["Revenue analysis"],
});
assertEqual(orion.humanSovereigntyRequired, true);
assertEqual(generateAgentRegistrySummary().totalAgents, 1);

const profile = createAgentProfile({ id: "forge-profile", roleNeeded: "Software Developer", department: "Engineering", skills: ["TypeScript"], goals: ["Create development plans"] });
assertEqual(profile.reportingChain.finalAuthority, "Cole");
assertEqual(generateAgentTrainingPlan({ department: "Engineering" }).length, 4);
assertEqual(listCreatedAgentProfiles().length, 1);

createAgentTrainingRecord({ id: "training-1", agentId: "orion", topic: "Sales", knowledgeLevel: 1 });
assertEqual(awardAgentCertification("orion", "Revenue Basics").certifications[0], "Revenue Basics");
assertEqual(getAgentTrainingStatus("orion").knowledgeLevel, 2);
assertEqual(generateAgentTrainingPack("Accessibility").quiz.length, 3);

const tree = createAgentSkillTree({ id: "content-tree", category: "Content", levels: ["Content Writer", "Content Strategist", "Content Director", "Brand Architect"] });
assertEqual(calculateAgentLevel({ trustScore: 70, certifications: ["A"] }, tree.id), "Brand Architect");
assertEqual(recommendNextSkill({ trustScore: 20 }, tree.id), "Content Strategist");
assertEqual(listSkillTrees().length, 1);

createAgentMessage({ id: "msg-1", fromAgentId: "orion", toAgentId: "muse", message: "Need more Creator Logistics leads" });
assertEqual(getOpenAgentRequests("muse").length, 1);
assertEqual(respondToAgentMessage("msg-1", { message: "Drafting content strategy" }).status, "Responded");
assertEqual(escalateAgentDependency("msg-1", "Needs approval").approvalStatus, "Cole Approval Required");

createMarketplaceTask({ id: "task-1", title: "Write SOP", status: "Available" });
createMarketplaceTask({ id: "task-2", title: "Publish public post", status: "Available" });
assertEqual(listAvailableTasks().length, 2);
assertEqual(claimMarketplaceTask("task-1", "archive").status, "Claimed");
assertEqual(claimMarketplaceTask("task-2", "muse").status, "Waiting");
assertEqual(updateMarketplaceTaskStatus("task-1", "Complete").status, "Complete");
assertEqual(generateMarketplaceSummary().waiting, 1);

const reputation = createAgentReputation("orion", { accuracy: 9, reliability: 9, usefulness: 8, approvalRate: 8, successRate: 8 });
const originalTrustScore = reputation.trustScore;
assertEqual(reputation.responsibilityLevel, "More Responsibility");
assertEqual(updateAgentReputation("orion", { reliability: 4 }).trustScore < originalTrustScore, true);
assertEqual(classifyResponsibility(40), "More Oversight");
assertEqual(rankAgentReputations()[0].agentId, "orion");

const resource = createResourceUsageRequest({ id: "resource-1", agentId: "muse", resource: "voice credits", estimatedCost: 20, action: "spend generation credits" });
assertEqual(resource.status, "Needs Approval");
assertEqual(approveResourceUsage("resource-1", { approvedBy: "Manager" }).status, "Needs Cole Approval");
assertEqual(approveResourceUsage("resource-1", { approvedBy: "Cole" }).status, "Approved");
logResourceUsage("muse", { actualCost: 5 });
assertEqual(generateAgentBudgetReport("muse").recordCount, 2);

const review = createCouncilReview({ id: "council-1", action: "approve Project A", notes: "critical action" });
assertEqual(review.members.indexOf("SENTINEL") >= 0, true);
assertEqual(generateCouncilRecommendation("council-1").recommendation, "Delay or escalate to Cole");
assertEqual(closeCouncilReview("council-1", { status: "Closed" }).status, "Closed");

const dashboard = generateAgentCivilizationDashboard({
  agents: [{ department: "Revenue" }, { department: "Content" }],
  tasks: [{ status: "Available" }, { status: "In Progress" }, { status: "Waiting" }],
  reputations: [{ trustScore: 80 }, { trustScore: 60 }],
  costs: [{ estimatedCost: 10 }],
  alerts: ["Council review waiting"],
});
assertEqual(dashboard.totalAgents, 2);
assertEqual(dashboard.approvalStatus, "Cole Approval Required");

console.log("All ATLAS Batch 31 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
