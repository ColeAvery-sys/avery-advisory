const connectors: any[] = [];

const DEFAULT_ALLOWED = ["export local packet", "prepare draft", "generate setup checklist", "log manual action"];
const DEFAULT_BLOCKED = ["publish", "upload publicly", "send email", "request payment", "issue refund", "change price", "share externally", "spend money"];

export function createConnectorRecord(connector: any) {
  const stored = {
    ...connector,
    connectionStatus: connector.connectionStatus || "Not Connected",
    permissionMode: connector.permissionMode || "Local Export Only",
    allowedActions: connector.allowedActions || DEFAULT_ALLOWED,
    approvalRequiredActions: connector.approvalRequiredActions || ["create draft in external tool", "manual publish/upload/send confirmation"],
    blockedActions: connector.blockedActions || DEFAULT_BLOCKED,
    healthStatus: connector.healthStatus || "Unknown",
  };
  connectors.push(stored);
  return stored;
}

export function updateConnectorStatus(connectorId: string, status: string) {
  const connector = findConnectorById(connectorId);
  connector.connectionStatus = status;
  connector.healthStatus = status === "Disabled" ? "Disabled" : connector.healthStatus;
  return connector;
}

export function getConnectorPermissions(platform: string) {
  const connector = findOrDefault(platform);
  return {
    platformName: connector.platformName,
    permissionMode: connector.permissionMode,
    allowedActions: connector.allowedActions,
    approvalRequiredActions: connector.approvalRequiredActions,
    blockedActions: connector.blockedActions,
  };
}

export function checkConnectorActionAllowed(platform: string, actionType: string) {
  const connector = findOrDefault(platform);
  const normalized = actionType.toLowerCase();
  const blocked = (connector.blockedActions || DEFAULT_BLOCKED).find((action: string) => normalized.indexOf(action.split(" ")[0].toLowerCase()) >= 0);
  if (blocked) return { allowed: false, approvalRequired: true, reason: `${actionType} is blocked by default for ${platform}. Cole approval and manual execution required.` };
  const allowed = (connector.allowedActions || DEFAULT_ALLOWED).some((action: string) => normalized.indexOf(action.split(" ")[0].toLowerCase()) >= 0);
  return { allowed, approvalRequired: !allowed, reason: allowed ? "Local/draft action allowed." : "Action needs setup, review, or approval before use." };
}

export function generateConnectorSetupChecklist(platform: string): string[] {
  return [`Confirm ${platform} account owner`, "Set permission mode", "Document allowed actions", "Document blocked actions", "Add approval gate", "Test local export", "Log first manual action"];
}

export function disableConnector(platform: string, reason: string) {
  const connector = findOrDefault(platform);
  connector.connectionStatus = "Disabled";
  connector.permissionMode = "Disabled";
  connector.healthStatus = "Disabled";
  connector.lastError = reason;
  return connector;
}

export function createIntegrationTask(platform: string, action: string) {
  return { platform, action, title: `Set up ${platform}: ${action}`, status: "Needs Review", approvalRequired: true };
}

function findConnectorById(connectorId: string) {
  const connector = connectors.find((entry) => entry.id === connectorId || entry.connectorId === connectorId);
  if (!connector) throw new Error(`Connector ${connectorId} not found.`);
  return connector;
}

function findOrDefault(platform: string) {
  const connector = connectors.find((entry) => String(entry.platformName).toLowerCase() === platform.toLowerCase());
  if (connector) return connector;
  return createConnectorRecord({ id: platform.toLowerCase().replace(/\s+/g, "-"), platformName: platform });
}

