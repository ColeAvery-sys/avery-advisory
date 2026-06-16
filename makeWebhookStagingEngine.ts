export type WebhookStatus = "Planned" | "Draft" | "Needs Approval" | "Testing" | "Active" | "Disabled" | "Error";
export type WebhookRecord = {
  id: string;
  scenarioName: string;
  trigger: string;
  payloadPreview: Record<string, unknown>;
  destination: string;
  approvalRequired: boolean;
  webhookStatus: WebhookStatus;
  lastTested?: string;
  notes?: string;
};

const webhooks: WebhookRecord[] = [];
const riskyTriggers = ["gmail", "email", "invoice", "payment", "publish", "delete", "submit", "grant", "client"];

export function createWebhookScenario(input: Omit<WebhookRecord, "approvalRequired" | "webhookStatus">): WebhookRecord {
  const approvalRequired = riskyTriggers.some((term) => `${input.scenarioName} ${input.trigger}`.toLowerCase().includes(term));
  const record: WebhookRecord = { ...input, approvalRequired, webhookStatus: approvalRequired ? "Needs Approval" : "Draft" };
  webhooks.push(record);
  return record;
}

export function generateWebhookPayloadPreview(id: string): Record<string, unknown> {
  return findWebhook(id).payloadPreview;
}

export function copyWebhookPayload(id: string): string {
  return JSON.stringify(findWebhook(id).payloadPreview, null, 2);
}

export function markWebhookTested(id: string): WebhookRecord {
  const webhook = findWebhook(id);
  webhook.webhookStatus = "Testing";
  webhook.lastTested = new Date().toISOString();
  return webhook;
}

export function markWebhookActive(id: string): WebhookRecord {
  const webhook = findWebhook(id);
  if (webhook.approvalRequired) throw new Error("Cole approval required before marking risky webhook active.");
  webhook.webhookStatus = "Active";
  return webhook;
}

export function disableWebhook(id: string): WebhookRecord {
  const webhook = findWebhook(id);
  webhook.webhookStatus = "Disabled";
  return webhook;
}

export function clearWebhookStagingForDemo(): void {
  webhooks.length = 0;
}

function findWebhook(id: string): WebhookRecord {
  const webhook = webhooks.find((item) => item.id === id);
  if (!webhook) throw new Error(`Webhook ${id} not found.`);
  return webhook;
}
