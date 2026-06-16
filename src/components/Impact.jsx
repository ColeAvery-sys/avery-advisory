import React from 'react';
import SectionHeader from './SectionHeader';
import { impactItems } from '../data/impact';

function Impact() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        kicker="Impact"
        title="Built for outcomes that matter to people and institutions."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {impactItems.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-sky-400/8"
          >
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border border-sky-400/20 bg-sky-400/10" />
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Impact;
