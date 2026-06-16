export type MarketingPlanData = {
  creatorLeads?: Array<Record<string, any>>;
  productInterest?: Array<Record<string, any>>;
  funderInterest?: Array<Record<string, any>>;
  content?: Array<Record<string, any>>;
  campaigns?: Array<Record<string, any>>;
  analytics?: Record<string, any>;
};

export type MarketingTask = {
  id: string;
  title: string;
  priority: "Critical" | "High" | "Medium";
  approvalRequired: boolean;
  reason: string;
};

export function generateWeeklyMarketingPlan(data: MarketingPlanData) {
  const priorities = identifyTopMarketingPriorities(data);
  const recommendation = generateMarketingRecommendation(data);

  return {
    priorities,
    contentWaitingOnCole: identifyContentWaitingOnCole(data),
    recommendation,
    tasks: createMarketingTasks({ priorities }),
    approvalRequired: true,
    safetyNote: "ATLAS can draft and organize marketing. Cole approval is required before public publishing.",
    logEntry: {
      actionType: "Batch 13 Weekly Marketing Plan",
      riskLevel: "Medium",
      approvalStatus: "Draft Only",
      outcome: "Plan generated locally",
    },
  };
}

export function identifyTopMarketingPriorities(data: MarketingPlanData): string[] {
  const priorities: string[] = [];
  const creatorLeadCount = (data.creatorLeads || []).length;
  const productInterestCount = (data.productInterest || []).length;
  const funderInterestCount = (data.funderInterest || []).length;

  if (creatorLeadCount > 0) priorities.push("Creator Logistics lead conversion");
  priorities.push("Creator Logistics lead generation");
  priorities.push("AveryTech credibility and trust");
  if (productInterestCount > 0) priorities.push("ATLAS Assist pilot interest");
  if (funderInterestCount > 0) priorities.push("Grant and funder credibility");

  return priorities.slice(0, 5);
}

export function identifyContentWaitingOnCole(data: MarketingPlanData): Array<Record<string, any>> {
  return (data.content || []).filter((item) =>
    /Needs Cole Review|Needs Cole Approval|Approval|High Review/i.test(String(item.approvalStatus || item.status || item.reviewLevel || "")),
  );
}

export function generateMarketingRecommendation(data: MarketingPlanData): string {
  const creatorLeads = (data.creatorLeads || []).length;
  const funderInterest = (data.funderInterest || []).length;

  if (creatorLeads > 0) {
    return "Push Creator Logistics this week because it is the fastest path to cash. Draft public content and route every post to Cole approval.";
  }

  if (funderInterest > 0) {
    return "Build AveryTech credibility with accessibility-first AI content, but avoid funding guarantees or medical claims.";
  }

  return "Run a balanced week: Creator Logistics for near-term revenue, AveryTech thought leadership for trust, and ATLAS Assist interest capture for long-term funding.";
}

export function createMarketingTasks(plan: { priorities: string[] }): MarketingTask[] {
  return plan.priorities.map((priority, index) => ({
    id: `marketing-task-${index + 1}`,
    title: `Create approval-ready content for ${priority}`,
    priority: index === 0 ? "High" : "Medium",
    approvalRequired: true,
    reason: "Public marketing content cannot be published without Cole approval.",
  }));
}
