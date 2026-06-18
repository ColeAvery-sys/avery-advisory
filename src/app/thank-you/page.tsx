import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Thank You',
  description: 'Avery Advisory received your request.',
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="panel gold-border rounded-[2rem] p-8 sm:p-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Submission Received</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Thanks. We&apos;ll review it and follow up soon.</h1>
        <p className="mt-4 text-sm leading-7 text-white/65">
          Your request has been logged and sent to Cole for review. If it&apos;s a fit, we&apos;ll reply with the next best step.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e8c55d]"
          >
            Back to Home
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.02] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#d4af37]/40"
          >
            View Services
          </Link>
        </div>
      </div>
    </div>
  );
}
