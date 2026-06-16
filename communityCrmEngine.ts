import { createAudienceGate, detectAudienceRisks, requireApprovalDraft } from "./audienceSafety";

const contacts: any[] = [];

export function createCommunityContact(contact: any) {
  const risks = detectAudienceRisks(`${contact.notes || ""} ${contact.relationshipType || ""}`);
  const stored = { ...contact, ...createAudienceGate("Community contact", risks), communityStatus: contact.communityStatus || "Active" };
  contacts.push(stored);
  return stored;
}

export function updateRelationship(contactId: string, updates: any) {
  const contact = findContact(contactId);
  Object.assign(contact, updates, { lastInteraction: updates.lastInteraction || contact.lastInteraction });
  return contact;
}

export function getContactsByRelationship(relationshipType: string) {
  return contacts.filter((contact) => String(contact.relationshipType).toLowerCase() === relationshipType.toLowerCase());
}

export function createFollowUpDraft(contactId: string) {
  const contact = findContact(contactId);
  return requireApprovalDraft("follow-up message", contact.name || contact.username);
}

export function generateThankYouDraft(contactId: string) {
  const contact = findContact(contactId);
  return { ...requireApprovalDraft("thank-you message", contact.name || contact.username), body: `Draft thank-you for ${contact.name || contact.username}. Mention their support without sounding automated.` };
}

export function generateCollaborationDraft(contactId: string) {
  const contact = findContact(contactId);
  return { ...requireApprovalDraft("collaboration invitation", contact.name || contact.username), body: `Draft collaboration note for ${contact.name || contact.username}. Keep it optional, respectful, and specific to shared interests.` };
}

function findContact(contactId: string) {
  const contact = contacts.find((entry) => entry.id === contactId || entry.contactId === contactId);
  if (!contact) throw new Error(`Community contact ${contactId} not found.`);
  return contact;
}

