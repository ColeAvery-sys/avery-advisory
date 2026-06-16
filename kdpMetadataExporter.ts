import { connectorLog, detectConnectorRisks, ensureApproval, requireFields } from "./platformConnectorSafety";

const kdpBooks: any[] = [];

export function validateKdpMetadata(book: any) {
  const missing = requireFields(book, ["bookId", "bookTitle", "authorName", "description"]);
  const risks = detectConnectorRisks(`${book.bookTitle} ${book.description || ""} ${(book.keywords || []).join(" ")}`);
  const keywordStuffing = (book.keywords || []).length > 7;
  const errors = missing.map((field) => `${field} missing`).concat(keywordStuffing ? ["keyword stuffing risk"] : []).concat(risks);
  return { valid: errors.length === 0, errors, approvalRequired: true };
}

export function generateKdpMetadataPacket(book: any) {
  const validation = validateKdpMetadata(book);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const packet = { ...book, exportStatus: "Metadata Ready", manualPublishOnly: true, launchChecklist: generateKdpLaunchChecklist(book) };
  kdpBooks.push(packet);
  return packet;
}

export function exportKdpMarkdown(book: any) {
  const packet = generateKdpMetadataPacket(book);
  return [`# ${packet.bookTitle}`, `Subtitle: ${packet.subtitle || ""}`, `Author: ${packet.authorName}`, "", packet.description, "", `Keywords: ${(packet.keywords || []).join(", ")}`, `Categories: ${(packet.categories || []).join(", ")}`].join("\n");
}

export function exportKdpCsv(book: any) {
  const packet = generateKdpMetadataPacket(book);
  return `bookId,bookTitle,subtitle,authorName,description,keywords,categories\n${packet.bookId},${packet.bookTitle},${packet.subtitle || ""},${packet.authorName},${packet.description},"${(packet.keywords || []).join("|")}","${(packet.categories || []).join("|")}"`;
}

export function generateCopyPasteKdpForm(book: any) {
  const packet = generateKdpMetadataPacket(book);
  return { title: packet.bookTitle, subtitle: packet.subtitle || "", authorName: packet.authorName, description: packet.description, keywords: packet.keywords || [], categories: packet.categories || [], pricing: packet.pricing, approvalRequired: true };
}

export function generateKdpLaunchChecklist(book: any): string[] {
  return ["metadata reviewed", "manuscript file ready", "cover file ready", "keywords relevant", "no fake reviews", "pricing approved", "manual publish only"];
}

export function markKdpPublishedManually(bookId: string, url: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before logging KDP manual publish.");
  const book = kdpBooks.find((entry) => entry.bookId === bookId);
  if (!book) throw new Error(`KDP book ${bookId} not exported.`);
  book.launchStatus = "Published Manually";
  book.amazonUrl = url;
  return connectorLog({ platform: "Amazon KDP", bookId, action: "mark published manually", url });
}

