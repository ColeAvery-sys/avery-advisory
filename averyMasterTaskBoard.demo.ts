import { generateAppsScriptSummary, getMasterTaskBoardSpec } from "./averyMasterTaskBoardEngine";

const spec = getMasterTaskBoardSpec();

console.log("Avery Industries Master Task Board");
console.log({
  fileName: spec.fileName,
  tabs: spec.tabs.map((tab) => ({ name: tab.name, columns: tab.columns.length, starterRows: tab.starterRows?.length || 0 })),
  formulas: spec.formulas,
  appsScript: generateAppsScriptSummary(),
});
