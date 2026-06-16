declare const require: any;
declare const __dirname: string;

const fs = require("fs");
const path = require("path");

export const ATLAS_SHARED_DATA_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_shared_data.json");

export type AtlasSharedCollectionName =
  | "ideas"
  | "leads"
  | "tasks"
  | "divisions"
  | "contentPackages"
  | "grants"
  | "approvalQueue"
  | "auditLogs";

export type AtlasAuditEventType = "Item Created" | "Item Updated" | "Item Approved" | "Item Rejected" | "Item Exported";

export interface AtlasAuditLogEntry {
  id: string;
  eventType: AtlasAuditEventType;
  collection: Exclude<AtlasSharedCollectionName, "auditLogs">;
  itemId: string;
  itemLabel: string;
  actor: string;
  timestamp: string;
  note?: string;
  payload?: Record<string, unknown>;
}

export interface AtlasSharedData {
  company: {
    parent: string;
    brand: string;
    tagline: string;
    mode: string;
  };
  routes: Array<{ path: string; label: string; description: string }>;
  statusBadges: string[];
  ideas: any[];
  leads: any[];
  tasks: any[];
  divisions: any[];
  contentPackages: any[];
  grants: any[];
  approvalQueue: any[];
  auditLogs: AtlasAuditLogEntry[];
  guardrails: string[];
  connections: Array<{ system: string; status: string; note: string }>;
  backendGaps: string[];
}

const COLLECTIONS: Exclude<AtlasSharedCollectionName, "auditLogs">[] = ["ideas", "leads", "tasks", "divisions", "contentPackages", "grants", "approvalQueue"];

const ROUTES = [
  { path: "/dashboard", label: "Dashboard", description: "Executive snapshot" },
  { path: "/idea-vault", label: "Idea Vault", description: "Capture and score ideas" },
  { path: "/leads", label: "Leads", description: "Revenue pipeline" },
  { path: "/content-ops", label: "Content Ops", description: "Drafts and publishing queue" },
  { path: "/grants", label: "Grants", description: "Grant readiness and submissions" },
  { path: "/creator-logistics", label: "Creator Logistics", description: "Client delivery and operations" },
  { path: "/divisions", label: "Divisions", description: "Company structure" },
  { path: "/settings", label: "Settings", description: "Config and integrations" },
  { path: "/approval-queue", label: "Approval Queue", description: "Items waiting on approval" },
];

const DEFAULT_STATUS_BADGES = ["Draft", "Pending Approval", "Approved", "Sent", "Blocked"];

type DivisionBlueprint = {
  name: string;
  mission: string;
  revenueModel: string;
  currentProjects: string[];
  activeTasks: string[];
  assetsNeeded: string[];
  socialPagesNeeded: string[];
  automationStatus: string;
  nextActions: string[];
  status: string;
  owner: string;
};

const DIVISION_BLUEPRINTS: DivisionBlueprint[] = [
  {
    name: "AveryTech",
    mission: "Build disability-aid tools, accessibility systems, and internal automation.",
    revenueModel: "B2B SaaS, hardware-supported tools, and funded accessibility projects.",
    currentProjects: ["EchoFrame", "Executive dysfunction journaling app", "Visual calendar system"],
    activeTasks: ["Prototype support flows", "Document accessibility proof", "Map grant evidence"],
    assetsNeeded: ["Research notes", "Prototype demos", "Support docs"],
    socialPagesNeeded: ["Founder update", "AveryTech updates", "Accessibility demos"],
    automationStatus: "Active",
    nextActions: ["Finalize one pilot", "Queue grant evidence", "Log user feedback"],
    status: "Active",
    owner: "Guide",
  },
  {
    name: "ATLAS OS",
    mission: "Run the company operating system, approvals, memory, and routing.",
    revenueModel: "Internal enablement, licensing, and systems consulting.",
    currentProjects: ["Command Center", "Shared data layer", "Approval queue"],
    activeTasks: ["Route work by division", "Keep audit history visible", "Reduce manual follow-up"],
    assetsNeeded: ["Auth", "Persistent database", "Analytics"],
    socialPagesNeeded: ["Internal update", "Product roadmap note"],
    automationStatus: "Active",
    nextActions: ["Connect real backend", "Expand approvals", "Stabilize data flow"],
    status: "Active",
    owner: "ATLAS Prime",
  },
  {
    name: "Creator Logistics",
    mission: "Convert qualified leads into predictable client delivery and retained revenue.",
    revenueModel: "Monthly retainers, editing packages, content systems, and follow-up automation.",
    currentProjects: ["Lead pipeline", "Outreach drafts", "Client delivery queue"],
    activeTasks: ["Score leads", "Draft outreach", "Review approvals"],
    assetsNeeded: ["CRM", "CSV imports", "Proposal templates"],
    socialPagesNeeded: ["Creator Logistics page", "Case study page", "Lead magnet page"],
    automationStatus: "Active",
    nextActions: ["Import more leads", "Queue outreach drafts", "Track conversion"],
    status: "Active",
    owner: "Broker",
  },
  {
    name: "Avery Entertainment",
    mission: "Ship IP, media, comics, games, and stories.",
    revenueModel: "Publishing, IP monetization, digital products, and licensing.",
    currentProjects: ["Books", "Comics", "Worldbuilding"],
    activeTasks: ["Editorial review", "Packaging", "Release planning"],
    assetsNeeded: ["Cover art", "Layouts", "Rights notes"],
    socialPagesNeeded: ["Publishing updates", "Launch pages"],
    automationStatus: "Strategic",
    nextActions: ["Finalize release order", "Package next book", "Check rights"],
    status: "Strategic",
    owner: "Apollo",
  },
  {
    name: "Avery Music Group",
    mission: "Produce, package, and publish music and audio assets.",
    revenueModel: "Music releases, sync, commissions, and audio libraries.",
    currentProjects: ["Release planning", "Audio branding", "SFX libraries"],
    activeTasks: ["Track production", "Prepare metadata", "Queue releases"],
    assetsNeeded: ["Masters", "Cover art", "Credits"],
    socialPagesNeeded: ["Music page", "Release announcements"],
    automationStatus: "Strategic",
    nextActions: ["Package one release", "Create metadata sheet", "Log approvals"],
    status: "Strategic",
    owner: "Apollo",
  },
  {
    name: "Avery Collectibles",
    mission: "Build merchandise, collectibles, and limited product drops.",
    revenueModel: "Merch drops, limited editions, and collector bundles.",
    currentProjects: ["Product ideas", "Packaging", "Storefront planning"],
    activeTasks: ["Scoring", "Launch readiness", "Asset prep"],
    assetsNeeded: ["Mockups", "Store copy", "Print specs"],
    socialPagesNeeded: ["Drop page", "Collector updates"],
    automationStatus: "Strategic",
    nextActions: ["Pick first drop", "Write listing copy", "Prepare launch checklist"],
    status: "Strategic",
    owner: "Mercury",
  },
  {
    name: "Avery Academy",
    mission: "Teach internal SOPs, training paths, and repeatable skills.",
    revenueModel: "Courses, training products, internal enablement, and licensing.",
    currentProjects: ["SOP library", "Training packs", "Onboarding"],
    activeTasks: ["Document workflows", "Package learning paths", "Plan assessments"],
    assetsNeeded: ["Lessons", "Quizzes", "Guides"],
    socialPagesNeeded: ["Training page", "Course announcements"],
    automationStatus: "Strategic",
    nextActions: ["Draft first lesson", "Link SOPs", "Add test checklist"],
    status: "Strategic",
    owner: "Archivist",
  },
  {
    name: "Avery Community Foundation",
    mission: "Support accessibility, mutual aid, and community impact programs.",
    revenueModel: "Grants, donations, sponsorships, and impact partnerships.",
    currentProjects: ["Fundraising", "Program design", "Impact reporting"],
    activeTasks: ["Draft grant packets", "Collect evidence", "Publish outcomes"],
    assetsNeeded: ["Grant docs", "Letters of support", "Program summaries"],
    socialPagesNeeded: ["Foundation page", "Impact updates"],
    automationStatus: "Strategic",
    nextActions: ["Prepare one grant packet", "Log impact metric", "Request support letters"],
    status: "Strategic",
    owner: "Lantern",
  },
  {
    name: "Apollo Athletics",
    mission: "Build movement, training, and performance products.",
    revenueModel: "Training content, coaching, and performance services.",
    currentProjects: ["Training plans", "Brand assets", "Programs"],
    activeTasks: ["Outline offer", "Plan content", "Map audience"],
    assetsNeeded: ["Program materials", "Visuals", "Testimonials"],
    socialPagesNeeded: ["Athletics page", "Training reels"],
    automationStatus: "Strategic",
    nextActions: ["Package first program", "Draft launch copy", "Assign owner"],
    status: "Strategic",
    owner: "Forge",
  },
  {
    name: "Apollo Apparel",
    mission: "Produce wearable branded apparel and lifestyle items.",
    revenueModel: "Product drops, bundles, and branded apparel.",
    currentProjects: ["Mockups", "Sizing", "Drop planning"],
    activeTasks: ["Select products", "Prepare mockups", "Draft launch list"],
    assetsNeeded: ["Design files", "Sizing info", "Store copy"],
    socialPagesNeeded: ["Apparel page", "Drop announcements"],
    automationStatus: "Strategic",
    nextActions: ["Choose launch SKU", "Create product sheet", "Track approvals"],
    status: "Strategic",
    owner: "Forge",
  },
  {
    name: "Apollo Nutrition",
    mission: "Support nutrition, supplements, and wellness products.",
    revenueModel: "Product sales, bundles, and wellness content.",
    currentProjects: ["Positioning", "Compliance review", "Product concepts"],
    activeTasks: ["Review claims", "Map audience", "Build launch plan"],
    assetsNeeded: ["Labels", "Claims review", "Product specs"],
    socialPagesNeeded: ["Nutrition page", "Product education"],
    automationStatus: "Strategic",
    nextActions: ["Verify claims", "Draft product overview", "Prepare compliance notes"],
    status: "Strategic",
    owner: "Forge",
  },
  {
    name: "Apollo Training",
    mission: "Teach repeatable training systems and skill development workflows.",
    revenueModel: "Courses, memberships, and coaching systems.",
    currentProjects: ["Curriculum", "Offer ladder", "Lesson packs"],
    activeTasks: ["Outline modules", "Build assessments", "Plan launch"],
    assetsNeeded: ["Lesson plans", "Proof points", "Templates"],
    socialPagesNeeded: ["Training page", "Course teasers"],
    automationStatus: "Strategic",
    nextActions: ["Draft module one", "Prepare landing copy", "Set release target"],
    status: "Strategic",
    owner: "Forge",
  },
  {
    name: "Apollo Recovery",
    mission: "Support recovery, rest, and disability-support workflows.",
    revenueModel: "Support products, guides, consulting, and funded aid.",
    currentProjects: ["Recovery systems", "Rest protocols", "Support guides"],
    activeTasks: ["Document recovery flow", "Map support content", "Collect evidence"],
    assetsNeeded: ["Protocols", "Support docs", "Funding evidence"],
    socialPagesNeeded: ["Recovery page", "Support notes"],
    automationStatus: "Strategic",
    nextActions: ["Draft support guide", "Queue research", "Log partner asks"],
    status: "Strategic",
    owner: "Sentinel",
  },
];

const DEFAULT_DATA: AtlasSharedData = {
  company: {
    parent: "Avery Industries LLC",
    brand: "ATLAS Command Center",
    tagline: "Professional AI operations for revenue, approvals, ideas, and division control.",
    mode: "Mock backend active until real APIs are connected.",
  },
  routes: ROUTES,
  statusBadges: DEFAULT_STATUS_BADGES,
  ideas: [
    { id: "idea-1", title: "Executive morning brief with auto-priority scoring", source: "ATLAS note", value: "High", effort: "Low", status: "Draft", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "idea-2", title: "Creator Logistics referral follow-up automation", source: "Revenue note", value: "High", effort: "Medium", status: "Pending Approval", createdAt: "2026-06-06T09:05:00.000Z", updatedAt: "2026-06-06T09:05:00.000Z" },
    { id: "idea-3", title: "AveryTech accessibility pilot for caregivers", source: "Grant note", value: "Medium", effort: "High", status: "Approved", createdAt: "2026-06-06T09:10:00.000Z", updatedAt: "2026-06-06T09:10:00.000Z" },
  ],
  leads: [
    { id: "lead-1", name: "Leo Media", stage: "Discovery", value: "$2,400", status: "Draft", createdAt: "2026-06-06T09:10:00.000Z", updatedAt: "2026-06-06T09:10:00.000Z" },
    { id: "lead-2", name: "Dani Creative", stage: "Proposal Ready", value: "$3,500", status: "Pending Approval", createdAt: "2026-06-06T09:15:00.000Z", updatedAt: "2026-06-06T09:15:00.000Z" },
    { id: "lead-3", name: "Safe Place Server", stage: "Follow-up", value: "$1,200", status: "Approved", createdAt: "2026-06-06T09:20:00.000Z", updatedAt: "2026-06-06T09:20:00.000Z" },
    { id: "lead-4", name: "Apollo referral", stage: "Closed Won", value: "$6,800", status: "Sent", createdAt: "2026-06-06T09:25:00.000Z", updatedAt: "2026-06-06T09:25:00.000Z" },
  ],
  tasks: [
    { id: "task-1", title: "Creator Logistics follow-up", owner: "Creator Logistics", priority: "High", status: "Pending Approval", area: "Revenue", createdAt: "2026-06-06T09:15:00.000Z", updatedAt: "2026-06-06T09:15:00.000Z" },
    { id: "task-2", title: "Grant packet polish", owner: "Avery Community Foundation", priority: "Medium", status: "Draft", area: "Grants", createdAt: "2026-06-06T09:20:00.000Z", updatedAt: "2026-06-06T09:20:00.000Z" },
    { id: "task-3", title: "ATLAS OS routing", owner: "ATLAS OS", priority: "Critical", status: "Blocked", area: "Operations", createdAt: "2026-06-06T09:25:00.000Z", updatedAt: "2026-06-06T09:25:00.000Z" },
  ],
  divisions: [
    { id: "div-1", name: "AveryTech", purpose: "Disability-aid tools, automation, and accessibility products.", status: "Active", owner: "Guide", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-2", name: "ATLAS OS", purpose: "Company command system, approvals, memory, and routing.", status: "Active", owner: "ATLAS Prime", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-3", name: "Creator Logistics", purpose: "Lead generation, editing services, client delivery, and revenue ops.", status: "Active", owner: "Broker", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-4", name: "Avery Entertainment", purpose: "IP, media, comics, games, and stories.", status: "Strategic", owner: "Apollo", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-5", name: "Avery Music Group", purpose: "Music production, audio publishing, and releases.", status: "Strategic", owner: "Apollo", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-6", name: "Avery Collectibles", purpose: "Merch, physical collectibles, and limited product drops.", status: "Strategic", owner: "Mercury", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-7", name: "Avery Academy", purpose: "Training, education, courses, and internal SOP learning.", status: "Strategic", owner: "Archivist", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-8", name: "Avery Community Foundation", purpose: "Community support, accessibility, and impact programs.", status: "Strategic", owner: "Lantern", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-9", name: "Apollo Athletics", purpose: "Movement, training, fitness, and performance products.", status: "Strategic", owner: "Forge", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-10", name: "Apollo Apparel", purpose: "Wearables, apparel, and branded lifestyle products.", status: "Strategic", owner: "Forge", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-11", name: "Apollo Nutrition", purpose: "Nutrition, supplements, and wellness products.", status: "Strategic", owner: "Forge", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-12", name: "Apollo Training", purpose: "Training systems, coaching, and skill development.", status: "Strategic", owner: "Forge", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "div-13", name: "Apollo Recovery", purpose: "Recovery, rest, and disability-support workflows.", status: "Strategic", owner: "Sentinel", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
  ],
  contentPackages: [
    { id: "content-1", title: "Weekly ATLAS update", owner: "ATLAS OS", channel: "Internal", status: "Draft", createdAt: "2026-06-06T09:05:00.000Z", updatedAt: "2026-06-06T09:05:00.000Z" },
    { id: "content-2", title: "Creator Logistics clip batch", owner: "Creator Logistics", channel: "Client", status: "Pending Approval", createdAt: "2026-06-06T09:10:00.000Z", updatedAt: "2026-06-06T09:10:00.000Z" },
    { id: "content-3", title: "Founder essay outline", owner: "AveryTech", channel: "Public", status: "Approved", createdAt: "2026-06-06T09:15:00.000Z", updatedAt: "2026-06-06T09:15:00.000Z" },
    { id: "content-4", title: "Grant explainer video", owner: "Avery Community Foundation", channel: "Grant", status: "Blocked", createdAt: "2026-06-06T09:20:00.000Z", updatedAt: "2026-06-06T09:20:00.000Z" },
  ],
  grants: [
    { id: "grant-1", title: "Accessibility pilot grant", agency: "State program", stage: "Draft", status: "Draft", createdAt: "2026-06-06T09:00:00.000Z", updatedAt: "2026-06-06T09:00:00.000Z" },
    { id: "grant-2", title: "Assistive tech evidence packet", agency: "Foundations", stage: "Review", status: "Pending Approval", createdAt: "2026-06-06T09:05:00.000Z", updatedAt: "2026-06-06T09:05:00.000Z" },
    { id: "grant-3", title: "Community support microgrant", agency: "Local fund", stage: "Submitted", status: "Sent", createdAt: "2026-06-06T09:10:00.000Z", updatedAt: "2026-06-06T09:10:00.000Z" },
  ],
  approvalQueue: [
    { id: "approval-1", title: "Creator Logistics proposal to Dani", reason: "Outbound client deliverable", status: "Pending Approval", collection: "contentPackages", itemId: "content-2", createdAt: "2026-06-06T09:30:00.000Z", updatedAt: "2026-06-06T09:30:00.000Z" },
    { id: "approval-2", title: "Grant response draft", reason: "External submission", status: "Draft", collection: "grants", itemId: "grant-1", createdAt: "2026-06-06T09:35:00.000Z", updatedAt: "2026-06-06T09:35:00.000Z" },
    { id: "approval-3", title: "Apollo reply message", reason: "Outbound DM", status: "Blocked", collection: "leads", itemId: "lead-1", createdAt: "2026-06-06T09:40:00.000Z", updatedAt: "2026-06-06T09:40:00.000Z" },
    { id: "approval-4", title: "Content post for public channel", reason: "Public posting", status: "Approved", collection: "contentPackages", itemId: "content-3", createdAt: "2026-06-06T09:45:00.000Z", updatedAt: "2026-06-06T09:45:00.000Z" },
    { id: "approval-5", title: "Invoice follow-up", reason: "Money-moving action", status: "Pending Approval", collection: "leads", itemId: "lead-2", createdAt: "2026-06-06T09:50:00.000Z", updatedAt: "2026-06-06T09:50:00.000Z" },
  ],
  auditLogs: [],
  guardrails: [
    "Never auto-send emails, DMs, proposals, or deliverables without approval.",
    "Keep approvals, logging, and draft history visible at all times.",
    "Use Avery Industries LLC everywhere.",
    "Keep the UI dense, simple, mobile-friendly, and executive-grade.",
  ],
  connections: [
    { system: "CRM", status: "Mock only", note: "Needs a real database or API." },
    { system: "Approvals", status: "Mock only", note: "Needs persistent approval workflow storage." },
    { system: "Email / DM sending", status: "Blocked", note: "Must remain approval-gated." },
    { system: "File storage", status: "Mock only", note: "Needs backend file sync." },
    { system: "Analytics", status: "Mock only", note: "Needs real event tracking." },
  ],
  backendGaps: [
    "Persistent database for tasks, approvals, leads, and notes.",
    "Real CRM and lead source integrations.",
    "Email and DM connectors with approval workflow storage.",
    "Grant document storage and submission tracking.",
    "Content publishing API integrations.",
    "Analytics and event logging backend.",
    "Authentication and user permissions.",
  ],
};

function getLabel(record: any): string {
  return String(record && (record.title || record.name || record.label || record.id || "record"));
}

function classifyIdeaIdea(idea: any) {
  const text = `${idea.title || ""} ${idea.rawNote || idea.description || ""} ${idea.category || ""} ${idea.relatedDivision || ""}`.toLowerCase();
  const distributions = {
    contentIdeas: [] as string[],
    productIdeas: [] as string[],
    marketingAngles: [] as string[],
    grantOpportunities: [] as string[],
    socialPosts: [] as string[],
    codexTasks: [] as string[],
    cursorTasks: [] as string[],
    salesOffers: [] as string[],
    risks: [] as string[],
    nextAction: "Write a one-paragraph next step.",
  };

  if (/video|content|post|story|essay|youtube|newsletter/.test(text)) {
    distributions.contentIdeas.push(`Turn "${idea.title}" into a content package.`);
    distributions.socialPosts.push(`Post a short update around ${idea.title}.`);
    distributions.cursorTasks.push("Build a content layout or publication draft.");
  }
  if (/product|app|tool|software|system|automation|atlas|assist/.test(text)) {
    distributions.productIdeas.push(`Prototype "${idea.title}" as a small product or workflow.`);
    distributions.codexTasks.push("Define a data model and acceptance checklist.");
    distributions.cursorTasks.push("Create the first UI shell and route map.");
  }
  if (/grant|fund|foundation|disability|accessibility|community|research/.test(text)) {
    distributions.grantOpportunities.push(`Map "${idea.title}" to a grant or funding packet.`);
    distributions.risks.push("Needs evidence and rights review before submission.");
  }
  if (/sales|lead|client|offer|revenue|service/.test(text)) {
    distributions.salesOffers.push(`Package "${idea.title}" into a revenue offer.`);
  }
  distributions.marketingAngles.push(`Founder update: why ${idea.title} matters.`);
  distributions.nextAction = distributions.codexTasks[0] || distributions.cursorTasks[0] || distributions.nextAction;
  return distributions;
}

export function scoreLeadRecord(record: any) {
  let score = 1;
  const text = `${record.platform || ""} ${record.niche || ""} ${Array.isArray(record.painPoints) ? record.painPoints.join(" ") : ""} ${record.notes || ""}`.toLowerCase();
  if (/editing|edit|footage|clip/.test(text)) score += 2;
  if (/short|shorts|reels|tiktok|upload/.test(text)) score += 2;
  if (/budget|paid|budgeted|monthly|retainer/.test(text)) score += 2;
  if (/brand|creator|channel|youtube/.test(text)) score += 1;
  if (/consistent|weekly|daily|regular/.test(text)) score += 1;
  if (/monet|revenue|growth|scale/.test(text)) score += 1;
  return Math.max(1, Math.min(10, score));
}

export function recommendOfferTier(score: number) {
  if (score >= 8) return "Full Media Infrastructure";
  if (score >= 6) return "Channel Expansion System";
  return "Growth Partner";
}

function buildDivisionProfiles(data: AtlasSharedData) {
  return DIVISION_BLUEPRINTS.map((blueprint) => {
    const existing = data.divisions.find((division: any) => String(division.name) === blueprint.name) || {};
    return {
      ...existing,
      id: existing.id || `div-${blueprint.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: blueprint.name,
      purpose: existing.purpose || blueprint.mission,
      mission: blueprint.mission,
      revenueModel: blueprint.revenueModel,
      currentProjects: blueprint.currentProjects,
      activeTasks: blueprint.activeTasks,
      assetsNeeded: blueprint.assetsNeeded,
      socialPagesNeeded: blueprint.socialPagesNeeded,
      automationStatus: blueprint.automationStatus,
      nextActions: blueprint.nextActions,
      status: existing.status || blueprint.status,
      owner: existing.owner || blueprint.owner,
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

export function createIdeaRecord(record: any, actor: string = "ATLAS") {
  const idea = createAtlasSharedRecord("ideas", {
    title: record.title,
    rawNote: record.rawNote || record.description || "",
    category: record.category || "Content",
    urgency: record.urgency || 3,
    revenuePotential: record.revenuePotential || 3,
    relatedDivision: record.relatedDivision || "ATLAS OS",
    source: record.source || "manual",
    status: record.status || "Draft",
    value: record.value || "Medium",
    effort: record.effort || "Medium",
    distribution: classifyIdeaIdea(record),
  }, actor);
  return idea;
}

export function createLeadRecord(record: any, actor: string = "ATLAS") {
  const fitScore = typeof record.fitScore === "number" ? record.fitScore : scoreLeadRecord(record);
  return createAtlasSharedRecord("leads", {
    name: record.name || record.creatorName || "Unnamed lead",
    platform: record.platform || "",
    url: record.url || "",
    niche: record.niche || "",
    fitScore,
    painPoints: record.painPoints || [],
    offerMatch: record.offerMatch || recommendOfferTier(fitScore),
    status: record.status || "Draft",
    stage: record.stage || "Discovery",
    value: record.value || "$0",
    notes: record.notes || "",
  }, actor);
}

export function createTaskRecord(record: any, actor: string = "ATLAS") {
  return createAtlasSharedRecord("tasks", {
    title: record.title,
    owner: record.owner || record.division || "ATLAS OS",
    priority: record.priority || "Draft",
    status: record.status || "Draft",
    area: record.area || "Operations",
    due: record.due || "",
  }, actor);
}

export function createContentPackageRecord(record: any, actor: string = "ATLAS") {
  return createAtlasSharedRecord("contentPackages", {
    title: record.title,
    owner: record.owner || "ATLAS OS",
    channel: record.channel || "Internal",
    platform: record.platform || "",
    tone: record.tone || "",
    audience: record.audience || "",
    goal: record.goal || "",
    status: record.status || "Draft",
    stages: record.stages || ["Idea", "Script", "Record", "Edit", "Thumbnail", "Upload", "Repurpose", "Analytics"],
  }, actor);
}

export function createGrantRecord(record: any, actor: string = "ATLAS") {
  return createAtlasSharedRecord("grants", {
    title: record.title,
    agency: record.agency || record.source || "",
    stage: record.stage || "Draft",
    amount: record.amount || "",
    eligibility: record.eligibility || "",
    requiredDocuments: record.requiredDocuments || [],
    status: record.status || "Draft",
    matchScore: record.matchScore || 0,
  }, actor);
}

export function createApprovalRecord(record: any, actor: string = "ATLAS") {
  return createAtlasSharedRecord("approvalQueue", {
    title: record.title,
    type: record.type || record.collection || "Email",
    division: record.division || "ATLAS OS",
    generatedContent: record.generatedContent || "",
    riskLevel: record.riskLevel || "Medium",
    revenuePotential: record.revenuePotential || "Medium",
    status: record.status || "Pending Approval",
    history: record.history || [],
    collection: record.collection || "contentPackages",
    itemId: record.itemId || "",
  }, actor);
}

export function createContentFromIdea(idea: any, actor: string = "ATLAS") {
  return createContentPackageRecord({
    title: `${idea.title} content package`,
    owner: idea.relatedDivision || "ATLAS OS",
    channel: "Internal",
    platform: "Multi-platform",
    tone: "Executive",
    audience: "Founder audience",
    goal: "Turn idea into content",
    status: "Draft",
  }, actor);
}

export function createLeadDrafts(lead: any) {
  const fitScore = lead.fitScore || scoreLeadRecord(lead);
  const offer = lead.offerMatch || recommendOfferTier(fitScore);
  return {
    emailDraft: `Hi ${lead.name}, ATLAS noticed your ${lead.platform || "channel"} and thinks ${offer} may be a fit. This is a draft pending approval.`,
    dmDraft: `Hey ${lead.name}, I noticed your work and drafted a Creator Logistics approach. Cole will review before anything is sent.`,
    followUpDraft: `Quick follow-up draft for ${lead.name}: stay warm, keep it short, and wait for approval.`,
    proposalSummary: `${lead.name} appears to fit ${offer}. Fit score: ${fitScore}/10.`,
    approvalRequired: true,
    offer,
    revenuePotential: offer === "Full Media Infrastructure" ? "$12,500+/mo" : offer === "Channel Expansion System" ? "$7,500/mo" : "$3,500/mo",
  };
}

export function generateGrantChecklist(record: any) {
  return {
    problemStatement: `What problem does ${record.title} solve?`,
    targetUsers: record.targetUsers || "AveryTech users and support network",
    budget: record.amount || "TBD",
    timeline: record.timeline || "TBD",
    impactMetrics: record.impactMetrics || "Usage, outcomes, and accessibility evidence",
    lettersOfSupport: record.lettersOfSupport || "Collect partner letters if required",
    prototypeDemo: "Attach prototype or evidence demo before submission",
    registrationDocs: "Include company registration and supporting docs",
  };
}

export function generateContentPackageForIdea(idea: any) {
  const title = idea.title || "Untitled idea";
  return {
    title: `${title} content package`,
    youtubeTitle: `${title}: what ATLAS is building next`,
    thumbnailConcept: `Bold black-and-gold card with the words ${title}`,
    hook: `Here is why ${title} matters now.`,
    scriptOutline: [`Open with the problem`, `Explain ${title}`, `Close with the next step`],
    shortsIdeas: [`Short on ${title}`, `Founder note on ${title}`, `Build log for ${title}`],
    tiktokCaption: `Building ${title} with ATLAS.`,
    instagramCaption: `A look at ${title}.`,
    tweet: `${title} is moving forward inside ATLAS Command Center.`,
    newsletterAngle: `${title} as a system update and decision point.`,
    repurposePlan: ["YouTube", "Shorts", "TikTok", "Instagram", "X", "Newsletter"],
    productionStages: ["Idea", "Script", "Record", "Edit", "Thumbnail", "Upload", "Repurpose", "Analytics"],
    exportFormat: "calendar-friendly",
  };
}

function getCollectionStatusDefault(collection: Exclude<AtlasSharedCollectionName, "auditLogs">): string {
  if (collection === "approvalQueue") return "Pending Approval";
  if (collection === "divisions") return "Active";
  return "Draft";
}

function readJsonFile(filePath: string): AtlasSharedData | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return normalizeAtlasData(parsed);
  } catch (_error) {
    return null;
  }
}

function writeJsonFile(filePath: string, data: AtlasSharedData) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function normalizeAtlasData(data: any): AtlasSharedData {
  const next = cloneDeep(DEFAULT_DATA);
  if (data && data.company) next.company = { ...next.company, ...data.company };
  if (data && Array.isArray(data.routes)) next.routes = data.routes;
  if (data && Array.isArray(data.statusBadges)) next.statusBadges = data.statusBadges;
  COLLECTIONS.forEach((collection) => {
    if (data && Array.isArray(data[collection])) next[collection] = data[collection];
  });
  if (data && Array.isArray(data.auditLogs)) next.auditLogs = data.auditLogs;
  if (data && Array.isArray(data.guardrails)) next.guardrails = data.guardrails;
  if (data && Array.isArray(data.connections)) next.connections = data.connections;
  if (data && Array.isArray(data.backendGaps)) next.backendGaps = data.backendGaps;
  return next;
}

function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function loadAtlasSharedData(): AtlasSharedData {
  return readJsonFile(ATLAS_SHARED_DATA_PATH) || cloneDeep(DEFAULT_DATA);
}

export function saveAtlasSharedData(data: AtlasSharedData): AtlasSharedData {
  const normalized = normalizeAtlasData(data);
  writeJsonFile(ATLAS_SHARED_DATA_PATH, normalized);
  return normalized;
}

export function resetAtlasSharedDataForDemo() {
  saveAtlasSharedData(cloneDeep(DEFAULT_DATA));
}

export function getAtlasCollection(name: AtlasSharedCollectionName) {
  const data = loadAtlasSharedData();
  return cloneDeep((data as any)[name] || []);
}

export function getAtlasSharedBootstrapData() {
  const data = loadAtlasSharedData();
  const auditLogs = data.auditLogs.slice().sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  const divisionProfiles = buildDivisionProfiles(data);
  const dashboard = {
    metrics: [
      { label: "Revenue in pipeline", value: formatCurrency(sumRevenue(data.leads)), trend: `${countOpenLeads(data.leads)} open leads` },
      { label: "Approval items", value: String(countPendingApprovals(data.approvalQueue)), trend: `${countBlocked(data.tasks)} blocked tasks` },
      { label: "Open leads", value: String(countOpenLeads(data.leads)), trend: `${countApproved(data.leads)} approved` },
      { label: "Active divisions", value: String(data.divisions.length), trend: "all mapped" },
    ],
    focus: buildFocusCards(data),
    activity: buildActivityCards(data, auditLogs),
  };

  return {
    company: data.company,
    routes: data.routes,
    statusBadges: data.statusBadges,
    dashboard,
    ideaVault: {
      captureInbox: data.ideas.map((idea) => ({ idea: idea.title, source: idea.source || "ATLAS", status: idea.status, id: idea.id, distribution: idea.distribution || classifyIdeaIdea(idea) })),
      scoreQueue: data.ideas.map((idea) => ({ idea: idea.title, value: idea.value || "Medium", effort: idea.effort || "Medium", status: idea.status, id: idea.id })),
      items: data.ideas,
    },
    leads: {
      pipeline: data.leads.map((lead) => ({ name: lead.name || lead.title, stage: lead.stage || "Discovery", value: lead.value || "$0", status: lead.status, id: lead.id, fitScore: lead.fitScore || scoreLeadRecord(lead), offerMatch: lead.offerMatch || recommendOfferTier(lead.fitScore || scoreLeadRecord(lead)), platform: lead.platform || "", niche: lead.niche || "" })),
      items: data.leads,
    },
    contentOps: {
      queue: data.contentPackages.map((item) => ({ title: item.title, owner: item.owner || "ATLAS", status: item.status, channel: item.channel || "Internal", id: item.id })),
      items: data.contentPackages,
    },
    grants: {
      pipeline: data.grants.map((grant) => ({ name: grant.title, agency: grant.agency || "Unknown", stage: grant.stage || "Draft", status: grant.status, id: grant.id, matchScore: grant.matchScore || 0 })),
      items: data.grants,
    },
    creatorLogistics: {
      board: data.tasks.map((task) => ({ client: task.owner || "ATLAS", deliverable: task.title, status: task.status, due: task.due || "Today", id: task.id, area: task.area || "Operations" })),
      items: data.tasks,
    },
    divisions: divisionProfiles,
    companyFlowchart: {
      parent: data.company.parent,
      branches: divisionProfiles.map((division) => ({ name: division.name, owner: division.owner, status: division.status })),
    },
    settings: {
      guardrails: data.guardrails,
      connections: data.connections,
    },
    approvalQueue: {
      items: data.approvalQueue.map((item) => ({ item: item.title, reason: item.reason, status: item.status, id: item.id, collection: item.collection, itemId: item.itemId, type: item.type || "Email", division: item.division || "ATLAS OS", generatedContent: item.generatedContent || "", riskLevel: item.riskLevel || "Medium", revenuePotential: item.revenuePotential || "Medium", history: item.history || [] })),
    },
    auditLogs,
    backendGaps: data.backendGaps,
    collections: {
      ideas: data.ideas,
      leads: data.leads,
      tasks: data.tasks,
      divisions: data.divisions,
      contentPackages: data.contentPackages,
      grants: data.grants,
      approvalQueue: data.approvalQueue,
      auditLogs,
    },
  };
}

export function recordAtlasAuditEvent(eventType: AtlasAuditEventType, collection: Exclude<AtlasSharedCollectionName, "auditLogs">, item: any, actor: string, note?: string, payload?: Record<string, unknown>) {
  const data = loadAtlasSharedData();
  const entry = appendAtlasAuditEvent(data, eventType, collection, item, actor, note, payload);
  saveAtlasSharedData(data);
  return entry;
}

function appendAtlasAuditEvent(data: AtlasSharedData, eventType: AtlasAuditEventType, collection: Exclude<AtlasSharedCollectionName, "auditLogs">, item: any, actor: string, note?: string, payload?: Record<string, unknown>) {
  const entry: AtlasAuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    eventType,
    collection,
    itemId: String(item.id || item.name || item.title || item.label || "item"),
    itemLabel: getLabel(item),
    actor,
    timestamp: new Date().toISOString(),
    note,
    payload,
  };
  data.auditLogs.push(entry);
  return entry;
}

function appendItemHistory(item: any, action: string, actor: string, note?: string) {
  if (!item.history) item.history = [];
  item.history.push({
    action,
    actor,
    note,
    status: item.status,
    timestamp: new Date().toISOString(),
  });
}

export function createAtlasSharedRecord(collection: Exclude<AtlasSharedCollectionName, "auditLogs">, record: any, actor: string = "ATLAS") {
  const data = loadAtlasSharedData();
  const next = cloneDeep(record || {});
  const item = {
    ...next,
    id: next.id || `${collection.slice(0, 3)}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    status: next.status || getCollectionStatusDefault(collection),
    createdAt: next.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  appendItemHistory(item, "Created", actor, "Record created");
  (data as any)[collection].push(item);
  appendAtlasAuditEvent(data, "Item Created", collection, item, actor);
  saveAtlasSharedData(data);
  return item;
}

export function updateAtlasSharedRecord(collection: Exclude<AtlasSharedCollectionName, "auditLogs">, id: string, patch: Record<string, unknown>, actor: string = "ATLAS") {
  const data = loadAtlasSharedData();
  const items = (data as any)[collection] as any[];
  const item = items.find((entry) => String(entry.id) === String(id));
  if (!item) throw new Error(`${collection} item ${id} not found.`);
  Object.assign(item, patch, { updatedAt: new Date().toISOString() });
  appendItemHistory(item, "Updated", actor, "Record updated");
  appendAtlasAuditEvent(data, "Item Updated", collection, item, actor, undefined, patch);
  saveAtlasSharedData(data);
  return item;
}

export function approveAtlasSharedRecord(collection: Exclude<AtlasSharedCollectionName, "auditLogs">, id: string, actor: string = "ATLAS") {
  const item = updateAtlasSharedRecord(collection, id, { status: "Approved" }, actor);
  const data = loadAtlasSharedData();
  appendItemHistory(item, "Approved", actor, "Approved by reviewer");
  appendAtlasAuditEvent(data, "Item Approved", collection, item, actor);
  saveAtlasSharedData(data);
  return item;
}

export function rejectAtlasSharedRecord(collection: Exclude<AtlasSharedCollectionName, "auditLogs">, id: string, note: string = "Rejected", actor: string = "ATLAS") {
  const item = updateAtlasSharedRecord(collection, id, { status: "Blocked", rejectionNote: note }, actor);
  const data = loadAtlasSharedData();
  appendItemHistory(item, "Rejected", actor, note);
  appendAtlasAuditEvent(data, "Item Rejected", collection, item, actor, note);
  saveAtlasSharedData(data);
  return item;
}

export function exportAtlasSharedRecord(collection: Exclude<AtlasSharedCollectionName, "auditLogs">, id: string, actor: string = "ATLAS") {
  const item = updateAtlasSharedRecord(collection, id, { status: "Sent", exportedAt: new Date().toISOString() }, actor);
  const data = loadAtlasSharedData();
  appendItemHistory(item, "Exported", actor, "Exported externally");
  appendAtlasAuditEvent(data, "Item Exported", collection, item, actor);
  saveAtlasSharedData(data);
  return item;
}

function sumRevenue(leads: any[]) {
  return leads.reduce((total, lead) => total + parseMoney(lead.value), 0);
}

function parseMoney(value: any) {
  const numeric = Number(String(value || "").replace(/[^0-9.]+/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function countPendingApprovals(items: any[]) {
  return items.filter((item) => /pending/i.test(String(item.status || ""))).length;
}

function countBlocked(tasks: any[]) {
  return tasks.filter((task) => /blocked/i.test(String(task.status || ""))).length;
}

function countOpenLeads(leads: any[]) {
  return leads.filter((lead) => !/sent|won/i.test(String(lead.status || ""))).length;
}

function countApproved(items: any[]) {
  return items.filter((item) => /approved/i.test(String(item.status || ""))).length;
}

function buildFocusCards(data: AtlasSharedData) {
  const approvalFocus = data.approvalQueue.filter((item) => /pending|blocked|draft/i.test(String(item.status || ""))).slice(0, 2);
  const taskFocus = data.tasks.filter((item) => /blocked|pending/i.test(String(item.status || ""))).slice(0, 2);
  const grantFocus = data.grants.filter((item) => /draft|review/i.test(String(item.status || ""))).slice(0, 1);
  const combined: Array<{ title: string; status: string; note: string }> = [];

  approvalFocus.forEach((item) => combined.push({ title: item.title, status: item.status, note: item.reason }));
  taskFocus.forEach((item) => combined.push({ title: item.title, status: item.status, note: item.owner || "Task" }));
  grantFocus.forEach((item) => combined.push({ title: item.title, status: item.status, note: item.agency || "Grant" }));

  return combined.slice(0, 3);
}

function buildActivityCards(data: AtlasSharedData, auditLogs: AtlasAuditLogEntry[]) {
  const source = auditLogs.length ? auditLogs : defaultActivityFromCollections(data);
  return source.slice(0, 4).map((entry) => ({
    time: formatTime(entry.timestamp),
    item: `${entry.eventType}: ${entry.itemLabel}`,
    status: entry.collection === "approvalQueue" ? "Pending Approval" : "Approved",
  }));
}

function defaultActivityFromCollections(data: AtlasSharedData): AtlasAuditLogEntry[] {
  return [
    { id: "activity-1", eventType: "Item Created", collection: "ideas", itemId: "idea-1", itemLabel: data.ideas[0] ? data.ideas[0].title : "Idea", actor: "ATLAS", timestamp: data.ideas[0] ? data.ideas[0].createdAt : new Date().toISOString() },
    { id: "activity-2", eventType: "Item Updated", collection: "leads", itemId: "lead-1", itemLabel: data.leads[0] ? data.leads[0].name : "Lead", actor: "ATLAS", timestamp: data.leads[0] ? data.leads[0].updatedAt : new Date().toISOString() },
    { id: "activity-3", eventType: "Item Approved", collection: "contentPackages", itemId: "content-3", itemLabel: data.contentPackages[2] ? data.contentPackages[2].title : "Content", actor: "ATLAS", timestamp: data.contentPackages[2] ? data.contentPackages[2].updatedAt : new Date().toISOString() },
    { id: "activity-4", eventType: "Item Exported", collection: "grants", itemId: "grant-3", itemLabel: data.grants[2] ? data.grants[2].title : "Grant", actor: "ATLAS", timestamp: data.grants[2] ? data.grants[2].updatedAt : new Date().toISOString() },
  ];
}

function formatCurrency(amount: number) {
  return `$${(amount / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

function formatTime(iso: string) {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "00:00";
  return date.toTimeString().slice(0, 5);
}
