import React from 'react';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import { researchInitiatives } from '../data/impact';
import { Cpu, Smartphone, Bot, ShieldCheck, Glasses, Workflow } from 'lucide-react';

function Labs() {
  const categories = [
    { title: 'Accessibility Systems', icon: Smartphone },
    { title: 'Human Augmentation', icon: ShieldCheck },
    { title: 'AI Operations', icon: Bot },
    { title: 'Education Technology', icon: Workflow },
    { title: 'Robotics', icon: Cpu },
    { title: 'Human-Machine Interfaces', icon: Glasses },
  ];

  return (
    <>
      <Seo
        title="Labs"
        description="AveryTech labs and research categories including accessibility systems, AI operations, robotics, and human-machine interfaces."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="Labs"
          title="Research initiatives that shape the roadmap."
          description="AveryTech uses the labs surface to describe future-facing work, not finished claims."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map(({ title, icon: Icon }) => (
            <article
              key={title}
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-sky-400/8"
            >
              <Icon className="h-5 w-5 text-sky-300" />
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Research direction tied to accessible, practical, and safe product design.
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Research Goal" value="Translate useful concepts into deployable systems." />
          <StatCard label="Safety Lens" value="Design from the start with oversight and real-world risk in mind." />
          <StatCard label="Product Link" value="Future work connects back to accessibility, operations, and education." />
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            AveryTech Labs
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {researchInitiatives.map((initiative) => (
              <div key={initiative} className="rounded-2xl border border-sky-400/15 bg-slate-950/70 p-4 text-sm text-slate-200">
                {initiative}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Labs;
