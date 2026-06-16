export type AutopilotRunType = "Manual" | "Scheduled" | "Retry" | "Test";
export type AutopilotRunStatus = "Success" | "Partial Success" | "Failed" | "Skipped" | "Blocked by Safety Mode";

export type AutopilotRunRecord = {
  id: string;
  loopName: string;
  runType: AutopilotRunType;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  status: AutopilotRunStatus;
  outputsCreated: string[];
  notificationsCreated: number;
  approvalItemsCreated: number;
  tasksCreated: number;
  draftsCreated: number;
  errors: string[];
  summary: string;
  logLink?: string;
};

const runs: AutopilotRunRecord[] = [];

export function createRunRecord(run: AutopilotRunRecord): AutopilotRunRecord {
  runs.push(run);
  return run;
}

export function updateRunRecord(runId: string, updates: Partial<AutopilotRunRecord>): AutopilotRunRecord {
  const run = findRun(runId);
  Object.assign(run, updates);
  return run;
}

export function completeRunRecord(runId: string, result: Partial<AutopilotRunRecord>): AutopilotRunRecord {
  const run = findRun(runId);
  const completedAt = result.completedAt || new Date().toISOString();
  const duration = new Date(completedAt).getTime() - new Date(run.startedAt).getTime();
  Object.assign(run, result, { completedAt, duration });
  return run;
}

export function getRunsByLoop(loopName: string): AutopilotRunRecord[] {
  return runs.filter((run) => run.loopName === loopName);
}

export function getRecentRuns(limit: number): AutopilotRunRecord[] {
  return [...runs].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, limit);
}

export function getFailedRuns(): AutopilotRunRecord[] {
  return runs.filter((run) => run.status === "Failed" || run.status === "Partial Success" || run.status === "Blocked by Safety Mode");
}

export function generateRunSummary(runId: string): string {
  const run = findRun(runId);
  return `${run.loopName} ${run.runType} run ended with ${run.status}. Tasks: ${run.tasksCreated}. Drafts: ${run.draftsCreated}. Approvals: ${run.approvalItemsCreated}. Errors: ${run.errors.length}.`;
}

export function createDebugPromptFromFailedRun(runId: string): string {
  const run = findRun(runId);
  if (run.status === "Success") return "No debug prompt needed. Run succeeded.";
  return [`Debug ATLAS autopilot run failure.`, `Loop: ${run.loopName}`, `Status: ${run.status}`, `Errors: ${run.errors.join("; ") || "Unknown error"}`, `Expected: keep all risky actions behind Cole approval.`].join("\n");
}

export function clearAutopilotRunHistoryForDemo(): void {
  runs.length = 0;
}

function findRun(runId: string): AutopilotRunRecord {
  const run = runs.find((item) => item.id === runId);
  if (!run) throw new Error(`Run ${runId} not found.`);
  return run;
}
