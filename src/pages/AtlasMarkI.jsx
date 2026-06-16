import React from 'react';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import { atlasMarkISpecs } from '../data/specs';
import { Shield, Layers3, ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const variants = ['Mark I', 'Mark II', 'Mark III', 'Titan', 'Sentinel'];

function AtlasMarkIPage() {
  return (
    <>
      <Seo
        title="ATLAS Mark I"
        description="Explore the ATLAS Mark I concept program, a research initiative for future human augmentation and field safety platforms."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="Concept Program"
          title="ATLAS Mark I"
          description="Research initiative and future development platform for human augmentation, worker safety, and resilient field support."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Future Development Platform
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Mission
                </h2>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              ATLAS Mark I is positioned as a concept program for systems that could improve safety, load support, and disaster readiness without implying current production deployment.
            </p>
            <div className="mt-6 rounded-[1.5rem] border border-sky-400/20 bg-[linear-gradient(135deg,rgba(14,165,233,0.14),rgba(2,6,23,0.92)_56%)] p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-300">
                Label
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-100">
                Concept Program
                <br />
                Research Initiative
                <br />
                Future Development Platform
              </p>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Technical Snapshot
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Engineering Targets
                </h3>
              </div>
              <div className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
                Prototype roadmap
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {atlasMarkISpecs.map((spec) => (
                <StatCard key={spec.label} label={spec.label} value={spec.value} />
              ))}
            </div>
          </article>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Layers3 className="h-5 w-5 text-sky-300" />
              <h3 className="text-xl font-semibold text-white">Applications</h3>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                'Construction',
                'Logistics',
                'Utilities',
                'Disaster response',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Rocket className="h-5 w-5 text-sky-300" />
              <h3 className="text-xl font-semibold text-white">Prototype Roadmap</h3>
            </div>
            <div className="mt-5 space-y-4">
              {[
                'Mark I: concept framing, safety posture, and human factors research.',
                'Mark II: lift geometry, operator interface, and modular support systems.',
                'Mark III: resilient systems integration and field testing pathways.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Future Variants
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Mark I, Mark II, Mark III, Titan, Sentinel
              </h3>
            </div>
            <Link
              to="/ecosystem"
              className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Explore Ecosystem
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {variants.map((variant) => (
              <div key={variant} className="rounded-2xl border border-sky-400/15 bg-slate-950/70 p-4 text-center text-sm font-medium text-slate-200">
                {variant}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AtlasMarkIPage;
