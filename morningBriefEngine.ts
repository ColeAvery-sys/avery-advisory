export type MorningBriefInput = {
  date: string;
  dailyPlanningResult: Record<string, any>;
  calendarDrafts: any[];
  notifications: any[];
  moneyPipeline: any[];
  grantDeadlines: any[];
  clientFollowUps: any[];
  productBuildTasks: any[];
  approvals: any[];
  personalAdmin: any[];
  systemHealth: string;
};

export function generateMorningBrief(data: MorningBriefInput) {
  const todayTopThree = pickTop([...(data.dailyPlanningResult.todayTopThree || []), ...data.moneyPipeline, ...data.grantDeadlines, ...data.clientFollowUps], 3);
  const fastestMoneyMove = pickFirst(data.moneyPipeline, "No money move queued.");
  const mostImportantBuildMove = pickFirst(data.productBuildTasks, "No build move queued.");
  const grantFundingMove = pickFirst(data.grantDeadlines, "No grant deadline move today.");
  const clientMove = pickFirst(data.clientFollowUps, "No client follow-up due.");
  const risks = [...data.approvals, ...data.notifications].filter((item) => /risk|urgent|critical|approval/i.test(JSON.stringify(item)));

  return {
    openingSummary: `${data.date}: focus on cash, deadlines, blockers, and stability. System health: ${data.systemHealth}.`,
    todayTopThree,
    fastestMoneyMove,
    mostImportantBuildMove,
    grantFundingMove,
    clientMove,
    approvalsWaiting: data.approvals,
    deadlinesToday: data.grantDeadlines.filter((item) => item.date === data.date || item.deadline === data.date),
    risks,
    ignoreToday: ["Moonshot work that does not unlock cash, funding, delivery, or stability."],
    suggestedCalendarBlocks: data.calendarDrafts.slice(0, 4),
    oneSentenceCommand: `Do ${label(todayTopThree[0]) || "the highest-cash practical task"} first, then clear approvals and deadline risks.`,
    tasksToCreate: todayTopThree.map((item) => ({ title: `Execute: ${label(item)}`, source: "Morning Brief" })),
    notificationsToCreate: risks.map((item) => ({ title: `Review risk: ${label(item)}`, priority: "High" })),
    logEntry: createLog("Morning Brief", `Generated morning brief for ${data.date}.`),
  };
}

function pickTop(items: any[], limit: number): any[] {
  return items.sort((a, b) => (b.score || b.priority || 0) - (a.score || a.priority || 0)).slice(0, limit);
}

function pickFirst(items: any[], fallback: string): string {
  return label(pickTop(items, 1)[0]) || fallback;
}

function label(item: any): string {
  return typeof item === "string" ? item : item?.title || item?.name || "";
}

function createLog(loopName: string, summary: string) {
  return { loopName, timestamp: new Date().toISOString(), status: "Success", summary };
}
