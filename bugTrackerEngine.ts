export type BugSeverity = "Critical" | "High" | "Medium" | "Low";
export type BugStatus = "New" | "Reproduced" | "Needs Info" | "Ready for Codex" | "Ready for Cursor" | "In Progress" | "Fixed" | "Verified" | "Closed" | "Won't Fix";
export type BugReport = {
  id: string;
  bugTitle: string;
  product: string;
  severity?: BugSeverity;
  status?: BugStatus;
  stepsToReproduce?: string[];
  expectedBehavior: string;
  actualBehavior: string;
  screenshotsOrLogs?: string[];
  affectedUsers?: string[];
  relatedFeature?: string;
  suspectedCause?: string;
  workaround?: string;
  assignedAgent?: string;
  codexPrompt?: string;
  cursorPrompt?: string;
};

const bugs: BugReport[] = [];

export function createBugReport(bug: BugReport): BugReport {
  const stored = { ...bug, severity: bug.severity || classifyBugSeverity(bug), status: bug.status || "New" as BugStatus };
  stored.codexPrompt = generateCodexDebugPrompt(stored);
  stored.cursorPrompt = generateCursorFixPrompt(stored);
  bugs.push(stored);
  return stored;
}

export function classifyBugSeverity(bug: BugReport): BugSeverity {
  const text = `${bug.bugTitle} ${bug.actualBehavior} ${bug.relatedFeature || ""}`.toLowerCase();
  if (/data loss|security|privacy|secret|client note|internal note|payment|grant|blocked workflow|cannot submit|cannot save/.test(text)) return "Critical";
  if (/broken|fails|crash|important workflow|delivery/.test(text)) return "High";
  if (/confusing|slow|annoying|workaround/.test(text)) return "Medium";
  return "Low";
}

export function generateReproductionSteps(bug: BugReport): string[] {
  return bug.stepsToReproduce && bug.stepsToReproduce.length ? bug.stepsToReproduce : ["Open the affected product", `Navigate to ${bug.relatedFeature || bug.bugTitle}`, "Repeat the action that produced the actual behavior", "Capture logs or screenshots"];
}

export function generateCodexDebugPrompt(bug: BugReport): string {
  return `Fix or diagnose this ${bug.severity || classifyBugSeverity(bug)} bug in ${bug.product}: ${bug.bugTitle}. Expected: ${bug.expectedBehavior}. Actual: ${bug.actualBehavior}. Include tests.`;
}

export function generateCursorFixPrompt(bug: BugReport): string {
  return `Repair the UI/workflow for ${bug.product}: ${bug.bugTitle}. Preserve safety gates and verify the user flow visually.`;
}

export function markBugFixed(bugId: string): BugReport {
  const bug = findBug(bugId);
  bug.status = "Fixed";
  return bug;
}

export function verifyBugFix(bugId: string, testResult: { passed: boolean; notes?: string }): BugReport {
  const bug = findBug(bugId);
  bug.status = testResult.passed ? "Verified" : "Reproduced";
  bug.workaround = testResult.notes || bug.workaround;
  return bug;
}

export function createRdBugReport(bug: BugReport): BugReport & { rdPriority: number; rdCategory: string; approvalRequired: boolean } {
  const stored = createBugReport(bug) as BugReport & { rdPriority: number; rdCategory: string; approvalRequired: boolean };
  stored.rdPriority = calculateRdBugPriority(stored);
  stored.rdCategory = classifyRdBugCategory(stored);
  stored.approvalRequired = stored.severity === "Critical" || /security|privacy|accessibility|release|production/i.test(`${stored.bugTitle} ${stored.actualBehavior}`);
  return stored;
}

export function calculateRdBugPriority(bug: BugReport): number {
  const severityWeight = bug.severity === "Critical" ? 100 : bug.severity === "High" ? 75 : bug.severity === "Medium" ? 45 : 20;
  const text = `${bug.product} ${bug.bugTitle} ${bug.actualBehavior} ${bug.relatedFeature || ""}`.toLowerCase();
  const missionBoost = /atlas hq|atlas assist|echoframe|creator logistics|accessibility/.test(text) ? 20 : 0;
  const releaseBoost = /production|release|mvp|pilot|client/.test(text) ? 10 : 0;
  return Math.min(100, severityWeight + missionBoost + releaseBoost);
}

export function classifyRdBugCategory(bug: BugReport): string {
  const text = `${bug.bugTitle} ${bug.actualBehavior} ${bug.relatedFeature || ""}`.toLowerCase();
  if (/accessibility|screen reader|keyboard|contrast|caption/.test(text)) return "Accessibility";
  if (/security|privacy|secret|token|auth/.test(text)) return "Security";
  if (/slow|performance|lag|memory/.test(text)) return "Performance";
  if (/ui|layout|button|mobile|visual/.test(text)) return "UI";
  return "Product";
}

export function prioritizeRdBugs(product?: string) {
  return bugs
    .filter((bug) => !product || bug.product === product)
    .map((bug) => ({ ...bug, rdPriority: calculateRdBugPriority(bug), rdCategory: classifyRdBugCategory(bug) }))
    .sort((a, b) => b.rdPriority - a.rdPriority);
}

export function clearBugsForDemo(): void {
  bugs.length = 0;
}

function findBug(bugId: string): BugReport {
  const bug = bugs.find((entry) => entry.id === bugId);
  if (!bug) throw new Error(`Bug ${bugId} not found.`);
  return bug;
}
