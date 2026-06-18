'use client';

export type AnalyticsEventName =
  | 'page_view'
  | 'form_view'
  | 'form_start'
  | 'form_submit'
  | 'pay_page_view'
  | 'strategy_click'
  | 'audit_click'
  | 'custom_click'
  | 'payment_success'
  | 'payment_cancelled'
  | 'book_consultation'
  | 'contact_us'
  | 'services_cta'
  | 'hero_cta';

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

function hasValue(value?: string | null) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function hasAnalyticsIds() {
  return hasValue(process.env.NEXT_PUBLIC_GA_ID) || hasValue(process.env.NEXT_PUBLIC_CLARITY_ID);
}

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  const eventPayload = {
    event: name,
    ...payload,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventPayload);
  }

  if (typeof window.clarity === 'function') {
    window.clarity('event', name);
  }
}
