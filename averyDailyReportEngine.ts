import { createAveryApprovalGate } from "./averyOpsSafety";

const reports: any[] = [];

export function createAgentDailyReport(report: any) {
  const gate = createAveryApprovalGate("Agent daily report", report);
  const stored = {
    id: report.id || `daily-report-${reports.length + 1}`,
    agentName: report.agentName,
    date: report.date || new Date(0).toISOString().slice(0, 10),
    completed: report.completed || [],
    blocked: report.blocked || [],
    needsApproved: report.needsApproved || [],
    recommendedNextActions: report.recommendedNextActions || [],
    approvalStatus: gate.approvalStatus,
    riskFlags: gate.riskFlags,
  };
  reports.push(stored);
  return stored;
}

export function getDailyReports(date?: string) {
  return date ? reports.filter((report) => report.date === date) : reports.slice();
}

export function generateDailyReportDigest(date?: string) {
  const source = getDailyReports(date);
  return {
    reportCount: source.length,
    completed: source.reduce((items: string[], report) => items.concat(report.completed), []),
    blocked: source.reduce((items: string[], report) => items.concat(report.blocked), []),
    needsApproved: source.reduce((items: string[], report) => items.concat(report.needsApproved), []),
    recommendedNextActions: source.reduce((items: string[], report) => items.concat(report.recommendedNextActions), []),
  };
}
