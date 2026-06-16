export function repurposeIdea(input: Record<string, any>) {
  const assets = generateContentAssetsFromIdea(input);
  return { coreIdea: input.coreIdea, brand: input.brand, assets, validation: assets.map(validateRepurposedAsset), approvalItems: sendRepurposedAssetsToApproval(assets) };
}

export function generateProductIdeasFromContent(content: Record<string, any>) {
  return [
    { type: "Etsy product", title: `${content.topic || content.coreIdea} checklist` },
    { type: "Merch slogan", title: shortSlogan(content.topic || content.coreIdea) },
    { type: "Amazon book section", title: `${content.topic || content.coreIdea} workbook section` },
  ];
}

export function generateContentAssetsFromIdea(idea: Record<string, any>) {
  const core = idea.coreIdea || idea.title;
  return [
    { type: "YouTube video idea", title: core, platform: "YouTube" },
    { type: "short-form clips", title: `${core} clips`, platform: "Shorts" },
    { type: "blog article", title: `${core} guide`, platform: "Blog" },
    { type: "newsletter", title: `${core} newsletter`, platform: "Newsletter" },
    { type: "Etsy product", title: `${core} checklist`, platform: "Etsy" },
    { type: "merch slogan", title: shortSlogan(core), platform: "Merch" },
    { type: "Amazon book section", title: `${core} workbook section`, platform: "Amazon KDP" },
    { type: "Reddit post", title: `${core} discussion`, platform: "Reddit" },
    { type: "Instagram carousel", title: `${core} carousel`, platform: "Instagram" },
    { type: "Facebook post", title: `${core} post`, platform: "Facebook" },
    { type: "lead magnet", title: `${core} template`, platform: "Website" },
    { type: "service offer angle", title: `${core} service angle`, platform: "Service Marketplace" },
  ];
}

export function routeAssetToPlatform(asset: Record<string, any>, platform: string) {
  return { asset, platform, approvalRequired: true, rightsCheckRequired: true };
}

export function validateRepurposedAsset(asset: Record<string, any>) {
  const text = `${asset.title} ${asset.description || ""}`.toLowerCase();
  const warnings: string[] = [];
  if ((asset.title || "").length < 8) warnings.push("Thin idea needs more substance before productizing.");
  if (/medical|legal|financial|funding|guarantee|income/.test(text)) warnings.push("Claim requires review.");
  return { valid: warnings.length === 0, warnings, rightsCheckRequired: true, approvalRequired: true };
}

export function sendRepurposedAssetsToApproval(assets: Record<string, any>[]) {
  return assets.map((asset, index) => ({ id: `repurpose-approval-${index + 1}`, title: `Approve ${asset.type}: ${asset.title}`, approvalRequired: true }));
}

function shortSlogan(value: string): string {
  return String(value || "Build the system").split(" ").slice(0, 5).join(" ");
}
