declare const require: any;

const fs = require("fs");
import {
  ATLAS_SHARED_DATA_PATH,
  approveAtlasSharedRecord,
  createAtlasSharedRecord,
  createApprovalRecord,
  createContentPackageRecord,
  createContentFromIdea,
  createGrantRecord,
  createIdeaRecord,
  createLeadDrafts,
  createLeadRecord,
  createTaskRecord,
  exportAtlasSharedRecord,
  getAtlasSharedBootstrapData,
  loadAtlasSharedData,
  generateContentPackageForIdea,
  generateGrantChecklist,
  recommendOfferTier,
  rejectAtlasSharedRecord,
  resetAtlasSharedDataForDemo,
  scoreLeadRecord,
  updateAtlasSharedRecord,
} from "./atlasSharedDataLayer";

const backup = fs.existsSync(ATLAS_SHARED_DATA_PATH) ? fs.readFileSync(ATLAS_SHARED_DATA_PATH, "utf8") : null;

try {
  resetAtlasSharedDataForDemo();

  const bootstrap = getAtlasSharedBootstrapData();
  assertEqual(bootstrap.company.parent, "Avery Industries LLC");
  assertEqual(bootstrap.routes.length, 9);
  assertEqual(bootstrap.collections.ideas.length >= 3, true);
  assertEqual(bootstrap.collections.leads.length >= 4, true);
  assertEqual(bootstrap.collections.tasks.length >= 3, true);
  assertEqual(bootstrap.divisions.length >= 13, true);
  assertEqual(bootstrap.companyFlowchart.branches.length >= 13, true);

  const created = createAtlasSharedRecord("ideas", {
    title: "Shared data layer idea",
    source: "QA",
    value: "High",
    effort: "Low",
  }, "QA");
  assertEqual(created.status, "Draft");

  const updated = updateAtlasSharedRecord("ideas", created.id, {
    status: "Pending Approval",
    summary: "Updated through shared store.",
  }, "QA");
  assertEqual(updated.status, "Pending Approval");

  const approved = approveAtlasSharedRecord("ideas", created.id, "QA");
  assertEqual(approved.status, "Approved");

  const rejected = rejectAtlasSharedRecord("leads", "lead-1", "Need more context", "QA");
  assertEqual(rejected.status, "Blocked");

  const exported = exportAtlasSharedRecord("contentPackages", "content-3", "QA");
  assertEqual(exported.status, "Sent");

  const idea = createIdeaRecord({
    title: "Accessibility launch brief",
    rawNote: "Build a content and grant package for disability support.",
    category: "Grant",
    relatedDivision: "AveryTech",
    source: "manual",
  }, "QA");
  assertEqual(Boolean(idea.distribution.grantOpportunities.length), true);

  const lead = createLeadRecord({
    name: "Creator Lead",
    platform: "YouTube",
    niche: "short-form editing",
    painPoints: ["editing", "shorts", "budget"],
  }, "QA");
  assertEqual(scoreLeadRecord(lead) >= 1, true);
  assertEqual(recommendOfferTier(lead.fitScore).length > 0, true);

  const leadDrafts = createLeadDrafts(lead);
  assertEqual(leadDrafts.approvalRequired, true);

  const contentPackage = createContentPackageRecord({
    title: "Content package test",
    owner: "ATLAS OS",
    channel: "Internal",
  }, "QA");
  assertEqual(contentPackage.status, "Draft");

  const grant = createGrantRecord({
    title: "Grant packet test",
    agency: "Foundation",
    amount: "$25000",
  }, "QA");
  assertEqual(Boolean(generateGrantChecklist(grant).problemStatement), true);

  const approval = createApprovalRecord({
    title: "Approval packet test",
    type: "DM",
    division: "Creator Logistics",
    generatedContent: "draft content",
    collection: "leads",
    itemId: lead.id,
  }, "QA");
  assertEqual(approval.status, "Pending Approval");

  const contentPlan = generateContentPackageForIdea(idea);
  assertEqual(Array.isArray(contentPlan.productionStages), true);
  assertEqual(Boolean(createContentFromIdea(idea, "QA").title), true);

  const data = loadAtlasSharedData();
  const eventTypes = data.auditLogs.map((entry) => entry.eventType);
  assertEqual(eventTypes.indexOf("Item Created") >= 0, true);
  assertEqual(eventTypes.indexOf("Item Updated") >= 0, true);
  assertEqual(eventTypes.indexOf("Item Approved") >= 0, true);
  assertEqual(eventTypes.indexOf("Item Rejected") >= 0, true);
  assertEqual(eventTypes.indexOf("Item Exported") >= 0, true);
  assertEqual(data.ideas.some((item) => item.id === created.id && item.status === "Approved"), true);
  assertEqual(Boolean(data.leads.some((item) => item.id === lead.id && item.history && item.history.length > 0)), true);
} finally {
  if (backup === null) {
    if (fs.existsSync(ATLAS_SHARED_DATA_PATH)) fs.unlinkSync(ATLAS_SHARED_DATA_PATH);
  } else {
    fs.writeFileSync(ATLAS_SHARED_DATA_PATH, backup);
  }
}

console.log("All ATLAS shared data layer tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}
