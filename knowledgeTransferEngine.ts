const knowledgeItems: any[] = [];

export function createKnowledgeTransferItem(item: any) {
  const stored = { ...item, id: item.id || `transfer-${knowledgeItems.length + 1}`, status: item.status || "Active" };
  knowledgeItems.push(stored);
  return stored;
}

export function generateExitContinuityPlan(person: any) {
  return {
    personName: person.name || person.editorName || person.contractorName,
    requiredTransfers: ["Current project status", "Client preferences", "File locations", "Templates used", "Known issues", "Lessons learned"],
    filesToCollect: person.files || [],
    approvalRequiredBeforeAccessChanges: true,
  };
}

export function createWorkflowGuide(workflow: any) {
  return createKnowledgeTransferItem({
    type: "Workflow Guide",
    title: workflow.title || workflow.workflowName,
    steps: workflow.steps || ["Document intake", "Document production", "Document QC", "Document approval", "Document handoff"],
    owner: workflow.owner,
  });
}

export function searchKnowledgeTransfer(query: string) {
  const needle = query.toLowerCase();
  return knowledgeItems.filter((item) => JSON.stringify(item).toLowerCase().indexOf(needle) >= 0 && item.status !== "Archived");
}

export function archiveKnowledgeTransferItem(itemId: string) {
  const item = knowledgeItems.find((entry) => entry.id === itemId);
  if (!item) throw new Error(`Knowledge transfer item ${itemId} not found.`);
  item.status = "Archived";
  return item;
}
