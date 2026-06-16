import Link from 'next/link';
import { ArrowRight, CheckCircle2, CreditCard } from 'lucide-react';
import { pricingCards, services, siteName } from '@/lib/site';

export const metadata = {
  title: 'Services',
  description: 'AI automation consulting, business process design, workflow optimization, and custom projects for Avery Advisory clients.',
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Services</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Operational services that create leverage, clarity, and speed.</h1>
        <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
          {siteName} focuses on practical systems that help teams do better work with less friction.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article key={service} className="panel rounded-[1.5rem] p-6">
            <CheckCircle2 className="text-[#d4af37]" size={18} />
            <h2 className="mt-4 text-xl font-semibold text-white">{service}</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Strategy, implementation support, and documentation designed to reduce manual work and increase repeatability.
            </p>
          </article>
        ))}
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Clear entry points for serious conversations.</h2>
          </div>
          <div className="hidden items-center gap-2 text-sm text-white/55 md:flex">
            <CreditCard size={16} />
            Stripe payment links can be connected in environment variables.
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {pricingCards.map((card) => (
            <article key={card.name} className="panel flex h-full flex-col rounded-[1.5rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4af37]">{card.name}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{card.price}</p>
              <p className="mt-3 text-sm leading-7 text-white/65">{card.description}</p>
              <div className="mt-6">
                <Link
                  href={card.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#d4af37]/40 hover:bg-white/[0.05]"
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
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Need a scoped quote for a larger automation build?</h2>
              <p className="text-sm leading-7 text-white/65">
                Share the workflow, the tools you use, and the result you want. We&apos;ll respond with the next best step.
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
