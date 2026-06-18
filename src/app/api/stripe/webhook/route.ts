import { NextResponse } from 'next/server';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { contactEmail } from '@/lib/site';
import { getStripeWebhookSecret, verifyStripeWebhookSignature } from '@/lib/stripe';

export const runtime = 'nodejs';

const dataDir = path.join(process.cwd(), 'data');
const paymentEventsFile = path.join(dataDir, 'payment-events.ndjson');

async function logPaymentEvent(event: Record<string, unknown>) {
  await mkdir(dataDir, { recursive: true });
  await appendFile(paymentEventsFile, `${JSON.stringify(event)}\n`, 'utf8');
}

async function sendPaymentNotification(payload: Record<string, unknown>) {
  const secretKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'Avery Advisory <onboarding@resend.dev>';

  if (!secretKey) {
    return { sent: false, reason: 'RESEND_API_KEY not configured' };
  }

  const planName = String(payload.planName || payload.planKey || 'Stripe payment');
  const customerEmail = String(payload.customerEmail || 'Not provided');
  const amount = String(payload.amountReceived || payload.amountTotal || '0');
  const currency = String(payload.currency || 'usd').toUpperCase();
  const sessionId = String(payload.sessionId || 'unknown');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [contactEmail],
      subject: `[Avery Advisory] Payment received: ${planName}`,
      text: [
        `Payment received for: ${planName}`,
        `Customer email: ${customerEmail}`,
        `Amount: ${currency} ${Number(amount) / 100}`,
        `Stripe session: ${sessionId}`,
        '',
        'Webhook event logged successfully.',
      ].join('\n'),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${detail}`);
  }

  return { sent: true };
}

export async function POST(request: Request) {
  const secret = getStripeWebhookSecret();
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'Stripe webhook secret is not configured.' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  const payload = await request.text();

  if (!verifyStripeWebhookSignature(payload, signature, secret)) {
    return NextResponse.json({ ok: false, error: 'Invalid signature.' }, { status: 400 });
  }

  const event = JSON.parse(payload) as {
    id?: string;
    type?: string;
    data?: { object?: Record<string, unknown> };
  };

  const session = (event.data?.object ?? {}) as Record<string, any>;

  const paymentEvent = {
    eventId: event.id,
    eventType: event.type,
    sessionId: String(session.id || ''),
    paymentStatus: String(session.payment_status || ''),
    amountTotal: Number(session.amount_total || 0),
    amountReceived: Number(session.amount_total || 0),
    currency: String(session.currency || 'usd'),
    customerEmail: String(session.customer_details?.email || session.customer_email || ''),
    planKey: String(session.metadata?.planKey || ''),
    planName: String(session.metadata?.planName || ''),
    source: String(session.metadata?.source || 'website'),
    receivedAt: new Date().toISOString(),
  };

  await logPaymentEvent(paymentEvent);

  let notification: { sent: boolean; reason?: string } | { sent: false; reason: string };

  if (event.type === 'checkout.session.completed' && String(session.payment_status || '') === 'paid') {
    notification = await sendPaymentNotification(paymentEvent);
  } else {
    notification = { sent: false, reason: 'Ignored non-paid checkout event.' };
  }

  return NextResponse.json({ ok: true, stored: true, notification });
}
