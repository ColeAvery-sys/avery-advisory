import { createWorkforceGate, labelPerson, workloadRisk } from "./workforceSafety";

export function calculateWorkload(person: any) {
  return {
    person: labelPerson(person),
    activeProjects: Number(person.activeProjects || 0),
    weeklyHours: Number(person.weeklyHours || person.hours || 0),
    deadlinesThisWeek: Number(person.deadlinesThisWeek || 0),
    revisionLoad: Number(person.revisionLoad || 0),
    risk: workloadRisk(person),
  };
}

export function balanceWorkload(people: any[], tasks: any[]) {
  const candidates = people.map(calculateWorkload).sort((a, b) => riskWeight(a.risk) - riskWeight(b.risk) || a.activeProjects - b.activeProjects);
  return tasks.map((task, index) => ({
    task: task.title || task.name,
    recommendedOwner: candidates[index % Math.max(1, candidates.length)]?.person || "Needs hire/help",
    recommendation: candidates[index % Math.max(1, candidates.length)]?.risk === "High" ? "Delay or hire help" : "Assign with approval if client-facing or paid.",
    ...createWorkforceGate("Workload assignment", ["Assignments remain approval-gated."]),
  }));
}

export function generateWorkloadRecommendation(person: any) {
  const workload = calculateWorkload(person);
  if (workload.risk === "High") return { ...workload, recommendation: "Delay new work, delegate, or hire help." };
  if (workload.risk === "Medium") return { ...workload, recommendation: "Assign only small scoped tasks." };
  return { ...workload, recommendation: "Available for scoped work." };
}

function riskWeight(risk: string) {
  if (risk === "High") return 3;
  if (risk === "Medium") return 2;
  return 1;
}
