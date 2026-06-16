import { createDailyExecutiveReport, exportDailyExecutiveReportMarkdown, generateExecutiveReportStorageRecord, getExecutiveReports, getLatestExecutiveReport } from "./dailyExecutiveReportSystem";

const report = createDailyExecutiveReport({
  date: "2026-06-02",
  revenue: [
    { title: "Creator Logistics deposit", amount: 500, status: "Confirmed" },
    { title: "Editing package opportunity", amount: 1500, status: "Open" },
  ],
  leads: [
    { name: "YouTube creator lead", score: 88, status: "Hot", nextAction: "Follow up" },
    { name: "Local business lead", score: 55, status: "New" },
  ],
  projects: [
    { projectName: "Client delivery packet", status: "Active", priority: "High", deadline: "Today" },
    { projectName: "ATLAS dashboard", status: "Blocked", priority: "High" },
  ],
  blockers: [{ title: "Editor test needs review", priority: "High" }],
  approvals: [{ title: "Approve client follow-up", priority: "High" }],
});

assertEqual(report.storageFolder, "Executive Reports");
assertEqual(report.revenueSummary.totalRevenue, 2000);
assertEqual(report.revenueSummary.confirmedRevenue, 500);
assertEqual(report.leadSummary.hotLeads, 1);
assertEqual(report.projectSummary.blockedProjects, 1);
assertEqual(report.blockers.count, 2);
assertEqual(report.approvalsNeeded.count, 1);
assertEqual(report.recommendedFocus, "Clear high-priority approvals first.");
assertEqual(getExecutiveReports("2026-06-02").length, 1);
assertEqual(getLatestExecutiveReport().id, report.id);

const markdown = exportDailyExecutiveReportMarkdown(report);
assertEqual(markdown.indexOf("## Revenue Summary") >= 0, true);
assertEqual(markdown.indexOf("## Approvals Needed") >= 0, true);
assertEqual(markdown.indexOf("Creator Logistics deposit") >= 0, true);

const storage = generateExecutiveReportStorageRecord(report);
assertEqual(storage.folder, "Executive Reports");
assertEqual(storage.fileName, "daily-executive-report-2026-06-02.md");
assertEqual(storage.manualSaveRequired, true);

console.log("All Daily Executive Report System tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
