const savedScripts: Array<Record<string, any>> = [];

export function generateDiscoveryScript(input: Record<string, any>) {
  return script("Discovery", input, ["What problem is costing you the most time right now?", "What budget range are you comfortable with?", "Who makes the final decision?", "What would make this project a win?"]);
}

export function generateColdOutreachScript(input: Record<string, any>) {
  return script("Cold Outreach", input, ["Is content organization a current bottleneck?", "Would a clearer clip system help this month?"]);
}

export function generateFollowUpScript(input: Record<string, any>) {
  return script("Follow-Up", input, ["Are you still interested in solving this?", "Would you like a smaller starter scope?"]);
}

export function generatePartnerCallScript(input: Record<string, any>) {
  return script("Partner Call", input, ["Who would this help?", "What compliance concerns should we respect?", "What would a low-risk pilot look like?"]);
}

export function generateCloseQuestions(input: Record<string, any>): string[] {
  return [`Does ${input.offer || "this offer"} fit the problem you want solved?`, "What would stop us from starting?", "Should I draft the next-step proposal for review?"];
}

export function saveScriptToSop(scriptRecord: Record<string, any>) {
  const stored = { ...scriptRecord, id: scriptRecord.id || `sales-script-${savedScripts.length + 1}`, approvalRequired: true };
  savedScripts.push(stored);
  return stored;
}

function script(type: string, input: Record<string, any>, questions: string[]) {
  return {
    scriptType: type,
    opening: `Quick check, ${input.contact || "there"}: I want to understand the actual problem before suggesting ${input.offer || "an offer"}.`,
    problemQuestions: questions,
    offerExplanation: `${input.offer || "The offer"} is scoped after fit, budget, timeline, and success criteria are clear.`,
    proofPoints: input.proofPoints || ["Workflow clarity", "Manual approval before client-facing steps"],
    objectionResponses: ["No results are guaranteed. The value is in a clearer, repeatable system."],
    closeQuestion: "Would you like me to draft the next step for review?",
    approvalRequired: true,
  };
}
