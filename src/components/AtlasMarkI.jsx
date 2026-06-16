import React from 'react';
import SectionHeader from './SectionHeader';
import StatCard from './StatCard';
import { atlasMarkISpecs } from '../data/specs';
import { Shield, Gauge, Bot } from 'lucide-react';

function AtlasMarkI() {
  return (
    <section id="labs" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        kicker="Labs"
        title="ATLAS Mark I is a future platform, not a finished product."
        description="The concept is positioned as a prototype roadmap for human augmentation, field safety, and resilient industrial support."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Research Initiative
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-white">
                ATLAS Mark I Concept
              </h3>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-300">
            The concept explores stabilized lift assistance, logistics support, and disaster response utility without implying a current production machine.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <StatCard label="Focus" value="Worker safety and field resilience." />
            <StatCard label="Positioning" value="Prototype roadmap and research initiative." />
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
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
              Concept only
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {atlasMarkISpecs.map((spec) => (
              <StatCard key={spec.label} label={spec.label} value={spec.value} />
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Bot, label: 'Supportive systems' },
              { icon: Gauge, label: 'Performance targets' },
              { icon: Shield, label: 'Safety-first framing' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-center"
              >
                <Icon className="mx-auto h-5 w-5 text-sky-300" />
                <p className="mt-3 text-sm text-slate-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AtlasMarkI;
