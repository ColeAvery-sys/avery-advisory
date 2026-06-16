declare const require: any;

import {
  buildRecruiterAutomationPlan,
  buildRecruiterDailyPlan,
  createDefaultRecruiterData,
  generateRecruiterCoverLetter,
  generateRecruiterDashboard,
  generateRecruiterQuestionAnswers,
  importRecruiterJobs,
  parseRecruiterJobFeed,
  rankRecruiterJobs,
  recordRecruiterJobAction,
  saveRecruiterData,
  loadRecruiterData,
  scoreRecruiterJob,
} from "./careerRecruiterEngine";

const fs = require("fs");
const os = require("os");
const path = require("path");

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function run() {
  const data = createDefaultRecruiterData();

  assert(data.profile.remoteOnly, "default profile should be remote only");
  assert(data.profile.salaryTarget >= 100000, "default salary target should be 100k+");
  assert(data.jobFeed.length >= 20, "seed feed should contain enough jobs for a daily queue");

  const ranked = rankRecruiterJobs(data, 20);
  assert(ranked.length === 20, "ranked feed should cap at 20 items");
  assert(ranked[0].score.matchScore >= ranked[ranked.length - 1].score.matchScore, "ranked jobs should sort descending");

  const remoteScore = scoreRecruiterJob(data.profile, data.jobFeed.find((job) => job.remote) as any);
  const onsiteScore = scoreRecruiterJob(data.profile, data.jobFeed.find((job) => !job.remote) as any);
  assert(remoteScore.matchScore > onsiteScore.matchScore, "remote jobs should outrank on-site jobs for a remote-only profile");

  const dashboard = generateRecruiterDashboard(data);
  assert(dashboard.approvalRequired, "dashboard should flag approval required");
  assert(dashboard.manualReviewRequired, "dashboard should flag manual review");
  assert(dashboard.averageMatchScore > 0, "dashboard should compute average match score");

  const plan = buildRecruiterDailyPlan(data);
  assert(plan.recommendedApplications.length === 20, "daily plan should recommend 20 applications");
  assert(plan.approvalGate.permissionLevel !== "Auto", "application sending should be gated");

  const selectedJob = plan.recommendedApplications[0].job;
  const coverLetter = generateRecruiterCoverLetter(data.profile, selectedJob);
  assert(coverLetter.includes(selectedJob.company), "cover letter should mention the company");
  assert(coverLetter.includes(selectedJob.title), "cover letter should mention the role title");

  const answers = generateRecruiterQuestionAnswers(data.profile, selectedJob);
  assert(answers.length === selectedJob.questions.length, "question answers should mirror the application questions");

  const automation = buildRecruiterAutomationPlan(data, selectedJob.id);
  assert(automation.approvalRequired, "automation plan should require approval");
  assert(automation.proposedChanges.coverLetterDraft.includes(selectedJob.company), "automation plan should include cover letter draft");

  const importedJobs = parseRecruiterJobFeed(
    JSON.stringify([
      {
        id: "imported-1",
        title: "Remote Operations Lead",
        company: "Example Co",
        location: "Remote",
        remote: true,
        salaryMin: 120000,
        salaryMax: 145000,
        description: "Lead remote operations.",
        source: "Manual import",
        keywords: ["operations", "remote"],
        questions: ["Why this role?"],
        postedAt: new Date().toISOString(),
      },
    ])
  );
  const merged = importRecruiterJobs(data, importedJobs);
  assert(merged.jobFeed.some((job) => job.id === "imported-1"), "imported job should be stored");

  const applied = recordRecruiterJobAction(data, selectedJob.id, "apply", "submitted manually");
  const application = applied.applications.find((item) => item.jobId === selectedJob.id);
  assert(application?.status === "Applied", "recorded action should update application status");
  assert((application?.notes || []).some((note) => note.includes("submitted manually")), "recorded notes should persist");

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "atlas-recruiter-"));
  const tempFile = path.join(tempDir, "recruiter.json");
  const saved = saveRecruiterData(data, tempFile);
  const reloaded = loadRecruiterData(tempFile);
  assert(saved.profile.name === reloaded.profile.name, "saved recruiter data should reload");
  assert(reloaded.jobFeed.length === data.jobFeed.length, "reloaded job feed should preserve data");

  console.log("careerRecruiterEngine tests passed");
}

run();
