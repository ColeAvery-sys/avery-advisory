export type EmailStatus = "Draft" | "Sent" | "Received" | "Replied" | "Forwarded" | "Archived" | "Deleted";
export type EmailClassification =
  | "Client"
  | "Personal"
  | "Internal"
  | "Sales"
  | "Support"
  | "Finance"
  | "Legal"
  | "Unclassified";
export type EmailFollowUpStatus = "None" | "Awaiting Response" | "Follow-Up Needed" | "Overdue Reply";
export type EmailLinkTargetType = "Project" | "Task" | "Contact" | "Memory";

export interface EmailLinkRecord {
  targetType: EmailLinkTargetType;
  targetId: string;
}

export interface EmailRecord {
  id: string;
  subject: string;
  sender: string;
  recipients: string[];
  cc: string[];
  bcc: string[];
  timestamp: string;
  threadId: string;
  status: EmailStatus;
  classification: EmailClassification;
  body: string;
  snippet: string;
  replyRequired: boolean;
  followUpStatus: EmailFollowUpStatus;
  followUpDueAt?: string | null;
  receivedAt?: string | null;
  sentAt?: string | null;
  draftedAt?: string | null;
  repliedAt?: string | null;
  forwardedAt?: string | null;
  archivedAt?: string | null;
  deletedAt?: string | null;
  inReplyToId?: string | null;
  forwardedFromId?: string | null;
  linkedProjectIds: string[];
  linkedTaskIds: string[];
  linkedContactIds: string[];
  linkedMemoryIds: string[];
  links: EmailLinkRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailState {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  emails: EmailRecord[];
}

export interface EmailView extends EmailRecord {
  links: EmailLinkRecord[];
}

export interface EmailSearchFilters {
  status?: EmailStatus;
  classification?: EmailClassification;
  sender?: string;
  recipient?: string;
  threadId?: string;
  linkedObjectType?: EmailLinkTargetType;
  linkedObjectId?: string;
  followUpStatus?: EmailFollowUpStatus;
}

export interface EmailPermissionContext {
  actor: string;
}

export interface EmailInput {
  id?: string;
  subject: string;
  sender: string;
  recipients: string[];
  body: string;
  cc?: string[];
  bcc?: string[];
  timestamp?: string;
  threadId?: string;
  replyRequired?: boolean;
  followUpDueAt?: string;
  linkedProjectIds?: string[];
  linkedTaskIds?: string[];
  linkedContactIds?: string[];
  linkedMemoryIds?: string[];
  actor?: string;
}

export interface EmailUpdateInput {
  subject?: string;
  sender?: string;
  recipients?: string[];
  body?: string;
  cc?: string[];
  bcc?: string[];
  replyRequired?: boolean;
  followUpDueAt?: string | null;
  linkedProjectIds?: string[];
  linkedTaskIds?: string[];
  linkedContactIds?: string[];
  linkedMemoryIds?: string[];
}

export interface EmailSendInput extends EmailInput {
  draftId?: string;
}

export interface EmailReplyInput extends Omit<EmailInput, "sender" | "threadId"> {
  sender?: string;
  threadId?: string;
  inReplyToId?: string;
}

export interface EmailForwardInput extends Omit<EmailInput, "sender" | "threadId" | "subject"> {
  subject?: string;
  sender?: string;
  threadId?: string;
  forwardedFromId?: string;
}
