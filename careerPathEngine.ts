const paths: any[] = [];

export function createCareerPath(path: any) {
  const stored = { ...path, id: path.id || `career-${paths.length + 1}` };
  paths.push(stored);
  return stored;
}

export function generateEditorCareerPath() {
  return createCareerPath({
    id: "editor-path",
    pathName: "Editor Growth Path",
    stages: ["Shadow Editor", "Junior Editor", "Editor", "Senior Editor", "Lead Editor", "Operations Lead"],
    approvalRequiredForPromotionOrPay: true,
  });
}

export function generateCareerRequirements(stage: string) {
  const requirements: Record<string, string[]> = {
    "Shadow Editor": ["Complete onboarding", "Practice on non-client clips", "Understand QC checklist"],
    "Junior Editor": ["Pass test task", "Deliver supervised project", "Follow file organization rules"],
    Editor: ["Deliver client-ready edits", "Keep revisions low", "Communicate reliably"],
    "Senior Editor": ["Mentor others", "Handle complex edits", "Improve SOPs"],
    "Lead Editor": ["Review work", "Train editors", "Manage delivery quality"],
    "Operations Lead": ["Balance workload", "Improve systems", "Coordinate contractors"],
  };
  return requirements[stage] || ["Define requirements before using this stage."];
}

export function mapPersonToCareerPath(person: any, pathId: string) {
  const path = findPath(pathId);
  const score = Number(person.capabilityScore || person.qualityIndex || 0);
  const stage = score >= 90 ? path.stages[4] : score >= 80 ? path.stages[3] : score >= 65 ? path.stages[2] : score >= 45 ? path.stages[1] : path.stages[0];
  return {
    personName: person.name || person.editorName || person.contractorName,
    pathName: path.pathName,
    currentStage: stage,
    nextRequirements: generateCareerRequirements(stage),
    promotionRequiresColeApproval: true,
  };
}

function findPath(pathId: string) {
  const path = paths.find((item) => item.id === pathId);
  if (!path) throw new Error(`Career path ${pathId} not found.`);
  return path;
}
