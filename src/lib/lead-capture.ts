export type LeadFormType = 'contact' | 'consultation' | 'automation-audit';

export type LeadSubmission = {
  formType: LeadFormType;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
  businessSize?: string;
  currentChallenges?: string;
  preferredMeetingTime?: string;
  website?: string;
  monthlyRevenueRange?: string;
  teamSize?: string;
  currentTools?: string;
  biggestBottleneck?: string;
  source?: string;
  honeypot?: string;
  submittedAt?: string;
};

export const leadFormLabels: Record<LeadFormType, string> = {
  contact: 'Contact Form',
  consultation: 'Consultation Request Form',
  'automation-audit': 'Automation Audit Request Form',
};

export const leadFormDescriptions: Record<LeadFormType, string> = {
  contact: 'Use this for general inquiries and quick direction.',
  consultation: 'Use this when you want a working session on strategy or execution.',
  'automation-audit': 'Use this when you want a systems review of your current operations.',
};

export function isLeadFormType(value: string): value is LeadFormType {
  return value === 'contact' || value === 'consultation' || value === 'automation-audit';
}
