import { generateProductSnapshot } from "./productCommandEngine";
import { createFeatureSpec, convertFeatureToCodexPrompt, convertFeatureToCursorPrompt, convertFeatureToTestCases } from "./featureSpecEngine";
import { createBugReport, markBugFixed, verifyBugFix, clearBugsForDemo } from "./bugTrackerEngine";
import { createTestCase, recordManualTestResult, createBugFromFailedTest, generateRegressionSuite, clearTestsForDemo } from "./testCaseManagerEngine";
import { createSecurityPrivacyIssue, getReleaseBlockingSecurityIssues, clearSecurityIssuesForDemo } from "./securityPrivacyChecklistEngine";
import { createAccessibilityIssue, generateAccessibilityReport, clearAccessibilityIssuesForDemo } from "./accessibilityQaEngine";
import { calculateMvpReadiness } from "./mvpReadinessEngine";
import { createDemoPlan, calculateDemoReadiness, generateDemoChecklist } from "./demoReadinessEngine";
import { createReleasePlan, validateReleaseReadiness, markReleasedManually } from "./releasePlannerEngine";
import { createFeedbackRecord, triageFeedback, convertFeedbackToBug, summarizeFeedback } from "./userFeedbackEngine";

clearBugsForDemo();
clearTestsForDemo();
clearSecurityIssuesForDemo();
clearAccessibilityIssuesForDemo();

const feature = createFeatureSpec({
  id: "feature-1",
  featureTitle: "Client-safe delivery tracker",
  product: "Creator Logistics Portal",
  problemSolved: "show safe client-visible delivery status",
  targetUser: "creator client",
  requirements: ["hide internal notes", "show approved delivery packet only"],
  priority: "High",
});
assertEqual(feature.riskLevel, "High");
assertEqual(feature.acceptanceCriteria!.length > 0, true);
assertEqual(convertFeatureToCodexPrompt(feature).indexOf("Include tests") >= 0, true);
assertEqual(convertFeatureToCursorPrompt(feature).indexOf("Build UI") >= 0, true);
assertEqual(convertFeatureToTestCases(feature).length > 0, true);

const bug = createBugReport({ id: "bug-1", bugTitle: "Internal notes visible to client", product: "Creator Logistics Portal", expectedBehavior: "Internal notes hidden", actualBehavior: "Client can see internal notes" });
assertEqual(bug.severity, "Critical");
assertEqual(markBugFixed("bug-1").status, "Fixed");
assertEqual(verifyBugFix("bug-1", { passed: true }).status, "Verified");

const test = createTestCase({ id: "test-1", testName: "Approval flow blocks public release", product: "ATLAS HQ", feature: "approval flow", testType: "Regression", priority: "Critical", steps: ["attempt release"], expectedResult: "Release blocked without Cole approval" });
assertEqual(recordManualTestResult("test-1", { passed: false, failedReason: "Release allowed" }).status, "Failed");
assertEqual(createBugFromFailedTest("test-1").severity, "Critical");
assertEqual(generateRegressionSuite("ATLAS HQ").length > 0, true);

const security = createSecurityPrivacyIssue({ id: "sec-1", product: "ATLAS HQ", pageOrFeature: "settings", riskCategory: "secrets", issue: "API key exposed in UI" });
assertEqual(security.severity, "Critical");
assertEqual(getReleaseBlockingSecurityIssues("ATLAS HQ").length, 1);

const accessibility = createAccessibilityIssue({ id: "a11y-1", product: "ATLAS Assist", page: "dashboard", issue: "keyboard navigation blocked" });
assertEqual(accessibility.severity, "Severe");
assertEqual(generateAccessibilityReport("ATLAS Assist").blocksReadiness, true);

const snapshot = generateProductSnapshot({ products: [{ productName: "ATLAS HQ", openBugs: 1, demoReadinessScore: 70, mvpReadinessScore: 70 }], bugs: [security] });
assertEqual(snapshot.nextBuildActions.length, 1);

const mvp = calculateMvpReadiness({ productName: "ATLAS Assist", targetUse: "Pilot" }, { coreFlowWorks: false, dataSavesCorrectly: true, bugs: [bug], risks: [security], requiredDocs: ["privacy note"], privacyReviewed: false, accessibilityReviewed: false, demoScriptExists: false });
assertEqual(mvp.status, "Not Ready");
assertEqual(mvp.approvalRequired, false);

const demo = createDemoPlan({ id: "demo-1", demoName: "ATLAS Assist pilot demo", targetAudience: "clinic partner", product: "ATLAS Assist", demoGoal: "show support workflow", demoFlow: ["open dashboard"], sampleDataNeeded: ["safe sample user"], liveDemoRisk: "workflow incomplete" });
assertEqual(calculateDemoReadiness(demo, { bugs: [bug] }).approvalRequired, true);
assertEqual(generateDemoChecklist(demo).indexOf("No sensitive data") >= 0, true);

const release = createReleasePlan({ id: "rel-1", releaseName: "Public Site 1.0", product: "AveryTech Public Website", version: "1.0", releaseType: "Public Website", includedFeatures: ["landing page"], fixedBugs: [], knownIssues: [], QAStatus: "Ready", accessibilityStatus: "Reviewed internally", securityStatus: "Needs review" });
assertEqual(validateReleaseReadiness(release, { bugs: [], securityIssues: [security] }).ready, false);
assertThrows(() => markReleasedManually("rel-1", { approvedByCole: false }));

const feedback = createFeedbackRecord({ id: "fb-1", sourceName: "Cole", sourceType: "Cole", product: "ATLAS HQ", feedbackText: "approval flow is broken", painPoint: "broken approval", severity: "High" });
assertEqual(triageFeedback("fb-1").status, "Bug");
assertEqual(convertFeedbackToBug("fb-1").product, "ATLAS HQ");
assertEqual(summarizeFeedback("ATLAS HQ").count, 1);

console.log("All ATLAS Batch 16 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}

function assertThrows(callback: () => void): void {
  let threw = false;
  try {
    callback();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("Expected function to throw.");
}
