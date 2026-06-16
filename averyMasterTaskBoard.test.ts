import { generateApprovalId, generateAppsScriptSummary, generateIdeaId, generateTaskId, getMasterTaskBoardSpec, getTaskBoardTab, MASTER_TASK_BOARD_NAME } from "./averyMasterTaskBoardEngine";

const spec = getMasterTaskBoardSpec();

assertEqual(spec.fileName, "Avery Industries - Master Task Board");
assertEqual(spec.tabs.length, 10);
assertEqual(spec.tabs[0].name, "Executive Queue");
assertEqual(getTaskBoardTab("Agent Tasks").columns[0], "Task ID");
const approvalDropdowns = getTaskBoardTab("Approvals").dropdowns || {};
assertEqual((approvalDropdowns.Status || []).indexOf("Needs More Info") >= 0, true);
assertEqual(getTaskBoardTab("Departments").starterRows?.length, 16);
assertEqual(getTaskBoardTab("Agents").starterRows?.length, 12);
assertEqual(getTaskBoardTab("Daily Brief").starterRows?.length, 6);
assertEqual(generateTaskId(1), "AI-0001");
assertEqual(generateApprovalId(12), "APP-0012");
assertEqual(generateIdeaId(99), "IDEA-0099");
assertEqual(spec.formulas.length, 7);
assertEqual(spec.sops.length >= 7, true);
assertEqual(generateAppsScriptSummary().generatorFile, "atlas_ops/templates/create_avery_master_task_board.gs");
assertEqual(MASTER_TASK_BOARD_NAME, spec.fileName);

console.log("All Avery Master Task Board tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
