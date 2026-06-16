export type AgentReportType = "Daily Agent Report" | "Weekly Agent Report" | "Risk Report" | "Progress Report" | "Blocker Report" | "Recommendation Report" | "Handoff Report";

export function generateAgentReport(agentName: string, data: Record<string, any[]>, reportType: AgentReportType) {
  const agent = (data.agents || []).find((item) => item.agentName === agentName);
  const agentItems = (items: any[] = []) => items.filter((item) => item.assignedAgent === agentName || item.agentName === agentName);
  const activeWork = agentItems(data.tasks).filter((task) => task.status !== "Completed");
  const completedWork = agentItems(data.tasks).filter((task) => task.status === "Completed");
  const blockers = agentItems(data.blockers).concat(activeWork.filter((item) => /blocked|needs info/i.test(JSON.stringify(item))));
  const waitingOnCole = agentItems(data.approvals).concat(activeWork.filter((item) => item.requiresColeApproval));
  const risks = [...blockers, ...waitingOnCole].filter((item) => /risk|high|legal|money|client|grant/i.test(JSON.stringify(item)));

  return {
    agentSummary: `${agentName} ${reportType} for ${agent?.department || "unknown department"}.`,
    completedWork,
    activeWork,
    blockers,
    waitingOnCole,
    risks,
    recommendations: getRecommendations(activeWork, blockers, waitingOnCole),
    nextActions: activeWork.slice(0, 3).map((item) => `Advance ${label(item)}.`),
    approvalsNeeded: waitingOnCole,
    codexTasksNeeded: activeWork.filter((item) => /backend|bug|test|script|codex/i.test(JSON.stringify(item))),
    cursorTasksNeeded: activeWork.filter((item) => /ui|page|dashboard|cursor/i.test(JSON.stringify(item))),
    logEntry: { loopName: "Agent Report", agentName, reportType, timestamp: new Date().toISOString(), summary: `Generated ${reportType}.` },
  };
}

function getRecommendations(active: any[], blockers: any[], approvals: any[]): string[] {
  if (approvals.length) return [`Clear approval for ${label(approvals[0])}.`];
  if (blockers.length) return [`Resolve blocker: ${label(blockers[0])}.`];
  if (active.length) return [`Finish or hand off ${label(active[0])}.`];
  return ["Review inbox for next assignment."];
}

function label(item: any): string {
  return typeof item === "string" ? item : item?.title || item?.name || "";
}
