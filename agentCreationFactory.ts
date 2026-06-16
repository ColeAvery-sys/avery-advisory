import { createAgentGate, detectAgentRisks, enforceHumanSovereignty } from "./agentCivilizationSafety";

const createdProfiles: any[] = [];

export function createAgentProfile(input: any) {
  const stored = {
    id: input.id || `created-agent-${createdProfiles.length + 1}`,
    agentName: input.agentName || input.roleNeeded,
    department: input.department,
    role: input.roleNeeded || input.role,
    goals: input.goals || [],
    skills: input.skills || [],
    permissions: input.permissions || ["draft", "recommend", "report"],
    responsibilities: generateResponsibilities(input),
    reportingChain: generateReportingChain(input),
    trainingPlan: generateAgentTrainingPlan(input),
    sovereignty: enforceHumanSovereignty(input),
    ...createAgentGate("Agent creation profile", detectAgentRisks(input).concat(["New agent activation requires review."])),
  };
  createdProfiles.push(stored);
  return stored;
}

export function generateResponsibilities(input: any) {
  return input.responsibilities || [`Support ${input.department} work`, "Create recommendations", "Explain reasoning", "Escalate risky actions"];
}

export function generateReportingChain(input: any) {
  return { reportsTo: input.manager || "ATLAS Chief Coordinator", oversight: ["SENTINEL", "ARCHIVE"], finalAuthority: "Cole" };
}

export function generateAgentTrainingPlan(input: any) {
  return [`Read ${input.department} SOPs`, "Review approval boundaries", "Complete starter task", "Receive trust score review"];
}

export function listCreatedAgentProfiles() {
  return createdProfiles.slice();
}
