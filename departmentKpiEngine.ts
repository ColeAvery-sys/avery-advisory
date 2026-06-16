export function calculateDepartmentKPIs(department: string, data: Record<string, any[]>) {
  const tasks = filterDepartment(data.tasks || [], department);
  const approvals = filterDepartment(data.approvals || [], department);
  const deadlines = filterDepartment(data.deadlines || [], department);
  const blockers = filterDepartment(data.blockers || [], department);
  const kpis = getKpisForDepartment(department, { tasks, approvals, deadlines, blockers, data });
  const warnings = [
    ...(approvals.length ? [`${approvals.length} approvals waiting.`] : []),
    ...(deadlines.filter((item) => (item.daysRemaining || 99) <= 7).length ? ["Deadline risk within 7 days."] : []),
    ...(blockers.length ? [`${blockers.length} blockers active.`] : []),
  ];

  return {
    department,
    kpis,
    warnings,
    recommendations: warnings.length ? ["Send risky or blocked items to Action Center."] : ["Continue current department workflow."],
    actionItems: [...approvals, ...blockers].map((item) => ({ title: `Resolve ${label(item)}`, department, requiresColeApproval: true })),
    logEntry: { loopName: "Department KPI", department, timestamp: new Date().toISOString(), summary: `Calculated KPIs for ${department}.` },
  };
}

function getKpisForDepartment(department: string, input: any): Record<string, number> {
  const base = {
    activeTasks: input.tasks.filter((task: any) => task.status !== "Completed").length,
    approvalsWaiting: input.approvals.length,
    blockers: input.blockers.length,
    deadlines: input.deadlines.length,
  };
  if (/Grants/i.test(department)) return { ...base, grantsTracked: (input.data.grants || []).length, packetsDrafted: count(input.data.grants, "packet") };
  if (/Sales/i.test(department)) return { ...base, leadsTracked: (input.data.leads || []).length, warmLeads: count(input.data.leads, "warm") };
  if (/Creator Logistics/i.test(department)) return { ...base, activeClients: (input.data.clients || []).length, deliveriesDue: count(input.data.deadlines, "delivery") };
  if (/Product/i.test(department)) return { ...base, activeBuilds: (input.data.products || []).length, bugsOpen: count(input.data.tasks, "bug") };
  if (/Automation/i.test(department)) return { ...base, failedRuns: count(input.data.logs, "failed"), blockedAutomations: count(input.data.logs, "blocked") };
  return base;
}

function filterDepartment(items: any[], department: string): any[] {
  return items.filter((item) => item.department === department || item.relatedDepartment === department);
}

function count(items: any[] = [], pattern: string): number {
  return items.filter((item) => new RegExp(pattern, "i").test(JSON.stringify(item))).length;
}

function label(item: any): string {
  return typeof item === "string" ? item : item?.title || item?.name || "";
}
