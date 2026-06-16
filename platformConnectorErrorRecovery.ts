const errors: any[] = [];

export function recordConnectorError(error: any) {
  const stored = { ...error, status: error.status || "New", retryCount: error.retryCount || 0, retryAllowed: error.retryAllowed !== false, classification: classifyConnectorError(error) };
  errors.push(stored);
  return stored;
}

export function classifyConnectorError(error: any): string {
  const text = `${error.errorMessage || ""} ${error.errorCode || ""}`.toLowerCase();
  if (/auth|unauthorized|token|credential|401|403/.test(text)) return "Auth/Permission";
  if (/rate|timeout|429|network/.test(text)) return "Retryable";
  if (/approval|forbidden|rights|qa/.test(text)) return "Approval/Safety";
  return "Unknown";
}

export function suggestConnectorRecovery(error: any) {
  const classification = classifyConnectorError(error);
  if (classification === "Auth/Permission") return "Review credentials, account access, and connector permission mode.";
  if (classification === "Retryable") return "Wait, then retry once if the action is still safe and approved.";
  if (classification === "Approval/Safety") return "Resolve approval, rights, QA, or safety blocker before retry.";
  return "Create a manual workaround and Codex debug prompt.";
}

export function shouldRetryConnectorAction(error: any) {
  const classification = classifyConnectorError(error);
  return { retry: classification === "Retryable" && (error.retryCount || 0) < 2 && error.retryAllowed !== false, reason: suggestConnectorRecovery(error) };
}

export function createManualWorkaround(error: any) {
  return { platform: error.platform, connectorAction: error.connectorAction, steps: ["Export local packet", "Review approval/rights/QA status", "Complete action manually if safe", "Log final URL/status"], approvalRequired: true };
}

export function generateCodexDebugPrompt(error: any) {
  return `Debug ATLAS connector failure.\nPlatform: ${error.platform}\nAction: ${error.connectorAction}\nError: ${error.errorMessage}\nRules: do not publish, send, spend, refund, share externally, or trigger customer-facing automation. Provide safe local fix and manual workaround.`;
}

export function markConnectorErrorResolved(errorId: string) {
  const error = errors.find((entry) => entry.id === errorId || entry.errorId === errorId);
  if (!error) throw new Error(`Connector error ${errorId} not found.`);
  error.status = "Resolved";
  return error;
}

