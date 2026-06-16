export function generateDepartmentDashboard(department: string, data: Record<string, any>) {
  const filterByDepartment = (items: any[] = []) => items.filter((item) => item.department === department || item.relatedDepartment === department);
  const activeTasks = filterByDepartment(data.tasks).filter((task) => task.status !== "Completed");
  const urgentTasks = activeTasks.filter((task) => (task.priority || 0) >= 8 || /urgent|critical|overdue/i.test(JSON.stringify(task)));
  const waitingOnCole = filterByDepartment(data.approvals).concat(activeTasks.filter((task) => task.requiresColeApproval));
  const riskWarnings = [...urgentTasks, ...waitingOnCole].filter((item) => /high|risk|approval|legal|money|client|grant/i.test(JSON.stringify(item)));

  return {
    departmentMission: getMission(department),
    assignedAgent: (data.agents || []).find((agent: any) => agent.department === department)?.agentName || "Unassigned",
    activeTasks,
    urgentTasks,
    waitingOnCole,
    kpis: data.kpis || {},
    relatedDocuments: filterByDepartment(data.documents),
    relatedApprovals: waitingOnCole,
    relatedDeadlines: filterByDepartment(data.deadlines),
    relatedWorkflows: filterByDepartment(data.workflows),
    nextRecommendedAction: getNextAction(urgentTasks, waitingOnCole, activeTasks),
    riskWarnings,
    logEntry: { loopName: "Department Dashboard", department, timestamp: new Date().toISOString(), summary: `Generated dashboard for ${department}.` },
  };
}

function getMission(department: string): string {
  const missions: Record<string, string> = {
    "Grants and Funding": "Find and prepare funding opportunities without submitting externally without Cole approval.",
    "Creator Logistics": "Protect client delivery, revisions, assets, and payment status.",
    "Product Development": "Move ATLAS and AveryTech products toward useful MVPs.",
    "Engineering Dispatch": "Turn technical work into clear Codex/Cursor prompts.",
  };
  return missions[department] || `Operate ${department} with clear tasks, approval safety, and practical reporting.`;
}

function getNextAction(urgent: any[], approvals: any[], active: any[]): string {
  if (approvals.length) return `Clear approval: ${label(approvals[0])}.`;
  if (urgent.length) return `Handle urgent item: ${label(urgent[0])}.`;
  if (active.length) return `Advance active task: ${label(active[0])}.`;
  return "Review inbox and create the next useful task.";
}

function label(item: any): string {
  return typeof item === "string" ? item : item?.title || item?.name || "";
}
