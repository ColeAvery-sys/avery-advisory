const http = require("http");
const fs = require("fs");
const path = require("path");
const sharedData = require("./shared-data");

const ROOT = __dirname;
const PORT = Number(process.env.ATLAS_COMMAND_CENTER_PORT || 8788);

function send(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function contentTypeFor(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

function readJson(req) {
  return new Promise(function (resolve, reject) {
    var body = "";
    req.on("data", function (chunk) {
      body += chunk;
      if (body.length > 100000) req.destroy();
    });
    req.on("end", function () {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(res, statusCode, body) {
  return send(res, statusCode, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify(body));
}

function findById(items, id) {
  return items.find(function (item) {
    return String(item.id) === String(id);
  });
}

function toCsv(rows, columns) {
  var header = columns.join(",");
  var lines = rows.map(function (row) {
    return columns
      .map(function (column) {
        var value = row[column];
        var text = value == null ? "" : String(value);
        return '"' + text.replace(/"/g, '""') + '"';
      })
      .join(",");
  });
  return [header].concat(lines).join("\n");
}

function serveStatic(req, res, pathname) {
  var assetMap = {
    "/": "index.html",
    "/dashboard": "index.html",
    "/idea-vault": "index.html",
    "/leads": "index.html",
    "/content-ops": "index.html",
    "/grants": "index.html",
    "/creator-logistics": "index.html",
    "/divisions": "index.html",
    "/settings": "index.html",
    "/approval-queue": "index.html",
    "/app.js": "app.js",
    "/styles.css": "styles.css",
    "/data.json": "data.json",
  };
  var assetName = assetMap[pathname] || "index.html";
  var filePath = path.join(ROOT, assetName);
  if (!fs.existsSync(filePath)) {
    return send(res, 404, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ error: "Not found" }));
  }
  return send(res, 200, { "Content-Type": contentTypeFor(filePath) }, fs.readFileSync(filePath));
}

function collectionHandler(collectionName, pathname, req, res) {
  var routeName = collectionName === "contentPackages" ? "content-packages" : collectionName === "approvalQueue" ? "approval-queue" : collectionName;

  if (req.method === "GET" && pathname === "/api/" + routeName) {
    return send(res, 200, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ ok: true, items: sharedData.getAtlasCollection(collectionName) }));
  }

  if (req.method === "POST" && pathname === "/api/" + routeName) {
    return readJson(req).then(function (body) {
      var item = sharedData.createAtlasSharedRecord(collectionName, body, body.actor || "ATLAS");
      return send(res, 201, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ ok: true, item: item }));
    });
  }

  var updateMatch = pathname.match(new RegExp("^/api/" + routeName + "/([^/]+)$"));
  var actionMatch = pathname.match(new RegExp("^/api/" + routeName + "/([^/]+)/(approve|reject|export)$"));

  if (req.method === "PATCH" && updateMatch) {
    return readJson(req).then(function (body) {
      var item = sharedData.updateAtlasSharedRecord(collectionName, updateMatch[1], body, body.actor || "ATLAS");
      return send(res, 200, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ ok: true, item: item }));
    });
  }

  if (req.method === "POST" && actionMatch) {
    var itemId = actionMatch[1];
    var action = actionMatch[2];
    if (action === "approve") {
      var approved = sharedData.approveAtlasSharedRecord(collectionName, itemId, "ATLAS");
      return send(res, 200, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ ok: true, item: approved }));
    }
    if (action === "reject") {
      return readJson(req).then(function (body) {
        var rejected = sharedData.rejectAtlasSharedRecord(collectionName, itemId, body.note || "Rejected", body.actor || "ATLAS");
        return send(res, 200, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ ok: true, item: rejected }));
      });
    }
    if (action === "export") {
      var exported = sharedData.exportAtlasSharedRecord(collectionName, itemId, "ATLAS");
      return send(res, 200, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ ok: true, item: exported }));
    }
  }

  return false;
}

function normalizeIdeaInput(body) {
  return {
    title: body.title || body.idea || "Untitled idea",
    rawNote: body.rawNote || body.note || body.description || "",
    category: body.category || "General",
    urgency: Number(body.urgency || 3),
    revenuePotential: Number(body.revenuePotential || 3),
    relatedDivision: body.relatedDivision || "ATLAS OS",
    source: body.source || "manual",
    status: body.status || "Draft",
    value: body.value || "Medium",
    effort: body.effort || "Medium",
  };
}

function normalizeLeadInput(body) {
  return {
    name: body.name || body.creatorName || "Unnamed lead",
    platform: body.platform || "",
    url: body.url || "",
    niche: body.niche || "",
    painPoints: Array.isArray(body.painPoints) ? body.painPoints : String(body.painPoints || "").split(",").map(function (item) { return item.trim(); }).filter(Boolean),
    notes: body.notes || "",
    value: body.value || "$0",
    status: body.status || "Draft",
    stage: body.stage || "Discovery",
  };
}

const server = http.createServer(function (req, res) {
  try {
    var pathname = new URL(req.url, "http://" + req.headers.host).pathname;

    if (pathname === "/api/health") {
      return send(res, 200, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ ok: true, backend: "shared-json", parentCompany: "Avery Industries LLC" }));
    }

    if (pathname === "/api/bootstrap") {
      return sendJson(res, 200, sharedData.getAtlasSharedBootstrapData());
    }

    if (pathname === "/api/idea-vault/distribute" && req.method === "POST") {
      return readJson(req).then(function (body) {
        var idea = sharedData.createIdeaRecord(normalizeIdeaInput(body), body.actor || "ATLAS");
        return sendJson(res, 201, {
          ok: true,
          item: idea,
          distribution: idea.distribution,
        });
      });
    }

    if (pathname === "/api/idea-vault/send-to-approval" && req.method === "POST") {
      return readJson(req).then(function (body) {
        var payload = normalizeIdeaInput(body);
        var approval = sharedData.createApprovalRecord({
          title: body.title || payload.title,
          type: body.type || "Codex batch",
          division: body.division || payload.relatedDivision,
          generatedContent: body.generatedContent || payload.rawNote,
          riskLevel: body.riskLevel || "Medium",
          revenuePotential: String(body.revenuePotential || payload.revenuePotential || "Medium"),
          collection: body.collection || "ideas",
          itemId: body.itemId || "",
          status: "Pending Approval",
          history: [],
        }, body.actor || "ATLAS");
        return sendJson(res, 201, { ok: true, item: approval });
      });
    }

    if (pathname === "/api/idea-vault/generate-codex-batch" && req.method === "POST") {
      return readJson(req).then(function (body) {
        var state = sharedData.loadAtlasSharedData();
        var idea = body.ideaId ? findById(state.ideas, body.ideaId) : normalizeIdeaInput(body);
        if (!idea) return sendJson(res, 404, { error: "Idea not found" });
        if (!idea.id || !idea.distribution) {
          idea = sharedData.createIdeaRecord(idea, body.actor || "ATLAS");
        }
        var distribution = idea.distribution || {};
        var tasks = (distribution.codexTasks || []).map(function (task, index) {
          return sharedData.createTaskRecord({
            title: task,
            owner: body.owner || idea.relatedDivision || "ATLAS OS",
            status: "Draft",
            area: "Idea Vault",
            priority: body.priority || "Draft",
            due: body.due || "",
            id: `${idea.id || "idea"}-codex-${index + 1}`,
          }, body.actor || "ATLAS");
        });
        return sendJson(res, 201, {
          ok: true,
          ideaId: idea.id || null,
          distribution: distribution,
          tasks: tasks,
        });
      });
    }

    if (pathname === "/api/leads/score" && req.method === "POST") {
      return readJson(req).then(function (body) {
        var lead = normalizeLeadInput(body);
        var fitScore = sharedData.scoreLeadRecord(lead);
        return sendJson(res, 200, {
          ok: true,
          fitScore: fitScore,
          offerMatch: sharedData.recommendOfferTier(fitScore),
        });
      });
    }

    if (pathname === "/api/leads/drafts" && req.method === "POST") {
      return readJson(req).then(function (body) {
        var state = sharedData.loadAtlasSharedData();
        var lead = body.leadId ? findById(state.leads, body.leadId) : normalizeLeadInput(body);
        if (!lead) return sendJson(res, 404, { error: "Lead not found" });
        if (!lead.id || !lead.fitScore) {
          lead = sharedData.createLeadRecord(lead, body.actor || "ATLAS");
        }
        var drafts = sharedData.createLeadDrafts(lead, body.actor || "ATLAS");
        if (body.queue) {
          var approval = sharedData.createApprovalRecord({
            title: `Outreach drafts for ${lead.name}`,
            type: "DM",
            division: body.division || "Creator Logistics",
            generatedContent: JSON.stringify(drafts, null, 2),
            riskLevel: "Medium",
            revenuePotential: drafts.revenuePotential,
            collection: "leads",
            itemId: lead.id || "",
            status: "Pending Approval",
            history: [],
          }, body.actor || "ATLAS");
          drafts.approval = approval;
        }
        return sendJson(res, 200, { ok: true, lead: lead, drafts: drafts });
      });
    }

    if (pathname === "/api/leads/export.csv" && req.method === "GET") {
      var leadRows = sharedData.loadAtlasSharedData().leads.map(function (lead) {
        return {
          name: lead.name,
          platform: lead.platform,
          niche: lead.niche,
          fitScore: lead.fitScore,
          value: lead.value,
          status: lead.status,
          stage: lead.stage,
          offerMatch: lead.offerMatch,
        };
      });
      return send(res, 200, { "Content-Type": "text/csv; charset=utf-8" }, toCsv(leadRows, ["name", "platform", "niche", "fitScore", "value", "status", "stage", "offerMatch"]));
    }

    if (pathname === "/api/content-packages/generate" && req.method === "POST") {
      return readJson(req).then(function (body) {
        var payload = body.ideaId ? findById(sharedData.loadAtlasSharedData().ideas, body.ideaId) : body;
        if (!payload) return sendJson(res, 404, { error: "Idea not found" });
        var packageDraft = sharedData.generateContentPackageForIdea(payload);
        var item = sharedData.createContentPackageRecord({
          title: body.title || packageDraft.title,
          owner: body.owner || payload.relatedDivision || "ATLAS OS",
          channel: body.channel || "Internal",
          platform: body.platform || "Multi-platform",
          tone: body.tone || "Executive",
          audience: body.audience || "Founder audience",
          goal: body.goal || "Turn idea into content",
          status: "Draft",
        }, body.actor || "ATLAS");
        return sendJson(res, 201, { ok: true, item: item, packageDraft: packageDraft });
      });
    }

    if (pathname === "/api/grants/checklist" && req.method === "POST") {
      return readJson(req).then(function (body) {
        var checklist = sharedData.generateGrantChecklist(body);
        return sendJson(res, 200, { ok: true, checklist: checklist });
      });
    }

    if (pathname === "/api/divisions/flowchart" && req.method === "GET") {
      var bootstrap = sharedData.getAtlasSharedBootstrapData();
      return sendJson(res, 200, { ok: true, flowchart: bootstrap.companyFlowchart, divisions: bootstrap.divisions });
    }

    if (pathname === "/api/ideas" || pathname.indexOf("/api/ideas/") === 0) {
      var handledIdeas = collectionHandler("ideas", pathname, req, res);
      if (handledIdeas !== false) return handledIdeas;
    }
    if (pathname === "/api/leads" || pathname.indexOf("/api/leads/") === 0) {
      var handledLeads = collectionHandler("leads", pathname, req, res);
      if (handledLeads !== false) return handledLeads;
    }
    if (pathname === "/api/tasks" || pathname.indexOf("/api/tasks/") === 0) {
      var handledTasks = collectionHandler("tasks", pathname, req, res);
      if (handledTasks !== false) return handledTasks;
    }
    if (pathname === "/api/divisions" || pathname.indexOf("/api/divisions/") === 0) {
      var handledDivisions = collectionHandler("divisions", pathname, req, res);
      if (handledDivisions !== false) return handledDivisions;
    }
    if (pathname === "/api/content-packages" || pathname.indexOf("/api/content-packages/") === 0) {
      var handledContent = collectionHandler("contentPackages", pathname, req, res);
      if (handledContent !== false) return handledContent;
    }
    if (pathname === "/api/grants" || pathname.indexOf("/api/grants/") === 0) {
      var handledGrants = collectionHandler("grants", pathname, req, res);
      if (handledGrants !== false) return handledGrants;
    }
    if (pathname === "/api/approval-queue" || pathname.indexOf("/api/approval-queue/") === 0) {
      var handledApprovals = collectionHandler("approvalQueue", pathname, req, res);
      if (handledApprovals !== false) return handledApprovals;
    }
    if (pathname === "/api/audit-logs") {
      return send(res, 200, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ ok: true, items: sharedData.getAtlasCollection("auditLogs") }));
    }

    return serveStatic(req, res, pathname);
  } catch (error) {
    console.error(error);
    return send(res, 500, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ error: "Internal error" }));
  }
});

server.listen(PORT, function () {
  console.log("ATLAS Command Center listening on http://localhost:" + PORT);
});
