export const AVERY_CHARTER_VERSION = "1.1";

export const AVERY_PARENT_COMPANY = {
  organization: "Avery Industries LLC",
  founder: "Cole Avery (Cole Ends)",
  finalApprovalAuthority: "Cole Avery",
  responsibilities: ["Strategic direction", "Asset ownership", "Intellectual property", "Capital allocation", "Brand management", "AI governance", "Company mission"],
};

export const AVERY_CORE_DIVISIONS = [
  { divisionName: "ATLAS HQ", purpose: "Build and maintain the operating system used to manage Avery Industries.", status: "Active", successMetric: "A fully operational company dashboard capable of coordinating priorities, tasks, memory, approvals, reports, and agents." },
  { divisionName: "Creator Logistics", purpose: "Generate revenue through creator services, editing support, upload packages, channel operations, and creator infrastructure.", status: "Active", successMetric: "Consistent recurring service revenue and repeatable client fulfillment." },
  { divisionName: "AveryTech", purpose: "Create ethical AI, software, accessibility, disability-aid, executive-function, and assistive technology products.", status: "Active", successMetric: "Evidence-backed software products used by real people." },
  { divisionName: "Marketing, Public Relations, and Advertising", purpose: "Manage brand visibility, campaigns, investor-facing communications, outreach, and public positioning.", status: "Active", successMetric: "Qualified leads, trusted public messaging, and investor-ready communication assets." },
  { divisionName: "Avery Community Foundation", purpose: "Community impact, accessibility initiatives, food security, housing support, and future charitable programs.", status: "Strategic Expansion", successMetric: "Measurable social impact and compliant nonprofit/foundation readiness." },
  { divisionName: "Real Estate Division", purpose: "Future property, facility, studio, lab, office, and community-space planning.", status: "Strategic Expansion", successMetric: "Revenue-supported expansion into physical infrastructure without reckless debt." },
  { divisionName: "Avery Entertainment", purpose: "Develop entertainment IP, channels, stories, animation, games, and creative universes.", status: "Strategic Expansion", successMetric: "Profitable IP ecosystem built after the revenue and operations base is stable." },
  { divisionName: "Studio ColeTrain", purpose: "Operate founder-led media, content production, editing, public persona, and studio assets.", status: "Strategic Expansion", successMetric: "Professional media presence that supports sales, partnerships, and founder authority." },
  { divisionName: "Avery Academy", purpose: "Educational products, training, AI literacy, automation education, creator operations, and entrepreneurship learning.", status: "Strategic Expansion", successMetric: "Training products and programs with clear outcomes and no unsupported claims." },
  { divisionName: "Avery Music Group", purpose: "Music production, audio publishing, soundtracks, artist brands, and rights-safe music systems.", status: "Strategic Expansion", successMetric: "Sustainable music/audio publishing with clear rights ownership." },
  { divisionName: "Avery Collectibles", purpose: "Merchandise, collectibles, figures, plushes, companion products, and brand collectibles.", status: "Strategic Expansion", successMetric: "Prototype-validated product lines with clear rights and manufacturability." },
  { divisionName: "Avery Publishing", purpose: "Books, workbooks, essays, fiction, guides, and publishing systems.", status: "Strategic Expansion", successMetric: "Published assets with clear rights, quality control, and audience demand." },
  { divisionName: "Avery Supply Co.", purpose: "Future consumer products, apparel, lifestyle goods, and utility products.", status: "Strategic Expansion", successMetric: "Validated product concepts with responsible supply chain and rights status." },
  { divisionName: "Avery Security", purpose: "Cybersecurity, internal security practices, digital trust, and future security-service capability.", status: "Strategic Expansion", successMetric: "Improved company security posture and potential future cybersecurity offers." },
  { divisionName: "Avery Ventures", purpose: "Future investment, incubation, venture partnerships, and portfolio opportunities.", status: "Strategic Expansion", successMetric: "Disciplined investment activity only after cash flow and governance maturity." },
  { divisionName: "Vine and Velvet", purpose: "Future 18+ ventures division requiring separate compliance, brand safety, and approval controls.", status: "Future / Compliance Review", successMetric: "No active public use until legal, platform, finance, and brand-risk review is complete." },
];

export const AVERY_AGENT_HIERARCHY = [
  { level: 1, name: "Cole Avery", title: "Founder / CEO / Final Approval Authority", reportsTo: null, department: "Executive" },
  { level: 2, name: "ATLAS Prime", title: "Chief Operating Agent", reportsTo: "Cole Avery", department: "Executive" },
  { level: 2, name: "Echo", title: "Chief Strategy Agent", reportsTo: "Cole Avery", department: "Executive" },
  { level: 3, name: "Circuit", title: "Engineering Director", reportsTo: "ATLAS Prime", department: "ATLAS HQ" },
  { level: 3, name: "Broker", title: "Sales Director", reportsTo: "ATLAS Prime", department: "Creator Logistics" },
  { level: 3, name: "Mercury", title: "Operations Director", reportsTo: "ATLAS Prime", department: "Creator Logistics" },
  { level: 3, name: "Broadcaster", title: "Marketing Director", reportsTo: "ATLAS Prime", department: "Marketing and Growth" },
  { level: 3, name: "Guide", title: "Product Director", reportsTo: "ATLAS Prime", department: "AveryTech" },
  { level: 3, name: "Apollo", title: "Entertainment Director", reportsTo: "ATLAS Prime", department: "Avery Entertainment" },
  { level: 3, name: "Lantern", title: "Funding Director", reportsTo: "ATLAS Prime", department: "Foundation" },
  { level: 3, name: "Forge", title: "Operations Director", reportsTo: "ATLAS Prime", department: "Operations" },
  { level: 3, name: "Archivist", title: "Knowledge Director", reportsTo: "ATLAS Prime", department: "Knowledge Management" },
  { level: 3, name: "Sentinel", title: "Security Director", reportsTo: "ATLAS Prime", department: "Monitoring and Security" },
];

export const AVERY_APPROVAL_POLICY = {
  allowed: ["Research", "Analyze", "Draft", "Organize", "Plan", "Report"],
  blockedWithoutColeApproval: ["Spend money", "Sign agreements", "Contact clients", "Submit grants", "Post publicly", "Purchase software"],
};

export const AVERY_DEVELOPMENT_PRIORITIES = [
  { phase: 1, name: "Build Company Operating System", required: ["Agent Registry", "Department Registry", "Shared Memory", "Task Queue", "Approval Queue", "Executive Dashboard"] },
  { phase: 2, name: "Build Revenue Systems", required: ["Creator Logistics CRM", "Lead Generation", "Proposal System", "Client Management"] },
  { phase: 3, name: "Build Product Systems", required: ["EchoFrame", "Bare Minimum Journal", "Accessibility Platform"] },
];

export const AVERY_CURSOR_DIRECTIVE = {
  owner: "Cursor",
  responsibilities: ["Engineering", "Architecture", "UI", "Infrastructure", "APIs", "Databases", "Integrations"],
  priorities: ["ATLAS Command Center", "Memory System", "Agent Registry", "Approval Queue", "Task Management"],
};

export const AVERY_CODEX_DIRECTIVE = {
  owner: "Codex",
  responsibilities: ["System design", "Documentation", "Workflow creation", "Agent architecture", "Business process design"],
  priorities: ["Agent Framework", "Department Framework", "Reporting Systems", "SOP Generation", "Company Documentation"],
};

export const AVERY_SUCCESS_CONDITION = [
  "ATLAS can track all projects.",
  "Agents have memory.",
  "Tasks are assigned automatically.",
  "Daily reports are generated automatically.",
  "Cole only needs to review approvals and make strategic decisions.",
];

export function generateCharterSummary() {
  return {
    version: AVERY_CHARTER_VERSION,
    organization: AVERY_PARENT_COMPANY.organization,
    finalApprovalAuthority: AVERY_PARENT_COMPANY.finalApprovalAuthority,
    activeDivisions: AVERY_CORE_DIVISIONS.filter((division) => division.status === "Active").map((division) => division.divisionName),
    futureDivisions: AVERY_CORE_DIVISIONS.filter((division) => division.status !== "Active").map((division) => division.divisionName),
    phaseOneRequired: AVERY_DEVELOPMENT_PRIORITIES[0].required,
  };
}

export function getCoreDivisions() {
  return AVERY_CORE_DIVISIONS.slice();
}

export function getCharterDivision(divisionName: string) {
  const division = AVERY_CORE_DIVISIONS.find((item) => item.divisionName === divisionName);
  if (!division) throw new Error(`Charter division ${divisionName} not found.`);
  return division;
}

export function getAgentHierarchy() {
  return AVERY_AGENT_HIERARCHY.slice();
}

export function getAgentHierarchyRecord(agentName: string) {
  const agent = AVERY_AGENT_HIERARCHY.find((item) => item.name === agentName);
  if (!agent) throw new Error(`Charter agent ${agentName} not found.`);
  return agent;
}

export function getDevelopmentPriorityPhase(phase: number) {
  const priority = AVERY_DEVELOPMENT_PRIORITIES.find((item) => item.phase === phase);
  if (!priority) throw new Error(`Development phase ${phase} not found.`);
  return priority;
}

export function validateAgentAgainstCharter(agent: any) {
  const missing = ["id", "name", "department", "manager", "purpose", "status", "lastActivity", "currentTask", "priorityLevel"].filter((field) => !agent[field]);
  return {
    agentName: agent.name || agent.agentName || "Unnamed Agent",
    valid: missing.length === 0,
    missing,
    requiredReports: ["Daily Report", "Weekly Report", "Blocker Report"],
    finalApprovalAuthority: AVERY_PARENT_COMPANY.finalApprovalAuthority,
  };
}

export function actionRequiresColeApproval(action: string) {
  const text = action.toLowerCase();
  return AVERY_APPROVAL_POLICY.blockedWithoutColeApproval.some((blocked) => text.indexOf(blocked.toLowerCase().split(" ")[0]) >= 0);
}

export function getApprovalPolicy() {
  return AVERY_APPROVAL_POLICY;
}

export function getCursorDirective() {
  return AVERY_CURSOR_DIRECTIVE;
}

export function getCodexDirective() {
  return AVERY_CODEX_DIRECTIVE;
}

export function getSuccessCondition() {
  return AVERY_SUCCESS_CONDITION.slice();
}
