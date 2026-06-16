export type SecurityIssue = { id: string; product: string; pageOrFeature: string; riskCategory: string; issue: string; severity?: string; suggestedFix?: string; status?: string; professionalReviewRecommended?: boolean };
const securityIssues: SecurityIssue[] = [];

export function runSecurityPrivacyChecklist(productOrFeature: Record<string, any>) {
  const checks = ["secrets not exposed", "client data not public", "internal notes hidden", "no automatic deletion", "no automatic sending", "private routes protected", "sensitive exports flagged", "audit logs present", "input validation exists"];
  return { product: productOrFeature.product || productOrFeature.productName || "Unknown", checks, status: "Internal review only", warning: "Critical security/privacy issues block release." };
}

export function createSecurityPrivacyIssue(issue: SecurityIssue): SecurityIssue {
  const stored = { ...issue, severity: issue.severity || classifySecuritySeverity(issue), status: issue.status || "Open", professionalReviewRecommended: true };
  securityIssues.push(stored);
  return stored;
}

export function classifySecuritySeverity(issue: SecurityIssue): string {
  const text = `${issue.riskCategory} ${issue.issue}`.toLowerCase();
  if (/secret|api key|sensitive data|client data|internal notes|public access|unsafe external|auto send|auto delete/.test(text)) return "Critical";
  if (/auth|privacy|upload|export/.test(text)) return "High";
  return "Medium";
}

export function generateCodexSecurityPrompt(issue: SecurityIssue): string {
  return `Fix this ${issue.severity || classifySecuritySeverity(issue)} security/privacy issue in ${issue.product}: ${issue.issue}. Add tests and prevent sensitive data exposure.`;
}

export function generatePrivacyReview(product: string) {
  return { product, review: ["Identify sensitive data", "Confirm internal notes are hidden", "Check exports", "Check logs", "Check external actions"], approvalRequired: true };
}

export function markIssueMitigated(issueId: string): SecurityIssue {
  const issue = findIssue(issueId);
  issue.status = "Mitigated";
  return issue;
}

export function getReleaseBlockingSecurityIssues(product: string): SecurityIssue[] {
  return securityIssues.filter((issue) => issue.product === product && issue.status !== "Mitigated" && /Critical|High/.test(issue.severity || ""));
}

export function clearSecurityIssuesForDemo(): void {
  securityIssues.length = 0;
}

function findIssue(issueId: string): SecurityIssue {
  const issue = securityIssues.find((entry) => entry.id === issueId);
  if (!issue) throw new Error(`Security issue ${issueId} not found.`);
  return issue;
}
