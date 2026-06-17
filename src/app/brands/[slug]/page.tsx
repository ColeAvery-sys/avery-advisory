import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, BadgeCheck, Building2, Layers3, Sparkles } from 'lucide-react';
import { companyDivisions, getDivisionBySlug } from '@/lib/company-network';
import { companyLegalName, siteUrl } from '@/lib/site';

type BrandPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return companyDivisions.map((division) => ({ slug: division.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const division = getDivisionBySlug(slug);

  if (!division) {
    return {
      title: 'Brand',
      description: 'Division page for Avery Industries LLC.',
    };
  }

  return {
    title: division.name,
    description: division.headline,
    alternates: {
      canonical: `${siteUrl}/brands/${division.slug}`,
    },
    openGraph: {
      title: `${division.name} | ${companyLegalName}`,
      description: division.summary,
      url: `${siteUrl}/brands/${division.slug}`,
      siteName: companyLegalName,
      type: 'website',
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const division = getDivisionBySlug(slug);

  if (!division) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Division</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">{division.name}</h1>
          <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">{division.headline}</p>
          <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">{division.summary}</p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/companies"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e8c55d]"
            >
              Back to Company Network
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#d4af37]/40 hover:bg-white/[0.05]"
            >
              Start a Request
            </Link>
          </div>
        </div>

        <div className="panel gold-border rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#f4df9d]">{division.role}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{division.launchStage}</p>
            </div>
            <div className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-3 py-1 text-xs font-semibold text-[#f4df9d]">
              {division.domain}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/8 bg-black/30 p-4">
              <Building2 className="text-[#d4af37]" size={18} />
              <p className="mt-3 text-sm leading-6 text-white/75">Structured as part of Avery Industries LLC.</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-black/30 p-4">
              <Layers3 className="text-[#d4af37]" size={18} />
              <p className="mt-3 text-sm leading-6 text-white/75">Uses the shared brand system and content pipeline.</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-black/30 p-4">
              <BadgeCheck className="text-[#d4af37]" size={18} />
              <p className="mt-3 text-sm leading-6 text-white/75">Designed to stay approval-gated and operational.</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-black/30 p-4">
              <Sparkles className="text-[#d4af37]" size={18} />
              <p className="mt-3 text-sm leading-6 text-white/75">{division.nextStep}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Operating Focus</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">What this division is responsible for.</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {division.operatingFocus.map((item) => (
            <article key={item} className="panel rounded-[1.5rem] p-5">
              <p className="text-sm leading-7 text-white/70">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Launch Context</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">This page exists so every division can share the same template.</h2>
          <p className="max-w-xl text-sm leading-7 text-white/65">
            The idea is simple: one parent company, one reusable system, and one clean experience no matter which division a
            visitor opens.
          </p>
        </div>

        <div className="panel rounded-[2rem] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Domain</p>
          <p className="mt-3 text-2xl font-semibold text-white">{division.domain}</p>
          <p className="mt-4 text-sm leading-7 text-white/65">
            This path can later be mapped to its own hosted domain without changing the underlying page template or content
            model.
          </p>
        </div>
      </section>
    </div>
  );
}
