import Link from 'next/link';
import { ArrowRight, BadgeCheck, Bot, Layers3, Workflow } from 'lucide-react';
import { processSteps, siteName, tagline, whyCards } from '@/lib/site';

const stats = [
  { label: 'Response time', value: '1 business day' },
  { label: 'Delivery style', value: 'Practical and documented' },
  { label: 'Payment readiness', value: 'Stripe link friendly' },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#f4df9d]">
            {tagline}
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.92] text-white sm:text-6xl lg:text-7xl">
              Stop Repeating Work.
              <span className="block text-[#d4af37]">Start Automating Growth.</span>
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              {siteName} helps businesses implement AI, automation, and operational systems that save time, reduce costs, and
              scale efficiently.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e8c55d]"
            >
              Book Free Consultation
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.02] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#d4af37]/40 hover:bg-white/[0.05]"
            >
              View Services
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="panel rounded-3xl p-4">
                <p className="text-xs uppercase tracking-[0.26em] text-white/40">{stat.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-[#d4af37]/15 blur-3xl" />
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
          <div className="panel gold-border relative overflow-hidden rounded-[2rem] p-6">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#f4df9d]">Operational Snapshot</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Executive-grade execution</p>
                </div>
                <div className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-3 py-1 text-xs font-semibold text-[#f4df9d]">
                  Ready
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-3xl border border-white/8 bg-black/30 p-4">
                  <Bot className="text-[#d4af37]" size={20} />
                  <h2 className="mt-4 text-base font-semibold">AI Automation</h2>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Streamline repeat tasks with practical workflows that improve consistency and throughput.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/8 bg-black/30 p-4">
                  <Layers3 className="text-[#d4af37]" size={20} />
                  <h2 className="mt-4 text-base font-semibold">Business Systems</h2>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Convert informal operations into clear systems with owners, steps, and standards.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/8 bg-black/30 p-4">
                  <Workflow className="text-[#d4af37]" size={20} />
                  <h2 className="mt-4 text-base font-semibold">Process Optimization</h2>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Reduce friction, remove waste, and make the workflow easier to repeat at scale.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/8 bg-black/30 p-4">
                  <BadgeCheck className="text-[#d4af37]" size={20} />
                  <h2 className="mt-4 text-base font-semibold">Stripe-Ready</h2>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Payment link slots are ready for discovery, strategy, audit, and custom project offers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Why Avery Advisory</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">A practical operating partner for growth-minded teams.</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {whyCards.map((card, index) => (
            <article key={card.title} className="panel rounded-[1.75rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4af37]">0{index + 1}</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">How It Works</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">A clean delivery process that keeps the work moving.</h2>
          <p className="max-w-xl text-sm leading-7 text-white/65">
            Every engagement is designed to move from clarity to action without unnecessary complexity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {processSteps.map((step) => (
            <article key={step.title} className="panel rounded-[1.5rem] p-5">
              <p className="text-sm font-semibold text-[#d4af37]">{step.step}</p>
              <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Testimonials</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Client proof will grow here as new engagements complete.</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            'Placeholder testimonial 1. Replace with verified client feedback after deployment.',
            'Placeholder testimonial 2. Keep all testimonials factual and approved before publishing.',
            'Placeholder testimonial 3. Use short, specific outcomes whenever possible.',
          ].map((copy) => (
            <article key={copy} className="panel rounded-[1.5rem] p-6">
              <p className="text-sm leading-7 text-white/65">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="panel gold-border rounded-[2rem] p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Call To Action</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">If the work is repetitive, slow, or unclear, we can probably systemize it.</h2>
              <p className="text-sm leading-7 text-white/65">
                Start with a free consultation and walk away with a sharper plan, clearer priorities, and next steps you can use.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e8c55d]"
              >
                Book Free Consultation
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
      </section>
    </div>
  );
}
