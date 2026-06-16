import { createStudioGate, detectContentRisks, ensureApproval, rightsClear } from "./contentStudioSafety";

const thumbnails: any[] = [];

export function createThumbnailProject(thumbnail: any) {
  const risks = validateThumbnailRisks(thumbnail).risks;
  const stored = { ...thumbnail, ...createStudioGate("Thumbnail", risks), status: thumbnail.status || "Concept" };
  thumbnails.push(stored);
  return stored;
}

export function generateThumbnailConcepts(thumbnail: any): string[] {
  return [`${thumbnail.brand || "Brand"} authority portrait + bold problem`, "clean product/mockup screenshot with single phrase", "high-contrast symbolic visual with no misleading claim"];
}

export function generateTextOptions(thumbnail: any): string[] {
  return ["ONE NEXT STEP", "TOO MUCH FOOTAGE?", "BUILD WITH CARE", "THE FIRE WE BUILT"];
}

export function generateDesignerBrief(thumbnail: any) {
  return { thumbnailTitle: thumbnail.thumbnailTitle, visualDirection: thumbnail.visualDirection || "high contrast, readable, honest, no fake outcome", avoid: ["misleading faces", "copyrighted characters", "unapproved likeness"], approvalRequired: true };
}

export function generateABTestIdeas(thumbnail: any): string[] {
  return ["text-heavy vs symbol-heavy", "founder face vs product mockup", "dark mythic vs clean tech"];
}

export function validateThumbnailRisks(thumbnail: any) {
  const risks = detectContentRisks(`${thumbnail.concept || ""} ${(thumbnail.textOptions || []).join(" ")} ${thumbnail.visualDirection || ""}`);
  if (!rightsClear(thumbnail.assetRightsStatus)) risks.push("Thumbnail asset rights must be clear.");
  if (/client|person likeness/i.test(`${thumbnail.visualDirection} ${thumbnail.referenceImages}`) && thumbnail.approvalStatus !== "Approved") risks.push("Client/person likeness requires approval.");
  return { valid: risks.length === 0, risks, approvalRequired: true };
}

export function markThumbnailFinalManually(thumbnailId: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before marking thumbnail final.");
  const thumbnail = findThumbnail(thumbnailId);
  const validation = validateThumbnailRisks(thumbnail);
  if (!validation.valid) throw new Error(validation.risks.join("; "));
  thumbnail.status = "Final Manually";
  return thumbnail;
}

function findThumbnail(thumbnailId: string) {
  const thumbnail = thumbnails.find((entry) => entry.id === thumbnailId || entry.thumbnailId === thumbnailId);
  if (!thumbnail) throw new Error(`Thumbnail ${thumbnailId} not found.`);
  return thumbnail;
}

