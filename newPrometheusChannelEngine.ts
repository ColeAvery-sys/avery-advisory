export const newPrometheusPillars = [
  "technology as fire",
  "disability and liberation",
  "capitalism versus human dignity",
  "Greek myth and modern power",
  "environmental technology",
  "ethical AI",
  "founder philosophy",
  "future of work",
  "class, labor, and automation",
  "personal systems and survival",
];

export function generateNewPrometheusVideoIdeas(count: number) {
  const safeCount = Math.max(1, Math.min(count, 50));
  return Array.from({ length: safeCount }, (_, index) => {
    const pillar = newPrometheusPillars[index % newPrometheusPillars.length];
    return {
      id: `np-video-${index + 1}`,
      title: `${titleCase(pillar)} and the Modern Founder`,
      pillar,
      tone: "intelligent, ethical, leftist, mythic, and tech-forward",
      approvalRequired: true,
      reviewNote: "Political or public claims require Cole approval before publishing.",
    };
  });
}

export function generateEssayOutline(topic: string) {
  return {
    topic,
    outline: [
      "Cold open with a clear modern problem",
      "Mythic frame using Prometheus or Greek philosophy",
      "Technology and power analysis",
      "Human dignity and accessibility angle",
      "Practical founder conclusion",
      "CTA to AveryTech or The New Prometheus",
    ],
    approvalRequired: true,
  };
}

export function generateColdOpen(topic: string): string {
  return `The old myth says fire changed humanity. The modern question is who gets to hold the tools when ${topic} becomes part of daily life.`;
}

export function generateThumbnailConcepts(topic: string): string[] {
  return [
    `Prometheus-style silhouette holding a clean tech symbol for ${topic}`,
    `Dark marble texture, bright circuit line, title: ${topic}`,
    "Founder portrait with Greek statue shadow and one precise phrase",
  ];
}

export function generateShortsBatch(topic: string) {
  return newPrometheusPillars.slice(0, 5).map((pillar, index) => ({
    id: `np-short-${index + 1}`,
    topic,
    pillar,
    hook: `What if ${topic} is not just a technology problem, but a power problem?`,
    CTA: "Watch The New Prometheus",
    approvalRequired: true,
  }));
}

export function createChannelContentCalendar(items: Array<Record<string, any>>) {
  return items.map((item, index) => ({
    id: item.id || `np-calendar-${index + 1}`,
    title: item.title || item.topic || "New Prometheus content",
    brand: "The New Prometheus",
    platform: item.platform || "YouTube",
    status: "Needs Cole Review",
    approvalRequired: true,
    reviewLevel: "High Review",
    reason: "Public philosophy, politics, or disability-related content should be reviewed before publishing.",
  }));
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
