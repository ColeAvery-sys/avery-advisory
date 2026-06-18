import crypto from 'node:crypto';
import { getCreatorLogisticsPlan, getPaymentPlan, type CreatorLogisticsPlanKey, type PaymentPlanKey } from '@/lib/site';

export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() ?? '';
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? '';
}

export function getStripeBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.PUBLIC_SITE_BASE_URL?.trim() || 'https://avery-advisory.com';
}

export function isStripeConfigured() {
  return getStripeSecretKey().length > 0;
}

export function normalizePlanKey(value: string | null | undefined): PaymentPlanKey | null {
  if (value === 'strategy' || value === 'audit' || value === 'custom') {
    return value;
  }

  return null;
}

export function normalizeCreatorPlanKey(value: string | null | undefined): CreatorLogisticsPlanKey | null {
  if (value === 'creator-starter' || value === 'creator-growth' || value === 'creator-operator') {
    return value;
  }

  return null;
}

export function buildCheckoutMetadata(planKey: PaymentPlanKey, source?: string | null) {
  const plan = getPaymentPlan(planKey);

  return {
    planKey,
    planName: plan?.name ?? planKey,
    amount: String(plan?.amount ?? 0),
    source: source || 'website',
  };
}

export function getCreatorPriceId(planKey: CreatorLogisticsPlanKey) {
  const plan = getCreatorLogisticsPlan(planKey);
  if (!plan) return '';
  return process.env[plan.priceIdEnv]?.trim() ?? '';
}

export function verifyStripeWebhookSignature(payload: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader || !secret) {
    return false;
  }

  const parts = signatureHeader.split(',').reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});

  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
