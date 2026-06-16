export type ReleasePlan = { id: string; releaseName: string; product: string; version: string; releaseType: string; targetDate?: string; includedFeatures: string[]; fixedBugs: string[]; knownIssues: string[]; QAStatus: string; accessibilityStatus: string; securityStatus: string; rollbackPlan?: string; releaseNotes?: string; approvalStatus?: string };
const releases: ReleasePlan[] = [];

export function createReleasePlan(release: ReleasePlan): ReleasePlan {
  const stored = { ...release, approvalStatus: release.approvalStatus || "Needs Cole Approval", rollbackPlan: release.rollbackPlan || generateRollbackPlan(release), releaseNotes: release.releaseNotes || generateReleaseNotes(release) };
  releases.push(stored);
  return stored;
}

export function validateReleaseReadiness(release: ReleasePlan, qaData: Record<string, any>) {
  const blockers = identifyReleaseBlockers(release, qaData.bugs || [], qaData.securityIssues || []);
  const approvalRequired = /Public|Client|Grant|Funder|Partner|Production/i.test(release.releaseType);
  return { ready: blockers.length === 0 && (!approvalRequired || release.approvalStatus === "Approved"), blockers, approvalRequired, warning: "Public/client/funder releases require Cole approval." };
}

export function generateReleaseNotes(release: ReleasePlan): string {
  return [`${release.releaseName} ${release.version}`, `Features: ${release.includedFeatures.join(", ") || "none"}`, `Fixed bugs: ${release.fixedBugs.join(", ") || "none"}`, `Known issues: ${release.knownIssues.join(", ") || "none"}`].join("\n");
}

export function generateRollbackPlan(release: ReleasePlan): string {
  return `If ${release.releaseName} fails QA or exposes risk, revert to previous ${release.product} version and disable the changed workflow.`;
}

export function identifyReleaseBlockers(release: ReleasePlan, bugs: any[], securityIssues: any[]) {
  const blockers: string[] = [];
  bugs.filter((bug) => bug.product === release.product && /Critical/.test(bug.severity || "")).forEach((bug) => blockers.push(`Critical bug: ${bug.bugTitle || bug.issue}`));
  securityIssues.filter((issue) => issue.product === release.product && /Critical|High/.test(issue.severity || "")).forEach((issue) => blockers.push(`Security/privacy issue: ${issue.issue}`));
  if (/failed|not ready/i.test(release.QAStatus)) blockers.push("QA is not ready.");
  return blockers;
}

export function markReleasedManually(releaseId: string, approval: { approvedByCole: boolean }): ReleasePlan {
  const release = releases.find((entry) => entry.id === releaseId);
  if (!release) throw new Error(`Release ${releaseId} not found.`);
  if (/Public|Client|Grant|Funder|Partner|Production/i.test(release.releaseType) && !approval.approvedByCole) throw new Error("Cole approval required before release.");
  release.approvalStatus = "Released Manually";
  return release;
}
