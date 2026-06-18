import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import PageViewTracker from '@/components/page-view-tracker';
import { siteName } from '@/lib/site';

export const metadata = {
  title: 'Payment Successful',
  description: 'Payment received by Avery Advisory.',
};

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <PageViewTracker eventName="payment_success" page="/payment-success" />
      <div className="panel rounded-[2rem] p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto text-[#d4af37]" size={40} />
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Payment received</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65">
          {siteName} has received your payment and logged the event for follow-up. Cole will receive a notification if email
          delivery is configured in production.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0a0a0a]">
            Return Home
          </Link>
          <Link href="/contact" className="rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white">
            Send a Lead
          </Link>
        </div>
      </div>
    </div>
  );
}
