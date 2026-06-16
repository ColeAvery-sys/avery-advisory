export type AuditTarget = {
  id: string;
  targetName: string;
  platform: string;
  bio?: string;
  title?: string;
  description?: string;
  CTA?: string;
  proof?: string[];
  visuals?: string[];
  tags?: string[];
  claims?: string[];
};

const targets: AuditTarget[] = [];

export function createAuditTarget(target: AuditTarget): AuditTarget {
  targets.push(target);
  return target;
}

export function runStorefrontAudit(target: AuditTarget) {
  const scores = calculateAuditScores(target);
  return { targetName: target.targetName, platform: target.platform, scores, recommendedFixes: generateFixList({ target, scores }), approvalRequired: true };
}

export function calculateAuditScores(target: AuditTarget) {
  const clarity = scoreText(target.title || target.bio || target.description);
  const trust = Math.min(100, (target.proof || []).length * 25 + 30);
  const SEO = Math.min(100, (target.tags || []).length * 10 + scoreText(target.title || ""));
  const visual = Math.min(100, (target.visuals || []).length * 20 + 30);
  const offer = scoreText(target.description || "");
  const CTA = target.CTA ? 85 : 20;
  const proof = Math.min(100, (target.proof || []).length * 30);
  const policyRisk = detectRisk(target).length ? 80 : 20;
  const conversionRisk = Math.max(0, 100 - Math.round((clarity + trust + SEO + offer + CTA + proof) / 6));
  return { clarity, trust, SEO, visual, offer, CTA, proof, policyRisk, conversionRisk };
}

export function generateFixList(audit: any): string[] {
  const fixes: string[] = [];
  const scores = audit.scores || calculateAuditScores(audit.target);
  if (scores.clarity < 60) fixes.push("Clarify headline or bio.");
  if (scores.CTA < 60) fixes.push("Add one clear CTA.");
  if (scores.proof < 50) fixes.push("Add evidence, examples, or approved testimonials.");
  if (scores.policyRisk > 50) fixes.push("Review trademark/copyright or claim risk.");
  return fixes;
}

export function generateBetterBio(target: AuditTarget): string {
  return `${target.targetName} helps ${target.platform} visitors understand the offer, trust the brand, and take one clear next step.`;
}

export function generateListingCopyFix(target: AuditTarget): string {
  return `${target.title || target.targetName}: clear benefit, honest scope, no exaggerated claims, and one CTA.`;
}

export function generateSeoFixes(target: AuditTarget): string[] {
  return ["Use relevant keywords only", "Add product/audience terms", "Avoid trademark stuffing", "Make title readable"];
}

export function generateCtaFixes(target: AuditTarget): string[] {
  return ["Use one primary CTA", `Route to ${target.CTA || "the most relevant landing page"}`, "Do not push too many offers at once"];
}

function scoreText(text?: string): number {
  if (!text) return 20;
  return Math.max(30, Math.min(100, text.length));
}

function detectRisk(target: AuditTarget): string[] {
  const text = `${target.title || ""} ${target.description || ""} ${(target.claims || []).join(" ")}`.toLowerCase();
  const risks: string[] = [];
  if (/guarantee|income|medical|funding|cure|viral/.test(text)) risks.push("risky claim");
  if (/disney|marvel|pokemon|nintendo|trademark/.test(text)) risks.push("rights risk");
  return risks;
}
