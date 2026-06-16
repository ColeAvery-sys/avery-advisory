import React from 'react';
import SectionHeader from './SectionHeader';

function Mission() {
  return (
    <section id="mission" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <SectionHeader
          kicker="Mission"
          title="We build tools that amplify people."
          description="AveryTech builds technology that amplifies human ability instead of replacing human value."
        />

        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Accessibility', 'Tools that reduce friction, support independence, and expand participation.'],
              ['Worker Safety', 'Systems that help people move, lift, and operate with greater control.'],
              ['Ethical AI', 'Practical automation with human oversight and clear responsibility.'],
              ['Climate Resilience', 'Future-ready concepts for utility, field, and disaster environments.'],
              ['Practical Education', 'Learning systems tied to useful, real-world outcomes.'],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              >
                <p className="text-xs uppercase tracking-[0.26em] text-sky-300">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Mission;
