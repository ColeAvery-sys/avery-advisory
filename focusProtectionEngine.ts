export function calculateOverwhelmScore(data: any): number {
  const projectLoad = Math.min(40, (data.activeProjects || 0) * 2);
  const commitments = Math.min(25, (data.openCommitments || 0) * 2);
  const approvals = Math.min(15, (data.pendingApprovals || 0) * 2);
  const missed = Math.min(20, (data.missedDeadlines || 0) * 5);
  return Math.min(100, projectLoad + commitments + approvals + missed + (data.selfReportedOverwhelm || 0));
}

export function generateFocusProtectionReport(data: any) {
  const overwhelmScore = calculateOverwhelmScore(data);
  const warnings: string[] = [];
  if ((data.activeProjects || 0) > 12) warnings.push(`Focus limit exceeded: ${data.activeProjects} active projects.`);
  if (overwhelmScore >= 70) warnings.push("Overwhelm score is high.");
  if ((data.newIdeasToday || 0) > 3) warnings.push("New idea volume is high. Capture, do not start.");
  return {
    overwhelmScore,
    warnings,
    noNewProjectsRecommendedDays: overwhelmScore >= 70 ? 5 : overwhelmScore >= 50 ? 2 : 0,
    recommendation: warnings.length ? "Freeze new projects and finish/decide existing work." : "Focus is within range. Keep top three protected.",
  };
}

export function shouldAcceptNewProject(data: any) {
  const report = generateFocusProtectionReport(data);
  return { accept: report.overwhelmScore < 50 && (data.activeProjects || 0) < 10, reason: report.recommendation };
}

