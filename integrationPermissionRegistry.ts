export type ConnectionStatus = "Planned" | "Connected" | "Paused";
export type IntegrationRecord = {
  toolName: string;
  category: string;
  connectionStatus: ConnectionStatus;
  permissionLevel: "Draft Only" | "Internal Only" | "Approval Required";
  allowedActions: string[];
  blockedActions: string[];
  approvalRequiredActions: string[];
  lastSync?: string;
  notes?: string;
};

const integrations: IntegrationRecord[] = [];

const defaults: Record<string, Omit<IntegrationRecord, "toolName" | "lastSync">> = {
  gmail: { category: "Communication", connectionStatus: "Planned", permissionLevel: "Draft Only", allowedActions: ["create draft"], blockedActions: ["auto send"], approvalRequiredActions: ["send email"], notes: "Draft only unless Cole approves send." },
  calendar: { category: "Calendar", connectionStatus: "Planned", permissionLevel: "Approval Required", allowedActions: ["suggest event"], blockedActions: ["auto invite"], approvalRequiredActions: ["external invite"], notes: "Suggest events unless Cole approves external invite." },
  drive: { category: "Files", connectionStatus: "Planned", permissionLevel: "Approval Required", allowedActions: ["organize", "create draft"], blockedActions: ["delete"], approvalRequiredActions: ["delete file"], notes: "Never delete without approval." },
  stripe: { category: "Payments", connectionStatus: "Planned", permissionLevel: "Approval Required", allowedActions: ["prepare notes"], blockedActions: ["auto charge", "auto pay"], approvalRequiredActions: ["money action"], notes: "Approval required for all money actions." },
  quickbooks: { category: "Accounting", connectionStatus: "Planned", permissionLevel: "Approval Required", allowedActions: ["prepare notes"], blockedActions: ["auto invoice", "auto payment"], approvalRequiredActions: ["money action"], notes: "Approval required for all money actions." },
  social: { category: "Publishing", connectionStatus: "Planned", permissionLevel: "Approval Required", allowedActions: ["draft post"], blockedActions: ["auto post"], approvalRequiredActions: ["public post"], notes: "Approval required for public posts." },
  "make.com": { category: "Automation", connectionStatus: "Planned", permissionLevel: "Internal Only", allowedActions: ["internal automation"], blockedActions: ["external action"], approvalRequiredActions: ["external automation"], notes: "Internal automations only unless approved." },
};

export function createIntegrationRecord(tool: Partial<IntegrationRecord> & { toolName: string }): IntegrationRecord {
  const key = tool.toolName.toLowerCase();
  const base = defaults[key] || { category: "Planned", connectionStatus: "Planned" as const, permissionLevel: "Approval Required" as const, allowedActions: [], blockedActions: ["live external action"], approvalRequiredActions: ["all external actions"], notes: "Placeholder integration." };
  const record = { ...base, ...tool };
  integrations.push(record);
  return record;
}

export function updateConnectionStatus(toolName: string, status: ConnectionStatus): IntegrationRecord {
  const record = getIntegrationPermissions(toolName);
  record.connectionStatus = status;
  record.lastSync = new Date().toISOString();
  return record;
}

export function getIntegrationPermissions(toolName: string): IntegrationRecord {
  const record = integrations.find((item) => item.toolName.toLowerCase() === toolName.toLowerCase());
  if (!record) throw new Error(`Integration ${toolName} not found.`);
  return record;
}

export function checkToolActionPermission(toolName: string, actionType: string): string {
  const record = getIntegrationPermissions(toolName);
  const action = actionType.toLowerCase();
  if (record.blockedActions.some((blocked) => action.includes(blocked.toLowerCase()))) return "Blocked";
  if (record.approvalRequiredActions.some((approval) => action.includes(approval.toLowerCase()))) return "Approval Required";
  if (record.allowedActions.some((allowed) => action.includes(allowed.toLowerCase()))) return "Allowed";
  return record.permissionLevel === "Internal Only" ? "Approval Required" : record.permissionLevel;
}

export function listPlannedIntegrations(): IntegrationRecord[] {
  return integrations.filter((item) => item.connectionStatus === "Planned");
}

export function listConnectedIntegrations(): IntegrationRecord[] {
  return integrations.filter((item) => item.connectionStatus === "Connected");
}

export function clearIntegrationRegistryForDemo(): void {
  integrations.length = 0;
}
