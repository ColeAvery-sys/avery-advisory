export type ContactRecord = {
  id: string;
  name: string;
  organization?: string;
  role?: string;
  email?: string;
  phone?: string;
  website?: string;
  platform?: string;
  relationshipType: "Lead" | "Client" | "Grant Contact" | "Contractor" | "Partner";
  status: string;
  tags: string[];
  lastContacted?: string;
  nextFollowUp?: string;
  notes?: string;
  relatedCampaign?: string;
  relatedGrant?: string;
  relatedClient?: string;
};

const contacts: ContactRecord[] = [];

export function addContact(contact: ContactRecord): ContactRecord {
  contacts.push(contact);
  return contact;
}

export function updateContactStatus(contactId: string, status: string): ContactRecord {
  const contact = findContact(contactId);
  contact.status = status;
  return contact;
}

export function getContactsByRelationshipType(type: ContactRecord["relationshipType"]): ContactRecord[] {
  return contacts.filter((contact) => contact.relationshipType === type);
}

export function getFollowUpsDue(date: string): ContactRecord[] {
  return contacts.filter((contact) => Boolean(contact.nextFollowUp) && contact.nextFollowUp! <= date);
}

export function generateContactSummary(contactId: string): string {
  const contact = findContact(contactId);
  return `${contact.name} at ${contact.organization || "unknown organization"} is a ${contact.relationshipType}. Status: ${contact.status}. Notes: ${contact.notes || "None"}. Outreach must be drafted for approval, never sent automatically.`;
}

export function convertContactToClient(contactId: string): ContactRecord {
  return convertType(contactId, "Client");
}

export function convertContactToGrantContact(contactId: string): ContactRecord {
  return convertType(contactId, "Grant Contact");
}

export function convertContactToContractor(contactId: string): ContactRecord {
  return convertType(contactId, "Contractor");
}

export function clearOutreachCrmForDemo(): void {
  contacts.length = 0;
}

function findContact(id: string): ContactRecord {
  const contact = contacts.find((item) => item.id === id);
  if (!contact) throw new Error(`Contact ${id} not found.`);
  return contact;
}

function convertType(id: string, type: ContactRecord["relationshipType"]): ContactRecord {
  const contact = findContact(id);
  contact.relationshipType = type;
  return contact;
}
