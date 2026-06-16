import { generateCharterSummary, getAgentHierarchyRecord, getCodexDirective, getCursorDirective, getDevelopmentPriorityPhase, validateAgentAgainstCharter } from "./averyCharterEngine";

console.log("Avery Industries Charter Snapshot");
console.log({
  charter: generateCharterSummary(),
  atlasPrime: getAgentHierarchyRecord("ATLAS Prime"),
  phaseOne: getDevelopmentPriorityPhase(1),
  cursorDirective: getCursorDirective(),
  codexDirective: getCodexDirective(),
  agentValidation: validateAgentAgainstCharter({
    id: "agent-atlas-prime",
    name: "ATLAS Prime",
    department: "Executive",
    manager: "Cole",
    purpose: "Coordinate all divisions.",
    status: "Active",
    lastActivity: "Reviewed charter.",
    currentTask: "Build command center.",
    priorityLevel: "High",
  }),
});
