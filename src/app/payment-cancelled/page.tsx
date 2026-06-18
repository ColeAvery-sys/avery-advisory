import Link from 'next/link';
import { ArrowLeftCircle } from 'lucide-react';
import PageViewTracker from '@/components/page-view-tracker';

export const metadata = {
  title: 'Payment Cancelled',
  description: 'Payment was cancelled before completion.',
};

export default function PaymentCancelledPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <PageViewTracker eventName="payment_cancelled" page="/payment-cancelled" />
      <div className="panel rounded-[2rem] p-8 text-center sm:p-10">
        <ArrowLeftCircle className="mx-auto text-[#f4df9d]" size={40} />
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Payment not completed</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65">
          No charge was made. You can return to checkout when you are ready or use the contact form if you want to discuss the next step.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/pay" className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0a0a0a]">
            Back to Payment
          </Link>
          <Link href="/contact" className="rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
