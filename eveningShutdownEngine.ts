export type EveningShutdownInput = {
  date: string;
  completedTasks: any[];
  missedTasks: any[];
  newIdeas: any[];
  approvalsHandled: any[];
  messagesSentManually: any[];
  moneyMovement: any[];
  blockers: any[];
  energyNote: string;
  tomorrowDeadlines: any[];
};

export function generateEveningShutdown(data: EveningShutdownInput) {
  const urgentMissed = data.missedTasks.filter((task) => /urgent|critical|today|overdue/i.test(JSON.stringify(task)));
  const distractions = data.newIdeas.filter((idea) => !/cash|grant|client|atlas|approval/i.test(JSON.stringify(idea)));

  return {
    whatGotDone: data.completedTasks,
    whatDidNotGetDone: data.missedTasks,
    moneyProgress: data.moneyMovement,
    clientProgress: data.completedTasks.filter((task) => /client|creator|delivery/i.test(JSON.stringify(task))),
    grantProgress: data.completedTasks.filter((task) => /grant|funding/i.test(JSON.stringify(task))),
    productProgress: data.completedTasks.filter((task) => /product|build|atlas|bug/i.test(JSON.stringify(task))),
    newRisks: data.blockers,
    carryToTomorrow: [...urgentMissed, ...data.tomorrowDeadlines],
    archiveOrIgnore: distractions,
    tomorrowPrep: data.tomorrowDeadlines.map((item) => ({ title: `Prepare for ${label(item)}`, source: "Evening Shutdown" })),
    shutdownNote: `Shutdown for ${data.date}. Energy note: ${data.energyNote}. Capture ideas, but do not let them derail tomorrow's cash and deadline work.`,
    tasksToCreate: urgentMissed.map((task) => ({ title: `Carry forward: ${label(task)}`, priority: "High" })),
    weeklyReviewInputs: { completed: data.completedTasks.length, missed: data.missedTasks.length, blockers: data.blockers.length },
    knowledgeBaseItems: data.newIdeas.map((idea) => ({ title: `Idea captured: ${label(idea)}`, status: "Needs Review" })),
    logEntry: createLog("Evening Shutdown", `Generated shutdown review for ${data.date}.`),
  };
}

function label(item: any): string {
  return typeof item === "string" ? item : item?.title || item?.name || "";
}

function createLog(loopName: string, summary: string) {
  return { loopName, timestamp: new Date().toISOString(), status: "Success", summary };
}
