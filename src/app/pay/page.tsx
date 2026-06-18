import PageViewTracker from '@/components/page-view-tracker';
import { ShieldCheck } from 'lucide-react';
import StripeCheckoutButton from '@/components/stripe-checkout-button';
import { paymentPlans, siteName } from '@/lib/site';

export const metadata = {
  title: 'Pay',
  description: 'Choose a payment option for Avery Advisory.',
};

export default function PayPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageViewTracker eventName="pay_page_view" page="/pay" />
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Payments</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Select the entry point that matches the work.</h1>
        <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
          {siteName} keeps checkout focused. Choose the option that fits the current stage, then complete payment securely through Stripe.
        </p>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        {paymentPlans.map((plan) => (
          <article key={plan.key} className="panel flex h-full flex-col rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4af37]">{plan.name}</p>
            <p className="mt-4 text-4xl font-semibold text-white">{plan.price}</p>
            <p className="mt-3 text-sm leading-7 text-white/65">{plan.description}</p>
            <div className="mt-6 flex-1 rounded-3xl border border-[#d4af37]/15 bg-white/[0.03] p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#f4df9d]">
                <ShieldCheck size={14} />
                Stripe Checkout
              </p>
              <p className="mt-3 text-sm leading-6 text-white/55">Secure checkout, payment logging, and inbox notification when the payment succeeds.</p>
            </div>
            <div className="mt-6">
              <StripeCheckoutButton plan={plan.key} label="Pay with Stripe" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
