import { createFactoryGate, readinessScore, rightsAreClear } from "./marketplaceFactorySafety";

const packs: any[] = [];

export function createAssetPack(pack: any) {
  const rightsBlocked = !rightsAreClear(pack.rightsStatus);
  const stored = { ...pack, ...createFactoryGate("Asset pack", rightsBlocked ? ["Unknown rights block public asset pack use."] : []), QAStatus: pack.QAStatus || "Not Started" };
  packs.push(stored);
  return stored;
}

export function generateFileList(pack: any): string[] {
  return (pack.includedAssets || []).concat(["README/instructions", "license notes", "preview images"]);
}

export function generateLicenseNotes(pack: any) {
  return { packName: pack.packName, licenseTerms: pack.licenseTerms || "License terms must be reviewed before sale or public distribution.", commercialUseAllowed: !!pack.commercialUseAllowed, approvalRequired: true };
}

export function generateInstructions(pack: any) {
  return `Instructions for ${pack.packName}: unzip the files, read license terms, and use only within the approved scope.`;
}

export function generatePreviewChecklist(pack: any): string[] {
  return ["cover preview", "asset grid preview", "file format labels", "license/use note", "no client/private assets visible"];
}

export function validatePackRights(pack: any) {
  const valid = rightsAreClear(pack.rightsStatus) && !!pack.licenseTerms && !/client|unknown/i.test(`${pack.rightsStatus} ${pack.licenseTerms}`);
  return { valid, rightsStatus: pack.rightsStatus || "Unknown", approvalRequired: true, reason: valid ? "Rights appear ready for review." : "Rights/license terms must be resolved before public use." };
}

export function calculatePackReadiness(pack: any) {
  const score = readinessScore([
    !!pack.packName,
    !!pack.packType,
    (pack.includedAssets || []).length > 0,
    (pack.fileFormats || []).length > 0,
    !!pack.licenseTerms,
    rightsAreClear(pack.rightsStatus),
    !!pack.instructionsFile,
    /passed|ready/i.test(pack.QAStatus || ""),
  ]);
  return { packName: pack.packName, readinessScore: score, readyForListingQa: score >= 75, approvalRequired: true };
}

export function sendPackToListingQa(packId: string) {
  const pack = findPack(packId);
  return { listingName: pack.packName, product: pack, platform: "TBD", approvalStatus: "Needs QA", rightsStatus: pack.rightsStatus };
}

function findPack(packId: string) {
  const pack = packs.find((entry) => entry.id === packId || entry.packId === packId);
  if (!pack) throw new Error(`Asset pack ${packId} not found.`);
  return pack;
}

