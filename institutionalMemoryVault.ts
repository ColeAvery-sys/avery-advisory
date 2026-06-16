const vaultItems: any[] = [];

export function createVaultItem(item: any) {
  const stored = { ...item, id: item.id || `vault-${vaultItems.length + 1}`, status: item.status || "Active", lastUpdated: item.lastUpdated || new Date(0).toISOString() };
  vaultItems.push(stored);
  return stored;
}

export function storeVaultItem(item: any) {
  return createVaultItem(item);
}

export function getVaultItemsByType(type: string) {
  return vaultItems.filter((item) => String(item.type).toLowerCase() === type.toLowerCase() && item.status !== "Archived");
}

export function archiveVaultItem(itemId: string) {
  const item = findVaultItem(itemId);
  item.status = "Archived";
  return item;
}

export function exportInstitutionalMemoryIndex() {
  return {
    totalItems: vaultItems.filter((item) => item.status !== "Archived").length,
    processes: getVaultItemsByType("Process").length,
    sops: getVaultItemsByType("SOP").length,
    policies: getVaultItemsByType("Policy").length,
    brandGuides: getVaultItemsByType("Brand Guide").length,
    lessons: getVaultItemsByType("Lesson").length,
    templates: getVaultItemsByType("Template").length,
  };
}

export function generateCompanySurvivalPacket() {
  return {
    title: "Avery Industries LLC Brain",
    index: exportInstitutionalMemoryIndex(),
    criticalItems: vaultItems.filter((item) => item.importance === "Critical" || item.importanceScore >= 80).map((item) => item.title),
    note: "If everyone vanished tomorrow, start here: processes, SOPs, policies, brand guides, lessons, templates, and systems.",
  };
}

export function generateContinuityPacket() {
  return generateCompanySurvivalPacket();
}

export function attachTemplateToVault(itemId: string, templateId: string) {
  const item = findVaultItem(itemId);
  item.templates = Array.from(new Set([...(item.templates || []), templateId]));
  return item;
}

export function searchVault(query: string) {
  const needle = query.toLowerCase();
  return vaultItems.filter((item) => JSON.stringify(item).toLowerCase().indexOf(needle) >= 0 && item.status !== "Archived");
}

function findVaultItem(itemId: string) {
  const item = vaultItems.find((entry) => entry.id === itemId || entry.itemId === itemId);
  if (!item) throw new Error(`Vault item ${itemId} not found.`);
  return item;
}
