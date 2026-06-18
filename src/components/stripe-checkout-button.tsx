'use client';

import { useState } from 'react';
import type { PaymentPlanKey } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

type StripeCheckoutButtonProps = {
  plan: PaymentPlanKey;
  label?: string;
};

export default function StripeCheckoutButton({ plan, label = 'Continue to Checkout' }: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, source: 'pay-page' }),
      });

      const result = (await response.json().catch(() => null)) as null | { ok?: boolean; error?: string; checkoutUrl?: string };

      if (!response.ok || !result?.ok) {
        setError(result?.error || 'Unable to start checkout.');
        return;
      }

      trackEvent(
        plan === 'strategy' ? 'strategy_click' : plan === 'audit' ? 'audit_click' : 'custom_click',
        { plan }
      );

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setError('Stripe did not return a checkout URL.');
      }
    } catch {
      setError('Unable to start checkout.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e8c55d] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Redirecting...' : label}
      </button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
