import {
  buildLinkedInAutomationPlan,
  compareCareerProfiles,
  createDefaultCareerOSData,
  generateATSResumeMarkdown,
  generateCareerDashboard,
  generateCareerProfilePackage,
  generateCopyPasteText,
  generateInterviewPrepMarkdown,
  generateLinkedInMarkdown,
  getCareerRoleLibrary,
  updateCareerOSData,
} from "./careerOSEngine";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function run() {
  const data = createDefaultCareerOSData();
  const roles = getCareerRoleLibrary();

  assert(roles.length === 6, "expected six target roles");

  const comparison = compareCareerProfiles(data, "operations_manager");
  assert(comparison.suggestedHeadline.includes("Operations Manager"), "headline should rewrite for operations");
  assert(comparison.skillsRecommendations.length >= 8, "skills recommendations should be populated");
  assert(comparison.featuredRecommendations.length >= 3, "featured recommendations should be populated");
  assert(comparison.missingCertifications.length >= 3, "should recommend missing certifications");

  const dashboard = generateCareerDashboard(data, "customer_success_manager");
  assert(dashboard.resumeScore > 0, "resume score should be positive");
  assert(dashboard.linkedinScore > 0, "linkedin score should be positive");
  assert(dashboard.jobMatchScore > 0, "job match score should be positive");
  assert(dashboard.recentAchievements.includes("Founder of Avery Industries"), "recent achievements should surface");

  const markdown = generateLinkedInMarkdown(data, "sales_manager");
  assert(markdown.includes("Updated Headline"), "markdown should include headline section");
  assert(markdown.includes("Missing Certifications"), "markdown should include certification section");

  const copy = generateCopyPasteText(data, "marketing_manager");
  assert(copy.headline.includes("Marketing Manager"), "copy text should include role headline");
  assert(copy.about.length > 20, "about copy should be non-empty");

  const resume = generateATSResumeMarkdown(data, "founder_ceo");
  assert(resume.includes("Selected Achievements"), "resume markdown should include achievements");

  const interview = generateInterviewPrepMarkdown(data, "technical_support_manager");
  assert(interview.includes("Likely Questions"), "interview prep should include likely questions");

  const automation = buildLinkedInAutomationPlan(data, "customer_success_manager");
  assert(automation.approvalRequired, "automation plan should require approval");
  assert(automation.manualLoginRequired, "automation plan should require manual login");

  const packageData = generateCareerProfilePackage(data, "operations_manager");
  assert(packageData.linkedinMarkdown.length > 0, "package should include linkedin markdown");
  assert(packageData.resumeMarkdown.length > 0, "package should include resume markdown");
  assert(packageData.interviewPrepMarkdown.length > 0, "package should include interview prep");

  const updated = updateCareerOSData(data, {
    masterProfile: { ...data.masterProfile, certifications: ["PMP"] },
    currentLinkedIn: { ...data.currentLinkedIn, headline: "Updated headline" },
  });
  assert(updated.masterProfile.certifications[0] === "PMP", "updated profile should merge master changes");
  assert(updated.currentLinkedIn.headline === "Updated headline", "updated profile should merge linkedin changes");

  console.log("careerOSEngine tests passed");
}

run();
