import { NextResponse } from 'next/server';
import { getCreatorPriceId, getStripeBaseUrl, getStripeSecretKey, normalizeCreatorPlanKey, normalizePlanKey } from '@/lib/stripe';
import { getCreatorLogisticsPlan, getPaymentPlan } from '@/lib/site';

export async function POST(request: Request) {
  const secretKey = getStripeSecretKey();
  if (!secretKey) {
    return NextResponse.json({ ok: false, error: 'Stripe is not configured.' }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as null | { plan?: string; source?: string };
  const planKey = normalizePlanKey(body?.plan);
  const creatorPlanKey = normalizeCreatorPlanKey(body?.plan);

  if (!planKey && !creatorPlanKey) {
    return NextResponse.json({ ok: false, error: 'Invalid payment plan.' }, { status: 400 });
  }

  const siteUrl = getStripeBaseUrl().replace(/\/$/, '');

  const isCreatorPlan = Boolean(creatorPlanKey);
  const paymentPlan = planKey ? getPaymentPlan(planKey) : null;
  const creatorPlan = creatorPlanKey ? getCreatorLogisticsPlan(creatorPlanKey) : null;
  const checkoutMode = isCreatorPlan ? 'subscription' : 'payment';
  const priceId = creatorPlanKey ? getCreatorPriceId(creatorPlanKey) : '';

  if (planKey && !paymentPlan) {
    return NextResponse.json({ ok: false, error: 'Payment plan not found.' }, { status: 404 });
  }

  if (creatorPlanKey && !creatorPlan) {
    return NextResponse.json({ ok: false, error: 'Creator Logistics plan not found.' }, { status: 404 });
  }

  const params = new URLSearchParams({
    mode: checkoutMode,
    success_url: `${siteUrl}${isCreatorPlan ? '/payment-success' : paymentPlan!.successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/payment-cancelled?plan=${encodeURIComponent(body?.plan || '')}`,
    'metadata[planKey]': String(body?.plan || ''),
    'metadata[planName]': paymentPlan?.name || creatorPlan?.name || '',
    'metadata[source]': body?.source || 'website',
    'customer_creation': 'always',
  });

  if (isCreatorPlan) {
    if (!priceId) {
      return NextResponse.json({ ok: false, error: 'Creator Logistics Stripe price ID is not configured.' }, { status: 503 });
    }

    params.set('line_items[0][price]', priceId);
    params.set('line_items[0][quantity]', '1');
  } else {
    const plan = paymentPlan!;
    params.set('line_items[0][price_data][currency]', plan.currency);
    params.set('line_items[0][price_data][product_data][name]', plan.name);
    params.set('line_items[0][price_data][product_data][description]', plan.description);
    params.set('line_items[0][price_data][unit_amount]', String(plan.amount));
    params.set('line_items[0][quantity]', '1');
  }

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json({ ok: false, error: `Stripe checkout failed: ${detail}` }, { status: 500 });
  }

  const session = (await response.json()) as { id?: string; url?: string };

  return NextResponse.json({
    ok: true,
    checkoutUrl: session.url ?? null,
    sessionId: session.id ?? null,
  });
}
