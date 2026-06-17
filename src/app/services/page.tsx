import Link from 'next/link';
import { ArrowRight, CheckCircle2, CreditCard } from 'lucide-react';
import { pricingCards, services, siteName, stripeIsConfigured } from '@/lib/site';

export const metadata = {
  title: 'Services',
  description: 'Marketing consolidation, AI support, and operational systems for Avery Advisory clients.',
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Services</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Services built to simplify the message and support the execution.</h1>
        <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
          {siteName} focuses on practical systems that reduce duplicate work and make marketing easier to manage.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article key={service} className="panel rounded-[1.5rem] p-6">
            <CheckCircle2 className="text-[#d4af37]" size={18} />
            <h2 className="mt-4 text-xl font-semibold text-white">{service}</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Strategy, implementation support, and documentation designed to reduce noise and increase repeatability.
            </p>
          </article>
        ))}
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Simple entry points for serious conversations.</h2>
          </div>
          <div className="hidden items-center gap-2 text-sm text-white/55 md:flex">
            <CreditCard size={16} />
            {stripeIsConfigured ? 'Stripe is connected and ready for checkout.' : 'Stripe is ready to connect through environment variables.'}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {pricingCards.map((card) => (
            <article
              key={card.name}
              className={`panel flex h-full flex-col rounded-[1.5rem] p-6 ${
                card.featured ? 'border border-[#d4af37]/30 bg-white/[0.05] shadow-[0_25px_60px_rgba(212,175,55,0.12)]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4af37]">{card.name}</p>
                {'badge' in card && card.badge ? (
                  <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f4df9d]">
                    {card.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{card.price}</p>
              <p className="mt-3 text-sm leading-7 text-white/65">{card.description}</p>
              <div className="mt-6">
                <Link
                  href={card.href}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    card.featured
                      ? 'bg-[#d4af37] text-[#0a0a0a] hover:bg-[#e8c55d]'
                      : 'border border-white/12 text-white hover:border-[#d4af37]/40 hover:bg-white/[0.05]'
                  }`}
                >
                  {card.actionLabel}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="panel rounded-[2rem] p-8 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Contact Us</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Need help consolidating a larger marketing system?</h2>
              <p className="text-sm leading-7 text-white/65">
                Share the current structure, the offers, and the outcome you want. We&apos;ll respond with the next best step.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e8c55d]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
