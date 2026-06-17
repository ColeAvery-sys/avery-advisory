import Link from 'next/link';
import { ArrowRight, Building2, ChevronRight, Layers3, ShieldCheck } from 'lucide-react';
import { companyDivisions, launchOrder, sharedStack, validationChecklist } from '@/lib/company-network';
import { contactEmail } from '@/lib/site';

export const metadata = {
  title: 'Company Network',
  description: 'Avery Industries LLC parent-company blueprint for the shared brand network, launch order, and cheapest operating stack.',
};

const spotlight = companyDivisions.slice(0, 3);

export default function CompanyNetworkPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Parent Company</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
            A cheap, clean way to make Avery Industries LLC feel like a real operating company.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Start with one shared platform, then let each division get its own face, tone, and domain without paying for separate
            systems every time. This keeps the network tight, credible, and easy to grow.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e8c55d]"
            >
              Start the rollout
              <ArrowRight size={16} />
            </Link>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#d4af37]/40 hover:bg-white/[0.05]"
            >
              Keep it centralized
            </a>
          </div>
        </div>

        <div className="panel gold-border rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#f4df9d]">Launch Rule</p>
              <p className="mt-2 text-2xl font-semibold text-white">One company, many faces.</p>
            </div>
            <div className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-3 py-1 text-xs font-semibold text-[#f4df9d]">
              Cheap
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {sharedStack.map((item) => (
              <div key={item} className="rounded-3xl border border-white/8 bg-black/30 p-4">
                <ShieldCheck className="text-[#d4af37]" size={18} />
                <p className="mt-3 text-sm leading-6 text-white/75">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">First Three</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Launch the core brands first.</h2>
          </div>
          <div className="hidden items-center gap-2 text-sm text-white/55 md:flex">
            <Layers3 size={16} />
            Shared stack, separated identities.
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {spotlight.map((division) => (
            <article key={division.name} className="panel rounded-[1.5rem] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4af37]">{division.role}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{division.name}</h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/70">
                  {division.launchStage}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/65">{division.summary}</p>
              <Link href={`/brands/${division.slug}`} className="mt-5 inline-flex text-sm font-medium text-[#f4df9d] transition hover:text-[#ffe9a8]">
                Open division page
              </Link>
              <p className="mt-5 text-sm font-medium text-[#f4df9d]">{division.domain}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Launch Order</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Start with the mother page and the divisions that can carry revenue.</h2>
          <p className="max-w-xl text-sm leading-7 text-white/65">
            The goal is not to build every brand at once. The goal is to create one system that can support every future brand
            cheaply.
          </p>
        </div>

        <div className="grid gap-3">
          {launchOrder.map((step, index) => (
            <article key={step} className="panel rounded-[1.35rem] px-5 py-4">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 text-sm font-semibold text-[#f4df9d]">
                  0{index + 1}
                </div>
                <p className="text-sm leading-7 text-white/75">{step}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Divisions</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">The full company map.</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {companyDivisions.map((division) => (
            <article key={division.domain} className="panel rounded-[1.5rem] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">{division.role}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{division.name}</h3>
                </div>
                <ChevronRight className="mt-1 text-white/35" size={18} />
              </div>
              <p className="mt-3 text-sm leading-6 text-white/65">{division.summary}</p>
              <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                <span className="text-white/55">{division.domain}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/70">
                  {division.launchStage}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="panel rounded-[2rem] p-8">
          <div className="flex items-center gap-3">
            <Building2 className="text-[#d4af37]" size={20} />
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Validation Checklist</p>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-7 text-white/70">
            {validationChecklist.map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </div>

        <div className="panel gold-border rounded-[2rem] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Next Move</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Use this page as the operating map for the whole brand stack.</h2>
          <p className="mt-4 text-sm leading-7 text-white/65">
            Once this mother page is in place, every new brand can inherit the same navigation, analytics, forms, and content
            structure without another full rebuild.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e8c55d]"
            >
              Plan the first rollout
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
