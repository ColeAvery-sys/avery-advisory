const ROUTE_FALLBACK = "/dashboard";

function slug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function badgeClass(status) {
  return slug(status);
}

function badgeHtml(status) {
  return `<span class="badge ${badgeClass(status)}">${escapeHtml(status)}</span>`;
}

function tableHtml(columns, rows) {
  const head = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const body = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("");

  return `
    <div class="route-table">
      <table class="table">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

function cardGrid(items) {
  return `<section class="compact-grid">${items.join("")}</section>`;
}

function cardHtml(title, body, status, extra) {
  return `
    <article class="card">
      <div class="section-title">
        <h3>${escapeHtml(title)}</h3>
        ${status ? badgeHtml(status) : ""}
      </div>
      <p>${escapeHtml(body)}</p>
      ${extra ? `<div class="card-extra">${extra}</div>` : ""}
    </article>
  `;
}

function renderFormField(label, name, value, type = "text", placeholder = "") {
  const field = type === "textarea"
    ? `<textarea name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value || "")}</textarea>`
    : type === "select"
      ? String(value || "")
      : `<input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value || "")}" placeholder="${escapeHtml(placeholder)}">`;

  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      ${field}
    </label>
  `;
}

function renderFormAction(label, action, kind = "submit") {
  return `<button type="${kind}" data-action="${escapeHtml(action)}">${escapeHtml(label)}</button>`;
}

function renderPreviewJson(value) {
  return `<pre class="json-preview">${escapeHtml(JSON.stringify(value, null, 2))}</pre>`;
}

function defaultCollections() {
  return {
    ideas: [],
    leads: [],
    tasks: [],
    divisions: [],
    contentPackages: [],
    grants: [],
    approvalQueue: [],
    auditLogs: [],
  };
}

function buildLegacyCollections(data) {
  const collections = defaultCollections();
  collections.ideas = ((data.ideaVault && data.ideaVault.captureInbox) || []).map((item, index) => ({
    id: item.id || `idea-${index + 1}`,
    title: item.idea,
    source: item.source || "ATLAS",
    status: item.status || "Draft",
    value: item.value || "Medium",
    effort: item.effort || "Medium",
    distribution: item.distribution || {},
  }));
  collections.leads = ((data.leads && data.leads.pipeline) || []).map((item, index) => ({
    id: item.id || `lead-${index + 1}`,
    name: item.name,
    stage: item.stage || "Discovery",
    value: item.value || "$0",
    status: item.status || "Draft",
    platform: item.platform || "",
    niche: item.niche || "",
    fitScore: item.fitScore || 0,
    offerMatch: item.offerMatch || "",
    painPoints: item.painPoints || [],
  }));
  collections.tasks = ((data.creatorLogistics && data.creatorLogistics.board) || []).map((item, index) => ({
    id: item.id || `task-${index + 1}`,
    title: item.deliverable,
    owner: item.client,
    due: item.due || "Today",
    status: item.status || "Draft",
    area: item.area || "Operations",
  }));
  collections.divisions = Array.isArray(data.divisions) ? data.divisions : [];
  collections.contentPackages = ((data.contentOps && data.contentOps.queue) || []).map((item, index) => ({
    id: item.id || `content-${index + 1}`,
    title: item.title,
    owner: item.owner || "ATLAS",
    channel: item.channel || "Internal",
    status: item.status || "Draft",
    platform: item.platform || "",
    tone: item.tone || "",
    audience: item.audience || "",
    goal: item.goal || "",
  }));
  collections.grants = ((data.grants && data.grants.pipeline) || []).map((item, index) => ({
    id: item.id || `grant-${index + 1}`,
    title: item.name,
    agency: item.agency || "Unknown",
    stage: item.stage || "Draft",
    status: item.status || "Draft",
    amount: item.amount || "",
    eligibility: item.eligibility || "",
    requiredDocuments: item.requiredDocuments || [],
  }));
  collections.approvalQueue = ((data.approvalQueue && data.approvalQueue.items) || []).map((item, index) => ({
    id: item.id || `approval-${index + 1}`,
    title: item.item,
    reason: item.reason || "",
    status: item.status || "Pending Approval",
    collection: item.collection || "contentPackages",
    itemId: item.itemId || "",
    type: item.type || "Email",
    division: item.division || "ATLAS OS",
    generatedContent: item.generatedContent || "",
    riskLevel: item.riskLevel || "Medium",
    revenuePotential: item.revenuePotential || "Medium",
    history: item.history || [],
  }));
  collections.auditLogs = Array.isArray(data.auditLogs) ? data.auditLogs : [];
  return collections;
}

function normalizeBootstrapData(raw) {
  const data = raw || {};
  const collections = data.collections || buildLegacyCollections(data) || defaultCollections();
  const company = {
    parent: (data.company && data.company.parent) || "Avery Industries LLC",
    brand: (data.company && data.company.brand) || "ATLAS Command Center",
    tagline: (data.company && data.company.tagline) || "Professional AI operations for revenue, approvals, ideas, and division control.",
    mode: (data.company && data.company.mode) || "Mock backend active until real APIs are connected.",
  };
  const routes = Array.isArray(data.routes) && data.routes.length ? data.routes : [
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

  const ideaVault = data.ideaVault || {
    captureInbox: collections.ideas.map((item) => ({ idea: item.title, source: item.source || "ATLAS", status: item.status, id: item.id, distribution: item.distribution || {} })),
    scoreQueue: collections.ideas.map((item) => ({ idea: item.title, value: item.value || "Medium", effort: item.effort || "Medium", status: item.status, id: item.id })),
    items: collections.ideas,
  };
  const leads = data.leads || {
    pipeline: collections.leads.map((item) => ({ name: item.name, stage: item.stage, value: item.value, status: item.status, id: item.id, platform: item.platform, niche: item.niche, fitScore: item.fitScore, offerMatch: item.offerMatch })),
    items: collections.leads,
  };
  const contentOps = data.contentOps || {
    queue: collections.contentPackages.map((item) => ({ title: item.title, owner: item.owner, status: item.status, channel: item.channel, id: item.id })),
    items: collections.contentPackages,
  };
  const grants = data.grants || {
    pipeline: collections.grants.map((item) => ({ name: item.title, agency: item.agency, stage: item.stage, status: item.status, id: item.id })),
    items: collections.grants,
  };
  const creatorLogistics = data.creatorLogistics || {
    board: collections.tasks.map((item) => ({ client: item.owner, deliverable: item.title, status: item.status, due: item.due, id: item.id, area: item.area })),
    items: collections.tasks,
  };
  const divisions = Array.isArray(data.divisions) && data.divisions.length ? data.divisions : collections.divisions;
  const approvalQueue = data.approvalQueue || {
    items: collections.approvalQueue.map((item) => ({
      item: item.title,
      reason: item.reason,
      status: item.status,
      id: item.id,
      collection: item.collection,
      itemId: item.itemId,
      type: item.type,
      division: item.division,
      generatedContent: item.generatedContent,
      riskLevel: item.riskLevel,
      revenuePotential: item.revenuePotential,
      history: item.history || [],
    })),
  };
  const companyFlowchart = data.companyFlowchart || {
    parent: company.parent,
    branches: divisions.map((division) => ({ name: division.name, owner: division.owner || "", status: division.status || "Active" })),
  };
  const dashboard = data.dashboard || {
    metrics: [
      { label: "Revenue in pipeline", value: "$0", trend: "fallback" },
      { label: "Approval items", value: "0", trend: "fallback" },
      { label: "Open leads", value: "0", trend: "fallback" },
      { label: "Active divisions", value: String(divisions.length || 0), trend: "all mapped" },
    ],
    focus: [],
    activity: [],
  };
  const settings = data.settings || {
    guardrails: data.guardrails || [],
    connections: data.connections || [],
  };

  return {
    ...data,
    company,
    routes,
    statusBadges: Array.isArray(data.statusBadges) && data.statusBadges.length ? data.statusBadges : ["Draft", "Pending Approval", "Approved", "Sent", "Blocked"],
    dashboard,
    ideaVault,
    leads,
    contentOps,
    grants,
    creatorLogistics,
    divisions,
    companyFlowchart,
    settings,
    approvalQueue,
    backendGaps: data.backendGaps || [],
    collections,
  };
}

async function loadBootstrapData() {
  try {
    const response = await fetch("./api/bootstrap", { cache: "no-store" });
    if (!response.ok) throw new Error(`bootstrap request failed: ${response.status}`);
    return normalizeBootstrapData(await response.json());
  } catch (error) {
    console.warn("ATLAS Command Center using fallback bootstrap data.", error);
    try {
      const fallback = await fetch("./data.json", { cache: "no-store" });
      if (fallback.ok) return normalizeBootstrapData(await fallback.json());
    } catch (_fallbackError) {}
    return normalizeBootstrapData({});
  }
}

function routeKeyFromPath(pathname) {
  const clean = String(pathname || "").replace(/\/+$/, "");
  const segments = clean.split("/").filter(Boolean);
  return segments.length ? `/${segments[segments.length - 1]}` : ROUTE_FALLBACK;
}

function renderNav(routes, currentPath) {
  return routes
    .map((route) => {
      const active = route.path === currentPath ? ' aria-current="page"' : "";
      return `<a href="${route.path}"${active}><span>${escapeHtml(route.label)}</span><span>${escapeHtml(route.description)}</span></a>`;
    })
    .join("");
}

function renderOverview(metrics) {
  return `
    <section class="route-overview" aria-label="Executive metrics">
      ${metrics
        .map(
          (metric) => `
            <article class="overview-card">
              <strong>${escapeHtml(metric.value)}</strong>
              <span>${escapeHtml(metric.label)}${metric.trend ? ` | ${escapeHtml(metric.trend)}` : ""}</span>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderDashboard(data) {
  return `
    <section class="route-header">
      <article class="route-summary">
        <h2>Dashboard</h2>
        <p>${escapeHtml(data.company.tagline)}</p>
        <div class="pill-row" style="margin-top:12px;">${data.statusBadges.map(badgeHtml).join("")}</div>
      </article>
      <article class="route-summary">
        <div class="route-meta">
          <p><strong>Parent company:</strong> ${escapeHtml(data.company.parent)}</p>
          <p><strong>Operating mode:</strong> ${escapeHtml(data.company.mode)}</p>
          <p><strong>Navigation:</strong> Revenue automation, approval gates, logging, and clean routing are first-class.</p>
        </div>
      </article>
    </section>

    ${renderOverview(data.dashboard.metrics)}

    <section class="dense-grid">
      <article class="panel">
        <div class="panel-header">
          <h2>Top focus</h2>
          <span class="badge muted">Today</span>
        </div>
        <div class="panel-body status-list">
          ${data.dashboard.focus
            .map(
              (item) => `
                <div class="status-row">
                  <div>
                    <strong>${escapeHtml(item.title)}</strong>
                    <small>${escapeHtml(item.note)}</small>
                  </div>
                  ${badgeHtml(item.status)}
                </div>
              `
            )
            .join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <h2>Activity log</h2>
          <span class="badge muted">Shared history</span>
        </div>
        <div class="panel-body status-list">
          ${data.dashboard.activity
            .map(
              (item) => `
                <div class="status-row">
                  <div>
                    <strong>${escapeHtml(item.time)}</strong>
                    <small>${escapeHtml(item.item)}</small>
                  </div>
                  ${badgeHtml(item.status)}
                </div>
              `
            )
            .join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <h2>Approval queue</h2>
          <span class="badge pending-approval">${data.approvalQueue.items.length} waiting</span>
        </div>
        <div class="panel-body status-list">
          ${data.approvalQueue.items
            .slice(0, 3)
            .map(
              (item) => `
                <div class="status-row">
                  <div>
                    <strong>${escapeHtml(item.item)}</strong>
                    <small>${escapeHtml(item.reason)}</small>
                  </div>
                  ${badgeHtml(item.status)}
                </div>
              `
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function renderIdeaVault(data) {
  const ideas = data.collections.ideas || [];
  return `
    <section class="route-header">
      <article class="route-summary">
        <h2>Idea Vault</h2>
        <p>Capture one raw idea, turn it into a distribution package, and keep the next action visible.</p>
      </article>
      <article class="route-summary">
        <div class="route-meta">
          <p><strong>Capture rule:</strong> no idea dies because it was not written down.</p>
          <p><strong>Default status:</strong> Draft until reviewed.</p>
        </div>
      </article>
    </section>

    <section class="dense-grid">
      <form class="panel form-panel" data-form="idea" data-queue-endpoint="/api/idea-vault/send-to-approval">
        <div class="panel-header">
          <h2>Idea intake</h2>
          <span class="badge draft">Draft</span>
        </div>
        <div class="panel-body form-grid">
          ${renderFormField("Title", "title", "", "text", "Idea title")}
          ${renderFormField("Raw note", "rawNote", "", "textarea", "What is the idea?")}
          ${renderFormField("Category", "category", "Content", "text", "Category")}
          ${renderFormField("Urgency", "urgency", "3", "number", "1-10")}
          ${renderFormField("Revenue potential", "revenuePotential", "3", "number", "1-10")}
          ${renderFormField("Related division", "relatedDivision", "ATLAS OS", "text", "Division")}
          ${renderFormField("Source", "source", "manual", "text", "voice, text, manual, import")}
          <div class="form-actions">
            ${renderFormAction("Save Idea", "idea-save")}
            ${renderFormAction("Send to Approval Queue", "idea-queue")}
            ${renderFormAction("Generate Codex Batch", "idea-codex", "button")}
          </div>
        </div>
      </form>

      <article class="panel">
        <div class="panel-header">
          <h2>Distribution output</h2>
          <span class="badge muted">Shared logic</span>
        </div>
        <div class="panel-body status-list">
          ${ideas.slice(0, 3).map((idea) => {
            const dist = idea.distribution || {};
            return `
              <div class="card">
                <div class="section-title">
                  <h3>${escapeHtml(idea.title)}</h3>
                  ${badgeHtml(idea.status || "Draft")}
                </div>
                <p>${escapeHtml(dist.nextAction || "Write a one-paragraph next step.")}</p>
                <div class="pill-row" style="margin-top:10px;">
                  ${badgeHtml(`Content ${(dist.contentIdeas && dist.contentIdeas.length) || 0}`)}
                  ${badgeHtml(`Product ${(dist.productIdeas && dist.productIdeas.length) || 0}`)}
                  ${badgeHtml(`Grant ${(dist.grantOpportunities && dist.grantOpportunities.length) || 0}`)}
                  ${badgeHtml(`Sales ${(dist.salesOffers && dist.salesOffers.length) || 0}`)}
                </div>
              </div>
            `;
          }).join("") || '<p class="pinned-note">No ideas stored yet.</p>'}
        </div>
      </article>
    </section>

    <div style="height:16px"></div>
    ${tableHtml(
      ["Idea", "Category", "Source", "Status"],
      ideas.map((idea) => [
        escapeHtml(idea.title),
        escapeHtml(idea.category || "Content"),
        escapeHtml(idea.source || "manual"),
        badgeHtml(idea.status || "Draft"),
      ])
    )}
  `;
}

function renderLeads(data) {
  const leads = data.collections.leads || [];
  return `
    <section class="route-header">
      <article class="route-summary">
        <h2>Leads</h2>
        <p>Revenue pipeline for Creator Logistics and related services. Drafts are generated before any sendable action can leave the system.</p>
      </article>
      <article class="route-summary">
        <div class="route-meta">
          <p><strong>Rule:</strong> draft first, approval second, send last.</p>
          <p><strong>Pipeline emphasis:</strong> warm leads, follow-up timing, and deal value.</p>
        </div>
      </article>
    </section>

    <section class="dense-grid">
      <form class="panel form-panel" data-form="lead">
        <div class="panel-header">
          <h2>Lead intake</h2>
          <span class="badge draft">Draft</span>
        </div>
        <div class="panel-body form-grid">
          ${renderFormField("Creator / business", "name", "", "text", "Lead name")}
          ${renderFormField("Platform", "platform", "", "text", "YouTube, X, Instagram")}
          ${renderFormField("URL", "url", "", "text", "https://")}
          ${renderFormField("Niche", "niche", "", "text", "Niche")}
          ${renderFormField("Pain points", "painPoints", "", "textarea", "Comma-separated pain points")}
          ${renderFormField("Value", "value", "$0", "text", "$3,500/mo")}
          ${renderFormField("Stage", "stage", "Discovery", "text", "Discovery")}
          ${renderFormField("Status", "status", "Draft", "text", "Draft")}
          <div class="form-actions">
            ${renderFormAction("Save Lead", "lead-save")}
            ${renderFormAction("Generate Drafts + Queue Approval", "lead-queue")}
            ${renderFormAction("Score Lead", "lead-score", "button")}
            ${renderFormAction("Export CSV", "lead-export", "button")}
          </div>
        </div>
      </form>

      <article class="panel">
        <div class="panel-header">
          <h2>Lead scoring</h2>
          <span class="badge muted">Shared logic</span>
        </div>
        <div class="panel-body status-list">
          ${leads.slice(0, 4).map((lead) => `
            <div class="status-row">
              <div>
                <strong>${escapeHtml(lead.name)}</strong>
                <small>${escapeHtml(lead.platform || "No platform")} | ${escapeHtml(lead.niche || "No niche")}</small>
              </div>
              <div class="pill-row">
                ${badgeHtml(`Score ${lead.fitScore || 0}`)}
                ${badgeHtml(lead.offerMatch || "Growth Partner")}
                ${badgeHtml(lead.status || "Draft")}
              </div>
            </div>
          `).join("") || '<p class="pinned-note">No leads stored yet.</p>'}
        </div>
      </article>
    </section>

    <div style="height:16px"></div>
    ${tableHtml(
      ["Lead", "Stage", "Value", "Status"],
      leads.map((lead) => [
        escapeHtml(lead.name),
        escapeHtml(lead.stage || "Discovery"),
        escapeHtml(lead.value || "$0"),
        badgeHtml(lead.status || "Draft"),
      ])
    )}
  `;
}

function renderContentOps(data) {
  const packages = data.collections.contentPackages || [];
  return `
    <section class="route-header">
      <article class="route-summary">
        <h2>Content Ops</h2>
        <p>Turn one idea into a content package, then stage the result for approval before anything is published.</p>
      </article>
      <article class="route-summary">
        <div class="route-meta">
          <p><strong>Default posture:</strong> no public release without explicit approval.</p>
          <p><strong>Operational goal:</strong> compress production lag without removing review gates.</p>
        </div>
      </article>
    </section>

    <section class="dense-grid">
      <form class="panel form-panel" data-form="content">
        <div class="panel-header">
          <h2>Content intake</h2>
          <span class="badge draft">Draft</span>
        </div>
        <div class="panel-body form-grid">
          ${renderFormField("Raw idea", "rawIdea", "", "textarea", "What is the content about?")}
          ${renderFormField("Target brand / channel", "owner", "ATLAS OS", "text", "Owner")}
          ${renderFormField("Tone", "tone", "Executive", "text", "Tone")}
          ${renderFormField("Platform", "platform", "Multi-platform", "text", "Platform")}
          ${renderFormField("Audience", "audience", "Founder audience", "text", "Audience")}
          ${renderFormField("Goal", "goal", "Turn idea into content", "text", "Goal")}
          ${renderFormField("Title", "title", "", "text", "Package title")}
          <div class="form-actions">
            ${renderFormAction("Generate Package", "content-generate")}
            ${renderFormAction("Send to Approval Queue", "content-queue")}
          </div>
        </div>
      </form>

      <article class="panel">
        <div class="panel-header">
          <h2>Production stages</h2>
          <span class="badge muted">Shared workflow</span>
        </div>
        <div class="panel-body status-list">
          ${packages.slice(0, 4).map((item) => `
            <div class="status-row">
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <small>${escapeHtml(item.owner || "ATLAS OS")} | ${escapeHtml(item.channel || "Internal")}</small>
              </div>
              ${badgeHtml(item.status || "Draft")}
            </div>
          `).join("") || '<p class="pinned-note">No content packages stored yet.</p>'}
        </div>
      </article>
    </section>

    <div style="height:16px"></div>
    ${tableHtml(
      ["Asset", "Owner", "Channel", "Status"],
      packages.map((item) => [
        escapeHtml(item.title),
        escapeHtml(item.owner || "ATLAS OS"),
        escapeHtml(item.channel || "Internal"),
        badgeHtml(item.status || "Draft"),
      ])
    )}
  `;
}

function renderGrants(data) {
  const grants = data.collections.grants || [];
  return `
    <section class="route-header">
      <article class="route-summary">
        <h2>Grants</h2>
        <p>Track readiness, evidence, rights checks, and missing attachments before anything is submitted.</p>
      </article>
      <article class="route-summary">
        <div class="route-meta">
          <p><strong>Rule:</strong> no submission until evidence is complete and reviewed.</p>
          <p><strong>Compliance note:</strong> this route should remain review-heavy.</p>
        </div>
      </article>
    </section>

    <section class="dense-grid">
      <form class="panel form-panel" data-form="grant">
        <div class="panel-header">
          <h2>Grant intake</h2>
          <span class="badge draft">Draft</span>
        </div>
        <div class="panel-body form-grid">
          ${renderFormField("Grant name", "title", "", "text", "Grant title")}
          ${renderFormField("Source", "agency", "", "text", "Agency or source")}
          ${renderFormField("Deadline", "deadline", "", "text", "Deadline")}
          ${renderFormField("Amount", "amount", "", "text", "$ amount")}
          ${renderFormField("Eligibility", "eligibility", "", "textarea", "Eligibility notes")}
          ${renderFormField("Required documents", "requiredDocuments", "", "textarea", "Comma-separated documents")}
          <div class="form-actions">
            ${renderFormAction("Save Grant", "grant-save")}
            ${renderFormAction("Generate Checklist", "grant-checklist", "button")}
          </div>
        </div>
      </form>

      <article class="panel">
        <div class="panel-header">
          <h2>Grant readiness</h2>
          <span class="badge muted">Shared logic</span>
        </div>
        <div class="panel-body status-list">
          ${grants.slice(0, 4).map((item) => `
            <div class="status-row">
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <small>${escapeHtml(item.agency || "Unknown")} | ${escapeHtml(item.stage || "Draft")}</small>
              </div>
              ${badgeHtml(item.status || "Draft")}
            </div>
          `).join("") || '<p class="pinned-note">No grants stored yet.</p>'}
        </div>
      </article>
    </section>

    <div style="height:16px"></div>
    ${tableHtml(
      ["Grant", "Agency", "Stage", "Status"],
      grants.map((grant) => [
        escapeHtml(grant.title),
        escapeHtml(grant.agency || "Unknown"),
        escapeHtml(grant.stage || "Draft"),
        badgeHtml(grant.status || "Draft"),
      ])
    )}
  `;
}

function renderCreatorLogistics(data) {
  const tasks = data.collections.tasks || [];
  const leads = data.collections.leads || [];
  return `
    <section class="route-header">
      <article class="route-summary">
        <h2>Creator Logistics</h2>
        <p>Client delivery, editing work, follow-ups, and revenue ops live here in one compact queue.</p>
      </article>
      <article class="route-summary">
        <div class="route-meta">
          <p><strong>Goal:</strong> convert approved leads into predictable delivery.</p>
          <p><strong>Status discipline:</strong> every client-facing item stays explicit and logged.</p>
        </div>
      </article>
    </section>

    <section class="dense-grid">
      <article class="panel">
        <div class="panel-header">
          <h2>Lead pipeline</h2>
          <span class="badge muted">Revenue</span>
        </div>
        <div class="panel-body status-list">
          ${leads.slice(0, 4).map((lead) => `
            <div class="status-row">
              <div>
                <strong>${escapeHtml(lead.name)}</strong>
                <small>${escapeHtml(lead.stage || "Discovery")} | ${escapeHtml(lead.value || "$0")}</small>
              </div>
              ${badgeHtml(lead.status || "Draft")}
            </div>
          `).join("") || '<p class="pinned-note">No leads stored yet.</p>'}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <h2>Delivery queue</h2>
          <span class="badge muted">Operations</span>
        </div>
        <div class="panel-body status-list">
          ${tasks.slice(0, 4).map((task) => `
            <div class="status-row">
              <div>
                <strong>${escapeHtml(task.title)}</strong>
                <small>${escapeHtml(task.owner || "ATLAS OS")} | Due ${escapeHtml(task.due || "Today")}</small>
              </div>
              ${badgeHtml(task.status || "Draft")}
            </div>
          `).join("") || '<p class="pinned-note">No tasks stored yet.</p>'}
        </div>
      </article>
    </section>

    <div style="height:16px"></div>
    ${tableHtml(
      ["Client", "Deliverable", "Due", "Status"],
      tasks.map((task) => [
        escapeHtml(task.owner || "ATLAS OS"),
        escapeHtml(task.title),
        escapeHtml(task.due || "Today"),
        badgeHtml(task.status || "Draft"),
      ])
    )}
  `;
}

function renderDivisions(data) {
  const divisions = data.divisions || [];
  const flowchart = data.companyFlowchart || { parent: data.company.parent, branches: divisions.map((division) => ({ name: division.name, owner: division.owner, status: division.status })) };
  return `
    <section class="route-header">
      <article class="route-summary">
        <h2>Divisions</h2>
        <p>Company structure for Avery Industries LLC. ATLAS should route work by division, not by noise.</p>
      </article>
      <article class="route-summary">
        <div class="route-meta">
          <p><strong>Parent:</strong> ${escapeHtml(data.company.parent)}</p>
          <p><strong>Active mapping:</strong> all requested divisions loaded in local mock form.</p>
        </div>
      </article>
    </section>

    <article class="panel">
      <div class="panel-header">
        <h2>Master flowchart</h2>
        <span class="badge muted">${escapeHtml(flowchart.parent)}</span>
      </div>
      <div class="panel-body">
        <div class="flowchart">
          <div class="flowchart-root">${escapeHtml(flowchart.parent)}</div>
          <div class="flowchart-branches">
            ${flowchart.branches
              .map(
                (branch) => `
                  <div class="flowchart-branch">
                    <strong>${escapeHtml(branch.name)}</strong>
                    <span>${escapeHtml(branch.owner || "Unassigned")}</span>
                    ${badgeHtml(branch.status || "Active")}
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    </article>

    <div style="height:16px"></div>
    <section class="dense-grid">
      ${divisions
        .map(
          (division) => `
            <article class="card">
              <div class="section-title">
                <h3>${escapeHtml(division.name)}</h3>
                <span class="badge muted">${escapeHtml(division.owner || "Unassigned")}</span>
              </div>
              <p>${escapeHtml(division.mission || division.purpose || "")}</p>
              <div class="pill-row" style="margin-top:10px;">
                ${badgeHtml(division.status || "Active")}
                ${badgeHtml(division.automationStatus || "Active")}
              </div>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderSettings(data) {
  const auditLogs = data.auditLogs || data.collections.auditLogs || [];
  return `
    <section class="route-header">
      <article class="route-summary">
        <h2>Settings</h2>
        <p>Company config, naming rules, automation guardrails, and backend gaps are visible here.</p>
      </article>
      <article class="route-summary">
        <div class="route-meta">
          <p><strong>Company rule:</strong> use Avery Industries LLC everywhere.</p>
          <p><strong>System rule:</strong> log first, send last, and always keep approval gates visible.</p>
        </div>
      </article>
    </section>

    <section class="dense-grid">
      <article class="panel">
        <div class="panel-header">
          <h2>Guardrails</h2>
          <span class="badge blocked">Required</span>
        </div>
        <div class="panel-body status-list">
          ${data.settings.guardrails.map((rule) => `
            <div class="status-row">
              <div>
                <strong>Avery Industries LLC rule</strong>
                <small>${escapeHtml(rule)}</small>
              </div>
              ${badgeHtml("Approved")}
            </div>
          `).join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <h2>Backend connections</h2>
          <span class="badge pending-approval">Mock only</span>
        </div>
        <div class="panel-body status-list">
          ${data.settings.connections.map((connection) => `
            <div class="status-row">
              <div>
                <strong>${escapeHtml(connection.system)}</strong>
                <small>${escapeHtml(connection.note)}</small>
              </div>
              ${badgeHtml(connection.status)}
            </div>
          `).join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <h2>Backend gaps</h2>
          <span class="badge muted">Still needed</span>
        </div>
        <div class="panel-body status-list">
          ${data.backendGaps.map((gap) => `
            <div class="status-row">
              <div>
                <strong>${escapeHtml(gap)}</strong>
                <small>Replace with the production service when available.</small>
              </div>
              ${badgeHtml("Blocked")}
            </div>
          `).join("")}
        </div>
      </article>
    </section>

    <div style="height:16px"></div>
    <article class="panel">
      <div class="panel-header">
        <h2>Audit logs</h2>
        <span class="badge muted">Shared history</span>
      </div>
      <div class="panel-body status-list">
        ${auditLogs.slice(0, 6).map((entry) => `
          <div class="status-row">
            <div>
              <strong>${escapeHtml(entry.eventType || "Event")}</strong>
              <small>${escapeHtml(entry.itemLabel || entry.itemId || "Item")} · ${escapeHtml(entry.collection || "shared")}</small>
            </div>
            ${badgeHtml(entry.actor || "ATLAS")}
          </div>
        `).join("") || '<p class="pinned-note">No audit events recorded yet.</p>'}
      </div>
    </article>
  `;
}

function renderApprovalQueue(data) {
  const items = data.approvalQueue.items || [];
  return `
    <section class="route-header">
      <article class="route-summary">
        <h2>Approval Queue</h2>
        <p>Every sendable, payable, public, or externally committed action should land here before execution.</p>
      </article>
      <article class="route-summary">
        <div class="route-meta">
          <p><strong>Rule:</strong> no auto-send without explicit approval.</p>
          <p><strong>Queue states:</strong> Draft, Pending Approval, Approved, Sent, Blocked.</p>
        </div>
      </article>
    </section>

    <section class="dense-grid">
      ${items.map((item) => `
        <article class="panel approval-card">
          <div class="panel-header">
            <h2>${escapeHtml(item.item || item.title || "Queue item")}</h2>
            ${badgeHtml(item.status || "Pending Approval")}
          </div>
          <div class="panel-body">
            <div class="route-meta">
              <p><strong>Type:</strong> ${escapeHtml(item.type || "Email")}</p>
              <p><strong>Division:</strong> ${escapeHtml(item.division || "ATLAS OS")}</p>
              <p><strong>Risk level:</strong> ${escapeHtml(item.riskLevel || "Medium")}</p>
              <p><strong>Revenue potential:</strong> ${escapeHtml(item.revenuePotential || "Medium")}</p>
              <p><strong>Reason:</strong> ${escapeHtml(item.reason || "No note")}</p>
            </div>
            <div class="approval-actions">
              <button type="button" data-approval-action="approve" data-id="${escapeHtml(item.id)}">Approve</button>
              <button type="button" data-approval-action="reject" data-id="${escapeHtml(item.id)}">Reject</button>
              <button type="button" data-approval-action="edit" data-id="${escapeHtml(item.id)}">Edit</button>
              <button type="button" data-approval-action="export" data-id="${escapeHtml(item.id)}">Mark Sent</button>
            </div>
            <div class="history-box">
              <strong>History</strong>
              ${(item.history || []).slice(-4).map((entry) => `<div>${escapeHtml(entry.timestamp || "")} · ${escapeHtml(entry.action || "")} · ${escapeHtml(entry.actor || "")}</div>`).join("") || "<div>No history yet.</div>"}
            </div>
          </div>
        </article>
      `).join("")}
    </section>
  `;
}

function renderRouteContent(routeKey, data) {
  switch (routeKey) {
    case "/idea-vault":
      return renderIdeaVault(data);
    case "/leads":
      return renderLeads(data);
    case "/content-ops":
      return renderContentOps(data);
    case "/grants":
      return renderGrants(data);
    case "/creator-logistics":
      return renderCreatorLogistics(data);
    case "/divisions":
      return renderDivisions(data);
    case "/settings":
      return renderSettings(data);
    case "/approval-queue":
      return renderApprovalQueue(data);
    case "/dashboard":
    default:
      return renderDashboard(data);
  }
}

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch (_error) {
    payload = { raw: text };
  }
  if (!response.ok) {
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }
  return payload;
}

async function requestCsv(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`CSV request failed: ${response.status}`);
  return response.text();
}

function downloadText(filename, text, contentType) {
  const blob = new Blob([text], { type: contentType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function updateRouteState(data) {
  const routeKey = routeKeyFromPath(window.location.pathname);
  const canonicalRoute = data.routes.some((route) => route.path === routeKey) ? routeKey : ROUTE_FALLBACK;
  if (canonicalRoute !== routeKey) {
    history.replaceState({}, "", canonicalRoute);
  }

  document.getElementById("primary-nav").innerHTML = renderNav(data.routes, canonicalRoute);
  document.getElementById("route-list").innerHTML = `<strong>Routes:</strong> ${data.routes.map((route) => `${escapeHtml(route.label)} (${escapeHtml(route.path)})`).join(" | ")}`;
  document.getElementById("backend-state").textContent = data.company.mode;
  document.getElementById("headline").textContent = data.company.tagline;
  document.getElementById("company-name").textContent = data.company.parent;
  document.getElementById("app").innerHTML = renderRouteContent(canonicalRoute, data);
  wireActions(data);
}

async function refreshApp() {
  const data = await loadBootstrapData();
  updateRouteState(data);
}

function formDataToObject(form) {
  const result = {};
  const formData = new FormData(form);
  formData.forEach((value, key) => {
    result[key] = String(value);
  });
  return result;
}

function wireActions(data) {
  document.querySelectorAll("#primary-nav a").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.pushState({}, "", link.getAttribute("href"));
      updateRouteState(data);
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  });

  const ideaForm = document.querySelector('[data-form="idea"]');
  if (ideaForm) {
    ideaForm.addEventListener("click", async (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      event.preventDefault();
      const payload = formDataToObject(ideaForm);
      payload.urgency = Number(payload.urgency || 3);
      payload.revenuePotential = Number(payload.revenuePotential || 3);
      try {
        if (button.dataset.action === "idea-codex") {
          await requestJson("/api/idea-vault/generate-codex-batch", { body: payload });
        } else {
          const created = await requestJson("/api/idea-vault/distribute", { body: payload });
          if (button.dataset.action === "idea-queue") {
            await requestJson("/api/idea-vault/send-to-approval", {
              body: {
                title: created.item.title,
                type: "Codex batch",
                division: payload.relatedDivision || "ATLAS OS",
                generatedContent: JSON.stringify(created.distribution, null, 2),
                riskLevel: "Medium",
                revenuePotential: String(payload.revenuePotential || "Medium"),
                collection: "ideas",
                itemId: created.item.id,
              },
            });
          }
        }
        await refreshApp();
      } catch (error) {
        alert(error.message || "Idea action failed");
      }
    });
  }

  const leadForm = document.querySelector('[data-form="lead"]');
  if (leadForm) {
    leadForm.addEventListener("click", async (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      event.preventDefault();
      const payload = formDataToObject(leadForm);
      payload.painPoints = payload.painPoints ? payload.painPoints.split(",").map((item) => item.trim()).filter(Boolean) : [];
      try {
        if (button.dataset.action === "lead-export") {
          const csv = await requestCsv("/api/leads/export.csv");
          downloadText("atlas_leads.csv", csv, "text/csv;charset=utf-8");
          return;
        }
        if (button.dataset.action === "lead-score") {
          const scored = await requestJson("/api/leads/score", { body: payload });
          alert(`Fit score ${scored.fitScore}/10 | ${scored.offerMatch}`);
          return;
        }
        if (button.dataset.action === "lead-queue") {
          await requestJson("/api/leads/drafts", { body: { ...payload, queue: true } });
        } else {
          await requestJson("/api/leads", { body: payload });
        }
        await refreshApp();
      } catch (error) {
        alert(error.message || "Lead action failed");
      }
    });
  }

  const contentForm = document.querySelector('[data-form="content"]');
  if (contentForm) {
    contentForm.addEventListener("click", async (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      event.preventDefault();
      const payload = formDataToObject(contentForm);
      try {
        const created = await requestJson("/api/content-packages/generate", { body: payload });
        if (button.dataset.action === "content-queue") {
          await requestJson("/api/approval-queue", {
            body: {
              title: created.item.title,
              type: "Content package",
              division: payload.owner || "ATLAS OS",
              generatedContent: JSON.stringify(created.packageDraft, null, 2),
              riskLevel: "Medium",
              revenuePotential: "Medium",
              collection: "contentPackages",
              itemId: created.item.id,
            },
          });
        }
        await refreshApp();
      } catch (error) {
        alert(error.message || "Content action failed");
      }
    });
  }

  const grantForm = document.querySelector('[data-form="grant"]');
  if (grantForm) {
    grantForm.addEventListener("click", async (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      event.preventDefault();
      const payload = formDataToObject(grantForm);
      payload.requiredDocuments = payload.requiredDocuments ? payload.requiredDocuments.split(",").map((item) => item.trim()).filter(Boolean) : [];
      try {
        if (button.dataset.action === "grant-checklist") {
          const checklist = await requestJson("/api/grants/checklist", { body: payload });
          alert(checklist.checklist.problemStatement);
          return;
        }
        await requestJson("/api/grants", { body: payload });
        await refreshApp();
      } catch (error) {
        alert(error.message || "Grant action failed");
      }
    });
  }

  document.querySelectorAll("button[data-approval-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      const action = button.dataset.approvalAction;
      try {
        if (action === "approve") {
          await requestJson(`/api/approval-queue/${id}/approve`, { method: "POST" });
        } else if (action === "reject") {
          const note = window.prompt("Reject note", "Needs revision");
          if (note === null) return;
          await requestJson(`/api/approval-queue/${id}/reject`, { body: { note } });
        } else if (action === "export") {
          await requestJson(`/api/approval-queue/${id}/export`, { method: "POST" });
        } else if (action === "edit") {
          const current = data.collections.approvalQueue.find((item) => String(item.id) === String(id));
          const nextTitle = window.prompt("Approval title", current ? current.title : "");
          if (nextTitle === null) return;
          const nextNote = window.prompt("Approval note", current ? current.reason || "" : "");
          if (nextNote === null) return;
          await requestJson(`/api/approval-queue/${id}`, { method: "PATCH", body: { title: nextTitle, reason: nextNote } });
        }
        await refreshApp();
      } catch (error) {
        alert(error.message || "Approval action failed");
      }
    });
  });
}

async function bootstrap() {
  const data = await loadBootstrapData();
  updateRouteState(data);
  if (!window.__atlasPopstateBound) {
    window.addEventListener("popstate", () => refreshApp());
    window.__atlasPopstateBound = true;
  }
}

bootstrap().catch((error) => {
  document.getElementById("app").innerHTML = `
    <section class="route-summary">
      <h2>Command Center unavailable</h2>
      <p>${escapeHtml(error.message || "Unknown error")}</p>
    </section>
  `;
  console.error(error);
});
