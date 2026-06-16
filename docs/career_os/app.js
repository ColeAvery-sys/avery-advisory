const h = React.createElement;
const { useEffect, useState } = React;

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
    { className: "score-card" },
    h("div", { className: "score-label" }, label),
    h("div", { className: "score-value" }, value),
    h("div", { className: "score-note" }, note),
    tone ? h("div", { style: { marginTop: "10px" } }, h(Badge, { tone }, tone.toUpperCase())) : null
  );
}

function Field({ label, children, span2 }) {
  return h(
    "div",
    { className: `field${span2 ? " span-2" : ""}` },
    h("label", null, label),
    children
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bootstrap, setBootstrap] = useState(null);
  const [roleKey, setRoleKey] = useState("founder_ceo");
  const [packageData, setPackageData] = useState(null);
  const [automationPlan, setAutomationPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  async function loadAll(nextRoleKey = roleKey, refreshForm = false) {
    setLoading(true);
    setError("");
    try {
      const bootstrapResponse = await fetchJson("/api/bootstrap");
      setBootstrap(bootstrapResponse);
      if ((refreshForm || !form) && bootstrapResponse.data) {
        const profile = bootstrapResponse.data.masterProfile;
        const linkedIn = bootstrapResponse.data.currentLinkedIn;
        setForm({
          name: profile.name,
          location: profile.location,
          currentTitle: profile.currentTitle,
          currentCompany: profile.currentCompany,
          targetHeadline: profile.targetHeadline,
          about: profile.about,
          certifications: listToText(profile.certifications),
          education: listToText(profile.education),
          skills: listToText(profile.skills),
          awards: listToText(profile.awards),
          promotions: listToText(profile.promotions),
          projects: listToText(profile.projects),
          revenueAchievements: listToText(profile.revenueAchievements),
          leadershipMetrics: listToText(profile.leadershipMetrics),
          recentAchievements: listToText(profile.recentAchievements),
          linkedinHeadline: linkedIn.headline,
          linkedinAbout: linkedIn.about,
          linkedinSkills: listToText(linkedIn.skills),
          linkedinFeatured: listToText(linkedIn.featured),
          notes: listToText(bootstrapResponse.data.notes),
        });
      }

      const [packageResponse, planResponse] = await Promise.all([
        fetchJson(`/api/package?role=${encodeURIComponent(nextRoleKey)}`),
        fetchJson(`/api/automation/plan?role=${encodeURIComponent(nextRoleKey)}`),
      ]);
      setPackageData(packageResponse.package);
      setAutomationPlan(planResponse.plan);
    } catch (requestError) {
      setError(requestError.message || "Failed to load Career OS");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll(roleKey, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleKey]);

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
          profile: form,
        },
      });
      await loadAll(roleKey, true);
    } catch (requestError) {
      setError(requestError.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function resetProfile() {
    if (!window.confirm("Reset the Career OS master profile to the seeded local source of truth?")) return;
    setSaving(true);
    try {
      await fetchJson("/api/reset", { method: "POST" });
      await loadAll(roleKey, true);
    } catch (requestError) {
      setError(requestError.message || "Failed to reset profile");
    } finally {
      setSaving(false);
    }
  }

  const data = bootstrap && bootstrap.data;
  const packageOutput = packageData || {};
  const comparison = packageOutput.comparison || {};
  const dashboard = packageOutput.dashboard || {};
  const roles = (bootstrap && bootstrap.roles) || [];

  if (loading && !data) {
    return h("div", { className: "shell" }, h("div", { className: "panel" }, h("div", { className: "panel-body" }, "Loading Career OS...")));
  }

  if (error && !data) {
    return h(
      "div",
      { className: "shell" },
      h("div", { className: "panel" }, h("div", { className: "panel-body" }, h("strong", null, "Career OS unavailable"), h("div", { className: "muted", style: { marginTop: "8px" } }, error)))
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
        h("h1", null, "ATLAS Career OS"),
        h(
          "p",
          { className: "headline" },
          "Local-first master profile, LinkedIn sync engine, ATS resume generator, and approval-gated LinkedIn automation planning."
        )
      ),
      h(
        "section",
        { className: "strip" },
        h(ScoreCard, {
          label: "Resume Score",
          value: formatPercent(dashboard.resumeScore || 0),
          note: "ATS density and evidence coverage",
          tone: dashboard.resumeScore >= 80 ? "ok" : dashboard.resumeScore >= 60 ? "warn" : "danger",
        }),
        h(ScoreCard, {
          label: "LinkedIn Score",
          value: formatPercent(dashboard.linkedinScore || 0),
          note: "Current profile alignment",
          tone: dashboard.linkedinScore >= 80 ? "ok" : dashboard.linkedinScore >= 60 ? "warn" : "danger",
        }),
        h(ScoreCard, {
          label: "Job Match Score",
          value: formatPercent(dashboard.jobMatchScore || 0),
          note: "Target role fit",
          tone: dashboard.jobMatchScore >= 80 ? "ok" : dashboard.jobMatchScore >= 60 ? "warn" : "danger",
        }),
        h(
          "div",
          { className: "metric-card" },
          h("span", { className: "metric-label" }, "Missing Certifications"),
          h("div", { className: "metric-value" }, String((dashboard.missingCertifications || []).length)),
          h("span", { className: "metric-note" }, (dashboard.missingCertifications || []).slice(0, 2).join(" | ") || "No gap flagged")
        )
      )
    ),
    h(
      "div",
      { className: "toolbar" },
      h(
        "div",
        { className: "toolbar-left" },
        h(
          "div",
          { className: "role-select" },
          h("label", { className: "muted", style: { display: "block", marginBottom: "6px" } }, "Target role"),
          h(
            "select",
            {
              value: roleKey,
              onChange: (event) => setRoleKey(event.target.value),
            },
            roles.map((role) => h("option", { key: role.key, value: role.key }, role.label))
          )
        ),
        h(Badge, { tone: "accent" }, "Manual approval required"),
        h(Badge, { tone: "ok" }, "Local source of truth")
      ),
      h(
        "div",
        { className: "toolbar-right" },
        h("button", { className: "primary", onClick: saveProfile, disabled: saving }, saving ? "Saving..." : "Save Profile"),
        h("button", { className: "ghost", onClick: resetProfile, disabled: saving }, "Reset Seed Data")
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
            h("h2", null, "Master Profile Editor"),
            h(Badge, { tone: "accent" }, "Persistent JSON")
          ),
          h(
            "div",
            { className: "panel-body" },
            h(
              "div",
              { className: "form-grid" },
              h(
                Field,
                { label: "Name" },
                h("input", { value: (form && form.name) || "", onChange: (e) => updateField("name", e.target.value) })
              ),
              h(
                Field,
                { label: "Location" },
                h("input", { value: (form && form.location) || "", onChange: (e) => updateField("location", e.target.value) })
              ),
              h(
                Field,
                { label: "Current Title" },
                h("input", { value: (form && form.currentTitle) || "", onChange: (e) => updateField("currentTitle", e.target.value) })
              ),
              h(
                Field,
                { label: "Current Company" },
                h("input", { value: (form && form.currentCompany) || "", onChange: (e) => updateField("currentCompany", e.target.value) })
              ),
              h(
                Field,
                { label: "Target Headline", span2: true },
                h("textarea", { value: (form && form.targetHeadline) || "", onChange: (e) => updateField("targetHeadline", e.target.value) })
              ),
              h(
                Field,
                { label: "About", span2: true },
                h("textarea", { value: (form && form.about) || "", onChange: (e) => updateField("about", e.target.value) })
              ),
              h(Field, { label: "Certifications" }, h("textarea", { value: (form && form.certifications) || "", onChange: (e) => updateField("certifications", e.target.value) })),
              h(Field, { label: "Education" }, h("textarea", { value: (form && form.education) || "", onChange: (e) => updateField("education", e.target.value) })),
              h(Field, { label: "Skills" }, h("textarea", { value: (form && form.skills) || "", onChange: (e) => updateField("skills", e.target.value) })),
              h(Field, { label: "Awards" }, h("textarea", { value: (form && form.awards) || "", onChange: (e) => updateField("awards", e.target.value) })),
              h(Field, { label: "Promotions" }, h("textarea", { value: (form && form.promotions) || "", onChange: (e) => updateField("promotions", e.target.value) })),
              h(Field, { label: "Projects" }, h("textarea", { value: (form && form.projects) || "", onChange: (e) => updateField("projects", e.target.value) })),
              h(Field, { label: "Revenue Achievements" }, h("textarea", { value: (form && form.revenueAchievements) || "", onChange: (e) => updateField("revenueAchievements", e.target.value) })),
              h(Field, { label: "Leadership Metrics" }, h("textarea", { value: (form && form.leadershipMetrics) || "", onChange: (e) => updateField("leadershipMetrics", e.target.value) })),
              h(Field, { label: "Recent Achievements" }, h("textarea", { value: (form && form.recentAchievements) || "", onChange: (e) => updateField("recentAchievements", e.target.value) })),
              h(Field, { label: "LinkedIn Headline", span2: true }, h("textarea", { value: (form && form.linkedinHeadline) || "", onChange: (e) => updateField("linkedinHeadline", e.target.value) })),
              h(Field, { label: "LinkedIn About", span2: true }, h("textarea", { value: (form && form.linkedinAbout) || "", onChange: (e) => updateField("linkedinAbout", e.target.value) })),
              h(Field, { label: "LinkedIn Skills" }, h("textarea", { value: (form && form.linkedinSkills) || "", onChange: (e) => updateField("linkedinSkills", e.target.value) })),
              h(Field, { label: "LinkedIn Featured" }, h("textarea", { value: (form && form.linkedinFeatured) || "", onChange: (e) => updateField("linkedinFeatured", e.target.value) })),
              h(Field, { label: "Operating Notes", span2: true }, h("textarea", { value: (form && form.notes) || "", onChange: (e) => updateField("notes", e.target.value) })),
              h(
                "div",
                { className: "actions span-2" },
                h("button", { className: "primary", onClick: saveProfile, disabled: saving }, saving ? "Saving..." : "Save to Source of Truth"),
                h("button", { className: "ghost", onClick: () => loadAll(roleKey, true), disabled: saving }, "Reload Current Data")
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
            h("h2", null, "Master Profile"),
            h(Badge, { tone: "ok" }, "Read-only history")
          ),
          h(
            "div",
            { className: "panel-body" },
            h(
              "div",
              { className: "list" },
              (data.masterProfile.employmentHistory || []).map((entry) =>
                h(
                  "div",
                  { className: "list-item", key: `${entry.company}-${entry.title}` },
                  h("strong", null, `${entry.company} - ${entry.title}`),
                  h("div", { className: "muted" }, entry.duration || "No duration listed"),
                  h("div", { className: "muted", style: { marginTop: "8px" } }, entry.summary),
                  h(
                    "div",
                    { className: "badge-row", style: { marginTop: "10px" } },
                    (entry.highlights || []).map((item) => h(Badge, { key: item }, item))
                  )
                )
              )
            ),
            h("div", { className: "divider" }),
            h("div", { className: "section-title" }, h("h3", null, "Current LinkedIn Snapshot"), h(Badge, { tone: "accent" }, "Current profile")),
            h("div", { className: "list" }, h("div", { className: "list-item" }, h("strong", null, "Headline"), h("div", null, data.currentLinkedIn.headline || "Not set")), h("div", { className: "list-item" }, h("strong", null, "About"), h("div", { className: "muted" }, data.currentLinkedIn.about || "No about section yet")), h("div", { className: "list-item" }, h("strong", null, "Skills"), h("div", { className: "badge-row" }, (data.currentLinkedIn.skills || []).map((item) => h(Badge, { key: item }, item)))))
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
            h("h2", null, "LinkedIn Sync"),
            h(Badge, { tone: "warn" }, "Review before submit")
          ),
          h(
            "div",
            { className: "panel-body" },
            h(
              "div",
              { className: "two-col" },
              h(
                "div",
                null,
                h("div", { className: "section-title" }, h("h3", null, "Current"), h("button", { className: "small", onClick: () => copyText(comparison.currentHeadline || "") }, "Copy")),
                h("div", { className: "code-block" }, comparison.currentHeadline || "No headline loaded"),
                h("div", { className: "divider" }),
                h("div", { className: "code-block" }, comparison.currentAbout || "No about section loaded")
              ),
              h(
                "div",
                null,
                h("div", { className: "section-title" }, h("h3", null, "Suggested"), h("button", { className: "small", onClick: () => copyText(comparison.suggestedHeadline || "") }, "Copy")),
                h("div", { className: "code-block" }, comparison.suggestedHeadline || "No suggestion yet"),
                h("div", { className: "divider" }),
                h("div", { className: "code-block" }, comparison.suggestedAbout || "No suggestion yet")
              )
            ),
            h("div", { className: "divider" }),
            h("div", { className: "scores" }, (dashboard.scoreNotes || []).map((note) => h("div", { className: "list-item", key: note }, note))),
            h(
              "div",
              { className: "badge-row", style: { marginTop: "12px" } },
              (comparison.missingCertifications || []).map((item) => h(Badge, { key: item, tone: "warn" }, item))
            ),
            h(
              "div",
              { className: "actions", style: { marginTop: "12px" } },
              h("button", { className: "primary", onClick: () => copyText(((packageOutput.copyPasteText || {}).headline) || "") }, "Copy Headline"),
              h("button", { className: "ghost", onClick: () => copyText(((packageOutput.copyPasteText || {}).about) || "") }, "Copy About"),
              h("button", { className: "ghost", onClick: () => copyText(((packageOutput.copyPasteText || {}).experience) || "") }, "Copy Experience")
            )
          )
        ),
        h(
          "div",
          { className: "panel" },
          h(
            "div",
            { className: "panel-header" },
            h("h2", null, "Automation Gate"),
            h(Badge, { tone: "danger" }, "No auto-submit")
          ),
          h(
            "div",
            { className: "panel-body" },
            h("div", { className: "muted" }, "Manual login is required. Review changes before any LinkedIn submission."),
            h("div", { className: "divider" }),
            h(
              "ol",
              { style: { margin: 0, paddingLeft: "18px", color: "var(--muted)", lineHeight: 1.6 } },
              (((automationPlan || {}).steps) || []).map((step) => h("li", { key: step }, step))
            ),
            h("div", { className: "divider" }),
            h("pre", { className: "code-block" }, JSON.stringify(((automationPlan || {}).proposedChanges) || {}, null, 2))
          )
        ),
        h(
          "div",
          { className: "panel" },
          h(
            "div",
            { className: "panel-header" },
            h("h2", null, "Generated Outputs"),
            h(Badge, { tone: "ok" }, "Markdown + copy text")
          ),
          h(
            "div",
            { className: "panel-body" },
            h("div", { className: "section-title" }, h("h3", null, "LinkedIn Markdown"), h("button", { className: "small", onClick: () => copyText(packageOutput.linkedinMarkdown || "") }, "Copy")),
            h("pre", { className: "code-block" }, packageOutput.linkedinMarkdown || "No markdown yet"),
            h("div", { className: "divider" }),
            h("div", { className: "section-title" }, h("h3", null, "ATS Resume"), h("button", { className: "small", onClick: () => copyText(packageOutput.resumeMarkdown || "") }, "Copy")),
            h("pre", { className: "code-block" }, packageOutput.resumeMarkdown || "No resume yet"),
            h("div", { className: "divider" }),
            h("div", { className: "section-title" }, h("h3", null, "Interview Prep"), h("button", { className: "small", onClick: () => copyText(packageOutput.interviewPrepMarkdown || "") }, "Copy")),
            h("pre", { className: "code-block" }, packageOutput.interviewPrepMarkdown || "No interview prep yet")
          )
        )
      )
    ),
    h(
      "footer",
      { className: "footer" },
      h("div", null, "LinkedIn outputs remain draft-only until you approve them manually."),
      h("div", { style: { marginTop: "6px" } }, `Storage: ${bootstrap && bootstrap.data ? "atlas_ops/logs/career_os_master.json" : "unavailable"}`)
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
