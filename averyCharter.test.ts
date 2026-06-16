import { actionRequiresColeApproval, generateCharterSummary, getAgentHierarchyRecord, getApprovalPolicy, getCharterDivision, getCodexDirective, getCoreDivisions, getCursorDirective, getDevelopmentPriorityPhase, getSuccessCondition, validateAgentAgainstCharter } from "./averyCharterEngine";

const summary = generateCharterSummary();
assertEqual(summary.organization, "Avery Industries LLC");
assertEqual(summary.finalApprovalAuthority, "Cole Avery");
assertEqual(summary.activeDivisions.indexOf("Creator Logistics") >= 0, true);
assertEqual(summary.activeDivisions.indexOf("ATLAS HQ") >= 0, true);
assertEqual(summary.phaseOneRequired[0], "Agent Registry");

assertEqual(getCharterDivision("AveryTech").purpose.indexOf("disability-aid") >= 0, true);
assertEqual(getCharterDivision("Studio ColeTrain").status, "Strategic Expansion");
assertEqual(getCoreDivisions().length, 16);
assertEqual(getAgentHierarchyRecord("ATLAS Prime").reportsTo, "Cole Avery");
assertEqual(getDevelopmentPriorityPhase(2).required.indexOf("Creator Logistics CRM") >= 0, true);
assertEqual(getApprovalPolicy().blockedWithoutColeApproval.indexOf("Submit grants") >= 0, true);
assertEqual(getCursorDirective().priorities[0], "ATLAS Command Center");
assertEqual(getCodexDirective().priorities.indexOf("Company Documentation") >= 0, true);
assertEqual(getSuccessCondition().indexOf("Daily reports are generated automatically.") >= 0, true);

const invalid = validateAgentAgainstCharter({ id: "agent-1", name: "ATLAS Prime" });
assertEqual(invalid.valid, false);
assertEqual(invalid.missing.indexOf("department") >= 0, true);

const valid = validateAgentAgainstCharter({
  id: "agent-1",
  name: "ATLAS Prime",
  department: "Executive",
  manager: "Cole",
  purpose: "Coordinate company operations.",
  status: "Active",
  lastActivity: "Created charter summary.",
  currentTask: "Build operating system.",
  priorityLevel: "High",
});
assertEqual(valid.valid, true);
assertEqual(actionRequiresColeApproval("spend money on software"), true);
assertEqual(actionRequiresColeApproval("draft a report"), false);

console.log("All Avery Industries charter tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
