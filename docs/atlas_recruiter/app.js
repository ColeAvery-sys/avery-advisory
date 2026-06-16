const h = React.createElement;
const { useEffect, useMemo, useState } = React;

function listToText(items) {
  return (items || []).join("\n");
}

function textToList(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatPercent(value) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

function formatCurrency(value) {
  return `$${Math.max(0, Math.round(value)).toLocaleString("en-US")}`;
}

function copyText(value) {
  if (!navigator.clipboard) return Promise.resolve();
  return navigator.clipboard.writeText(value);
}

async function fetchJson(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed: ${response.status}`);
  return payload;
}

function Badge({ children, tone }) {
  return h("span", { className: `badge ${tone || ""}`.trim() }, children);
}

function ScoreCard({ label, value, note, tone }) {
  return h(
    "div",
    { className: "metric-card" },
    h("div", { className: "metric-label" }, label),
    h("div", { className: "metric-value" }, value),
    h("div", { className: "metric-note" }, note),
    tone ? h("div", { style: { marginTop: "10px" } }, h(Badge, { tone }, tone.toUpperCase())) : null
  );
}

function Field({ label, children, span2 }) {
  return h("div", { className: `field${span2 ? " span-2" : ""}` }, h("label", null, label), children);
}

function JobCard({ item, onAction, onOpenPlan }) {
  const { job, score, applicationDraft } = item;
  return h(
    "div",
    { className: "job-card" },
    h(
      "div",
      { className: "job-head" },
      h(
        "div",
        null,
        h("strong", null, `${job.title} at ${job.company}`),
        h("div", { className: "muted" }, `${job.location} | ${job.remote ? "Remote" : "On-site"} | ${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`)
      ),
      h(Badge, { tone: score.matchScore >= 80 ? "ok" : score.matchScore >= 60 ? "warn" : "danger" }, formatPercent(score.matchScore))
    ),
    h("div", { className: "muted" }, job.description),
    h("div", { className: "badge-row" }, score.reasons.slice(0, 4).map((reason) => h(Badge, { key: reason, tone: reason.includes("fails") ? "danger" : "accent" }, reason))),
    h(
      "div",
      { className: "actions" },
      h("button", { className: "small", onClick: () => onAction(job.id, "save") }, "Save"),
      h("button", { className: "small primary", onClick: () => onAction(job.id, "draft") }, "Draft"),
      h("button", { className: "small", onClick: () => onAction(job.id, "apply") }, "Mark Applied"),
      h("button", { className: "small", onClick: () => onAction(job.id, "response") }, "Response"),
      h("button", { className: "small", onClick: () => onAction(job.id, "interview") }, "Interview"),
      h("button", { className: "small", onClick: () => onAction(job.id, "follow_up") }, "Follow-up"),
      h("button", { className: "small ghost", onClick: () => onOpenPlan(job.id) }, "Open Drafts")
    ),
    h("pre", { className: "code-block" }, applicationDraft.coverLetterDraft || "Draft unavailable")
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bootstrap, setBootstrap] = useState(null);
  const [plan, setPlan] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [jobImport, setJobImport] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [automationPlan, setAutomationPlan] = useState(null);

  async function loadAll(refreshForm = false) {
    setLoading(true);
    setError("");
    try {
      const [bootstrapResponse, planResponse, dashboardResponse] = await Promise.all([
        fetchJson("/api/bootstrap"),
        fetchJson("/api/plan"),
        fetchJson("/api/dashboard"),
      ]);
      setBootstrap(bootstrapResponse);
      setPlan(planResponse.plan);
      setDashboard(dashboardResponse.dashboard);
      if (refreshForm || !form) {
        const profile = bootstrapResponse.data.profile;
        setForm({
          name: profile.name,
          location: profile.location,
          resumeText: profile.resumeText,
          linkedinText: profile.linkedinText,
          salaryTarget: profile.salaryTarget,
          remoteOnly: profile.remoteOnly,
          targetTitles: listToText(profile.targetTitles),
          skills: listToText(profile.skills),
          keywords: listToText(profile.keywords),
          industries: listToText(profile.industries),
          dealBreakers: listToText(profile.dealBreakers),
          notes: listToText(profile.notes),
        });
      }
      const firstJob = (planResponse.plan && planResponse.plan.recommendedApplications[0] && planResponse.plan.recommendedApplications[0].job.id) || "";
      setSelectedJobId(firstJob);
      if (firstJob) {
        const automationResponse = await fetchJson(`/api/automation/plan?jobId=${encodeURIComponent(firstJob)}`);
        setAutomationPlan(automationResponse.plan);
      }
    } catch (requestError) {
      setError(requestError.message || "Failed to load ATLAS Recruiter");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshAutomation(jobId) {
    if (!jobId) return;
    const response = await fetchJson(`/api/automation/plan?jobId=${encodeURIComponent(jobId)}`);
    setAutomationPlan(response.plan);
    setSelectedJobId(jobId);
  }

  function updateField(name, value) {
    setForm((current) => ({ ...(current || {}), [name]: value }));
  }

  async function saveProfile() {
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      await fetchJson("/api/profile", {
        method: "PATCH",
        body: {
          profile: {
            ...form,
            salaryTarget: Number(form.salaryTarget || 0),
            remoteOnly: Boolean(form.remoteOnly),
            targetTitles: textToList(form.targetTitles),
            skills: textToList(form.skills),
            keywords: textToList(form.keywords),
            industries: textToList(form.industries),
            dealBreakers: textToList(form.dealBreakers),
            notes: textToList(form.notes),
          },
        },
      });
      await loadAll(true);
    } catch (requestError) {
      setError(requestError.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function importJobs() {
    if (!jobImport.trim()) return;
    setSaving(true);
    setError("");
    try {
      await fetchJson("/api/import", { method: "POST", body: { jobs: jobImport } });
      setJobImport("");
      await loadAll(true);
    } catch (requestError) {
      setError(requestError.message || "Failed to import jobs");
    } finally {
      setSaving(false);
    }
  }

  async function resetData() {
    if (!window.confirm("Reset ATLAS Recruiter to the seeded local source of truth?")) return;
    setSaving(true);
    try {
      await fetchJson("/api/reset", { method: "POST" });
      await loadAll(true);
    } catch (requestError) {
      setError(requestError.message || "Failed to reset recruiter data");
    } finally {
      setSaving(false);
    }
  }

  async function performAction(jobId, action) {
    setSaving(true);
    setError("");
    try {
      await fetchJson("/api/job-action", { method: "POST", body: { jobId, action } });
      await loadAll(false);
      if (selectedJobId === jobId) {
        await refreshAutomation(jobId);
      }
    } catch (requestError) {
      setError(requestError.message || "Failed to record job action");
    } finally {
      setSaving(false);
    }
  }

  const data = bootstrap && bootstrap.data;
  const recommendedJobs = useMemo(() => (plan && plan.recommendedApplications) || [], [plan]);
  const selectedApplication = useMemo(() => {
    if (!selectedJobId || !plan) return null;
    return recommendedJobs.find((item) => item.job.id === selectedJobId) || recommendedJobs[0] || null;
  }, [plan, recommendedJobs, selectedJobId]);

  if (loading && !data) {
    return h("div", { className: "shell" }, h("div", { className: "panel" }, h("div", { className: "panel-body" }, "Loading ATLAS Recruiter...")));
  }

  if (error && !data) {
    return h(
      "div",
      { className: "shell" },
      h("div", { className: "panel" }, h("div", { className: "panel-body" }, h("strong", null, "ATLAS Recruiter unavailable"), h("div", { className: "muted", style: { marginTop: "8px" } }, error)))
    );
  }

  return h(
    "div",
    { className: "shell" },
    h(
      "header",
      { className: "topbar" },
      h(
        "section",
        { className: "brand" },
        h("p", { className: "eyebrow" }, "Avery Industries LLC"),
        h("h1", null, "ATLAS Recruiter"),
        h("p", { className: "headline" }, "Local recruiting operations surface for resume parsing, LinkedIn alignment, remote-only filtering, salary-target scoring, draft generation, and approval-gated application tracking.")
      ),
      h(
        "section",
        { className: "strip" },
        h(ScoreCard, {
          label: "Jobs Scanned",
          value: String((dashboard && dashboard.scannedJobs) || 0),
          note: "Current local feed size",
          tone: "accent",
        }),
        h(ScoreCard, {
          label: "Average Match",
          value: formatPercent((dashboard && dashboard.averageMatchScore) || 0),
          note: "Top queue average fit",
          tone: ((dashboard && dashboard.averageMatchScore) || 0) >= 80 ? "ok" : "warn",
        }),
        h(ScoreCard, {
          label: "Top 20 Target",
          value: String((plan && plan.recommendedApplications && plan.recommendedApplications.length) || 0),
          note: "Applications recommended today",
          tone: "ok",
        }),
        h(ScoreCard, {
          label: "Follow-ups Due",
          value: String((dashboard && dashboard.followUpsDue) || 0),
          note: "Responses still waiting",
          tone: ((dashboard && dashboard.followUpsDue) || 0) > 0 ? "warn" : "ok",
        })
      )
    ),
    h(
      "div",
      { className: "toolbar" },
      h(
        "div",
        { className: "toolbar-left" },
        h(Badge, { tone: "accent" }, "Manual approval required"),
        h(Badge, { tone: "ok" }, "Local source of truth"),
        h(Badge, { tone: "warn" }, "Drafts only until approved")
      ),
      h(
        "div",
        { className: "toolbar-right" },
        h("button", { className: "primary", onClick: saveProfile, disabled: saving }, saving ? "Saving..." : "Save Profile"),
        h("button", { className: "ghost", onClick: resetData, disabled: saving }, "Reset Seed Data")
      )
    ),
    error ? h("div", { className: "panel", style: { marginBottom: "16px", borderColor: "rgba(248,113,113,0.35)" } }, h("div", { className: "panel-body" }, error)) : null,
    h(
      "div",
      { className: "grid" },
      h(
        "section",
        { className: "stack" },
        h(
          "div",
          { className: "panel" },
          h(
            "div",
            { className: "panel-header" },
            h("h2", null, "Recruiter Profile"),
            h(Badge, { tone: "accent" }, "Persistent JSON")
          ),
          h(
            "div",
            { className: "panel-body" },
            h(
              "div",
              { className: "form-grid" },
              h(Field, { label: "Name" }, h("input", { value: (form && form.name) || "", onChange: (e) => updateField("name", e.target.value) })),
              h(Field, { label: "Location" }, h("input", { value: (form && form.location) || "", onChange: (e) => updateField("location", e.target.value) })),
              h(Field, { label: "Salary Target" }, h("input", { type: "number", value: (form && form.salaryTarget) || 0, onChange: (e) => updateField("salaryTarget", e.target.value) })),
              h(Field, { label: "Remote Only" }, h("select", { value: String((form && form.remoteOnly) || false), onChange: (e) => updateField("remoteOnly", e.target.value === "true") }, h("option", { value: "true" }, "True"), h("option", { value: "false" }, "False"))),
              h(Field, { label: "Target Titles", span2: true }, h("textarea", { value: (form && form.targetTitles) || "", onChange: (e) => updateField("targetTitles", e.target.value) })),
              h(Field, { label: "Resume Text", span2: true }, h("textarea", { value: (form && form.resumeText) || "", onChange: (e) => updateField("resumeText", e.target.value) })),
              h(Field, { label: "LinkedIn Text", span2: true }, h("textarea", { value: (form && form.linkedinText) || "", onChange: (e) => updateField("linkedinText", e.target.value) })),
              h(Field, { label: "Skills" }, h("textarea", { value: (form && form.skills) || "", onChange: (e) => updateField("skills", e.target.value) })),
              h(Field, { label: "Keywords" }, h("textarea", { value: (form && form.keywords) || "", onChange: (e) => updateField("keywords", e.target.value) })),
              h(Field, { label: "Industries" }, h("textarea", { value: (form && form.industries) || "", onChange: (e) => updateField("industries", e.target.value) })),
              h(Field, { label: "Deal Breakers" }, h("textarea", { value: (form && form.dealBreakers) || "", onChange: (e) => updateField("dealBreakers", e.target.value) })),
              h(Field, { label: "Operating Notes", span2: true }, h("textarea", { value: (form && form.notes) || "", onChange: (e) => updateField("notes", e.target.value) })),
              h(
                "div",
                { className: "actions span-2" },
                h("button", { className: "primary", onClick: saveProfile, disabled: saving }, saving ? "Saving..." : "Save to Source of Truth"),
                h("button", { className: "ghost", onClick: () => loadAll(true), disabled: saving }, "Reload Current Data")
              )
            )
          )
        ),
        h(
          "div",
          { className: "panel" },
          h(
            "div",
            { className: "panel-header" },
            h("h2", null, "Job Feed Import"),
            h(Badge, { tone: "ok" }, "JSON array")
          ),
          h(
            "div",
            { className: "panel-body" },
            h("div", { className: "muted" }, "Paste a JSON array of jobs to add more than the seeded feed. The local score engine will rank and draft the best 20."), 
            h("textarea", { style: { marginTop: "12px", minHeight: "220px" }, value: jobImport, onChange: (e) => setJobImport(e.target.value), placeholder: '[{"id":"job-100","title":"..."}]' }),
            h(
              "div",
              { className: "actions", style: { marginTop: "12px" } },
              h("button", { className: "primary", onClick: importJobs, disabled: saving }, "Import Jobs"),
              h("button", { className: "ghost", onClick: () => copyText(JSON.stringify((data && data.jobFeed) || [], null, 2)) }, "Copy Current Feed")
            )
          )
        )
      ),
      h(
        "section",
        { className: "stack" },
        h(
          "div",
          { className: "panel" },
          h(
            "div",
            { className: "panel-header" },
            h("h2", null, "Daily Queue"),
            h(Badge, { tone: "accent" }, "Top 20 applications")
          ),
          h(
            "div",
            { className: "panel-body" },
            h("div", { className: "queue" }, recommendedJobs.map((item) => h(JobCard, { key: item.job.id, item, onAction: performAction, onOpenPlan: refreshAutomation }))),
            h("div", { className: "divider" }),
            h("div", { className: "badge-row" }, (dashboard && dashboard.topMatchTitles ? dashboard.topMatchTitles : []).map((item) => h(Badge, { key: item, tone: "ok" }, item)))
          )
        ),
        h(
          "div",
          { className: "panel" },
          h(
            "div",
            { className: "panel-header" },
            h("h2", null, "Approval Gate"),
            h(Badge, { tone: "danger" }, "No auto-submit")
          ),
          h(
            "div",
            { className: "panel-body" },
            h("div", { className: "muted" }, "Applications, responses, interviews, and follow-ups are drafted locally and must be approved before anything is sent externally."),
            h("div", { className: "divider" }),
            h(
              "div",
              { className: "queue" },
              h("div", { className: "queue-item" }, `Scan target: ${(plan && plan.scanTarget) || 5000}`),
              h("div", { className: "queue-item" }, `Daily target: ${(plan && plan.dailyTarget) || 20}`),
              h("div", { className: "queue-item" }, `Approval gate: ${((plan && plan.approvalGate && plan.approvalGate.permissionLevel) || "Approval Required")}`)
            )
          )
        ),
        h(
          "div",
          { className: "panel" },
          h(
            "div",
            { className: "panel-header" },
            h("h2", null, "Draft Workspace"),
            h(Badge, { tone: "ok" }, "Cover letters + answers")
          ),
          h(
            "div",
            { className: "panel-body" },
            selectedApplication
              ? h(
                  "div",
                  null,
                  h("div", { className: "section-title" }, h("h3", null, `${selectedApplication.job.title} at ${selectedApplication.job.company}`), h(Badge, { tone: "accent" }, formatPercent(selectedApplication.score.matchScore))),
                  h("div", { className: "muted" }, selectedApplication.job.description),
                  h("div", { className: "divider" }),
                  h("div", { className: "section-title" }, h("h3", null, "Cover Letter"), h("button", { className: "small", onClick: () => copyText(selectedApplication.applicationDraft.coverLetterDraft || "") }, "Copy")),
                  h("pre", { className: "code-block" }, selectedApplication.applicationDraft.coverLetterDraft || "No draft yet"),
                  h("div", { className: "divider" }),
                  h("div", { className: "section-title" }, h("h3", null, "Application Answers"), h("button", { className: "small", onClick: () => copyText(JSON.stringify(selectedApplication.applicationDraft.questionAnswersDraft || [], null, 2)) }, "Copy")),
                  h("pre", { className: "code-block" }, JSON.stringify(selectedApplication.applicationDraft.questionAnswersDraft || [], null, 2)),
                  h("div", { className: "divider" }),
                  h("div", { className: "section-title" }, h("h3", null, "Follow-up Draft"), h("button", { className: "small", onClick: () => copyText(selectedApplication.applicationDraft.followUpDraft || "") }, "Copy")),
                  h("pre", { className: "code-block" }, selectedApplication.applicationDraft.followUpDraft || "No follow-up draft yet")
                )
              : h("div", { className: "muted" }, "No recommendation selected yet.")
          )
        ),
        h(
          "div",
          { className: "panel" },
          h(
            "div",
            { className: "panel-header" },
            h("h2", null, "Recorded Activity"),
            h(Badge, { tone: "accent" }, "Saved / Applied / Response / Interview")
          ),
          h(
            "div",
            { className: "panel-body" },
            h(
              "div",
              { className: "queue" },
              ((data && data.applications) || []).slice(0, 8).map((application) =>
                h(
                  "div",
                  { className: "queue-item", key: application.id },
                  h("strong", null, application.id),
                  h("div", { className: "muted" }, `${application.status} | ${formatPercent(application.matchScore)} | Updated ${application.lastUpdatedAt}`),
                  h("div", { className: "muted" }, (application.notes || []).join(" | ") || "No notes")
                )
              )
            )
          )
        )
      )
    ),
    h(
      "footer",
      { className: "footer" },
      h("div", null, "ATLAS Recruiter keeps outbound steps draft-only until Mr. Avery approves them."),
      h("div", { style: { marginTop: "6px" } }, `Storage: ${data ? "atlas_ops/logs/atlas_recruiter_master.json" : "unavailable"}`)
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
