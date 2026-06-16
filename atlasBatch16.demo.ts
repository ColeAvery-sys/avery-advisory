import { generateProductSnapshot } from "./productCommandEngine";
import { createFeatureSpec, convertFeatureToCodexPrompt, convertFeatureToCursorPrompt } from "./featureSpecEngine";
import { createBugReport, clearBugsForDemo } from "./bugTrackerEngine";
import { generateRegressionSuite, clearTestsForDemo } from "./testCaseManagerEngine";
import { createSecurityPrivacyIssue, generatePrivacyReview, clearSecurityIssuesForDemo } from "./securityPrivacyChecklistEngine";
import { createAccessibilityIssue, generateAccessibilityReport, clearAccessibilityIssuesForDemo } from "./accessibilityQaEngine";
import { calculateMvpReadiness } from "./mvpReadinessEngine";
import { createDemoPlan, calculateDemoReadiness, generateDemoScript } from "./demoReadinessEngine";
import { createReleasePlan, validateReleaseReadiness } from "./releasePlannerEngine";
import { createFeedbackRecord, triageFeedback, summarizeFeedback } from "./userFeedbackEngine";

clearBugsForDemo();
clearTestsForDemo();
clearSecurityIssuesForDemo();
clearAccessibilityIssuesForDemo();

console.log("Feature Spec");
const feature = createFeatureSpec({ id: "feature-demo", featureTitle: "Client-safe delivery tracker", product: "Creator Logistics Portal", problemSolved: "show safe client-visible delivery status", targetUser: "creator client", requirements: ["hide internal notes", "show approved delivery packet only"], priority: "High" });
console.log(feature);
console.log(convertFeatureToCodexPrompt(feature));
console.log(convertFeatureToCursorPrompt(feature));

console.log("\nBug Tracker");
const bug = createBugReport({ id: "bug-demo", bugTitle: "Internal notes visible to client", product: "Creator Logistics Portal", expectedBehavior: "Internal notes hidden", actualBehavior: "Client can see internal notes" });
console.log(bug);

console.log("\nTest Case Manager");
console.log(generateRegressionSuite("ATLAS HQ").slice(0, 3));

console.log("\nSecurity and Privacy");
const security = createSecurityPrivacyIssue({ id: "sec-demo", product: "ATLAS HQ", pageOrFeature: "settings", riskCategory: "secrets", issue: "API key exposed in UI" });
console.log(security);
console.log(generatePrivacyReview("ATLAS HQ"));

console.log("\nAccessibility QA");
createAccessibilityIssue({ id: "a11y-demo", product: "ATLAS Assist", page: "dashboard", issue: "keyboard navigation blocked" });
console.log(generateAccessibilityReport("ATLAS Assist"));

console.log("\nProduct Command");
console.log(generateProductSnapshot({ products: [{ productName: "ATLAS HQ", openBugs: 1, demoReadinessScore: 70, mvpReadinessScore: 70 }], bugs: [bug] }));

console.log("\nMVP Readiness");
console.log(calculateMvpReadiness({ productName: "ATLAS Assist", targetUse: "Pilot" }, { coreFlowWorks: false, dataSavesCorrectly: true, bugs: [bug], risks: [security], requiredDocs: ["privacy note"], privacyReviewed: false, accessibilityReviewed: false, demoScriptExists: false }));

console.log("\nDemo Readiness");
const demo = createDemoPlan({ id: "demo-demo", demoName: "ATLAS Assist pilot demo", targetAudience: "clinic partner", product: "ATLAS Assist", demoGoal: "show support workflow", demoFlow: ["open dashboard"], sampleDataNeeded: ["safe sample user"], liveDemoRisk: "workflow incomplete" });
console.log(calculateDemoReadiness(demo, { bugs: [bug] }));
console.log(generateDemoScript(demo));

console.log("\nRelease Planner");
const release = createReleasePlan({ id: "release-demo", releaseName: "Public Site 1.0", product: "AveryTech Public Website", version: "1.0", releaseType: "Public Website", includedFeatures: ["landing page"], fixedBugs: [], knownIssues: [], QAStatus: "Ready", accessibilityStatus: "Reviewed internally", securityStatus: "Needs review" });
console.log(validateReleaseReadiness(release, { bugs: [], securityIssues: [security] }));

console.log("\nUser Feedback");
createFeedbackRecord({ id: "feedback-demo", sourceName: "Cole", sourceType: "Cole", product: "ATLAS HQ", feedbackText: "approval flow is broken", painPoint: "broken approval", severity: "High" });
console.log(triageFeedback("feedback-demo"));
console.log(summarizeFeedback("ATLAS HQ"));
