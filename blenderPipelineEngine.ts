const blenderAssets: any[] = [];

export function createBlenderAsset(asset: Record<string, any>) {
  const stored = { ...asset, status: asset.status || "Planned", qualityStatus: asset.qualityStatus || "Needs Review" };
  blenderAssets.push(stored);
  return stored;
}

export function generateBlenderScriptPrompt(asset: Record<string, any>): string {
  return `Create or process Blender asset ${asset.assetName}. Target use: ${asset.targetUse}. Export as ${asset.fileFormat || "GLB/GLTF"}.`;
}

export function generateAssetChecklist(asset: Record<string, any>): string[] {
  return ["clear purpose", "scale checked", "origin set", "materials named", "file organized", "export format chosen"];
}

export function generateAnimationBrief(asset: Record<string, any>) {
  return { assetName: asset.assetName, purpose: asset.targetUse, warning: "Animations should have a clear use case before production.", approvalRequired: false };
}

export function generateExportChecklist(asset: Record<string, any>): string[] {
  return ["apply transforms", "optimize geometry", "check texture paths", `export ${asset.fileFormat || "GLB/GLTF"}`, "test import target"];
}

export function generatePrintabilityChecklist(asset: Record<string, any>): string[] {
  return ["watertight mesh", "correct scale", "no non-manifold geometry", "wall thickness checked", "safe material/use reviewed"];
}

export function routeAssetToGodot(assetId: string) {
  return route(assetId, "Godot Pipeline");
}

export function routeAssetToDavinci(assetId: string) {
  return route(assetId, "DaVinci Pipeline");
}

export function routeAssetTo3dPrinterPrep(assetId: string) {
  return route(assetId, "3D Printer Prep", true);
}

function route(assetId: string, destination: string, approvalRequired = false) {
  const asset = blenderAssets.find((entry) => entry.id === assetId);
  if (!asset) throw new Error(`Asset ${assetId} not found.`);
  return { assetId, destination, approvalRequired, warning: approvalRequired ? "Printable objects require safety/mesh review." : "Review export before use." };
}
