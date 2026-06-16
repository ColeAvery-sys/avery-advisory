const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  CAREER_OS_DATA_PATH,
  loadCareerOSData,
  saveCareerOSData,
  updateCareerOSData,
  getCareerRoleLibrary,
  compareCareerProfiles,
  generateCareerDashboard,
  generateCareerProfilePackage,
  buildLinkedInAutomationPlan,
} = require("../../dist/careerOSEngine");

const ROOT = __dirname;
const PORT = Number(process.env.CAREER_OS_PORT || 8799);

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
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 200000) req.destroy();
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

function sendJson(res, statusCode, body) {
  return send(res, statusCode, { "Content-Type": "application/json; charset=utf-8" }, JSON.stringify(body));
}

function normalizeRoleKey(value) {
  const text = String(value || "founder_ceo").toLowerCase();
  if (text.includes("operations")) return "operations_manager";
  if (text.includes("customer success")) return "customer_success_manager";
  if (text.includes("technical support")) return "technical_support_manager";
  if (text.includes("sales")) return "sales_manager";
  if (text.includes("marketing")) return "marketing_manager";
  return "founder_ceo";
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

function parseListField(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildPatch(body) {
  const patch = {};
  if (body.masterProfile) patch.masterProfile = body.masterProfile;
  if (body.currentLinkedIn) patch.currentLinkedIn = body.currentLinkedIn;
  if (body.notes) patch.notes = parseListField(body.notes);
  if (body.profile) {
    patch.masterProfile = {
      name: body.profile.name,
      location: body.profile.location,
      currentTitle: body.profile.currentTitle,
      currentCompany: body.profile.currentCompany,
      targetHeadline: body.profile.targetHeadline,
      about: body.profile.about,
      certifications: parseListField(body.profile.certifications),
      education: parseListField(body.profile.education),
      skills: parseListField(body.profile.skills),
      awards: parseListField(body.profile.awards),
      promotions: parseListField(body.profile.promotions),
      projects: parseListField(body.profile.projects),
      revenueAchievements: parseListField(body.profile.revenueAchievements),
      leadershipMetrics: parseListField(body.profile.leadershipMetrics),
      recentAchievements: parseListField(body.profile.recentAchievements),
    };
    patch.currentLinkedIn = {
      headline: body.profile.linkedinHeadline,
      about: body.profile.linkedinAbout,
      skills: parseListField(body.profile.linkedinSkills),
      featured: parseListField(body.profile.linkedinFeatured),
    };
  }
  return patch;
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    const data = loadCareerOSData(CAREER_OS_DATA_PATH);

    if (pathname === "/api/health") {
      return sendJson(res, 200, {
        ok: true,
        system: "Career OS",
        company: "Avery Industries LLC",
        storage: CAREER_OS_DATA_PATH,
      });
    }

    if (pathname === "/api/bootstrap") {
      return sendJson(res, 200, {
        ok: true,
        data,
        roles: getCareerRoleLibrary(),
      });
    }

    if (pathname === "/api/package" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const roleKey = normalizeRoleKey(url.searchParams.get("role"));
      return sendJson(res, 200, {
        ok: true,
        roleKey,
        package: generateCareerProfilePackage(data, roleKey),
      });
    }

    if (pathname === "/api/compare" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const roleKey = normalizeRoleKey(url.searchParams.get("role"));
      return sendJson(res, 200, {
        ok: true,
        roleKey,
        comparison: compareCareerProfiles(data, roleKey),
        dashboard: generateCareerDashboard(data, roleKey),
      });
    }

    if (pathname === "/api/automation/plan" && req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const roleKey = normalizeRoleKey(url.searchParams.get("role"));
      return sendJson(res, 200, {
        ok: true,
        roleKey,
        plan: buildLinkedInAutomationPlan(data, roleKey),
      });
    }

    if (pathname === "/api/profile" && req.method === "PATCH") {
      const body = await readJson(req);
      const patch = buildPatch(body);
      const updated = saveCareerOSData(updateCareerOSData(data, patch), CAREER_OS_DATA_PATH);
      return sendJson(res, 200, { ok: true, data: updated });
    }

    if (pathname === "/api/reset" && req.method === "POST") {
      const { createDefaultCareerOSData } = require("../../dist/careerOSEngine");
      const reset = saveCareerOSData(createDefaultCareerOSData(), CAREER_OS_DATA_PATH);
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
  console.log(`Career OS listening on http://localhost:${PORT}`);
});
