import { createDailyExecutiveReport, generateExecutiveReportStorageRecord } from "./dailyExecutiveReportSystem";

const report = createDailyExecutiveReport({
  date: "2026-06-02",
  revenue: [
    { title: "Creator Logistics paid deposit", amount: 500, status: "Confirmed" },
    { title: "Weekly Clip Engine prospect", amount: 1200, status: "Open" },
  ],
  leads: [
    { name: "Creator with backlog", score: 91, status: "Hot", nextAction: "Follow up" },
    { name: "Podcast editing inquiry", score: 70, status: "New" },
  ],
  projects: [
    { projectName: "Client intake packet", status: "Active", priority: "High", deadline: "Today" },
    { projectName: "Editor candidate review", status: "Waiting", priority: "High" },
  ],
  blockers: [{ title: "Need Cole approval on outreach message", priority: "High" }],
  approvals: [{ title: "Approve Creator Logistics follow-up", priority: "High" }],
});

console.log("Daily Executive Report");
console.log(report);
console.log("Storage Record");
console.log(generateExecutiveReportStorageRecord(report));
