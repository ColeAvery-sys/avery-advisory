import { scoreLead } from "./leadScoringEngine";

export function generateSalesPlan(data: Record<string, any>) {
  const hotLeads = identifyHotLeads(data);
  const followUpsDue = identifyFollowUpsDue(data);
  const stuckDeals = identifyStuckDeals(data);
  const recommendation = generateSalesRecommendation(data);
  return {
    hotLeads,
    followUpsDue,
    stuckDeals,
    recommendation,
    tasks: createSalesTasks({ hotLeads, followUpsDue, stuckDeals, recommendation }),
    approvalRequired: true,
    safetyNote: "Client-facing sales actions require Cole approval. ATLAS cannot close deals, request payment, or promise final pricing.",
  };
}

export function identifyHotLeads(data: Record<string, any>) {
  return (data.leads || [])
    .map((lead: any) => ({ lead, score: scoreLead(lead) }))
    .filter((entry: any) => entry.score.leadQuality === "Hot" || entry.score.leadQuality === "Warm" || entry.score.leadQuality === "Partner Potential")
    .sort((a: any, b: any) => b.score.score - a.score.score);
}

export function identifyFollowUpsDue(data: Record<string, any>) {
  const date = data.date || new Date().toISOString().slice(0, 10);
  return (data.deals || []).filter((deal: any) => deal.followUpDate && deal.followUpDate <= date && !/Won|Lost|Paused/i.test(deal.stage || ""));
}

export function identifyStuckDeals(data: Record<string, any>) {
  const date = new Date(data.date || new Date().toISOString().slice(0, 10)).getTime();
  return (data.deals || []).filter((deal: any) => {
    const last = deal.lastContacted ? new Date(deal.lastContacted).getTime() : 0;
    return last > 0 && (date - last) / 86400000 >= 14 && !/Won|Lost|Paused/i.test(deal.stage || "");
  });
}

export function generateSalesRecommendation(data: Record<string, any>): string {
  const hotLeads = identifyHotLeads(data);
  if (hotLeads.length) return "Prioritize the highest-scoring Creator Logistics or partner lead and draft a discovery message for Cole approval.";
  if (identifyFollowUpsDue(data).length) return "Handle follow-ups due today. Draft messages only and route them to approval.";
  return "Create new Creator Logistics lead generation tasks before spending time on speculative revenue.";
}

export function createSalesTasks(plan: Record<string, any>) {
  const tasks: any[] = [];
  (plan.hotLeads || []).slice(0, 3).forEach((entry: any, index: number) =>
    tasks.push({ id: `sales-task-hot-${index + 1}`, title: `Prepare approved discovery message for ${entry.lead.leadName}`, approvalRequired: true }),
  );
  (plan.followUpsDue || []).slice(0, 3).forEach((deal: any, index: number) =>
    tasks.push({ id: `sales-task-follow-${index + 1}`, title: `Draft follow-up for ${deal.dealName}`, approvalRequired: true }),
  );
  if (!tasks.length) tasks.push({ id: "sales-task-1", title: "Score new Creator Logistics leads", approvalRequired: false });
  return tasks;
}
