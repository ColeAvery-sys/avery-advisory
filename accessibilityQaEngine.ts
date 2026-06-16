export type AccessibilityIssue = { id: string; product: string; page: string; issue: string; severity?: string; affectedUsers?: string[]; WCAGRelated?: string; suggestedFix?: string; status?: string; relatedFeature?: string; relatedBug?: string };
const accessibilityIssues: AccessibilityIssue[] = [];

export function runAccessibilityChecklist(productOrPage: Record<string, any>) {
  return { product: productOrPage.product || productOrPage.productName || "Unknown", status: "Reviewed internally, not professionally audited", checks: ["keyboard navigation", "readable contrast", "clear labels", "form error clarity", "screen reader labels", "reduced motion option", "cognitive load", "mobile usability", "overwhelm-safe UI", "alt text"] };
}

export function createAccessibilityIssue(issue: AccessibilityIssue): AccessibilityIssue {
  const stored = { ...issue, severity: issue.severity || classifyAccessibilitySeverity(issue), status: issue.status || "Open" };
  accessibilityIssues.push(stored);
  return stored;
}

export function classifyAccessibilitySeverity(issue: AccessibilityIssue): string {
  const text = `${issue.issue} ${issue.affectedUsers || ""}`.toLowerCase();
  if (/cannot use|keyboard navigation blocked|keyboard blocked|screen reader blocked|seizure|unreadable|overwhelm/.test(text)) return "Severe";
  if (/contrast|label|focus|mobile|error/.test(text)) return "Moderate";
  return "Low";
}

export function generateAccessibilityFixPrompt(issue: AccessibilityIssue): string {
  return `Fix accessibility issue in ${issue.product} on ${issue.page}: ${issue.issue}. Do not claim full compliance unless professionally audited.`;
}

export function generateAccessibilityReport(product: string) {
  const issues = accessibilityIssues.filter((issue) => issue.product === product && issue.status !== "Fixed" && issue.status !== "Verified");
  return { product, status: "Reviewed internally", openIssues: issues, blocksReadiness: issues.some((issue) => issue.severity === "Severe") };
}

export function markAccessibilityIssueFixed(issueId: string): AccessibilityIssue {
  const issue = findIssue(issueId);
  issue.status = "Fixed";
  return issue;
}

export function verifyAccessibilityFix(issueId: string): AccessibilityIssue {
  const issue = findIssue(issueId);
  issue.status = "Verified";
  return issue;
}

export function clearAccessibilityIssuesForDemo(): void {
  accessibilityIssues.length = 0;
}

function findIssue(issueId: string): AccessibilityIssue {
  const issue = accessibilityIssues.find((entry) => entry.id === issueId);
  if (!issue) throw new Error(`Accessibility issue ${issueId} not found.`);
  return issue;
}
