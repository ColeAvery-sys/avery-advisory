import { label, pickTop } from "./executiveSafety";

export function generateDailyExecutiveBriefing(data: any) {
  const topThree = pickTop([...(data.revenueTasks || []), ...(data.clientTasks || []), ...(data.grantTasks || []), ...(data.productTasks || [])], 3);
  const avoid = identifyThingsToAvoidToday(data);
  return {
    greeting: `Good Morning ${data.name || "Cole"}`,
    today: topThree.map(label),
    avoid,
    recommendedFocus: label(topThree[0]) || "Creator Logistics fulfillment",
    decisionsNeeded: (data.decisions || []).slice(0, 3),
    overwhelmNote: (data.openProjects || 0) > 12 ? "Open project count is high. Do fewer things today." : "Keep the day narrow.",
    approvalRequired: false,
  };
}

export function identifyThingsToAvoidToday(data: any): string[] {
  const avoid = ["Starting new experimental projects", "Redesigning already-good-enough pages", "Low-cash creative side quests"];
  if ((data.openProjects || 0) > 10) avoid.unshift("Adding new commitments");
  return avoid.concat(data.avoid || []).slice(0, 5);
}

export function createDailyCheckInTasks(briefing: any) {
  return (briefing.today || []).map((title: string) => ({ title: `Today: ${title}`, status: "Ready", source: "Daily Executive Briefing" }));
}

