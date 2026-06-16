export type AssetRecord = {
  id: string;
  assetName: string;
  assetType: string;
  source?: string;
  creatorOwner?: string;
  licenseType: string;
  usageAllowed?: string;
  commercialUseAllowed?: boolean;
  attributionRequired?: boolean;
  expirationDate?: string;
  relatedBrand?: string;
  relatedProduct?: string;
  relatedPost?: string;
  riskLevel?: string;
  proofOfRightsLink?: string;
  notes?: string;
  publicUseBlocked?: boolean;
  publicUseApproved?: boolean;
};

const assets: AssetRecord[] = [];

export function createAssetRecord(asset: AssetRecord): AssetRecord {
  const riskLevel = classifyRightsRisk(asset);
  const stored = { ...asset, riskLevel, publicUseBlocked: riskLevel === "High" || asset.licenseType === "Unknown" };
  assets.push(stored);
  return stored;
}

export function checkCommercialUse(assetId: string) {
  const asset = findAsset(assetId);
  const allowed = !!asset.commercialUseAllowed && !asset.publicUseBlocked && asset.licenseType !== "Unknown";
  return { allowed, approvalRequired: true, reason: allowed ? "Commercial use appears allowed, still review before public use." : "Commercial/public use blocked until rights are verified." };
}

export function flagUnknownRights(assetId: string): AssetRecord {
  const asset = findAsset(assetId);
  asset.licenseType = "Unknown";
  asset.riskLevel = "High";
  asset.publicUseBlocked = true;
  return asset;
}

export function attachProofOfRights(assetId: string, proofLink: string): AssetRecord {
  const asset = findAsset(assetId);
  asset.proofOfRightsLink = proofLink;
  return asset;
}

export function generateRightsSummary(assetId: string) {
  const asset = findAsset(assetId);
  return { assetName: asset.assetName, licenseType: asset.licenseType, commercialUseAllowed: !!asset.commercialUseAllowed, riskLevel: asset.riskLevel, publicUseBlocked: !!asset.publicUseBlocked, proof: asset.proofOfRightsLink || "Missing" };
}

export function blockPublicUse(assetId: string): AssetRecord {
  const asset = findAsset(assetId);
  asset.publicUseBlocked = true;
  asset.riskLevel = "High";
  return asset;
}

export function approvePublicUse(assetId: string, approval: { approvedByCole: boolean }): AssetRecord {
  if (!approval.approvedByCole) throw new Error("Cole approval required before public use.");
  const asset = findAsset(assetId);
  if (asset.publicUseBlocked || asset.licenseType === "Unknown") throw new Error("Rights must be verified before public use.");
  asset.publicUseApproved = true;
  return asset;
}

function classifyRightsRisk(asset: AssetRecord): string {
  const text = `${asset.assetName} ${asset.notes || ""}`.toLowerCase();
  if (asset.licenseType === "Unknown" || /pokemon|disney|marvel|nintendo|trademark|copyright/.test(text)) return "High";
  if (asset.assetType === "Client Asset" || asset.licenseType === "Client Provided" || asset.assetType === "AI-Generated Asset") return "Medium";
  return "Low";
}

function findAsset(assetId: string): AssetRecord {
  const asset = assets.find((entry) => entry.id === assetId);
  if (!asset) throw new Error(`Asset ${assetId} not found.`);
  return asset;
}
