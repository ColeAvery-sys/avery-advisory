import { createFactoryGate, detectProductRisks, ensureColeApproval } from "./marketplaceFactorySafety";

const books: any[] = [];

export function createKdpBookProject(book: any) {
  const risks = detectProductRisks(`${book.bookTitle} ${book.promise || ""} ${book.keywords || ""}`);
  const stored = { ...book, ...createFactoryGate("KDP book project", risks), manuscriptStatus: book.manuscriptStatus || "Draft", launchStatus: book.launchStatus || "Not Started" };
  books.push(stored);
  return stored;
}

export function generateBookConcept(input: any) {
  return { bookTitle: input.bookTitle || `${input.topic || "Creator"} Workbook`, bookType: input.bookType || "workbook", targetReader: input.targetReader || "busy builders", promise: "A practical guide with no guaranteed outcomes.", approvalRequired: true };
}

export function generateBookOutline(book: any): string[] {
  return ["Introduction and scope", "Who this is for", "Core framework", "Worksheets or prompts", "Examples", "Next steps and limitations"];
}

export function generateBookSectionDraft(book: any, section: string) {
  return { bookTitle: book.bookTitle, section, draft: `${section}\n\nThis section supports ${book.targetReader || "the reader"} with practical prompts and examples. It avoids medical, legal, financial, and income guarantees.`, approvalRequired: true };
}

export function generateInteriorChecklist(book: any): string[] {
  return ["trim size selected", "margins checked", "page numbers", "section headings", "print-safe images", "no unsupported claims", "copyright page placeholder"];
}

export function generateCoverBrief(book: any) {
  return { title: book.bookTitle, subtitle: book.subtitle || "", mood: "clear, trustworthy, readable at thumbnail size", mustInclude: ["title", "author name", "genre signal"], approvalRequired: true };
}

export function generateKdpListing(book: any) {
  const risks = detectProductRisks(`${book.bookTitle} ${book.promise || ""}`);
  return { title: book.bookTitle, subtitle: book.subtitle, description: book.listingDescription || `${book.bookTitle} is a practical ${book.bookType || "book"} for ${book.targetReader || "readers"}.`, keywords: sanitizeKeywords(book.keywords || []), categories: book.categories || [], approvalRequired: true, risks };
}

export function generateLaunchChecklist(book: any): string[] {
  return ["manuscript uploaded manually", "cover uploaded manually", "listing copy reviewed", "keywords relevant", "no fake reviews", "pricing approved", "preview proof checked"];
}

export function markPublishedManually(bookId: string, approval?: { approvedByCole?: boolean }) {
  ensureColeApproval(approval, "Cole approval required before marking KDP book published manually.");
  const book = findBook(bookId);
  book.launchStatus = "Published Manually";
  return book;
}

function sanitizeKeywords(keywords: string[]): string[] {
  return keywords.filter((keyword) => detectProductRisks(keyword).length === 0).slice(0, 7);
}

function findBook(bookId: string) {
  const book = books.find((entry) => entry.id === bookId || entry.bookId === bookId);
  if (!book) throw new Error(`KDP book ${bookId} not found.`);
  return book;
}

