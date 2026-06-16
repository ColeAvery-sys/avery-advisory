declare const require: any;
declare const __dirname: string;

const fs = require("fs");
const path = require("path");

export const CAREER_OS_DATA_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "career_os_master.json");

export type CareerRoleKey =
  | "operations_manager"
  | "customer_success_manager"
  | "technical_support_manager"
  | "sales_manager"
  | "marketing_manager"
  | "founder_ceo";

export interface CareerJobTarget {
  key: CareerRoleKey;
  label: string;
  searchTitle: string;
  keywords: string[];
}

export interface CareerExperienceEntry {
  company: string;
  title: string;
  summary: string;
  highlights: string[];
  duration?: string;
}

export interface CareerMasterProfile {
  name: string;
  location: string;
  currentTitle: string;
  currentCompany: string;
  targetHeadline: string;
  about: string;
  employmentHistory: CareerExperienceEntry[];
  certifications: string[];
  education: string[];
  skills: string[];
  awards: string[];
  promotions: string[];
  projects: string[];
  revenueAchievements: string[];
  leadershipMetrics: string[];
  recentAchievements: string[];
}

export interface CareerLinkedInProfile {
  headline: string;
  about: string;
  experience: CareerExperienceEntry[];
  skills: string[];
  featured: string[];
}

export interface CareerOSData {
  masterProfile: CareerMasterProfile;
  currentLinkedIn: CareerLinkedInProfile;
  jobTargets: CareerJobTarget[];
  notes: string[];
  updatedAt: string;
}

export interface CareerMatchComparison {
  currentHeadline: string;
  suggestedHeadline: string;
  currentAbout: string;
  suggestedAbout: string;
  experienceEntries: CareerExperienceEntry[];
  skillsRecommendations: string[];
  featuredRecommendations: string[];
  missingCertifications: string[];
  score: number;
  scoreBreakdown: Array<{ label: string; score: number; note: string }>;
}

export interface CareerRoleRewrite {
  headline: string;
  about: string;
  skills: string[];
  featured: string[];
  experienceBullets: string[];
  atsKeywords: string[];
  suggestedCertifications: string[];
  interviewThemes: string[];
}

export interface CareerDashboardMetrics {
  resumeScore: number;
  linkedinScore: number;
  jobMatchScore: number;
  missingCertifications: string[];
  recentAchievements: string[];
  scoreNotes: string[];
}

const ROLE_LIBRARY: Record<CareerRoleKey, CareerRoleRewrite> = {
  operations_manager: {
    headline: "Operations Manager | Workforce Systems | Retention & Escalation Leader | AI Automation Builder | Founder, Avery Industries",
    about:
      "Operations leader with 10+ years managing customer-facing, technical, and workforce operations inside a high-volume environment. Known for improving retention, handling escalations, leading floor operations, and using automation to make teams faster, clearer, and more accountable. Builds systems that protect revenue, improve customer experience, and keep work moving.",
    skills: [
      "Operations Management",
      "Workforce Planning",
      "Escalation Management",
      "Retention Strategy",
      "Floor Leadership",
      "Process Improvement",
      "Team Coaching",
      "Performance Tracking",
    ],
    featured: [
      "ATLAS AI automation platform",
      "Operations and leadership proof points",
      "Customer satisfaction evidence",
    ],
    experienceBullets: [
      "Led frontline operations, escalations, and team support in a high-volume customer environment.",
      "Balanced service quality with productivity, retention, and workforce execution.",
      "Built internal structure and automation thinking into daily operational work.",
    ],
    atsKeywords: ["operations", "workforce", "escalations", "retention", "leadership", "process improvement"],
    suggestedCertifications: ["PMP", "Lean Six Sigma Green Belt", "ITIL Foundation"],
    interviewThemes: ["How I improve throughput", "How I stabilize teams", "How I prevent escalation churn"],
  },
  customer_success_manager: {
    headline: "Customer Success Manager | Retention Leader | Escalation Specialist | AI Automation Builder | Founder, Avery Industries",
    about:
      "Customer success professional with deep experience in customer service, retention, escalations, and account care. Comfortable working across technical support, telecom support, and workforce operations to keep customers aligned, informed, and satisfied. Focused on measurable customer outcomes, strong communication, and repeatable systems that protect renewal and expansion revenue.",
    skills: [
      "Customer Success",
      "Retention",
      "Escalation Resolution",
      "Account Management",
      "Customer Satisfaction",
      "Communication",
      "Renewal Support",
      "Cross-Functional Coordination",
    ],
    featured: [
      "Customer satisfaction score history",
      "Retention and escalation stories",
      "Founder-led systems work",
    ],
    experienceBullets: [
      "Managed customer accounts with a focus on retention, service recovery, and issue resolution.",
      "Handled technical and telecom support while keeping customer trust intact.",
      "Used structured communication to keep customers informed and reduce churn risk.",
    ],
    atsKeywords: ["customer success", "retention", "renewal", "account management", "satisfaction", "escalation"],
    suggestedCertifications: ["Certified Customer Success Manager", "ITIL Foundation", "HubSpot Service Hub Software"],
    interviewThemes: ["How I save at-risk accounts", "How I measure customer health", "How I coordinate support"],
  },
  technical_support_manager: {
    headline: "Technical Support Manager | Escalations Leader | Telecom Support Specialist | AI Automation Builder | Founder, Avery Industries",
    about:
      "Technical support and escalation leader with experience in customer service, telecom support, and workforce operations. Brings a calm, structured approach to incident handling, team support, and service restoration. Focused on documentation, repeatability, and automation that shortens resolution time without losing the human side of support.",
    skills: [
      "Technical Support",
      "Telecom Support",
      "Escalation Management",
      "Knowledge Management",
      "Support Operations",
      "Team Leadership",
      "Documentation",
      "Service Recovery",
    ],
    featured: [
      "Support leadership stories",
      "Escalation handling evidence",
      "Automation ideas for support operations",
    ],
    experienceBullets: [
      "Resolved customer technical issues and guided escalations to closure.",
      "Supported telecom workflows while keeping service recovery on track.",
      "Led teams through high-pressure queue and floor conditions.",
    ],
    atsKeywords: ["technical support", "telecom", "escalation", "knowledge base", "incident", "service restoration"],
    suggestedCertifications: ["CompTIA A+", "ITIL Foundation", "HDI Support Center Manager"],
    interviewThemes: ["How I triage issues", "How I support agents", "How I document repeatable fixes"],
  },
  sales_manager: {
    headline: "Sales Manager | Retention & Revenue Leader | Top Performer | AI Automation Builder | Founder, Avery Industries",
    about:
      "Sales and retention leader with a record of high performance, customer trust, and escalation management. Brings operational discipline to pipeline work, account care, and team leadership. Skilled at balancing revenue goals with customer experience and at turning service context into stronger close and retention outcomes.",
    skills: [
      "Sales Leadership",
      "Retention",
      "Revenue Operations",
      "Account Growth",
      "Coaching",
      "Performance Metrics",
      "Pipeline Management",
      "Customer Communication",
    ],
    featured: [
      "National top credit card sales performer",
      "Retention and customer growth proof",
      "Team leadership examples",
    ],
    experienceBullets: [
      "Balanced sales goals with account retention and customer experience.",
      "Used coaching and structured execution to support team performance.",
      "Converted service conversations into revenue and long-term account value.",
    ],
    atsKeywords: ["sales", "retention", "pipeline", "quota", "coaching", "revenue"],
    suggestedCertifications: ["HubSpot Sales Software", "Salesforce Associate", "Certified Sales Leader"],
    interviewThemes: ["How I hit targets", "How I coach a team", "How I keep customers from churning"],
  },
  marketing_manager: {
    headline: "Marketing Manager | Content Strategy | Video Editing | Growth Systems Builder | Founder, Avery Industries",
    about:
      "Marketing leader with content strategy and video editing experience, plus a strong operational background that keeps campaigns grounded in execution. Brings customer insight, structured thinking, and AI-assisted workflow building to content, brand, and growth work. Best at turning raw story, proof, and metrics into useful marketing systems.",
    skills: [
      "Content Strategy",
      "Video Editing",
      "Campaign Planning",
      "Storytelling",
      "Brand Positioning",
      "Analytics",
      "Audience Growth",
      "Workflow Automation",
    ],
    featured: [
      "Video editing and content strategy work",
      "Founder and ATLAS build logs",
      "Performance-driven content examples",
    ],
    experienceBullets: [
      "Planned and edited content while keeping messaging aligned to a business goal.",
      "Turned operational insight into clearer audience communication.",
      "Used systems thinking to support repeatable content production.",
    ],
    atsKeywords: ["marketing", "content strategy", "video editing", "growth", "brand", "campaign"],
    suggestedCertifications: ["Google Analytics", "HubSpot Content Marketing", "Meta Digital Marketing Associate"],
    interviewThemes: ["How I build content systems", "How I turn data into messaging", "How I keep marketing consistent"],
  },
  founder_ceo: {
    headline: "Founder / CEO | Operations Builder | AI Automation Founder | Customer and Revenue Systems Leader",
    about:
      "Founder building Avery Industries and the ATLAS AI automation platform as a practical operating system for revenue, approvals, and execution. Brings cross-functional leadership across customer support, sales, technical support, workforce operations, and content strategy. Focused on building useful systems, protecting output quality, and turning work into repeatable assets.",
    skills: [
      "Founding",
      "Operations Strategy",
      "Revenue Systems",
      "Product Thinking",
      "Leadership",
      "Automation",
      "Content Systems",
      "Business Development",
    ],
    featured: [
      "Avery Industries",
      "ATLAS AI automation platform",
      "Founder build narrative",
    ],
    experienceBullets: [
      "Built a company and operating system around useful automation, approvals, and execution.",
      "Connected revenue work, customer experience, and internal systems into one operating model.",
      "Converted multi-domain experience into founder strategy and product direction.",
    ],
    atsKeywords: ["founder", "ceo", "operations", "automation", "revenue", "product"],
    suggestedCertifications: ["No mandatory certification", "Founder-led case studies", "Leadership proof portfolio"],
    interviewThemes: ["Why I founded Avery Industries", "How I build systems", "How I prioritize company revenue"],
  },
};

const JOB_TARGETS: CareerJobTarget[] = [
  {
    key: "operations_manager",
    label: "Operations Manager",
    searchTitle: "Operations Manager",
    keywords: ["operations", "workforce", "escalation", "leadership", "retention"],
  },
  {
    key: "customer_success_manager",
    label: "Customer Success Manager",
    searchTitle: "Customer Success Manager",
    keywords: ["customer success", "retention", "account management", "satisfaction", "renewal"],
  },
  {
    key: "technical_support_manager",
    label: "Technical Support Manager",
    searchTitle: "Technical Support Manager",
    keywords: ["technical support", "telecom", "escalation", "incident", "service"],
  },
  {
    key: "sales_manager",
    label: "Sales Manager",
    searchTitle: "Sales Manager",
    keywords: ["sales", "retention", "pipeline", "revenue", "coaching"],
  },
  {
    key: "marketing_manager",
    label: "Marketing Manager",
    searchTitle: "Marketing Manager",
    keywords: ["marketing", "content", "video", "brand", "growth"],
  },
  {
    key: "founder_ceo",
    label: "Founder / CEO",
    searchTitle: "Founder / CEO",
    keywords: ["founder", "ceo", "operations", "revenue", "automation"],
  },
];

export function createDefaultCareerOSData(): CareerOSData {
  return {
    masterProfile: {
      name: "Cole Ends",
      location: "United States",
      currentTitle: "Account Manager, Sales, Retention at IBEX Global",
      currentCompany: "IBEX Global",
      targetHeadline: "Operations Manager | Customer Success Leader | Technical Support Specialist | AI Automation Builder | Founder, Avery Industries",
      about:
        "Career operating profile built around customer service, technical support, telecom support, sales, retention, escalations, workforce operations, and team leadership. Founder of Avery Industries and builder of the ATLAS AI automation platform. Focused on operational leadership, revenue protection, and systems that make work easier to run.",
      employmentHistory: [
        {
          company: "IBEX Global",
          title: "Account Manager, Sales, Retention",
          duration: "10+ years",
          summary: "Cross-functional account and operations work spanning service, support, retention, escalation handling, workforce operations, floor management, and team leadership.",
          highlights: [
            "Customer service and customer support",
            "Technical support and telecom support",
            "Sales and retention",
            "Escalation handling",
            "Workforce operations and floor management",
            "Team leadership",
          ],
        },
        {
          company: "Youth Health Services",
          title: "Receptionist",
          summary: "Front desk and customer-facing support experience with scheduling, reception, and service coordination.",
          highlights: ["Reception coverage", "Client communication", "Administrative support"],
        },
        {
          company: "Walmart Online Grocery Pickup",
          title: "Manager",
          summary: "Operations and service management experience in a fast-moving retail environment.",
          highlights: ["Team coordination", "Floor execution", "Customer-facing operations"],
        },
        {
          company: "Avery Industries",
          title: "Founder",
          summary: "Founder of Avery Industries and builder of the ATLAS AI automation platform.",
          highlights: ["Founder strategy", "AI automation platform", "Operational systems design"],
        },
      ],
      certifications: [],
      education: [],
      skills: [
        "Customer Service",
        "Technical Support",
        "Telecom Support",
        "Sales",
        "Retention",
        "Escalations",
        "Workforce Operations",
        "Floor Management",
        "Team Leadership",
        "Video Editing",
        "Content Strategy",
        "AI Automation",
      ],
      awards: [
        "National Top Credit Card Sales Performer",
        "Multiple Employee of the Month Awards",
      ],
      promotions: [
        "Grew into workforce operations, floor management, and team leadership responsibilities at IBEX Global.",
        "Advanced from support work into broader revenue and retention ownership.",
      ],
      projects: [
        "ATLAS AI automation platform",
        "Avery Industries operating system",
        "Career profile modernization system",
      ],
      revenueAchievements: [
        "National Top Credit Card Sales Performer",
        "Retention performance tied to customer account stability",
        "Revenue-protecting escalation handling across support and sales work",
      ],
      leadershipMetrics: [
        "90-100% customer satisfaction scores",
        "Workforce operations and floor management leadership",
        "Team leadership across customer-facing environments",
      ],
      recentAchievements: [
        "Building ATLAS AI automation platform",
        "Founder of Avery Industries",
        "Maintaining a master profile for resumes, LinkedIn, and applications",
      ],
    },
    currentLinkedIn: {
      headline: "Account Manager, Sales, Retention at IBEX Global",
      about: "",
      experience: [
        {
          company: "IBEX Global",
          title: "Account Manager, Sales, Retention",
          duration: "10+ years",
          summary: "Customer-facing account and support work across service, retention, and operations.",
          highlights: ["Customer service", "Technical support", "Sales", "Retention"],
        },
      ],
      skills: ["Account Management", "Sales", "Retention", "Customer Service"],
      featured: [],
    },
    jobTargets: JOB_TARGETS,
    notes: [
      "Manual review required before any LinkedIn update is submitted.",
      "No outbound send or auto-submit should occur without explicit approval.",
    ],
    updatedAt: new Date().toISOString(),
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function normalizeCareerData(data: Partial<CareerOSData> | null | undefined): CareerOSData {
  const base = createDefaultCareerOSData();
  if (!data) return base;
  return {
    masterProfile: { ...base.masterProfile, ...(data.masterProfile || {}) },
    currentLinkedIn: { ...base.currentLinkedIn, ...(data.currentLinkedIn || {}) },
    jobTargets: Array.isArray(data.jobTargets) && data.jobTargets.length ? data.jobTargets : base.jobTargets,
    notes: Array.isArray(data.notes) && data.notes.length ? data.notes : base.notes,
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export function loadCareerOSData(filePath: string = CAREER_OS_DATA_PATH): CareerOSData {
  if (!fs.existsSync(filePath)) {
    const initial = createDefaultCareerOSData();
    saveCareerOSData(initial, filePath);
    return clone(initial);
  }

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return normalizeCareerData(raw);
  } catch (_error) {
    const fallback = createDefaultCareerOSData();
    saveCareerOSData(fallback, filePath);
    return clone(fallback);
  }
}

export function saveCareerOSData(data: CareerOSData, filePath: string = CAREER_OS_DATA_PATH): CareerOSData {
  const normalized = normalizeCareerData(data);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2));
  return normalized;
}

export function getCareerRoleLibrary(): CareerJobTarget[] {
  return clone(JOB_TARGETS);
}

export function getCareerRoleRewrite(roleKey: CareerRoleKey): CareerRoleRewrite {
  return clone(ROLE_LIBRARY[roleKey] || ROLE_LIBRARY.founder_ceo);
}

export function compareCareerProfiles(data: CareerOSData, roleKey: CareerRoleKey = "founder_ceo"): CareerMatchComparison {
  const role = getCareerRoleRewrite(roleKey);
  const master = data.masterProfile;
  const current = data.currentLinkedIn;
  const currentHeadline = current.headline || "";
  const currentAbout = current.about || "";
  const suggestedHeadline = role.headline;
  const suggestedAbout = role.about;
  const experienceEntries = master.employmentHistory.map((entry) => ({
    ...entry,
    summary: `${entry.summary} ${entry.highlights.length ? `Highlights: ${entry.highlights.join(", ")}.` : ""}`.trim(),
  }));
  const skillsRecommendations = unique([
    ...role.skills,
    ...master.skills,
    "Revenue Protection",
    "Customer Experience",
    "Team Coaching",
  ]).slice(0, 12);
  const featuredRecommendations = unique([
    ...role.featured,
    ...master.projects,
    ...master.revenueAchievements.slice(0, 2),
    ...master.recentAchievements.slice(0, 2),
  ]).slice(0, 6);
  const missingCertifications = computeMissingCertifications(master.certifications, role.suggestedCertifications);
  const scoreBreakdown = buildScoreBreakdown(master, current, roleKey);
  const score = Math.round(scoreBreakdown.reduce((total, item) => total + item.score, 0) / scoreBreakdown.length);

  return {
    currentHeadline,
    suggestedHeadline,
    currentAbout,
    suggestedAbout,
    experienceEntries,
    skillsRecommendations,
    featuredRecommendations,
    missingCertifications,
    score,
    scoreBreakdown,
  };
}

export function generateCareerDashboard(data: CareerOSData, roleKey: CareerRoleKey = "founder_ceo"): CareerDashboardMetrics {
  const comparison = compareCareerProfiles(data, roleKey);
  const master = data.masterProfile;
  const resumeScore = scoreResume(master, roleKey);
  const linkedinScore = Math.max(0, Math.min(100, comparison.score));
  const jobMatchScore = scoreJobMatch(master, roleKey);
  return {
    resumeScore,
    linkedinScore,
    jobMatchScore,
    missingCertifications: comparison.missingCertifications,
    recentAchievements: master.recentAchievements.slice(0, 4),
    scoreNotes: comparison.scoreBreakdown.map((item) => `${item.label}: ${item.score}/100`).slice(0, 4),
  };
}

export function generateLinkedInMarkdown(data: CareerOSData, roleKey: CareerRoleKey = "founder_ceo"): string {
  const comparison = compareCareerProfiles(data, roleKey);
  const master = data.masterProfile;
  const role = getCareerRoleRewrite(roleKey);
  const lines = [
    `# LinkedIn Update Plan for ${master.name}`,
    "",
    `## Updated Headline`,
    comparison.suggestedHeadline,
    "",
    `## About`,
    comparison.suggestedAbout,
    "",
    `## Experience Updates`,
    ...comparison.experienceEntries.map((entry) => `- **${entry.company} - ${entry.title}**: ${entry.summary}`),
    "",
    `## Skills Recommendations`,
    comparison.skillsRecommendations.map((skill) => `- ${skill}`).join("\n"),
    "",
    `## Featured Recommendations`,
    comparison.featuredRecommendations.map((item) => `- ${item}`).join("\n"),
    "",
    `## Missing Certifications`,
    comparison.missingCertifications.length ? comparison.missingCertifications.map((item) => `- ${item}`).join("\n") : "- None required for this profile target",
    "",
    `## Manual Review Gate`,
    "- Review every change before pasting into LinkedIn.",
    "- Do not auto-submit without explicit approval.",
    `- Target role: ${role.headline}`,
  ];
  return lines.join("\n");
}

export function generateCopyPasteText(data: CareerOSData, roleKey: CareerRoleKey = "founder_ceo"): Record<string, string> {
  const comparison = compareCareerProfiles(data, roleKey);
  return {
    headline: comparison.suggestedHeadline,
    about: comparison.suggestedAbout,
    experience: comparison.experienceEntries
      .map((entry) => `${entry.company} - ${entry.title}: ${entry.summary}`)
      .join("\n\n"),
    skills: comparison.skillsRecommendations.join(", "),
    featured: comparison.featuredRecommendations.join("\n"),
  };
}

export function generateATSResumeMarkdown(data: CareerOSData, roleKey: CareerRoleKey = "founder_ceo"): string {
  const role = getCareerRoleRewrite(roleKey);
  const master = data.masterProfile;
  const experienceSections: string[] = [];
  master.employmentHistory.forEach((entry) => {
    experienceSections.push(`### ${entry.company} - ${entry.title}`);
    if (entry.duration) experienceSections.push(entry.duration);
    experienceSections.push(entry.summary);
    entry.highlights.forEach((highlight) => experienceSections.push(`- ${highlight}`));
    experienceSections.push("");
  });
  return [
    `# ${master.name}`,
    `${master.location} | ${master.currentTitle}`,
    "",
    `## Target Summary`,
    role.about,
    "",
    `## Core Skills`,
    unique([...role.skills, ...master.skills]).slice(0, 12).map((skill) => `- ${skill}`).join("\n"),
    "",
    `## Experience`,
    ...experienceSections,
    `## Selected Achievements`,
    ...master.revenueAchievements.map((item) => `- ${item}`),
    ...master.leadershipMetrics.map((item) => `- ${item}`),
    "",
    `## Awards`,
    ...master.awards.map((item) => `- ${item}`),
    "",
    `## Certifications`,
    master.certifications.length ? master.certifications.map((item) => `- ${item}`).join("\n") : "- None listed yet",
  ].filter(Boolean).join("\n");
}

export function generateInterviewPrepMarkdown(data: CareerOSData, roleKey: CareerRoleKey = "founder_ceo"): string {
  const role = getCareerRoleRewrite(roleKey);
  const master = data.masterProfile;
  const comparison = compareCareerProfiles(data, roleKey);
  const stories = [
    "A high-volume customer and retention environment taught me how to protect revenue while keeping service quality stable.",
    "I built ATLAS and Avery Industries around systems, automation, and clear execution.",
    "My support, sales, and workforce experience gives me a practical view of how operations and customer experience fit together.",
  ];
  return [
    `# Interview Prep: ${roleKey.replace(/_/g, " ").toUpperCase()}`,
    "",
    `## Opening Pitch`,
    `${master.name} is a cross-functional operations, support, and revenue leader building Avery Industries and ATLAS.`,
    "",
    `## Proof Points`,
    ...stories.map((story) => `- ${story}`),
    "",
    `## Likely Questions`,
    ...role.interviewThemes.map((theme) => `- ${theme}`),
    "",
    `## Evidence To Cite`,
    ...comparison.featuredRecommendations.map((item) => `- ${item}`),
    "",
    `## Gaps To Address`,
    ...(comparison.missingCertifications.length ? comparison.missingCertifications.map((item) => `- ${item}`) : ["- No immediate certification gap identified"]),
    "",
    `## Close`,
    `Connect the role to revenue, customer experience, and repeatable execution.`,
  ].join("\n");
}

export function generateCareerProfilePackage(data: CareerOSData, roleKey: CareerRoleKey = "founder_ceo") {
  const comparison = compareCareerProfiles(data, roleKey);
  const dashboard = generateCareerDashboard(data, roleKey);
  return {
    comparison,
    dashboard,
    linkedinMarkdown: generateLinkedInMarkdown(data, roleKey),
    copyPasteText: generateCopyPasteText(data, roleKey),
    resumeMarkdown: generateATSResumeMarkdown(data, roleKey),
    interviewPrepMarkdown: generateInterviewPrepMarkdown(data, roleKey),
    role: getCareerRoleRewrite(roleKey),
  };
}

export function buildLinkedInAutomationPlan(data: CareerOSData, roleKey: CareerRoleKey = "founder_ceo") {
  const comparison = compareCareerProfiles(data, roleKey);
  return {
    approvalRequired: true,
    manualLoginRequired: true,
    steps: [
      "Open LinkedIn in a browser and log in manually.",
      "Review the generated headline, about section, and experience edits.",
      "Verify the featured section recommendations match the current proof points.",
      "Copy the approved text into LinkedIn manually.",
      "Stop before final submission unless Cole gives explicit approval.",
    ],
    proposedChanges: {
      headline: comparison.suggestedHeadline,
      about: comparison.suggestedAbout,
      skills: comparison.skillsRecommendations,
      featured: comparison.featuredRecommendations,
    },
  };
}

export function updateCareerOSData(data: CareerOSData, patch: Partial<CareerOSData>): CareerOSData {
  return normalizeCareerData({
    ...data,
    ...patch,
    masterProfile: {
      ...data.masterProfile,
      ...(patch.masterProfile || {}),
    },
    currentLinkedIn: {
      ...data.currentLinkedIn,
      ...(patch.currentLinkedIn || {}),
    },
    updatedAt: new Date().toISOString(),
  });
}

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => String(value).trim()).filter(Boolean)));
}

function normalizeText(value: unknown) {
  return String(value || "").toLowerCase();
}

function countMatches(haystack: string, needles: string[]) {
  return needles.reduce((count, needle) => (haystack.includes(needle) ? count + 1 : count), 0);
}

function buildScoreBreakdown(master: CareerMasterProfile, current: CareerLinkedInProfile, roleKey: CareerRoleKey) {
  const role = getCareerRoleRewrite(roleKey);
  const headlineScore = current.headline ? Math.min(100, 30 + countMatches(normalizeText(current.headline), role.atsKeywords) * 10) : 15;
  const aboutScore = current.about ? Math.min(100, 30 + current.about.length / 4) : 10;
  const skillsScore = Math.min(100, 20 + scoreOverlap(master.skills, role.skills) * 8);
  const evidenceScore = Math.min(100, 20 + master.recentAchievements.length * 10 + master.revenueAchievements.length * 6);
  const roleScore = scoreJobMatch(master, roleKey);
  return [
    { label: "Headline fit", score: headlineScore, note: "Current headline coverage" },
    { label: "About fit", score: aboutScore, note: "Current summary depth" },
    { label: "Skills fit", score: skillsScore, note: "Master skills coverage" },
    { label: "Evidence fit", score: evidenceScore, note: "Achievement and proof density" },
    { label: "Role match", score: roleScore, note: "Target role alignment" },
  ];
}

function scoreOverlap(masterSkills: string[], roleSkills: string[]) {
  const masterSet = new Set(masterSkills.map((item) => normalizeText(item)));
  return roleSkills.reduce((total, skill) => (masterSet.has(normalizeText(skill)) ? total + 1 : total), 0);
}

function scoreResume(master: CareerMasterProfile, roleKey: CareerRoleKey) {
  const role = getCareerRoleRewrite(roleKey);
  const coverage = [
    master.employmentHistory.length > 0 ? 12 : 0,
    master.skills.length >= 8 ? 12 : 8,
    master.revenueAchievements.length > 0 ? 12 : 0,
    master.leadershipMetrics.length > 0 ? 12 : 0,
    master.recentAchievements.length > 0 ? 12 : 0,
    master.awards.length > 0 ? 8 : 0,
    master.projects.length > 0 ? 8 : 0,
    master.certifications.length > 0 ? 8 : 0,
  ].reduce((a, b) => a + b, 0);
  const keywordCoverage = Math.min(20, scoreOverlap(master.skills, role.skills) * 2);
  return Math.max(0, Math.min(100, coverage + keywordCoverage + 20));
}

function scoreJobMatch(master: CareerMasterProfile, roleKey: CareerRoleKey) {
  const role = getCareerRoleRewrite(roleKey);
  const text = normalizeText([
    master.currentTitle,
    master.about,
    master.skills.join(" "),
    master.revenueAchievements.join(" "),
    master.leadershipMetrics.join(" "),
    master.recentAchievements.join(" "),
    master.projects.join(" "),
  ].join(" "));
  const matches = countMatches(text, role.atsKeywords);
  return Math.max(35, Math.min(100, 40 + matches * 10 + scoreOverlap(master.skills, role.skills) * 3));
}

function computeMissingCertifications(certifications: string[], suggested: string[]) {
  const existing = new Set(certifications.map((item) => normalizeText(item)));
  return suggested.filter((item) => {
    const normalized = normalizeText(item);
    return normalized !== "no mandatory certification" && !existing.has(normalized);
  });
}
