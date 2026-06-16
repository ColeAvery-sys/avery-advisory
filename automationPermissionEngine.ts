export type PermissionLevel = "Auto" | "Approval Required" | "Blocked";
export type RiskLevel = "Low" | "Medium" | "High";

export type AutomationAction = {
  actionType: string;
  department: string;
  externalFacing?: boolean;
  moneyRelated?: boolean;
  legalRelated?: boolean;
  financialRelated?: boolean;
  personalRelationshipRelated?: boolean;
  deletesData?: boolean;
  publishesContent?: boolean;
  submitsApplication?: boolean;
  amount?: number;
};

export type AutomationPermissionResult = {
  permissionLevel: PermissionLevel;
  riskLevel: RiskLevel;
  reasons: string[];
  safeAlternative: string;
};

const AUTO_ACTIONS = [
  "internal task creation",
  "sorting",
  "tagging",
  "drafting",
  "checklist generation",
  "summarizing",
  "prompt generation",
];

const HIGH_RISK_TERMS = ["legal", "financial", "grant", "contract", "loan", "client", "contractor", "public", "invoice", "payment"];

/**
 * Checks whether ATLAS can perform an automation or must wait for Cole.
 */
export function checkAutomationPermission(action: AutomationAction): AutomationPermissionResult {
  if (!action || typeof action !== "object") {
    throw new TypeError("action must be an object.");
  }

  const actionType = action.actionType.toLowerCase();
  const reasons: string[] = [];
  const blockedReasons = getBlockedReasons(action, actionType);

  if (blockedReasons.length > 0) {
    return {
      permissionLevel: "Blocked",
      riskLevel: "High",
      reasons: blockedReasons,
      safeAlternative: "Create a draft, summary, or approval request for Cole instead of executing this action.",
    };
  }

  if (action.externalFacing) reasons.push("External-facing action requires Cole review.");
  if (action.moneyRelated || action.financialRelated || action.amount !== undefined) reasons.push("Money or financial impact requires Cole approval.");
  if (action.legalRelated) reasons.push("Legal impact requires Cole approval.");
  if (action.publishesContent) reasons.push("Public content requires Cole approval.");
  if (action.submitsApplication) reasons.push("External applications require Cole approval.");
  if (action.deletesData) reasons.push("Deleting records or files requires Cole approval.");
  if (isApprovalAction(actionType)) reasons.push("This action type is listed as approval-required.");

  if (reasons.length > 0) {
    return {
      permissionLevel: "Approval Required",
      riskLevel: isHighRiskByDefault(action, actionType) || reasons.length >= 2 || action.amount !== undefined ? "High" : "Medium",
      reasons,
      safeAlternative: "Prepare the materials and route the action through Action Center or Approval Inbox for Cole.",
    };
  }

  if (AUTO_ACTIONS.includes(actionType)) {
    return {
      permissionLevel: "Auto",
      riskLevel: "Low",
      reasons: ["Internal workflow support action is safe to automate."],
      safeAlternative: "Proceed and log the action.",
    };
  }

  return {
    permissionLevel: "Approval Required",
    riskLevel: "Medium",
    reasons: ["Unknown action types require review before automation."],
    safeAlternative: "Convert this into a draft or checklist and route it through Action Center or Approval Inbox.",
  };
}

function getBlockedReasons(action: AutomationAction, actionType: string): string[] {
  const reasons: string[] = [];

  if (/auto|automatic/.test(actionType) && /(send|email|message|contact|reply)/.test(actionType)) {
    reasons.push("Automatic sending, messaging, or contacting external people is blocked.");
  }

  if (/auto|automatic/.test(actionType) && /(submit|file|apply)/.test(actionType) && (action.submitsApplication || /grant|application/.test(actionType))) {
    reasons.push("Automatic grant or application submission is blocked.");
  }

  if ((action.moneyRelated || action.financialRelated) && /auto|automatic|spend|purchase|pay|transfer/.test(actionType)) {
    reasons.push("Automatic spending or money movement is blocked.");
  }

  if (/auto|automatic/.test(actionType) && /(pay contractor|contractor payment|pay freelancer)/.test(actionType)) {
    reasons.push("Automatic contractor payment is blocked.");
  }

  if (action.legalRelated && /submit|file|sign|accept/.test(actionType)) {
    reasons.push("Automatic legal submission or signing is blocked.");
  }

  if (/loan/.test(actionType) && /accept|sign|submit/.test(actionType)) {
    reasons.push("Automatic loan acceptance or submission is blocked.");
  }

  if (action.deletesData || /(delete|remove).*(file|files|record|records|data|database)/.test(actionType)) {
    reasons.push("Automatic file, record, or data deletion is blocked.");
  }

  if (/auto|automatic/.test(actionType) && /(publish|post)/.test(actionType)) {
    reasons.push("Automatic public publishing is blocked.");
  }

  if (action.personalRelationshipRelated && action.externalFacing) {
    reasons.push("Sending personal relationship messages without review is blocked.");
  }

  return reasons;
}

function isApprovalAction(actionType: string): boolean {
  return [
    "email",
    "send email",
    "grant submission",
    "client proposal",
    "invoice",
    "payment request",
    "purchase",
    "public post",
    "publish content",
    "loan application",
    "college application",
    "contractor message",
    "client message",
    "contact client",
    "contact funder",
    "contact college",
    "contact contractor",
    "contact partner",
  ].some((approvalAction) => actionType.includes(approvalAction));
}

function isHighRiskByDefault(action: AutomationAction, actionType: string): boolean {
  const department = action.department.toLowerCase();
  return HIGH_RISK_TERMS.some((term) => actionType.includes(term) || department.includes(term));
}
