import { createRdGate, detectRdRisks } from "./rdSafety";

const assets: any[] = [];

export function createBlenderPipelineAsset(asset: any) {
  const stored = { ...asset, id: asset.id || `blender-${assets.length + 1}`, stage: asset.stage || "Concept", riskFlags: detectRdRisks(asset) };
  assets.push(stored);
  return stored;
}

export function advanceBlenderAssetStage(assetId: string, stage: string, approval?: any) {
  const asset = findAsset(assetId);
  if (/approved|export/i.test(stage) && approval?.approvedBy !== "Cole") {
    asset.stage = "Needs Cole Approval";
    return asset;
  }
  asset.stage = stage;
  return asset;
}

export function generateBlenderAssetChecklist(asset: any) {
  return {
    assetName: asset.assetName,
    pipeline: ["Concept", "Model", "UV", "Texture", "Rig", "Animate", "Export", "Approved"],
    checks: ["Rights clear", "Scale correct", "Topology reviewed", "Export format selected", "Target use confirmed"],
    ...createRdGate("Blender asset checklist", detectRdRisks(asset)),
  };
}

export function routeBlenderAsset(assetId: string, target: string) {
  const asset = findAsset(assetId);
  return { assetId, target, routeStatus: asset.stage === "Approved" ? "Ready for target handoff" : "Blocked until approved", approvalRequired: true };
}

function findAsset(assetId: string) {
  const asset = assets.find((item) => item.id === assetId);
  if (!asset) throw new Error(`Blender asset ${assetId} not found.`);
  return asset;
}
