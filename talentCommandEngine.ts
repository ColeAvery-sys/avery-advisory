import { createWorkforceGate, detectWorkforceRisks, labelPerson, scoreWorkQuality, workloadRisk } from "./workforceSafety";

const talentRecords: any[] = [];

export function createTalentRecord(person: any) {
  const stored = { ...person, id: person.id || `talent-${talentRecords.length + 1}`, riskFlags: detectWorkforceRisks(person) };
  talentRecords.push(stored);
  return stored;
}

export function generateTalentCommandCenter(data: any = {}) {
  const people = data.people || talentRecords;
  const highWorkload = people.filter((person: any) => workloadRisk(person) === "High");
  const topPerformers = people.slice().sort((a: any, b: any) => scoreWorkQuality(b) - scoreWorkQuality(a)).slice(0, 5);
  return {
    totalPeople: people.length,
    byRole: countBy(people, (person: any) => person.role || person.type),
    available: people.filter((person: any) => /available|open/i.test(person.availability || "")).map(labelPerson),
    highWorkload: highWorkload.map(labelPerson),
    topPerformers: topPerformers.map(labelPerson),
    riskAlerts: people.filter((person: any) => detectWorkforceRisks(person).length).map((person: any) => ({ person: labelPerson(person), risks: detectWorkforceRisks(person) })),
    recommendation: generateTalentRecommendation(people),
    ...createWorkforceGate("Talent command recommendation", ["People-management actions remain approval-gated."]),
  };
}

export function generateTalentRecommendation(people: any[]) {
  if (!people.length) return "Create the first editor/contractor records before assigning work.";
  if (people.some((person) => workloadRisk(person) === "High")) return "Delay or rebalance work before adding more assignments.";
  if (people.some((person) => scoreWorkQuality(person) >= 85 && /available|open/i.test(person.availability || ""))) return "Assign low-risk work to the strongest available person, with Cole approval where required.";
  return "Keep work scoped small and collect more performance evidence.";
}

function countBy(items: any[], getter: (item: any) => string) {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const key = getter(item) || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}
