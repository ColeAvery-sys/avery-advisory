const fs = require("fs");
const path = require("path");
const assert = require("assert");

const ROOT = path.resolve(__dirname, "..");
const CENTER = path.join(ROOT, "docs", "atlas_command_center");
const DATA = JSON.parse(fs.readFileSync(path.join(CENTER, "data.json"), "utf8"));
const HTML = fs.readFileSync(path.join(CENTER, "index.html"), "utf8");
const APP = fs.readFileSync(path.join(CENTER, "app.js"), "utf8");
const DOC = fs.readFileSync(path.join(ROOT, "docs", "ATLAS_COMMAND_CENTER_V1.md"), "utf8");

function includesEvery(source, values, label) {
  values.forEach((value) => assert.ok(source.includes(value), `${label} missing: ${value}`));
}

includesEvery(DATA.company.parent, ["Avery Industries LLC"], "company");
includesEvery(HTML, ["ATLAS Command Center v1", "primary-nav", "route-list"], "html");
includesEvery(APP, ["/dashboard", "/idea-vault", "/approval-queue", "data-form=\"idea\"", "data-approval-action"], "app routes");
includesEvery(DOC, ["Avery Industries LLC", "/dashboard", "/approval-queue", "/idea-vault/distribute", "/leads/drafts"], "documentation");

assert.deepStrictEqual(
  DATA.routes.map((route) => route.path),
  ["/dashboard", "/idea-vault", "/leads", "/content-ops", "/grants", "/creator-logistics", "/divisions", "/settings", "/approval-queue"],
  "routes are incomplete"
);

assert.deepStrictEqual(
  DATA.statusBadges,
  ["Draft", "Pending Approval", "Approved", "Sent", "Blocked"],
  "status badges changed"
);

assert.deepStrictEqual(
  DATA.divisions.map((division) => division.name),
  [
    "AveryTech",
    "ATLAS OS",
    "Creator Logistics",
    "Avery Entertainment",
    "Avery Music Group",
    "Avery Collectibles",
    "Avery Academy",
    "Avery Community Foundation",
    "Apollo Athletics",
    "Apollo Apparel",
    "Apollo Nutrition",
    "Apollo Training",
    "Apollo Recovery"
  ],
  "divisions list is incomplete"
);

assert.ok(
  !/Avery Enterprises/.test([HTML, APP, DOC, JSON.stringify(DATA)].join("\n")),
  "legacy company naming still exists in the command center package"
);

assert.ok(APP.includes("Generate Codex Batch"), "idea vault codex workflow missing");
assert.ok(APP.includes("Generate Checklist"), "grant checklist workflow missing");
assert.ok(APP.includes("Export CSV"), "lead export workflow missing");

console.log("ATLAS Command Center validation passed.");
