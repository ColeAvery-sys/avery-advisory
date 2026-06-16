export type HealthStatus = "Healthy" | "Warning" | "Critical" | "Offline" | "Unknown";

export type SystemHealthInput = {
  serverHealth: HealthStatus;
  databaseHealth: HealthStatus;
  integrationCredentials: HealthStatus;
  failedLoops: number;
  failedIntegrations: number;
  overdueApprovals: number;
  notificationBacklog: number;
  schedulerStatus: HealthStatus;
  actionLogStatus: HealthStatus;
  recentErrors: string[];
};

export function runSystemHealthCheck(data: SystemHealthInput) {
  const healthChecks = [
    { name: "local server health", status: data.serverHealth },
    { name: "database/storage health", status: data.databaseHealth },
    { name: "integration credential status", status: data.integrationCredentials },
    { name: "scheduler status", status: data.schedulerStatus },
    { name: "action log status", status: data.actionLogStatus },
  ];
  const warnings = healthChecks.filter((item) => item.status === "Warning").map((item) => item.name);
  const criticalIssues = [
    ...healthChecks.filter((item) => item.status === "Critical" || item.status === "Offline").map((item) => `${item.name}: ${item.status}`),
    ...(data.failedLoops > 0 ? [`failed loop count: ${data.failedLoops}`] : []),
    ...(data.failedIntegrations > 0 ? [`failed integration count: ${data.failedIntegrations}`] : []),
    ...(data.recentErrors.length > 0 ? data.recentErrors : []),
  ];

  return {
    overallStatus: getOverallStatus(healthChecks.map((item) => item.status), criticalIssues.length),
    healthChecks,
    warnings,
    criticalIssues,
    suggestedFixes: getSuggestedFixes(data, criticalIssues),
    codexDebugPrompts: criticalIssues.map((issue) => `Debug ATLAS system health issue: ${issue}. Do not restart services automatically. Provide safe manual steps.`),
    notificationsToCreate: [...warnings, ...criticalIssues].map((issue) => ({ title: issue, priority: criticalIssues.includes(issue) ? "High" : "Medium" })),
    logEntry: createLog("System Health Monitor", `Health check found ${warnings.length} warnings and ${criticalIssues.length} critical issues.`),
  };
}

function getOverallStatus(statuses: HealthStatus[], criticalCount: number): HealthStatus {
  if (statuses.includes("Offline")) return "Offline";
  if (criticalCount >= 3) return "Critical";
  if (criticalCount > 0 || statuses.includes("Critical")) return "Critical";
  if (statuses.includes("Warning") || statuses.includes("Unknown")) return "Warning";
  return "Healthy";
}

function getSuggestedFixes(data: SystemHealthInput, criticalIssues: string[]): string[] {
  const fixes = ["Review logs before taking action.", "Create Codex debug prompt for failures.", "Do not restart services automatically."];
  if (criticalIssues.length >= 3) fixes.push("Recommend Local Only Mode until failures are understood.");
  if (data.overdueApprovals > 0) fixes.push("Clear overdue approvals or batch low-risk items.");
  if (data.notificationBacklog > 10) fixes.push("Review notification backlog and archive stale notices.");
  return fixes;
}

function createLog(loopName: string, summary: string) {
  return { loopName, timestamp: new Date().toISOString(), status: "Success", summary };
}
