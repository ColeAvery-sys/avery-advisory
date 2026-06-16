export type EscalationRule = {
  id: string;
  trigger: string;
  department: string;
  escalationTarget: string;
  riskLevel: "Low" | "Medium" | "High";
  reason: string;
  requiredAction: string;
  active: boolean;
  lastUpdated: string;
};

const escalationRules: EscalationRule[] = [];
const defaultTriggers = [
  ["money action", "Action Center", "High"],
  ["legal/financial action", "ATLAS Legal/Finance Reviewer", "High"],
  ["external-facing message", "Action Center", "High"],
  ["grant submission", "Action Center", "High"],
  ["client delivery", "Action Center", "High"],
  ["contractor payment", "Action Center", "High"],
  ["hiring", "Action Center", "High"],
  ["unclear ownership", "ATLAS Chief of Staff", "Medium"],
  ["conflicting agent recommendations", "Agent Debate Room", "Medium"],
  ["sensitive files", "ATLAS Legal/Finance Reviewer", "High"],
  ["public content", "Action Center", "High"],
];

export function seedDefaultEscalationRules(): EscalationRule[] {
  if (escalationRules.length > 0) return escalationRules;
  return defaultTriggers.map(([trigger, escalationTarget, riskLevel], index) =>
    createEscalationRule({
      id: `esc-${index + 1}`,
      trigger,
      department: "All",
      escalationTarget,
      riskLevel: riskLevel as EscalationRule["riskLevel"],
      reason: `${trigger} requires escalation.`,
      requiredAction: "Create review item before action.",
      active: true,
      lastUpdated: new Date().toISOString(),
    }),
  );
}

export function createEscalationRule(rule: EscalationRule): EscalationRule {
  escalationRules.push(rule);
  return rule;
}

export function updateEscalationRule(ruleId: string, updates: Partial<EscalationRule>): EscalationRule {
  const rule = findRule(ruleId);
  Object.assign(rule, updates, { lastUpdated: new Date().toISOString() });
  return rule;
}

export function disableEscalationRule(ruleId: string): EscalationRule {
  return updateEscalationRule(ruleId, { active: false });
}

export function testEscalationRules(item: { title: string; department: string; description?: string }): EscalationRule[] {
  const text = `${item.title} ${item.description || ""}`.toLowerCase();
  return escalationRules.filter((rule) => rule.active && (rule.department === "All" || rule.department === item.department) && text.includes(rule.trigger.toLowerCase()));
}

export function getEscalationsForDepartment(department: string): EscalationRule[] {
  return escalationRules.filter((rule) => rule.department === "All" || rule.department === department);
}

export function createActionItemFromEscalation(escalation: EscalationRule) {
  return { title: `Escalation: ${escalation.trigger}`, target: escalation.escalationTarget, riskLevel: escalation.riskLevel, requiredAction: escalation.requiredAction };
}

export function clearEscalationRulesForDemo(): void {
  escalationRules.length = 0;
}

function findRule(ruleId: string): EscalationRule {
  const rule = escalationRules.find((item) => item.id === ruleId);
  if (!rule) throw new Error(`Escalation rule ${ruleId} not found.`);
  return rule;
}
