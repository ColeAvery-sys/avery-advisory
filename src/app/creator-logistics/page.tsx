import { ArrowRight, CheckCircle2, Clapperboard, Upload } from 'lucide-react';
import PageViewTracker from '@/components/page-view-tracker';
import TrackedLink from '@/components/tracked-link';
import { creatorLogisticsPlans } from '@/lib/site';

export const metadata = {
  title: 'Creator Logistics',
  description: 'Editing, thumbnails, shorts, SEO, and creator operations under Avery Advisory.',
};

const processSteps = [
  'Discovery Call',
  'Content Audit',
  'Editing & Optimization',
  'Delivery & Growth',
];

const faqItems = [
  {
    q: 'What kind of creators is this for?',
    a: 'Creators, founders, and businesses that need consistent content support without hiring a full internal team.',
  },
  {
    q: 'Do you handle strategy too?',
    a: 'Yes. The service includes operations support and monthly strategy where the package calls for it.',
  },
  {
    q: 'Can I start small?',
    a: 'Yes. The Starter Package is designed as the lightest entry point.',
  },
];

export default function CreatorLogisticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageViewTracker eventName="page_view" page="/creator-logistics" />

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Creator Logistics</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] text-white sm:text-6xl">
            Your Content Team Without Hiring a Team
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            Professional editing, content systems, thumbnails, shorts, and channel operations for creators and businesses.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              href="/contact"
              eventName="book_consultation"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#0a0a0a]"
            >
              Book Discovery Call
              <ArrowRight size={16} />
            </TrackedLink>
            <TrackedLink
              href="/pay?plan=creator-starter"
              eventName="custom_click"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.02] px-6 py-3 text-sm font-semibold text-white"
            >
              Start Creator Logistics
            </TrackedLink>
          </div>
        </div>

        <div className="panel rounded-[2rem] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/8 bg-black/25 p-5">
              <Clapperboard className="text-[#d4af37]" size={20} />
              <h2 className="mt-4 text-lg font-semibold text-white">Editing Systems</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">Clean delivery for long-form, clips, and channel-ready assets.</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-black/25 p-5">
              <Upload className="text-[#d4af37]" size={20} />
              <h2 className="mt-4 text-lg font-semibold text-white">Upload Operations</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">Assistance with scheduling, file prep, and publishing flow.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Process</p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {processSteps.map((step, index) => (
            <article key={step} className="panel rounded-[1.5rem] p-5">
              <p className="text-sm font-semibold text-[#d4af37]">0{index + 1}</p>
              <h2 className="mt-3 text-lg font-semibold text-white">{step}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Portfolio</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {['YouTube', 'Shorts', 'TikTok', 'Podcasts'].map((item) => (
            <article key={item} className="panel rounded-[1.5rem] p-6">
              <CheckCircle2 className="text-[#d4af37]" size={18} />
              <h2 className="mt-4 text-xl font-semibold text-white">{item}</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">Placeholder card for featured work, examples, or proof later.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Pricing</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {creatorLogisticsPlans.map((plan) => (
            <article key={plan.key} className="panel flex h-full flex-col rounded-[1.75rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4af37]">{plan.name}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{plan.price}</p>
              <p className="mt-3 text-sm leading-7 text-white/65">{plan.description}</p>
              <div className="mt-6 flex-1 rounded-3xl border border-[#d4af37]/15 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[#f4df9d]">Monthly Service</p>
                <p className="mt-3 text-sm leading-6 text-white/55">Use Stripe subscription checkout once the price IDs are connected.</p>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <TrackedLink
                  href="/contact"
                  eventName="book_consultation"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 px-4 py-3 text-sm font-semibold text-white"
                >
                  Book Discovery Call
                </TrackedLink>
                <TrackedLink
                  href={`/pay?plan=${plan.key}`}
                  eventName="custom_click"
                  className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-4 py-3 text-sm font-semibold text-[#0a0a0a]"
                >
                  Start Creator Logistics
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">FAQ</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Common questions before starting.</h2>
        </div>
        <div className="grid gap-4">
          {faqItems.map((item) => (
            <article key={item.q} className="panel rounded-[1.5rem] p-6">
              <h3 className="text-lg font-semibold text-white">{item.q}</h3>
              <p className="mt-2 text-sm leading-7 text-white/65">{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
