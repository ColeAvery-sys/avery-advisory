import { createPlatformAction, detectRightsRisks, ensureApproved } from "./mediaBaronSafety";

const books: any[] = [];

export function createBookProject(book: any) {
  const stored = { ...book, ...createPlatformAction("Amazon book listing", detectRightsRisks(`${book.bookTitle} ${book.description || ""}`)), launchStatus: "Draft" };
  books.push(stored);
  return stored;
}

export function generateBookListingCopy(book: any) {
  return { title: book.bookTitle, subtitle: book.subtitle, description: `${book.description || book.bookTitle}. Honest book description only. No fake reviews, irrelevant keywords, or medical claims.`, approvalRequired: true };
}

export function generateKdpKeywords(book: any): string[] {
  return unique([book.bookType, "planner", "workbook", "creator workflow", "accessibility support", "organization"].filter(Boolean)).slice(0, 7);
}

export function generateCategoryIdeas(book: any): string[] {
  return /disability|support|workbook/i.test(`${book.bookType} ${book.bookTitle}`) ? ["Self-Help", "Disability Studies", "Personal Time Management"] : ["Business Planning", "Creativity", "Journals"];
}

export function generateBackCoverCopy(book: any): string {
  return `${book.bookTitle} helps readers organize ideas, routines, and next steps without promising outcomes.`;
}

export function generateLaunchChecklist(book: any): string[] {
  return ["manuscript checked", "cover checked", "metadata reviewed", "keywords relevant", "pricing approved", "no fake reviews", "manual publish only"];
}

export function generateAmazonAdsDraft(book: any) {
  return { campaignName: `${book.bookTitle} ad test`, budget: "Draft only", approvalRequired: true, warning: "Ad spend requires Cole approval." };
}

export function markPublishedManually(bookId: string) {
  const book = books.find((entry) => entry.id === bookId);
  if (!book) throw new Error(`Book ${bookId} not found.`);
  ensureApproved(book.approvalStatus);
  book.launchStatus = "Published Manually";
  return book;
}

function unique(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}
