export type ClaimValidation = {
  valid: boolean;
  warnings: string[];
  approvalRequired: boolean;
};

export function generateThoughtLeadershipPost(topic: string) {
  const content = `AveryTech is building ${topic} with a human-approved automation mindset. The goal is not to replace judgment. The goal is to reduce chaos, protect safety, and make useful systems easier to operate.`;
  return {
    topic,
    content,
    validation: validateThoughtLeadershipClaims(content),
    approvalRequired: true,
  };
}

export function generateBlogDraft(topic: string) {
  const draft = [
    `# ${topic}`,
    "",
    "AveryTech approaches this problem from a practical, accessibility-first angle.",
    "The core idea is simple: useful AI should organize work, explain tradeoffs, and keep risky decisions behind human approval.",
    "This article avoids medical, funding, or guaranteed outcome claims and should be reviewed before publishing.",
  ].join("\n");
  return { topic, draft, approvalRequired: true, validation: validateThoughtLeadershipClaims(draft) };
}

export function generateNewsletterDraft(topic: string) {
  const draft = `This week at AveryTech: ${topic}. The focus is practical progress, safer automation, and workflows that help overwhelmed people move one step at a time.`;
  return { subject: `AveryTech note: ${topic}`, draft, approvalRequired: true };
}

export function generateFounderUpdate(data: Record<string, any>) {
  const focus = data.focus || "building the ATLAS workflow";
  return {
    title: `Founder update: ${focus}`,
    body: `This week, the focus is ${focus}. The priority remains early cash flow, accessibility-first product work, and safe systems that keep external actions behind approval.`,
    approvalRequired: true,
  };
}

export function generatePrStatement(data: Record<string, any>) {
  const statement = `AveryTech is developing ${data.project || "ATLAS"} as an accessibility-first software system focused on organization, workflow support, and human-approved automation.`;
  return {
    statement,
    validation: validateThoughtLeadershipClaims(statement),
    approvalRequired: true,
    reviewLevel: "High Review",
  };
}

export function validateThoughtLeadershipClaims(content: string): ClaimValidation {
  const text = content.toLowerCase();
  const warnings: string[] = [];
  if (/cure|treat|diagnose|therapy replacement|medical device|clinical outcome/.test(text)) warnings.push("medical claim detected");
  if (/guarantee funding|guaranteed funding|will be funded/.test(text)) warnings.push("funding guarantee detected");
  if (/guarantee growth|guaranteed revenue|will make money/.test(text)) warnings.push("growth or revenue guarantee detected");
  if (/world.?leading|best in the world|proven partnership|official partner/.test(text)) warnings.push("exaggerated or unverified company claim detected");
  return { valid: warnings.length === 0, warnings, approvalRequired: true };
}
