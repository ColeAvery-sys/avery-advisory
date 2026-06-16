declare const require: any;
declare const __dirname: string;

const fs = require("fs");
const path = require("path");

import { checkAutomationPermission } from "./automationPermissionEngine";

export const RECRUITER_DATA_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_recruiter_master.json");

export interface RecruiterProfile {
  name: string;
  location: string;
  resumeText: string;
  linkedinText: string;
  salaryTarget: number;
  remoteOnly: boolean;
  targetTitles: string[];
  skills: string[];
  keywords: string[];
  industries: string[];
  dealBreakers: string[];
  notes: string[];
}

export interface RecruiterJob {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salaryMin: number;
  salaryMax: number;
  description: string;
  source: string;
  keywords: string[];
  questions: string[];
  postedAt: string;
}

export interface RecruiterApplication {
  id: string;
  jobId: string;
  status: "Saved" | "Drafted" | "Applied" | "Responded" | "Interviewing" | "Offer" | "Rejected";
  matchScore: number;
  coverLetterDraft: string;
  questionAnswersDraft: Array<{ question: string; answer: string }>;
  followUpDraft: string;
  notes: string[];
  appliedAt?: string;
  respondedAt?: string;
  interviewAt?: string;
  followUpAt?: string;
  lastUpdatedAt: string;
}

export interface RecruiterScore {
  matchScore: number;
  salaryFit: number;
  remoteFit: number;
  keywordFit: number;
  targetTitleFit: number;
  reasons: string[];
}

export interface RecruiterDailyApplication {
  job: RecruiterJob;
  score: RecruiterScore;
  applicationDraft: RecruiterApplication;
}

export interface RecruiterDailyPlan {
  scanTarget: number;
  dailyTarget: number;
  scannedJobs: number;
  rankedJobs: number;
  recommendedApplications: RecruiterDailyApplication[];
  savedJobs: RecruiterJob[];
  appliedJobs: RecruiterApplication[];
  responseQueue: RecruiterApplication[];
  interviewQueue: RecruiterApplication[];
  followUpQueue: RecruiterApplication[];
  approvalGate: ReturnType<typeof checkAutomationPermission>;
}

export interface RecruiterDashboard {
  scanTarget: number;
  dailyTarget: number;
  scannedJobs: number;
  savedJobs: number;
  appliedJobs: number;
  responses: number;
  interviews: number;
  followUpsDue: number;
  averageMatchScore: number;
  topMatchTitles: string[];
  approvalRequired: boolean;
  manualReviewRequired: boolean;
}

export interface RecruiterData {
  profile: RecruiterProfile;
  jobFeed: RecruiterJob[];
  applications: RecruiterApplication[];
  updatedAt: string;
}

const DEFAULT_SCAN_TARGET = 5000;
const DEFAULT_DAILY_TARGET = 20;

export function createDefaultRecruiterData(): RecruiterData {
  return {
    profile: {
      name: "Cole Ends",
      location: "United States",
      resumeText:
        "Operations, customer success, technical support, sales, retention, workforce operations, leadership, escalation handling, and ATLAS automation builder.",
      linkedinText:
        "Founder of Avery Industries LLC and builder of ATLAS systems with experience in support, retention, operations, and revenue protection.",
      salaryTarget: 100000,
      remoteOnly: true,
      targetTitles: ["Operations Manager", "Customer Success Manager", "Technical Support Manager", "Revenue Operations Manager", "Program Manager"],
      skills: ["Operations", "Customer Success", "Technical Support", "Sales", "Retention", "Automation", "Leadership", "Workforce Operations"],
      keywords: ["remote", "revenue", "retention", "ops", "support", "automation", "customer", "workflow"],
      industries: ["SaaS", "Support", "Operations", "Telecom", "AI"],
      dealBreakers: ["onsite only", "low salary", "no remote option"],
      notes: ["Draft only until explicit approval", "External follow-up remains gated"],
    },
    jobFeed: createSeedJobFeed(),
    applications: [
      {
        id: "application-1",
        jobId: "atlas-job-1",
        status: "Saved",
        matchScore: 92,
        coverLetterDraft: "",
        questionAnswersDraft: [],
        followUpDraft: "",
        notes: ["High-priority remote operations role"],
        lastUpdatedAt: new Date("2026-06-13T09:00:00.000Z").toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export function loadRecruiterData(filePath: string = RECRUITER_DATA_PATH): RecruiterData {
  if (!fs.existsSync(filePath)) {
    const initial = createDefaultRecruiterData();
    saveRecruiterData(initial, filePath);
    return clone(initial);
  }

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return normalizeRecruiterData(raw);
  } catch (_error) {
    const fallback = createDefaultRecruiterData();
    saveRecruiterData(fallback, filePath);
    return clone(fallback);
  }
}

export function saveRecruiterData(data: RecruiterData, filePath: string = RECRUITER_DATA_PATH): RecruiterData {
  const normalized = normalizeRecruiterData(data);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2));
  return normalized;
}

export function updateRecruiterData(data: RecruiterData, patch: Partial<RecruiterData>): RecruiterData {
  return normalizeRecruiterData({
    ...data,
    ...patch,
    profile: {
      ...data.profile,
      ...(patch.profile || {}),
    },
    jobFeed: Array.isArray(patch.jobFeed) ? patch.jobFeed : data.jobFeed,
    applications: Array.isArray(patch.applications) ? patch.applications : data.applications,
    updatedAt: new Date().toISOString(),
  });
}

export function rankRecruiterJobs(data: RecruiterData, limit = DEFAULT_DAILY_TARGET): Array<{ job: RecruiterJob; score: RecruiterScore }> {
  return data.jobFeed
    .map((job) => ({ job, score: scoreRecruiterJob(data.profile, job) }))
    .sort((left, right) => right.score.matchScore - left.score.matchScore)
    .slice(0, limit);
}

export function scoreRecruiterJob(profile: RecruiterProfile, job: RecruiterJob): RecruiterScore {
  const jobText = normalizeText([job.title, job.company, job.location, job.description, job.keywords.join(" "), job.questions.join(" ")].join(" "));
  const profileText = normalizeText([profile.resumeText, profile.linkedinText, profile.skills.join(" "), profile.keywords.join(" "), profile.targetTitles.join(" "), profile.industries.join(" ")].join(" "));
  const targetTitleFit = hasTargetTitleMatch(profile.targetTitles, job.title) ? 100 : scoreOverlapFromText(normalizeText(job.title), profile.targetTitles) > 0 ? 85 : 25;
  const keywordFit = Math.min(100, 20 + countMatches(jobText, profile.keywords) * 12 + scoreOverlap(job.keywords, profile.keywords) * 10 + scoreOverlapFromText(jobText, profile.skills) * 4);
  const remoteFit = profile.remoteOnly ? (job.remote ? 100 : 0) : job.remote ? 75 : 55;
  const salaryFit = scoreSalaryFit(profile.salaryTarget, job.salaryMin, job.salaryMax);
  const profileFit = Math.min(100, 25 + countMatches(profileText, job.keywords) * 5 + scoreOverlap(job.keywords, profile.targetTitles) * 8);
  const matchScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        targetTitleFit * 0.24 +
          keywordFit * 0.28 +
          remoteFit * 0.18 +
          salaryFit * 0.2 +
          profileFit * 0.1
      )
    )
  );

  const reasons = buildScoreReasons(profile, job, { targetTitleFit, keywordFit, remoteFit, salaryFit, profileFit });

  return {
    matchScore,
    salaryFit,
    remoteFit,
    keywordFit,
    targetTitleFit,
    reasons,
  };
}

export function buildRecruiterDailyPlan(data: RecruiterData): RecruiterDailyPlan {
  const ranked = rankRecruiterJobs(data, data.jobFeed.length);
  const existing = new Map(data.applications.map((application) => [application.jobId, application]));
  const recommendedApplications = ranked
    .filter(({ job }) => !isApplicationFinal(existing.get(job.id)))
    .slice(0, DEFAULT_DAILY_TARGET)
    .map(({ job, score }) => {
      const applicationDraft = buildApplicationDraft(data.profile, job, score);
      return { job, score, applicationDraft };
    });

  const appliedJobs = data.applications.filter((application) => application.status === "Applied" || application.status === "Responded" || application.status === "Interviewing" || application.status === "Offer");
  const responseQueue = data.applications.filter((application) => application.status === "Applied");
  const interviewQueue = data.applications.filter((application) => application.status === "Responded");
  const followUpQueue = data.applications.filter((application) => application.status === "Applied" || application.status === "Responded");
  const savedJobs = data.jobFeed.filter((job) => existing.get(job.id)?.status === "Saved");

  return {
    scanTarget: DEFAULT_SCAN_TARGET,
    dailyTarget: DEFAULT_DAILY_TARGET,
    scannedJobs: data.jobFeed.length,
    rankedJobs: ranked.length,
    recommendedApplications,
    savedJobs,
    appliedJobs,
    responseQueue,
    interviewQueue,
    followUpQueue,
    approvalGate: checkAutomationPermission({
      actionType: "send job application",
      department: "ATLAS Recruiter",
      externalFacing: true,
      submitsApplication: true,
    }),
  };
}

export function generateRecruiterDashboard(data: RecruiterData): RecruiterDashboard {
  const ranked = rankRecruiterJobs(data, data.jobFeed.length);
  const applicationByJobId = new Map(data.applications.map((application) => [application.jobId, application]));
  const savedJobs = data.applications.filter((application) => application.status === "Saved").length;
  const appliedJobs = data.applications.filter((application) => application.status === "Applied" || application.status === "Responded" || application.status === "Interviewing" || application.status === "Offer").length;
  const responses = data.applications.filter((application) => application.status === "Responded" || application.status === "Interviewing" || application.status === "Offer").length;
  const interviews = data.applications.filter((application) => application.status === "Interviewing" || application.status === "Offer").length;
  const followUpsDue = data.applications.filter((application) => application.status === "Applied" || application.status === "Responded").length;
  const scoredApplications = ranked.slice(0, DEFAULT_DAILY_TARGET);
  const averageMatchScore = scoredApplications.length ? Math.round(scoredApplications.reduce((total, item) => total + item.score.matchScore, 0) / scoredApplications.length) : 0;
  const topMatchTitles = scoredApplications.slice(0, 5).map((item) => `${item.job.title} at ${item.job.company}`);

  return {
    scanTarget: DEFAULT_SCAN_TARGET,
    dailyTarget: DEFAULT_DAILY_TARGET,
    scannedJobs: data.jobFeed.length,
    savedJobs,
    appliedJobs,
    responses,
    interviews,
    followUpsDue,
    averageMatchScore,
    topMatchTitles,
    approvalRequired: true,
    manualReviewRequired: true,
  };
}

export function generateRecruiterCoverLetter(profile: RecruiterProfile, job: RecruiterJob): string {
  return [
    `Dear Hiring Team at ${job.company},`,
    "",
    `I am applying for the ${job.title} role because it lines up with my background in ${firstFive(profile.skills).join(", ").toLowerCase()}.`,
    `My work combines operations discipline, customer-facing execution, and automation-minded process improvement, which fits a remote role that needs ownership and reliable follow-through.`,
    "",
    `I am targeting remote roles at or above $${formatCurrency(profile.salaryTarget)} and I am looking for a role where I can contribute quickly, communicate clearly, and keep execution organized.`,
    "",
    `Thank you for considering my application.`,
    `- ${profile.name}`,
  ].join("\n");
}

export function generateRecruiterQuestionAnswers(profile: RecruiterProfile, job: RecruiterJob): Array<{ question: string; answer: string }> {
  return job.questions.map((question) => ({
    question,
    answer: buildQuestionAnswer(profile, job, question),
  }));
}

export function buildRecruiterAutomationPlan(data: RecruiterData, jobId: string) {
  const job = findJob(data, jobId);
  const score = scoreRecruiterJob(data.profile, job);
  return {
    approvalRequired: true,
    manualReviewRequired: true,
    jobId,
    jobTitle: `${job.title} at ${job.company}`,
    score,
    gate: checkAutomationPermission({
      actionType: "send job application",
      department: "ATLAS Recruiter",
      externalFacing: true,
      submitsApplication: true,
    }),
    steps: [
      "Review the cover letter and question drafts.",
      "Confirm salary and remote filters still match the target.",
      "Paste the approved text into the job portal manually.",
      "Log the submission in ATLAS Recruiter before moving on.",
    ],
    proposedChanges: {
      coverLetterDraft: generateRecruiterCoverLetter(data.profile, job),
      questionAnswersDraft: generateRecruiterQuestionAnswers(data.profile, job),
    },
  };
}

export function recordRecruiterJobAction(data: RecruiterData, jobId: string, action: "save" | "draft" | "apply" | "response" | "interview" | "follow_up" | "reject", note?: string): RecruiterData {
  const job = findJob(data, jobId);
  const now = new Date().toISOString();
  const existing = data.applications.find((application) => application.jobId === job.id);
  const draft = buildApplicationDraft(data.profile, job, scoreRecruiterJob(data.profile, job));
  const next: RecruiterApplication = {
    id: existing?.id || `application-${data.applications.length + 1}`,
    jobId: job.id,
    status: mapActionToStatus(action),
    matchScore: draft.matchScore,
    coverLetterDraft: draft.coverLetterDraft,
    questionAnswersDraft: draft.questionAnswersDraft,
    followUpDraft: draft.followUpDraft,
    notes: unique([...(existing?.notes || []), note || "", actionNote(action)]),
    appliedAt: action === "apply" ? existing?.appliedAt || now : existing?.appliedAt,
    respondedAt: action === "response" ? now : existing?.respondedAt,
    interviewAt: action === "interview" ? now : existing?.interviewAt,
    followUpAt: action === "follow_up" ? now : existing?.followUpAt,
    lastUpdatedAt: now,
  };
  const applications = data.applications.filter((application) => application.jobId !== job.id).concat(next);
  return updateRecruiterData(data, { applications });
}

export function importRecruiterJobs(data: RecruiterData, jobs: RecruiterJob[]): RecruiterData {
  const seen = new Set(data.jobFeed.map((job) => job.id));
  const nextJobs = jobs.filter((job) => job && job.id && !seen.has(job.id)).map((job) => normalizeJob(job));
  return updateRecruiterData(data, { jobFeed: data.jobFeed.concat(nextJobs) });
}

export function parseRecruiterJobFeed(value: string): RecruiterJob[] {
  if (!value.trim()) return [];
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error("Recruiter job feed must be a JSON array.");
  return parsed.map((job) => normalizeJob(job));
}

export function generateRecruiterSummary(data: RecruiterData) {
  const dashboard = generateRecruiterDashboard(data);
  const plan = buildRecruiterDailyPlan(data);
  return {
    dashboard,
    plan,
    approvalGate: checkAutomationPermission({
      actionType: "send job application",
      department: "ATLAS Recruiter",
      externalFacing: true,
      submitsApplication: true,
    }),
  };
}

function createSeedJobFeed(): RecruiterJob[] {
  const templates: Array<Omit<RecruiterJob, "id" | "postedAt">> = [
    {
      title: "Operations Manager",
      company: "Northstar Systems",
      location: "Remote",
      remote: true,
      salaryMin: 115000,
      salaryMax: 140000,
      description: "Own workflow design, team throughput, escalation management, and operational reporting across a remote service organization.",
      source: "ATS mirror",
      keywords: ["operations", "workflow", "escalation", "team", "remote", "reporting"],
      questions: ["Describe a process you improved.", "What is your salary expectation?", "Are you comfortable working remotely?"],
    },
    {
      title: "Customer Success Manager",
      company: "Harbor CRM",
      location: "Remote",
      remote: true,
      salaryMin: 105000,
      salaryMax: 132000,
      description: "Drive retention, onboarding, account health, and executive communication for a customer success team.",
      source: "LinkedIn Jobs",
      keywords: ["customer success", "retention", "account", "onboarding", "remote"],
      questions: ["How do you handle at-risk accounts?", "What metrics do you track?"],
    },
    {
      title: "Technical Support Manager",
      company: "SignalWorks",
      location: "Remote",
      remote: true,
      salaryMin: 102000,
      salaryMax: 128000,
      description: "Lead support operations, knowledge management, incident triage, and service recovery.",
      source: "Company site",
      keywords: ["technical support", "incident", "knowledge", "service", "remote"],
      questions: ["Tell us about a difficult escalation.", "How do you coach a support team?"],
    },
    {
      title: "Revenue Operations Manager",
      company: "Atlas Ledger",
      location: "Remote",
      remote: true,
      salaryMin: 120000,
      salaryMax: 150000,
      description: "Support CRM hygiene, pipeline reporting, deal process, and revenue analytics.",
      source: "ATS mirror",
      keywords: ["revenue operations", "pipeline", "crm", "analytics", "remote"],
      questions: ["How do you improve revenue visibility?", "What data quality habits do you enforce?"],
    },
    {
      title: "Program Manager",
      company: "Bright Harbor AI",
      location: "Remote",
      remote: true,
      salaryMin: 110000,
      salaryMax: 145000,
      description: "Coordinate cross-functional programs, timeline tracking, and executive reporting.",
      source: "Remote OK",
      keywords: ["program", "cross-functional", "timeline", "remote", "reporting"],
      questions: ["How do you keep programs on schedule?", "What tools do you use for status reporting?"],
    },
    {
      title: "Operations Analyst",
      company: "Zenith Support",
      location: "Remote",
      remote: true,
      salaryMin: 98000,
      salaryMax: 120000,
      description: "Analyze process performance and help managers simplify internal workflows.",
      source: "Job board",
      keywords: ["operations", "analysis", "workflow", "remote", "process"],
      questions: ["Describe a process analysis you led.", "Why remote work?"],
    },
    {
      title: "People Operations Manager",
      company: "Common Thread",
      location: "Remote",
      remote: true,
      salaryMin: 108000,
      salaryMax: 130000,
      description: "Support hiring, onboarding, manager operations, and employee experience systems.",
      source: "ATS mirror",
      keywords: ["people operations", "onboarding", "hiring", "remote"],
      questions: ["How do you improve onboarding?", "What is your people ops philosophy?"],
    },
    {
      title: "Customer Experience Lead",
      company: "Paperplane Health",
      location: "Remote",
      remote: true,
      salaryMin: 101000,
      salaryMax: 126000,
      description: "Own support response quality, customer satisfaction, and service playbooks.",
      source: "Company site",
      keywords: ["customer experience", "support", "satisfaction", "remote"],
      questions: ["How do you protect customer satisfaction?"],
    },
    {
      title: "Sales Operations Manager",
      company: "Metric Forge",
      location: "Remote",
      remote: true,
      salaryMin: 110000,
      salaryMax: 138000,
      description: "Manage sales process, pipeline hygiene, compensation logic, and operational reporting.",
      source: "LinkedIn Jobs",
      keywords: ["sales operations", "pipeline", "reporting", "remote"],
      questions: ["How do you keep reps accountable?", "What sales systems have you improved?"],
    },
    {
      title: "Support Operations Manager",
      company: "Nimble Desk",
      location: "Remote",
      remote: true,
      salaryMin: 104000,
      salaryMax: 129000,
      description: "Run support tooling, queue processes, and customer issue operations.",
      source: "ATS mirror",
      keywords: ["support operations", "queue", "tooling", "remote"],
      questions: ["How do you reduce ticket volume?", "What is your escalation process?"],
    },
    {
      title: "Office Manager",
      company: "Metro Clinic",
      location: "Chicago, IL",
      remote: false,
      salaryMin: 75000,
      salaryMax: 85000,
      description: "Manage in-office scheduling, front desk activity, and vendor relationships.",
      source: "Job board",
      keywords: ["office", "scheduling", "vendor", "in-office"],
      questions: ["Are you able to work on-site full time?"],
    },
    {
      title: "Operations Coordinator",
      company: "Blue Lantern",
      location: "Remote",
      remote: true,
      salaryMin: 90000,
      salaryMax: 105000,
      description: "Coordinate projects, systems updates, and cross-team operations.",
      source: "Company site",
      keywords: ["operations", "coordination", "remote"],
      questions: ["Tell us about your coordination style."],
    },
    {
      title: "Retention Manager",
      company: "Prime Support",
      location: "Remote",
      remote: true,
      salaryMin: 109000,
      salaryMax: 133000,
      description: "Lead customer retention workflows, save plays, and service recovery coaching.",
      source: "ATS mirror",
      keywords: ["retention", "save", "customer", "remote"],
      questions: ["How do you reduce churn?"],
    },
    {
      title: "Workflow Manager",
      company: "Relay Health",
      location: "Remote",
      remote: true,
      salaryMin: 111000,
      salaryMax: 136000,
      description: "Design internal workflow systems and reporting for a distributed team.",
      source: "Remote OK",
      keywords: ["workflow", "systems", "remote", "reporting"],
      questions: ["How do you document process changes?"],
    },
    {
      title: "Client Services Manager",
      company: "Summit Ledger",
      location: "Remote",
      remote: true,
      salaryMin: 107000,
      salaryMax: 129000,
      description: "Lead client delivery, service quality, and issue resolution.",
      source: "LinkedIn Jobs",
      keywords: ["client services", "delivery", "resolution", "remote"],
      questions: ["How do you manage client expectations?"],
    },
    {
      title: "Training Operations Manager",
      company: "Spark Academy",
      location: "Remote",
      remote: true,
      salaryMin: 103000,
      salaryMax: 127000,
      description: "Run enablement, coaching, and process training for a remote team.",
      source: "Company site",
      keywords: ["training", "operations", "coaching", "remote"],
      questions: ["How do you measure training impact?"],
    },
    {
      title: "Project Manager",
      company: "North Ridge Tech",
      location: "Remote",
      remote: true,
      salaryMin: 106000,
      salaryMax: 131000,
      description: "Own project plans, delivery status, and stakeholder communication.",
      source: "ATS mirror",
      keywords: ["project", "delivery", "stakeholder", "remote"],
      questions: ["How do you handle shifting priorities?"],
    },
    {
      title: "Operations Team Lead",
      company: "Clearpath Care",
      location: "Remote",
      remote: true,
      salaryMin: 100000,
      salaryMax: 123000,
      description: "Lead a remote operations team with a focus on reliability and throughput.",
      source: "Job board",
      keywords: ["operations", "lead", "team", "remote"],
      questions: ["Why are you a fit for team leadership?"],
    },
    {
      title: "Senior Support Specialist",
      company: "Fuse Network",
      location: "Remote",
      remote: true,
      salaryMin: 97000,
      salaryMax: 118000,
      description: "Handle complex support issues, client communication, and escalation recovery.",
      source: "Company site",
      keywords: ["support", "escalation", "client", "remote"],
      questions: ["How do you calm a frustrated customer?"],
    },
    {
      title: "Business Operations Manager",
      company: "Comet Cloud",
      location: "Remote",
      remote: true,
      salaryMin: 118000,
      salaryMax: 146000,
      description: "Support company planning, operational execution, and cross-team accountability.",
      source: "LinkedIn Jobs",
      keywords: ["business operations", "planning", "accountability", "remote"],
      questions: ["How do you prioritize work across teams?"],
    },
    {
      title: "Customer Operations Manager",
      company: "Sunwell Software",
      location: "Remote",
      remote: true,
      salaryMin: 112000,
      salaryMax: 137000,
      description: "Blend customer success, service operations, and internal process management.",
      source: "ATS mirror",
      keywords: ["customer operations", "customer success", "process", "remote"],
      questions: ["What is your approach to customer ops?"],
    },
    {
      title: "Support Team Manager",
      company: "Prism Helpdesk",
      location: "Remote",
      remote: true,
      salaryMin: 101000,
      salaryMax: 124000,
      description: "Oversee support quality, team coaching, and escalation handling.",
      source: "Job board",
      keywords: ["support", "team", "coaching", "remote"],
      questions: ["How do you keep a team accountable?"],
    },
    {
      title: "Operations Project Coordinator",
      company: "Quiet Harbor",
      location: "Remote",
      remote: true,
      salaryMin: 88000,
      salaryMax: 98000,
      description: "Support operational projects, scheduling, and reporting.",
      source: "Company site",
      keywords: ["operations", "project", "reporting", "remote"],
      questions: ["What makes you a fit for coordination work?"],
    },
    {
      title: "Account Manager",
      company: "Vector Finance",
      location: "Austin, TX",
      remote: false,
      salaryMin: 92000,
      salaryMax: 110000,
      description: "Manage client accounts and in-office business development work.",
      source: "LinkedIn Jobs",
      keywords: ["account", "business development", "in-office"],
      questions: ["Are you open to hybrid work?"],
    },
  ];

  return templates.map((template, index) => ({
    ...template,
    id: `atlas-job-${index + 1}`,
    postedAt: new Date(Date.now() - index * 86400000).toISOString(),
  }));
}

function buildApplicationDraft(profile: RecruiterProfile, job: RecruiterJob, score: RecruiterScore): RecruiterApplication {
  const coverLetterDraft = generateRecruiterCoverLetter(profile, job);
  const questionAnswersDraft = generateRecruiterQuestionAnswers(profile, job);
  const followUpDraft = buildFollowUpDraft(profile, job);
  return {
    id: `application-${job.id}`,
    jobId: job.id,
    status: "Drafted",
    matchScore: score.matchScore,
    coverLetterDraft,
    questionAnswersDraft,
    followUpDraft,
    notes: [
      `Match score ${score.matchScore}%`,
      score.reasons[0] || "Draft created from profile match",
    ],
    lastUpdatedAt: new Date().toISOString(),
  };
}

function buildFollowUpDraft(profile: RecruiterProfile, job: RecruiterJob): string {
  return [
    `Subject: Follow-up on ${job.title} application`,
    "",
    `Hello ${job.company} hiring team,`,
    "",
    `I wanted to follow up on my application for the ${job.title} role. The position matches my background in operations, customer-facing execution, and remote workflow ownership.`,
    `If useful, I can provide any additional details to support the review.`,
    "",
    `Thank you for your time,`,
    `${profile.name}`,
  ].join("\n");
}

function buildQuestionAnswer(profile: RecruiterProfile, job: RecruiterJob, question: string): string {
  const normalized = normalizeText(question);
  if (normalized.includes("salary")) return `My target is $${formatCurrency(profile.salaryTarget)}+ for the right remote role, and I am open to discussing total compensation.`;
  if (normalized.includes("remote")) return profile.remoteOnly ? "Yes. Remote only is my working preference and requirement." : "I am open to remote or hybrid roles.";
  if (normalized.includes("start")) return "I can start after a standard notice period and will coordinate timing carefully.";
  if (normalized.includes("why") && normalized.includes("fit")) return `The role fits my background in ${firstFive(profile.skills).join(", ").toLowerCase()} and my focus on clear execution.`;
  if (normalized.includes("challenge") || normalized.includes("difficult")) return "I focus on calm triage, clear documentation, and quick ownership until the issue is closed.";
  return `I would connect this to my experience in ${firstThree(job.keywords).join(", ")} and keep the response practical, measurable, and concise.`;
}

function normalizeRecruiterData(data: Partial<RecruiterData> | null | undefined): RecruiterData {
  const base = createDefaultRecruiterData();
  if (!data) return base;
  return {
    profile: { ...base.profile, ...(data.profile || {}) },
    jobFeed: Array.isArray(data.jobFeed) && data.jobFeed.length ? data.jobFeed.map((job) => normalizeJob(job)) : base.jobFeed,
    applications: Array.isArray(data.applications) ? data.applications.map((application) => normalizeApplication(application)) : base.applications,
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

function normalizeJob(job: Partial<RecruiterJob>): RecruiterJob {
  return {
    id: String(job.id || `atlas-job-${Math.random().toString(36).slice(2, 8)}`),
    title: String(job.title || "Untitled Role"),
    company: String(job.company || "Unknown Company"),
    location: String(job.location || "Remote"),
    remote: Boolean(job.remote),
    salaryMin: Number(job.salaryMin || 0),
    salaryMax: Number(job.salaryMax || 0),
    description: String(job.description || ""),
    source: String(job.source || "Imported"),
    keywords: unique(Array.isArray(job.keywords) ? job.keywords : []),
    questions: unique(Array.isArray(job.questions) ? job.questions : []),
    postedAt: String(job.postedAt || new Date().toISOString()),
  };
}

function normalizeApplication(application: Partial<RecruiterApplication>): RecruiterApplication {
  return {
    id: String(application.id || `application-${Math.random().toString(36).slice(2, 8)}`),
    jobId: String(application.jobId || ""),
    status: normalizeStatus(application.status),
    matchScore: Number(application.matchScore || 0),
    coverLetterDraft: String(application.coverLetterDraft || ""),
    questionAnswersDraft: Array.isArray(application.questionAnswersDraft)
      ? application.questionAnswersDraft.map((item) => ({
          question: String((item as { question?: string }).question || ""),
          answer: String((item as { answer?: string }).answer || ""),
        }))
      : [],
    followUpDraft: String(application.followUpDraft || ""),
    notes: unique(Array.isArray(application.notes) ? application.notes.map((item) => String(item)) : []),
    appliedAt: application.appliedAt,
    respondedAt: application.respondedAt,
    interviewAt: application.interviewAt,
    followUpAt: application.followUpAt,
    lastUpdatedAt: String(application.lastUpdatedAt || new Date().toISOString()),
  };
}

function normalizeStatus(value: unknown): RecruiterApplication["status"] {
  const text = String(value || "Drafted");
  if (text === "Saved" || text === "Drafted" || text === "Applied" || text === "Responded" || text === "Interviewing" || text === "Offer" || text === "Rejected") {
    return text;
  }
  return "Drafted";
}

function buildScoreReasons(profile: RecruiterProfile, job: RecruiterJob, scores: Record<string, number>): string[] {
  const reasons: string[] = [];
  if (scores.targetTitleFit >= 85) reasons.push("Target title match is strong.");
  if (scores.keywordFit >= 70) reasons.push("Keyword overlap is strong.");
  if (scores.remoteFit === 100) reasons.push("Remote-only requirement is satisfied.");
  if (profile.remoteOnly && !job.remote) reasons.push("Remote-only requirement fails on this role.");
  if (scores.salaryFit >= 80) reasons.push("Salary range supports the target.");
  if (scores.salaryFit <= 40) reasons.push("Salary range is below the target.");
  if (job.questions.length > 0) reasons.push("Application questions can be drafted locally.");
  return reasons.length ? reasons : ["Baseline fit is acceptable but not exceptional."];
}

function scoreSalaryFit(target: number, min: number, max: number) {
  if (!min && !max) return 50;
  if (max >= target && min <= target) return 100;
  if (max >= target) return 82;
  if (min >= target * 0.9) return 66;
  if (max >= target * 0.8) return 48;
  return 20;
}

function scoreOverlap(values: string[], terms: string[]) {
  const valueSet = new Set(values.map((value) => normalizeText(value)));
  return terms.reduce((total, term) => (valueSet.has(normalizeText(term)) ? total + 1 : total), 0);
}

function scoreOverlapFromText(text: string, terms: string[]) {
  return terms.reduce((total, term) => (text.includes(normalizeText(term)) ? total + 1 : total), 0);
}

function countMatches(text: string, terms: string[]) {
  return terms.reduce((total, term) => (text.includes(normalizeText(term)) ? total + 1 : total), 0);
}

function hasTargetTitleMatch(targetTitles: string[], title: string) {
  const normalizedTitle = normalizeText(title);
  return targetTitles.some((target) => normalizedTitle.includes(normalizeText(target)) || normalizeText(target).includes(normalizedTitle));
}

function normalizeText(value: string) {
  return String(value || "").toLowerCase();
}

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => String(value).trim()).filter(Boolean)));
}

function formatCurrency(value: number) {
  return Math.max(0, Math.round(value)).toLocaleString("en-US");
}

function firstFive(values: string[]) {
  return unique(values).slice(0, 5);
}

function firstThree(values: string[]) {
  return unique(values).slice(0, 3);
}

function isApplicationFinal(application?: RecruiterApplication) {
  return Boolean(application && (application.status === "Applied" || application.status === "Responded" || application.status === "Interviewing" || application.status === "Offer" || application.status === "Rejected"));
}

function findJob(data: RecruiterData, jobId: string) {
  const job = data.jobFeed.find((item) => item.id === jobId);
  if (!job) throw new Error(`Recruiter job ${jobId} not found.`);
  return job;
}

function mapActionToStatus(action: RecruiterApplication["status"] | "save" | "draft" | "apply" | "response" | "interview" | "follow_up" | "reject") {
  switch (action) {
    case "save":
      return "Saved";
    case "draft":
      return "Drafted";
    case "apply":
      return "Applied";
    case "response":
      return "Responded";
    case "interview":
      return "Interviewing";
    case "follow_up":
      return "Applied";
    case "reject":
      return "Rejected";
    default:
      return action;
  }
}

function actionNote(action: string) {
  switch (action) {
    case "save":
      return "Job saved for review";
    case "draft":
      return "Draft generated locally";
    case "apply":
      return "Manual application submitted";
    case "response":
      return "Employer response logged";
    case "interview":
      return "Interview logged";
    case "follow_up":
      return "Follow-up drafted";
    case "reject":
      return "Role marked rejected";
    default:
      return "Action recorded";
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
