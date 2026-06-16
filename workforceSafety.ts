export function createWorkforceGate(actionType: string, riskFlags: string[] = []) {
  return {
    actionType,
    riskFlags,
    approvalStatus: riskFlags.length ? "Needs Cole Approval" : "Draft",
    recommendationOnly: true,
    cannotHireFireDisciplineOrChangePay: true,
  };
}

export function detectWorkforceRisks(item: any): string[] {
  const text = JSON.stringify(item || {}).toLowerCase();
  const risks: string[] = [];
  if (/hire|offer|accepted|employment|employee/.test(text)) risks.push("Hiring or employment decision requires Cole approval.");
  if (/fire|terminate|discipline|warning|probation/.test(text)) risks.push("Discipline or termination requires Cole approval.");
  if (/\bcontract\b|nda|agreement|scope of work|sow/.test(text)) risks.push("Contract or legal document requires Cole approval.");
  if (/rate|pay|compensation|raise|bonus|invoice|payment/.test(text)) risks.push("Compensation or payment change requires Cole approval.");
  if (/client data|private|confidential|sensitive/.test(text)) risks.push("Confidentiality review required.");
  return risks;
}

export function scoreWorkQuality(item: any): number {
  const quality = score10(item.qualityScore ?? item.quality);
  const reliability = score10(item.reliabilityScore ?? item.reliability);
  const communication = score10(item.communicationScore ?? item.communication);
  const speed = score10(item.speedScore ?? item.speed);
  return Math.round(((quality * 0.35 + reliability * 0.3 + communication * 0.2 + speed * 0.15) / 10) * 100);
}

export function score10(value: any): number {
  if (typeof value === "number") return Math.max(0, Math.min(10, value));
  if (/excellent|strong|high|great/i.test(value || "")) return 9;
  if (/good|medium|ok|solid/i.test(value || "")) return 7;
  if (/weak|low|poor|bad/i.test(value || "")) return 3;
  return 5;
}

export function workloadRisk(person: any): "Low" | "Medium" | "High" {
  const active = Number(person.activeProjects || 0);
  const hours = Number(person.weeklyHours || person.hours || 0);
  const deadlines = Number(person.deadlinesThisWeek || 0);
  const stress = score10(person.stressIndicators || person.stress || 0);
  const score = active * 12 + hours + deadlines * 10 + stress * 4;
  if (score >= 90) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}

export function labelPerson(person: any): string {
  return person.name || person.editorName || person.contractorName || person.applicantName || "Unnamed Person";
}

export function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
