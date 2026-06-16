import { createAudienceGate } from "./audienceSafety";

const newsletters: any[] = [];

export function createNewsletterRecord(record: any) {
  const stored = { ...record, ...createAudienceGate("Newsletter growth"), subscribers: record.subscribers || 0 };
  newsletters.push(stored);
  return stored;
}

export function calculateNewsletterHealth(record: any) {
  const openRate = Number(record.openRate) || 0;
  const clickRate = Number(record.clickRate) || 0;
  const growthRate = Number(record.growthRate) || 0;
  const score = Math.min(100, Math.round(openRate * 40 + clickRate * 40 + growthRate * 20));
  return { score, status: score >= 70 ? "Healthy" : score >= 40 ? "Needs Work" : "Weak", recommendation: score < 40 ? "Improve lead magnet and welcome sequence." : "Double down on best topics." };
}

export function generateNewsletterIdeas(data: any): string[] {
  return [
    "What I built this week at AveryTech",
    "One tool for overloaded creators",
    "The New Prometheus note on ethical technology",
    "Behind the scenes: Creator Logistics workflow",
    "ATLAS Assist product diary",
  ].concat(data.bestTopics || []);
}

export function generateSubjectLines(topic: string): string[] {
  return [`${topic}: one useful idea`, `A quieter way to think about ${topic}`, `What changed this week: ${topic}`];
}

export function generateWelcomeSequence(audience: string) {
  return ["Welcome and mission", `Best resources for ${audience}`, "How to reply with what you need", "Soft invite to follow the main project"];
}

export function generateLeadMagnetIdeas(category: string): string[] {
  return [`${category} checklist`, `${category} starter template`, `${category} quick audit`, `${category} tiny-step worksheet`];
}

