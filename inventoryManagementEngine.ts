import { createHqGate, detectHqRisks } from "./physicalHqSafety";

const assets: any[] = [];

export function createInventoryAsset(asset: any) {
  const stored = { ...asset, assetId: asset.assetId || asset.id || `asset-${assets.length + 1}`, condition: asset.condition || "Unknown" };
  assets.push(stored);
  return stored;
}

export function updateAssetLocation(assetId: string, location: string) {
  const asset = findAsset(assetId);
  asset.location = location;
  return asset;
}

export function assignAsset(assetId: string, assignedTo: string) {
  const asset = findAsset(assetId);
  asset.assignedTo = assignedTo;
  return asset;
}

export function generateInventorySummary() {
  return {
    totalAssets: assets.length,
    byCategory: countBy(assets, (asset: any) => asset.category || "Unknown"),
    needsRepair: assets.filter((asset) => /poor|broken|repair/i.test(asset.condition || "")).map((asset) => asset.name || asset.assetName),
    replacementExposure: assets.reduce((sum, asset) => sum + Number(asset.replacementCost || 0), 0),
    ...createHqGate("Inventory summary", ["Purchases and replacements require approval."]),
  };
}

export function generateAssetReplacementPlan() {
  return assets.filter((asset) => /poor|broken|repair/i.test(asset.condition || "")).map((asset) => ({
    assetId: asset.assetId,
    name: asset.name || asset.assetName,
    replacementCost: asset.replacementCost || 0,
    approvalRequiredBeforePurchase: true,
    riskFlags: detectHqRisks(asset),
  }));
}

function countBy(items: any[], getter: (item: any) => string) {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const key = getter(item);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function findAsset(assetId: string) {
  const asset = assets.find((entry) => entry.assetId === assetId);
  if (!asset) throw new Error(`Asset ${assetId} not found.`);
  return asset;
}
