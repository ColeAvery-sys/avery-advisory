import { NextResponse } from 'next/server';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { leadNotificationEmail, resendApiKey, resendFromEmail } from '@/lib/lead-notifications';
import { isLeadFormType, type LeadSubmission } from '@/lib/lead-capture';

const dataDir = path.join(process.cwd(), 'data');
const leadsFile = path.join(dataDir, 'lead-submissions.json');
const eventsFile = path.join(dataDir, 'lead-events.ndjson');

async function readLeads(): Promise<LeadSubmission[]> {
  try {
    const raw = await readFile(leadsFile, 'utf8');
    return JSON.parse(raw) as LeadSubmission[];
  } catch {
    return [];
  }
}

async function saveLeads(leads: LeadSubmission[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(leadsFile, JSON.stringify(leads, null, 2), 'utf8');
}

async function logEvent(event: Record<string, unknown>) {
  await mkdir(dataDir, { recursive: true });
  await appendFile(eventsFile, `${JSON.stringify(event)}\n`, 'utf8');
}

async function sendNotification(submission: LeadSubmission) {
  if (!resendApiKey.trim()) {
    return { sent: false, reason: 'RESEND_API_KEY not configured' };
  }

  const subject = `[Avery Advisory] New ${submission.formType} lead from ${submission.name}`;
  const text = [
    `Form: ${submission.formType}`,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Company: ${submission.company || 'Not provided'}`,
    `Phone: ${submission.phone || 'Not provided'}`,
    `Source: ${submission.source || 'website'}`,
    '',
    submission.message ? `Message: ${submission.message}` : null,
    submission.businessSize ? `Business Size: ${submission.businessSize}` : null,
    submission.currentChallenges ? `Current Challenges: ${submission.currentChallenges}` : null,
    submission.preferredMeetingTime ? `Preferred Meeting Time: ${submission.preferredMeetingTime}` : null,
    submission.website ? `Website: ${submission.website}` : null,
    submission.monthlyRevenueRange ? `Monthly Revenue Range: ${submission.monthlyRevenueRange}` : null,
    submission.teamSize ? `Team Size: ${submission.teamSize}` : null,
    submission.currentTools ? `Current Tools: ${submission.currentTools}` : null,
    submission.biggestBottleneck ? `Biggest Bottleneck: ${submission.biggestBottleneck}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [leadNotificationEmail],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${detail}`);
  }

  return { sent: true };
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<LeadSubmission>;

  if (!body || typeof body !== 'object' || !body.formType || !isLeadFormType(body.formType)) {
    return NextResponse.json({ ok: false, error: 'Invalid form type.' }, { status: 400 });
  }

  const honeypot = String(body.honeypot || (body as Record<string, string | undefined>).companyWebsite || '').trim();
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: false, error: 'Spam detected.' }, { status: 400 });
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const company = (body.company || '').trim();

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: 'Name and email are required.' }, { status: 400 });
  }

  const submission: LeadSubmission = {
    ...body,
    name,
    email,
    company,
    formType: body.formType,
    submittedAt: new Date().toISOString(),
  };

  const leads = await readLeads();
  leads.unshift(submission);
  await saveLeads(leads.slice(0, 500));
  await logEvent({ type: 'lead_submission', submission });

  const notification = await sendNotification(submission);

  return NextResponse.json({
    ok: true,
    stored: true,
    notification,
    message: `Thanks ${submission.name}. We received your submission and logged it for follow-up.`,
    redirectUrl: '/thank-you',
  });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
