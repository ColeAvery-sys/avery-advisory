import { connectorLog, ensureApproval, requireFields } from "./platformConnectorSafety";

const scenarios: any[] = [];
const results: any[] = [];

export function createFulfillmentScenario(scenario: any) {
  const stored = { ...scenario, webhookStatus: scenario.webhookStatus || "Draft", approvalStatus: scenario.approvalStatus || "Needs Cole Approval", enabled: scenario.enabled !== false };
  scenarios.push(stored);
  return stored;
}

export function generateFulfillmentPayload(scenario: any, item: any) {
  return { scenarioName: scenario.scenarioName, triggerType: scenario.triggerType, relatedItem: item.id || item.orderId || item.listingId || "unknown", riskLevel: scenario.riskLevel || "Medium", customerFacing: !!scenario.customerFacing, item };
}

export function validateFulfillmentPayload(payload: any) {
  const missing = requireFields(payload, ["scenarioName", "triggerType", "relatedItem"]);
  const errors = missing.map((field) => `${field} missing`);
  if (/payment|refund|publish|customer/i.test(`${payload.triggerType} ${payload.scenarioName}`)) errors.push("customer/money/publishing automation requires strict approval");
  return { valid: errors.length === 0, errors, approvalRequired: true };
}

export function triggerApprovedFulfillmentWebhook(scenario: any, payload: any, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before triggering fulfillment webhook.");
  const validation = validateFulfillmentPayload(payload);
  if (validation.errors.some((error) => !/requires strict approval/.test(error))) throw new Error(validation.errors.join("; "));
  if (/money movement|refund|publish/i.test(`${scenario.triggerType} ${scenario.scenarioName}`)) throw new Error("Publishing, money movement, and refunds cannot be triggered by this connector.");
  const result = { scenarioName: scenario.scenarioName, webhookStatus: "Triggered Mock", responseStatus: "Mock Success", payload };
  return logFulfillmentWebhookResult(result);
}

export function logFulfillmentWebhookResult(result: any) {
  const logged = connectorLog({ platform: "Make.com", ...result });
  results.push(logged);
  return logged;
}

export function disableFulfillmentScenario(scenarioId: string) {
  const scenario = scenarios.find((entry) => entry.id === scenarioId || entry.scenarioId === scenarioId);
  if (!scenario) throw new Error(`Fulfillment scenario ${scenarioId} not found.`);
  scenario.enabled = false;
  scenario.webhookStatus = "Disabled";
  return scenario;
}

