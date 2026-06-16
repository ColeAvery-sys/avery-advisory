const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  RECRUITER_DATA_PATH,
  loadRecruiterData,
  saveRecruiterData,
  updateRecruiterData,
  buildRecruiterDailyPlan,
  buildRecruiterAutomationPlan,
  generateRecruiterDashboard,
  importRecruiterJobs,
  parseRecruiterJobFeed,
  recordRecruiterJobAction,
} = require("../../dist/careerRecruiterEngine");

const ROOT = __dirname;
const PORT = Number(process.env.RECRUITER_OS_PORT || 8798);

function send(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function sendJson(res, statusCode, body) {
  return send(res, statusCode, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify(body));
}

function contentTypeFor(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  return "application/octet-stream";
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 300000) req.destroy();
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function parseListField(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function serveStatic(req, res, pathname) {
  const assetMap = {
    "/": "index.html",
    "/app.js": "app.js",
    "/styles.css": "styles.css",
    "/favicon.ico": "favicon.ico",
  };
  const assetName = assetMap[pathname];
  if (!assetName) return false;
  const filePath = path.join(ROOT, assetName);
  if (!fs.existsSync(filePath)) {
    return send(res, 404, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ error: "Not found" }));
  }
  return send(res, 200, { "Content-Type": contentTypeFor(filePath) }, fs.readFileSync(filePath));
}

function buildPatch(body) {
  const patch = {};
  if (body.profile) {
    patch.profile = {
      name: body.profile.name,
      location: body.profile.location,
      resumeText: body.profile.resumeText,
      linkedinText: body.profile.linkedinText,
      salaryTarget: Number(body.profile.salaryTarget || 0),
      remoteOnly: Boolean(body.profile.remoteOnly),
      targetTitles: parseListField(body.profile.targetTitles),
      skills: parseListField(body.profile.skills),
      keywords: parseListField(body.profile.keywords),
      industries: parseListField(body.profile.industries),
      dealBreakers: parseListField(body.profile.dealBreakers),
      notes: parseListField(body.profile.notes),
    };
  }
  return patch;
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    const data = loadRecruiterData(RECRUITER_DATA_PATH);

    if (pathname === "/api/health") {
      return sendJson(res, 200, {
        ok: true,
        system: "ATLAS Recruiter",
        company: "Avery Industries LLC",
        storage: RECRUITER_DATA_PATH,
      });
    }

    if (pathname === "/api/bootstrap") {
      return sendJson(res, 200, {
        ok: true,
        data,
      });
    }

    if (pathname === "/api/dashboard") {
      return sendJson(res, 200, {
        ok: true,
        dashboard: generateRecruiterDashboard(data),
      });
    }

    if (pathname === "/api/plan") {
      return sendJson(res, 200, {
        ok: true,
        plan: buildRecruiterDailyPlan(data),
      });
    }

    if (pathname === "/api/automation/plan" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const jobId = url.searchParams.get("jobId");
      if (!jobId) {
        return sendJson(res, 400, { ok: false, error: "jobId is required" });
      }
      return sendJson(res, 200, {
        ok: true,
        plan: buildRecruiterAutomationPlan(data, jobId),
      });
    }

    if (pathname === "/api/profile" && req.method === "PATCH") {
      const body = await readJson(req);
      const patch = buildPatch(body);
      const updated = saveRecruiterData(updateRecruiterData(data, patch), RECRUITER_DATA_PATH);
      return sendJson(res, 200, { ok: true, data: updated });
    }

    if (pathname === "/api/import" && req.method === "POST") {
      const body = await readJson(req);
      const jobs = parseRecruiterJobFeed(String(body.jobs || "[]"));
      const updated = saveRecruiterData(importRecruiterJobs(data, jobs), RECRUITER_DATA_PATH);
      return sendJson(res, 200, { ok: true, data: updated, imported: jobs.length });
    }

    if (pathname === "/api/job-action" && req.method === "POST") {
      const body = await readJson(req);
      const updated = saveRecruiterData(recordRecruiterJobAction(data, String(body.jobId || ""), String(body.action || "draft"), String(body.note || "")), RECRUITER_DATA_PATH);
      return sendJson(res, 200, { ok: true, data: updated });
    }

    if (pathname === "/api/reset" && req.method === "POST") {
      const { createDefaultRecruiterData } = require("../../dist/careerRecruiterEngine");
      const reset = saveRecruiterData(createDefaultRecruiterData(), RECRUITER_DATA_PATH);
      return sendJson(res, 200, { ok: true, data: reset });
    }

    const served = serveStatic(req, res, pathname);
    if (served !== false) return served;

    return send(res, 404, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ error: "Not found" }));
  } catch (error) {
    console.error(error);
    return send(res, 500, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify({ error: "Internal error" }));
  }
});

server.listen(PORT, () => {
  console.log(`ATLAS Recruiter listening on http://localhost:${PORT}`);
});
