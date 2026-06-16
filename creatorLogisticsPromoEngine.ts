const defaultAngles = [
  "You have footage, not a system.",
  "Your content is dying in your hard drive.",
  "Turn one long video into weeks of posts.",
  "Content infrastructure for overwhelmed creators.",
  "Stop editing from panic.",
  "We organize your content machine.",
];

export function generatePromoBatch(angle: string, count: number) {
  const safeCount = Math.max(1, Math.min(count, 25));
  return Array.from({ length: safeCount }, (_, index) => ({
    id: `creator-promo-${index + 1}`,
    angle,
    postDraft: `${angle} Creator Logistics turns scattered long-form content into organized clip opportunities, timestamps, and a posting plan. Results are not guaranteed, but the system gets clearer.`,
    CTA: "Submit the Creator Lead Intake form",
    approvalRequired: true,
    reviewLevel: "Standard",
  }));
}

export function generateCreatorPainPoints(): string[] {
  return [
    "Too much footage and no clip system",
    "Ideas scattered across notes, messages, and hard drives",
    "No consistent upload calendar",
    "Editing backlog keeps growing",
    "Timestamps and clip labels never get done",
    "Content work happens from panic instead of process",
  ];
}

export function generateSalesPost(offer: string) {
  return {
    title: `${offer} for overwhelmed creators`,
    body: `${offer} helps creators organize footage, find clip opportunities, and turn content chaos into a weekly workflow. No growth guarantees. Just a cleaner system and approval-ready deliverables.`,
    CTA: "Start with the Creator Lead Intake form",
    approvalRequired: true,
  };
}

export function generateShortVideoScript(offer: string) {
  return {
    hook: "Your best content might already exist. It is just buried.",
    beats: [
      "Name the footage backlog",
      `Explain how ${offer} organizes clips, timestamps, and posting ideas`,
      "Show the before and after workflow",
      "Invite the creator to submit the intake form",
    ],
    CTA: "Creator Lead Intake",
    approvalRequired: true,
  };
}

export function generateOutreachAngle(targetAudience: string) {
  return {
    targetAudience,
    angle: `${targetAudience} usually do not need more random posting. They need a repeatable content operating system.`,
    draftLine: `If your long-form content is sitting unused, Creator Logistics can help organize it into clips, timestamps, and a clearer posting plan.`,
    approvalRequired: true,
  };
}

export function generatePackageComparisonPost() {
  return {
    title: "Creator Logistics package comparison",
    packages: [
      "Starter: one video organized, timestamps, and 5 to 10 clip opportunities",
      "Growth: 2 to 4 videos, 20 to 40 clip opportunities, labels, and upload calendar",
      "Operator: monthly content operations and a recurring delivery system",
    ],
    disclaimer: "Final scope and pricing require project review. Growth results are not guaranteed.",
    CTA: "Request a Creator Logistics review",
    approvalRequired: true,
  };
}

export function getCreatorPromoAngles(): string[] {
  return defaultAngles.slice();
}
