const fs = require("fs");
const path = require("path");

const SHARED_DATA_PATH = path.resolve(__dirname, "..", "..", "atlas_ops", "logs", "atlas_shared_data.json");
const LEGACY_BOOTSTRAP_PATH = path.join(__dirname, "data.json");
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
const STATUS_BADGES = ["Draft", "Pending Approval", "Approved", "Sent", "Blocked"];
const DIVISION_BLUEPRINTS = [
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultSharedData() {
  return {
    company: {
      parent: "Avery Industries LLC",
      brand: "ATLAS Command Center",
      tagline: "Professional AI operations for revenue, approvals, ideas, and division control.",
      mode: "Mock backend active until real APIs are connected.",
    },
    routes: ROUTES,
    statusBadges: STATUS_BADGES,
    ideas: [],
    leads: [],
    tasks: [],
    divisions: [],
    contentPackages: [],
    grants: [],
    approvalQueue: [],
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
}

function loadLegacyBootstrap() {
  if (!fs.existsSync(LEGACY_BOOTSTRAP_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(LEGACY_BOOTSTRAP_PATH, "utf8"));
  } catch (_error) {
    return null;
  }
}

function legacyToSharedData(legacy) {
  const data = defaultSharedData();
  if (legacy && legacy.company) data.company = { ...data.company, ...legacy.company };
  if (legacy && Array.isArray(legacy.routes)) data.routes = legacy.routes;
  if (legacy && Array.isArray(legacy.statusBadges)) data.statusBadges = legacy.statusBadges;
  if (legacy && legacy.ideaVault) {
    data.ideas = (legacy.ideaVault.captureInbox || []).map((item, index) => ({
      id: `idea-${index + 1}`,
      title: item.idea,
      source: item.source,
      value: item.value || "Medium",
      effort: item.effort || "Medium",
      status: item.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
  if (legacy && legacy.leads && Array.isArray(legacy.leads.pipeline)) {
    data.leads = legacy.leads.pipeline.map((item, index) => ({
      id: `lead-${index + 1}`,
      name: item.name,
      stage: item.stage,
      value: item.value,
      status: item.status,
      platform: item.platform || "",
      url: item.url || "",
      niche: item.niche || "",
      fitScore: item.fitScore || 0,
      painPoints: item.painPoints || [],
      offerMatch: item.offerMatch || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
  if (legacy && legacy.contentOps) {
    data.contentPackages = (legacy.contentOps.queue || []).map((item, index) => ({
      id: `content-${index + 1}`,
      title: item.title,
      owner: item.owner,
      channel: item.channel,
      status: item.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
  if (legacy && legacy.grants) {
    data.grants = (legacy.grants.pipeline || []).map((item, index) => ({
      id: `grant-${index + 1}`,
      title: item.name,
      agency: item.agency,
      stage: item.stage,
      status: item.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
  if (legacy && legacy.creatorLogistics) {
    data.tasks = data.tasks.concat((legacy.creatorLogistics.board || []).map((item, index) => ({
      id: `task-cl-${index + 1}`,
      title: item.deliverable,
      owner: item.client,
      priority: item.status,
      status: item.status,
      due: item.due,
      area: "Creator Logistics",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })));
  }
  if (legacy && legacy.divisions) data.divisions = legacy.divisions;
  if (legacy && legacy.approvalQueue) {
    data.approvalQueue = (legacy.approvalQueue.items || []).map((item, index) => ({
      id: `approval-${index + 1}`,
      title: item.item,
      reason: item.reason,
      status: item.status,
      collection: item.collection || inferCollectionFromApprovalTitle(item.item),
      itemId: item.itemId || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
  if (legacy && legacy.settings) {
    data.guardrails = legacy.settings.guardrails || data.guardrails;
    data.connections = legacy.settings.connections || data.connections;
  }
  if (legacy && Array.isArray(legacy.backendGaps)) data.backendGaps = legacy.backendGaps;
  return data;
}

function inferCollectionFromApprovalTitle(title) {
  const text = String(title || "").toLowerCase();
  if (text.indexOf("grant") >= 0) return "grants";
  if (text.indexOf("invoice") >= 0 || text.indexOf("lead") >= 0 || text.indexOf("reply") >= 0) return "leads";
  if (text.indexOf("proposal") >= 0 || text.indexOf("content") >= 0 || text.indexOf("post") >= 0 || text.indexOf("delivery") >= 0) return "contentPackages";
  return "contentPackages";
}

function normalizeData(data) {
  const base = defaultSharedData();
  const next = data ? clone(data) : base;
  if (!Array.isArray(next.routes)) next.routes = base.routes;
  if (!Array.isArray(next.statusBadges)) next.statusBadges = base.statusBadges;
  if (!Array.isArray(next.ideas)) next.ideas = [];
  if (!Array.isArray(next.leads)) next.leads = [];
  if (!Array.isArray(next.tasks)) next.tasks = [];
  if (!Array.isArray(next.divisions)) next.divisions = [];
  if (!Array.isArray(next.contentPackages)) next.contentPackages = [];
  if (!Array.isArray(next.grants)) next.grants = [];
  if (!Array.isArray(next.approvalQueue)) next.approvalQueue = [];
  if (!Array.isArray(next.auditLogs)) next.auditLogs = [];
  if (!Array.isArray(next.guardrails)) next.guardrails = base.guardrails;
  if (!Array.isArray(next.connections)) next.connections = base.connections;
  if (!Array.isArray(next.backendGaps)) next.backendGaps = base.backendGaps;
  next.company = { ...base.company, ...(next.company || {}) };
  return next;
}

function loadAtlasSharedData() {
  if (fs.existsSync(SHARED_DATA_PATH)) {
    try {
      return normalizeData(JSON.parse(fs.readFileSync(SHARED_DATA_PATH, "utf8")));
    } catch (_error) {
      return normalizeData(defaultSharedData());
    }
  }
  const legacy = loadLegacyBootstrap();
  return normalizeData(legacy ? legacyToSharedData(legacy) : defaultSharedData());
}

function saveAtlasSharedData(data) {
  const normalized = normalizeData(data);
  fs.mkdirSync(path.dirname(SHARED_DATA_PATH), { recursive: true });
  fs.writeFileSync(SHARED_DATA_PATH, JSON.stringify(normalized, null, 2));
  return normalized;
}

function collectionDefaultStatus(collection) {
  if (collection === "approvalQueue") return "Pending Approval";
  if (collection === "divisions") return "Active";
  return "Draft";
}

function labelFor(item) {
  return String(item && (item.title || item.name || item.item || item.label || item.id || "item"));
}

function appendAuditEvent(data, eventType, collection, item, actor, note, payload) {
  const entry = {
    id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    eventType,
    collection,
    itemId: String(item && (item.id || item.name || item.title || item.label || "item")),
    itemLabel: labelFor(item),
    actor: actor || "ATLAS",
    timestamp: new Date().toISOString(),
  };
  if (note) entry.note = note;
  if (payload) entry.payload = payload;
  data.auditLogs.push(entry);
  return entry;
}

function appendItemHistory(item, action, actor, note) {
  if (!item.history) item.history = [];
  item.history.push({
    action,
    actor,
    note,
    status: item.status,
    timestamp: new Date().toISOString(),
  });
}

function recordAtlasAuditEvent(eventType, collection, item, actor, note, payload) {
  const data = loadAtlasSharedData();
  const entry = appendAuditEvent(data, eventType, collection, item, actor, note, payload);
  saveAtlasSharedData(data);
  return entry;
}

function classifyIdeaIdea(idea) {
  const text = `${idea.title || ""} ${idea.rawNote || idea.description || ""} ${idea.category || ""} ${idea.relatedDivision || ""}`.toLowerCase();
  const distributions = {
    contentIdeas: [],
    productIdeas: [],
    marketingAngles: [],
    grantOpportunities: [],
    socialPosts: [],
    codexTasks: [],
    cursorTasks: [],
    salesOffers: [],
    risks: [],
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
  distributions.nextAction = distributions.codexTasks[0] || distributions.cursorTasks[0] || "Write a one-paragraph next step.";
  return distributions;
}

function createIdeaRecord(record, actor) {
  const data = loadAtlasSharedData();
  const item = {
    id: record.id || `idea-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: record.title,
    rawNote: record.rawNote || record.description || "",
    category: record.category || "Content",
    urgency: record.urgency || 3,
    revenuePotential: record.revenuePotential || 3,
    relatedDivision: record.relatedDivision || "ATLAS OS",
    source: record.source || "manual",
    status: record.status || "Draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    distribution: classifyIdeaIdea(record),
  };
  appendItemHistory(item, "Created", actor || "ATLAS", "Idea captured");
  data.ideas.push(item);
  appendAuditEvent(data, "Item Created", "ideas", item, actor || "ATLAS", "Idea captured");
  saveAtlasSharedData(data);
  return item;
}

function createLeadRecord(record, actor) {
  const data = loadAtlasSharedData();
  const fitScore = typeof record.fitScore === "number" ? record.fitScore : scoreLeadRecord(record);
  const item = {
    id: record.id || `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`,
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  appendItemHistory(item, "Created", actor || "ATLAS", "Lead captured");
  data.leads.push(item);
  appendAuditEvent(data, "Item Created", "leads", item, actor || "ATLAS", "Lead captured");
  saveAtlasSharedData(data);
  return item;
}

function scoreLeadRecord(record) {
  var score = 1;
  var text = `${record.platform || ""} ${record.niche || ""} ${record.painPoints ? record.painPoints.join(" ") : ""} ${record.notes || ""}`.toLowerCase();
  if (/editing|edit|footage|clip/.test(text)) score += 2;
  if (/short|shorts|reels|tiktok|upload/.test(text)) score += 2;
  if (/budget|paid|budgeted|monthly|retainer/.test(text)) score += 2;
  if (/brand|creator|channel|youtube/.test(text)) score += 1;
  if (/consistent|weekly|daily|regular/.test(text)) score += 1;
  if (/monet|revenue|growth|scale/.test(text)) score += 1;
  return Math.max(1, Math.min(10, score));
}

function recommendOfferTier(score) {
  if (score >= 8) return "Full Media Infrastructure";
  if (score >= 6) return "Channel Expansion System";
  return "Growth Partner";
}

function buildDivisionProfiles(data) {
  return DIVISION_BLUEPRINTS.map((blueprint) => {
    const existing = data.divisions.find((division) => String(division.name) === blueprint.name) || {};
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

function createTaskRecord(record, actor) {
  const data = loadAtlasSharedData();
  const item = {
    id: record.id || `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: record.title,
    owner: record.owner || record.division || "ATLAS OS",
    priority: record.priority || "Draft",
    status: record.status || "Draft",
    area: record.area || "Operations",
    due: record.due || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  appendItemHistory(item, "Created", actor || "ATLAS", "Task created");
  data.tasks.push(item);
  appendAuditEvent(data, "Item Created", "tasks", item, actor || "ATLAS", "Task created");
  saveAtlasSharedData(data);
  return item;
}

function createContentPackageRecord(record, actor) {
  const data = loadAtlasSharedData();
  const item = {
    id: record.id || `content-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: record.title,
    owner: record.owner || "ATLAS OS",
    channel: record.channel || "Internal",
    platform: record.platform || "",
    tone: record.tone || "",
    audience: record.audience || "",
    goal: record.goal || "",
    status: record.status || "Draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  appendItemHistory(item, "Created", actor || "ATLAS", "Content package created");
  data.contentPackages.push(item);
  appendAuditEvent(data, "Item Created", "contentPackages", item, actor || "ATLAS", "Content package created");
  saveAtlasSharedData(data);
  return item;
}

function createGrantRecord(record, actor) {
  const data = loadAtlasSharedData();
  const item = {
    id: record.id || `grant-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: record.title,
    agency: record.agency || record.source || "",
    stage: record.stage || "Draft",
    amount: record.amount || "",
    eligibility: record.eligibility || "",
    requiredDocuments: record.requiredDocuments || [],
    status: record.status || "Draft",
    matchScore: record.matchScore || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  appendItemHistory(item, "Created", actor || "ATLAS", "Grant created");
  data.grants.push(item);
  appendAuditEvent(data, "Item Created", "grants", item, actor || "ATLAS", "Grant created");
  saveAtlasSharedData(data);
  return item;
}

function createApprovalRecord(record, actor) {
  const data = loadAtlasSharedData();
  const item = {
    id: record.id || `approval-${Date.now()}-${Math.random().toString(16).slice(2)}`,
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  appendItemHistory(item, "Created", actor || "ATLAS", "Approval queued");
  data.approvalQueue.push(item);
  appendAuditEvent(data, "Item Created", "approvalQueue", item, actor || "ATLAS", "Approval queued");
  saveAtlasSharedData(data);
  return item;
}

function createContentFromIdea(idea, actor) {
  return createContentPackageRecord({
    title: `${idea.title} content package`,
    owner: idea.relatedDivision || "ATLAS OS",
    channel: "Internal",
    platform: "Multi-platform",
    tone: "Executive",
    audience: "Founder audience",
    goal: "Turn idea into content",
    status: "Draft",
  }, actor || "ATLAS");
}

function createLeadDrafts(lead, actor) {
  const offer = lead.offerMatch || recommendOfferTier(lead.fitScore || scoreLeadRecord(lead));
  return {
    emailDraft: `Hi ${lead.name}, ATLAS noticed your ${lead.platform || "channel"} and thinks ${offer} may be a fit. This is a draft pending approval.`,
    dmDraft: `Hey ${lead.name}, I noticed your work and drafted a Creator Logistics approach. Cole will review before anything is sent.`,
    followUpDraft: `Quick follow-up draft for ${lead.name}: stay warm, keep it short, and wait for approval.`,
    proposalSummary: `${lead.name} appears to fit ${offer}. Fit score: ${lead.fitScore || scoreLeadRecord(lead)}/10.`,
    approvalRequired: true,
    offer,
    revenuePotential: offer === "Full Media Infrastructure" ? "$12,500+/mo" : offer === "Channel Expansion System" ? "$7,500/mo" : "$3,500/mo",
  };
}

function generateGrantChecklist(record) {
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

function generateContentPackageForIdea(idea) {
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

function createAtlasSharedRecord(collection, record, actor) {
  const data = loadAtlasSharedData();
  const next = { ...(record || {}) };
  const item = {
    ...next,
    id: next.id || `${collection.slice(0, 3)}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    status: next.status || collectionDefaultStatus(collection),
    createdAt: next.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data[collection].push(item);
  appendAuditEvent(data, "Item Created", collection, item, actor || "ATLAS");
  saveAtlasSharedData(data);
  return item;
}

function updateAtlasSharedRecord(collection, id, patch, actor) {
  const data = loadAtlasSharedData();
  const items = data[collection];
  const item = items.find((entry) => String(entry.id) === String(id));
  if (!item) throw new Error(`${collection} item ${id} not found.`);
  Object.assign(item, patch || {}, { updatedAt: new Date().toISOString() });
  appendItemHistory(item, "Updated", actor || "ATLAS", "Record updated");
  appendAuditEvent(data, "Item Updated", collection, item, actor || "ATLAS", undefined, patch || {});
  saveAtlasSharedData(data);
  return item;
}

function approveAtlasSharedRecord(collection, id, actor) {
  const item = updateAtlasSharedRecord(collection, id, { status: "Approved" }, actor);
  const data = loadAtlasSharedData();
  appendItemHistory(item, "Approved", actor || "ATLAS", "Approved by reviewer");
  appendAuditEvent(data, "Item Approved", collection, item, actor || "ATLAS");
  saveAtlasSharedData(data);
  return item;
}

function rejectAtlasSharedRecord(collection, id, note, actor) {
  const item = updateAtlasSharedRecord(collection, id, { status: "Blocked", rejectionNote: note || "Rejected" }, actor);
  const data = loadAtlasSharedData();
  appendItemHistory(item, "Rejected", actor || "ATLAS", note || "Rejected");
  appendAuditEvent(data, "Item Rejected", collection, item, actor || "ATLAS", note || "Rejected");
  saveAtlasSharedData(data);
  return item;
}

function exportAtlasSharedRecord(collection, id, actor) {
  const item = updateAtlasSharedRecord(collection, id, { status: "Sent", exportedAt: new Date().toISOString() }, actor);
  const data = loadAtlasSharedData();
  appendItemHistory(item, "Exported", actor || "ATLAS", "Exported externally");
  appendAuditEvent(data, "Item Exported", collection, item, actor || "ATLAS");
  saveAtlasSharedData(data);
  return item;
}

function getAtlasSharedBootstrapData() {
  const data = loadAtlasSharedData();
  const auditLogs = data.auditLogs.slice().sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  const divisionProfiles = buildDivisionProfiles(data);
  return {
    company: data.company,
    routes: data.routes,
    statusBadges: data.statusBadges,
    dashboard: {
      metrics: [
        { label: "Revenue in pipeline", value: formatCurrency(sumRevenue(data.leads)), trend: `${countOpenLeads(data.leads)} open leads` },
        { label: "Approval items", value: String(countPendingApprovals(data.approvalQueue)), trend: `${countBlocked(data.tasks)} blocked tasks` },
        { label: "Open leads", value: String(countOpenLeads(data.leads)), trend: `${countApproved(data.leads)} approved` },
        { label: "Active divisions", value: String(data.divisions.length), trend: "all mapped" },
      ],
      focus: buildFocusCards(data),
      activity: buildActivityCards(data, auditLogs),
    },
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

function getAtlasCollection(name) {
  const data = loadAtlasSharedData();
  return clone(data[name] || []);
}

function sumRevenue(leads) {
  return leads.reduce((total, lead) => total + parseMoney(lead.value), 0);
}

function parseMoney(value) {
  const numeric = Number(String(value || "").replace(/[^0-9.]+/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function countPendingApprovals(items) {
  return items.filter((item) => /pending/i.test(String(item.status || ""))).length;
}

function countBlocked(tasks) {
  return tasks.filter((task) => /blocked/i.test(String(task.status || ""))).length;
}

function countOpenLeads(leads) {
  return leads.filter((lead) => !/sent|won/i.test(String(lead.status || ""))).length;
}

function countApproved(items) {
  return items.filter((item) => /approved/i.test(String(item.status || ""))).length;
}

function buildFocusCards(data) {
  const approvalFocus = data.approvalQueue.filter((item) => /pending|blocked|draft/i.test(String(item.status || ""))).slice(0, 2);
  const taskFocus = data.tasks.filter((item) => /blocked|pending/i.test(String(item.status || ""))).slice(0, 2);
  const grantFocus = data.grants.filter((item) => /draft|review/i.test(String(item.status || ""))).slice(0, 1);
  const combined = [];

  approvalFocus.forEach((item) => combined.push({ title: item.title, status: item.status, note: item.reason }));
  taskFocus.forEach((item) => combined.push({ title: item.title, status: item.status, note: item.owner || "Task" }));
  grantFocus.forEach((item) => combined.push({ title: item.title, status: item.status, note: item.agency || "Grant" }));

  return combined.slice(0, 3);
}

function buildActivityCards(data, auditLogs) {
  const source = auditLogs.length ? auditLogs : defaultActivityFromCollections(data);
  return source.slice(0, 4).map((entry) => ({
    time: formatTime(entry.timestamp),
    item: `${entry.eventType}: ${entry.itemLabel}`,
    status: entry.collection === "approvalQueue" ? "Pending Approval" : "Approved",
  }));
}

function defaultActivityFromCollections(data) {
  const now = new Date().toISOString();
  return [
    { id: "activity-1", eventType: "Item Created", collection: "ideas", itemId: "idea-1", itemLabel: data.ideas[0] ? data.ideas[0].title : "Idea", actor: "ATLAS", timestamp: data.ideas[0] ? data.ideas[0].createdAt : now },
    { id: "activity-2", eventType: "Item Updated", collection: "leads", itemId: "lead-1", itemLabel: data.leads[0] ? data.leads[0].name : "Lead", actor: "ATLAS", timestamp: data.leads[0] ? data.leads[0].updatedAt : now },
    { id: "activity-3", eventType: "Item Approved", collection: "contentPackages", itemId: "content-3", itemLabel: data.contentPackages[2] ? data.contentPackages[2].title : "Content", actor: "ATLAS", timestamp: data.contentPackages[2] ? data.contentPackages[2].updatedAt : now },
    { id: "activity-4", eventType: "Item Exported", collection: "grants", itemId: "grant-3", itemLabel: data.grants[2] ? data.grants[2].title : "Grant", actor: "ATLAS", timestamp: data.grants[2] ? data.grants[2].updatedAt : now },
  ];
}

function formatCurrency(amount) {
  return `$${(amount / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

function formatTime(iso) {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "00:00";
  return date.toTimeString().slice(0, 5);
}

function getCollectionNameFromPath(pathname) {
  const normalized = String(pathname || "").replace(/^\/api\//, "").replace(/\/+$/, "");
  if (normalized === "approval-queue") return "approvalQueue";
  if (normalized === "content-packages") return "contentPackages";
  if (normalized === "audit-logs") return "auditLogs";
  if (normalized === "ideas") return "ideas";
  if (normalized === "leads") return "leads";
  if (normalized === "tasks") return "tasks";
  if (normalized === "divisions") return "divisions";
  if (normalized === "grants") return "grants";
  return "";
}

module.exports = {
  SHARED_DATA_PATH,
  ROUTES,
  STATUS_BADGES,
  loadAtlasSharedData,
  saveAtlasSharedData,
  getAtlasSharedBootstrapData,
  getAtlasCollection,
  createIdeaRecord,
  createLeadRecord,
  createTaskRecord,
  createContentPackageRecord,
  createGrantRecord,
  createApprovalRecord,
  createAtlasSharedRecord,
  updateAtlasSharedRecord,
  approveAtlasSharedRecord,
  rejectAtlasSharedRecord,
  exportAtlasSharedRecord,
  recordAtlasAuditEvent,
  scoreLeadRecord,
  recommendOfferTier,
  createLeadDrafts,
  generateContentPackageForIdea,
  createContentFromIdea,
  generateGrantChecklist,
  getCollectionNameFromPath,
  defaultSharedData,
};
