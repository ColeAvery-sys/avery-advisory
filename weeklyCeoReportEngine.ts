export type WeeklyCeoReportInput = {
  dateRange: string;
  revenue: any[];
  clients: any[];
  grants: any[];
  products: any[];
  content: any[];
  operations: any[];
  personalAdmin: any[];
  risks: any[];
  blockers: any[];
  approvals: any[];
  kpis: Record<string, number | string>;
};

export function generateWeeklyCeoReport(data: WeeklyCeoReportInput) {
  const decisionsNeeded = [...data.approvals, ...data.blockers].map((item) => label(item));
  const nextWeekPriorities = [...data.revenue, ...data.clients, ...data.grants, ...data.products]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5)
    .map(label);
  const pauseKillList = [...data.products, ...data.content, ...data.operations].filter((item) => (item.score || 50) < 35).map(label);

  const report = {
    executiveSummary: `Avery Industries LLC weekly report for ${data.dateRange}. Focus remains cash, funding, client delivery, product infrastructure, and stability.`,
    revenueSection: summarize("Revenue", data.revenue),
    clientsSection: summarize("Clients", data.clients),
    grantsFundingSection: summarize("Grants/Funding", data.grants),
    productDevelopmentSection: summarize("Product Development", data.products),
    contentMarketingSection: summarize("Content/Marketing", data.content),
    operationsSection: summarize("Operations", data.operations),
    personalAdminStabilitySection: summarize("Personal/Admin Stability", data.personalAdmin),
    risksAndBlockers: [...data.risks, ...data.blockers].map(label),
    decisionsNeeded,
    nextWeekPriorities,
    atlasRecommendation: `Clear decisions first, then pursue ${nextWeekPriorities[0] || "the highest-value cash or funding move"}.`,
    actionList: nextWeekPriorities.map((title) => `Create next action for ${title}.`),
    approvalList: data.approvals.map(label),
    pauseKillList,
    logEntry: createLog("Weekly CEO Report", `Generated weekly CEO report for ${data.dateRange}.`),
  };

  const markdownReport = [
    `# Weekly CEO Report: ${data.dateRange}`,
    report.executiveSummary,
    `## Revenue\n${report.revenueSection}`,
    `## Clients\n${report.clientsSection}`,
    `## Grants/Funding\n${report.grantsFundingSection}`,
    `## Product Development\n${report.productDevelopmentSection}`,
    `## Decisions Needed\n${decisionsNeeded.join("\n")}`,
    `## ATLAS Recommendation\n${report.atlasRecommendation}`,
  ].join("\n\n");

  return { ...report, markdownReport, googleDocsReadyVersion: markdownReport };
}

export function generateExecutiveWeeklyReport(data: any) {
  const revenue = sum(data.revenue || []);
  const leads = (data.leads || []).length;
  const openTasks = (data.openTasks || []).length;
  const bottlenecks = identifyWeeklyBottlenecks(data);
  return {
    dateRange: data.dateRange,
    revenue,
    leads,
    contentProduced: (data.contentProduced || []).length,
    productsShipped: (data.productsShipped || []).length,
    openTasks,
    bottlenecks,
    biggestWins: data.biggestWins || [],
    biggestMistakes: data.biggestMistakes || [],
    nextWeekFocus: bottlenecks.length ? `Clear bottleneck: ${bottlenecks[0]}` : "Creator Logistics revenue and client fulfillment.",
    forceReality: openTasks > 25 ? "Too many open tasks. Reduce commitments before adding new projects." : "Task load is manageable.",
  };
}

export function identifyWeeklyBottlenecks(data: any): string[] {
  const bottlenecks: string[] = [];
  if ((data.approvals || []).length > 5) bottlenecks.push("Approval backlog");
  if ((data.overdueTasks || []).length > 0) bottlenecks.push("Overdue tasks");
  if ((data.stuckDeals || []).length > 0) bottlenecks.push("Stuck deals");
  if ((data.openTasks || []).length > 25) bottlenecks.push("Too many open tasks");
  return bottlenecks;
}

function sum(items: any[]): number {
  return items.reduce((total, item) => total + (Number(item.amount) || Number(item.value) || 0), 0);
}

function summarize(labelText: string, items: any[]): string {
  return `${labelText}: ${items.length} tracked. Top item: ${label(items[0]) || "none"}.`;
}

function label(item: any): string {
  return typeof item === "string" ? item : item?.title || item?.name || "";
}

function createLog(loopName: string, summary: string) {
  return { loopName, timestamp: new Date().toISOString(), status: "Success", summary };
}
