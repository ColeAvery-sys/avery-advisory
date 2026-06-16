import { label, priorityWeight } from "./averyOpsSafety";

const executiveReports: any[] = [];

export const EXECUTIVE_REPORTS_FOLDER = "Executive Reports";

export function createDailyExecutiveReport(input: any) {
  const reportDate = input.date || new Date(0).toISOString().slice(0, 10);
  const revenueSummary = summarizeRevenue(input.revenue || []);
  const leadSummary = summarizeLeads(input.leads || []);
  const projectSummary = summarizeProjects(input.projects || []);
  const blockers = summarizeBlockers(input.blockers || [], input.projects || []);
  const approvalsNeeded = summarizeApprovals(input.approvals || []);
  const report = {
    id: input.id || `executive-report-${executiveReports.length + 1}`,
    title: "Daily Executive Report",
    date: reportDate,
    storageFolder: EXECUTIVE_REPORTS_FOLDER,
    storageFileName: `daily-executive-report-${reportDate}.md`,
    revenueSummary,
    leadSummary,
    projectSummary,
    blockers,
    approvalsNeeded,
    healthScore: calculateCompanyHealthScore({ revenueSummary, leadSummary, projectSummary, blockers, approvalsNeeded }),
    recommendedFocus: determineExecutiveFocus({ revenueSummary, leadSummary, projectSummary, blockers, approvalsNeeded }),
    readingTimeTarget: "Under 3 minutes",
    createdAt: input.createdAt || new Date(0).toISOString(),
  };
  executiveReports.push(report);
  return report;
}

export function getExecutiveReports(date?: string) {
  return date ? executiveReports.filter((report) => report.date === date) : executiveReports.slice();
}

export function getLatestExecutiveReport() {
  return executiveReports[executiveReports.length - 1] || null;
}

export function exportDailyExecutiveReportMarkdown(report: any) {
  return [
    `# ${report.title}`,
    "",
    `Date: ${report.date}`,
    `Storage: ${report.storageFolder}/${report.storageFileName}`,
    `Health Score: ${report.healthScore}/100`,
    `Reading Target: ${report.readingTimeTarget}`,
    "",
    "## Revenue Summary",
    `- Total revenue tracked: $${report.revenueSummary.totalRevenue}`,
    `- Confirmed revenue: $${report.revenueSummary.confirmedRevenue}`,
    `- Open revenue opportunities: ${report.revenueSummary.openOpportunities}`,
    `- Top item: ${report.revenueSummary.topItem || "None"}`,
    ...formatPrefixedLines("Top revenue items", report.revenueSummary.items),
    "",
    "## Lead Summary",
    `- Total leads: ${report.leadSummary.totalLeads}`,
    `- Hot leads: ${report.leadSummary.hotLeads}`,
    `- Needs follow-up: ${report.leadSummary.needsFollowUp}`,
    `- Top lead: ${report.leadSummary.topLead || "None"}`,
    ...formatPrefixedLines("Top leads", report.leadSummary.items),
    "",
    "## Project Summary",
    `- Active projects: ${report.projectSummary.activeProjects}`,
    `- Blocked projects: ${report.projectSummary.blockedProjects}`,
    `- Due soon: ${report.projectSummary.dueSoon}`,
    `- Top project: ${report.projectSummary.topProject || "None"}`,
    ...formatPrefixedLines("Top projects", report.projectSummary.items),
    "",
    "## Blockers",
    ...formatLines(report.blockers.items),
    "",
    "## Approvals Needed",
    ...formatLines(report.approvalsNeeded.items),
    "",
    "## Recommended Focus",
    `- ${report.recommendedFocus}`,
  ].join("\n");
}

export function generateExecutiveReportStorageRecord(report: any) {
  return {
    folder: report.storageFolder || EXECUTIVE_REPORTS_FOLDER,
    fileName: report.storageFileName || `daily-executive-report-${report.date}.md`,
    content: exportDailyExecutiveReportMarkdown(report),
    approvalStatus: "Draft",
    manualSaveRequired: true,
  };
}

export function summarizeRevenue(revenueItems: any[]) {
  const totalRevenue = revenueItems.reduce((sum, item) => sum + amount(item), 0);
  const confirmedRevenue = revenueItems.filter((item) => /confirmed|paid|won/i.test(item.status || item.confidence || "")).reduce((sum, item) => sum + amount(item), 0);
  const sorted = revenueItems.slice().sort((a, b) => amount(b) - amount(a));
  return {
    totalRevenue,
    confirmedRevenue,
    openOpportunities: revenueItems.filter((item) => !/lost|closed/i.test(item.status || "")).length,
    topItem: sorted[0] ? label(sorted[0]) : null,
    items: sorted.slice(0, 3).map(label),
  };
}

export function summarizeLeads(leads: any[]) {
  const sorted = leads.slice().sort((a, b) => score(b) - score(a));
  return {
    totalLeads: leads.length,
    hotLeads: leads.filter((lead) => /hot|high|urgent/i.test(`${lead.status || ""} ${lead.priority || ""}`) || score(lead) >= 75).length,
    needsFollowUp: leads.filter((lead) => /follow|waiting|new/i.test(`${lead.status || ""} ${lead.nextAction || ""}`)).length,
    topLead: sorted[0] ? label(sorted[0]) : null,
    items: sorted.slice(0, 3).map(label),
  };
}

export function summarizeProjects(projects: any[]) {
  const sorted = projects.slice().sort((a, b) => priorityWeight(b.priority || b.riskLevel || "") - priorityWeight(a.priority || a.riskLevel || ""));
  return {
    activeProjects: projects.filter((project) => /active|working|in progress/i.test(project.status || "")).length,
    blockedProjects: projects.filter((project) => /blocked|waiting/i.test(project.status || "")).length,
    dueSoon: projects.filter((project) => /today|tomorrow|this week|urgent/i.test(project.deadline || project.dueDate || "")).length,
    topProject: sorted[0] ? label(sorted[0]) : null,
    items: sorted.slice(0, 3).map(label),
  };
}

export function summarizeBlockers(blockers: any[], projects: any[]) {
  const projectBlockers = projects
    .filter((project) => /blocked|waiting/i.test(project.status || ""))
    .map((project) => ({ title: `${label(project)} is blocked`, priority: project.priority || "High" }));
  const sorted = blockers.concat(projectBlockers).sort((a, b) => priorityWeight(b.priority || b.riskLevel || "") - priorityWeight(a.priority || a.riskLevel || ""));
  return {
    count: sorted.length,
    critical: sorted.filter((item) => /critical|high/i.test(item.priority || item.riskLevel || "")).length,
    items: sorted.slice(0, 5).map(label),
  };
}

export function summarizeApprovals(approvals: any[]) {
  const sorted = approvals.slice().sort((a, b) => priorityWeight(b.priority || b.riskLevel || "") - priorityWeight(a.priority || a.riskLevel || ""));
  return {
    count: sorted.length,
    highPriority: sorted.filter((item) => /critical|high/i.test(item.priority || item.riskLevel || "")).length,
    items: sorted.slice(0, 5).map(label),
  };
}

export function calculateCompanyHealthScore(parts: any) {
  let scoreValue = 70;
  if (parts.revenueSummary.confirmedRevenue > 0) scoreValue += 10;
  if (parts.leadSummary.hotLeads > 0) scoreValue += 5;
  if (parts.projectSummary.blockedProjects > 0) scoreValue -= Math.min(15, parts.projectSummary.blockedProjects * 5);
  if (parts.blockers.critical > 0) scoreValue -= Math.min(20, parts.blockers.critical * 5);
  if (parts.approvalsNeeded.highPriority > 0) scoreValue -= Math.min(10, parts.approvalsNeeded.highPriority * 3);
  return Math.max(0, Math.min(100, scoreValue));
}

export function determineExecutiveFocus(parts: any) {
  if (parts.approvalsNeeded.highPriority > 0) return "Clear high-priority approvals first.";
  if (parts.blockers.critical > 0) return "Remove the biggest blocker before starting new work.";
  if (parts.leadSummary.hotLeads > 0) return "Move the hottest Creator Logistics lead forward.";
  if (parts.revenueSummary.confirmedRevenue === 0) return "Take one revenue action before internal build work.";
  return "Keep execution narrow and ship the next committed task.";
}

function amount(item: any): number {
  const value = item.amount || item.value || item.estimatedValue || 0;
  return typeof value === "number" ? value : Number(value) || 0;
}

function score(item: any): number {
  const value = item.score || item.priorityScore || item.leadScore || priorityWeight(item.priority || "");
  return typeof value === "number" ? value : Number(value) || 0;
}

function formatLines(items: string[]) {
  return items.length ? items.map((item) => `- ${item}`) : ["- None"];
}

function formatPrefixedLines(labelText: string, items: string[]) {
  if (!items.length) return [`- ${labelText}: None`];
  return [`- ${labelText}: ${items.join("; ")}`];
}
