import React from 'react';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';

function Mission() {
  return (
    <>
      <Seo
        title="Mission"
        description="AveryTech mission, accessibility, safety, ethical AI, climate resilience, and practical education."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="Mission"
          title="AveryTech builds technology that amplifies human ability instead of replacing human value."
          description="The company is framed around accessibility, dignity, and practical outcomes that help people operate with more independence."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {[
            ['Accessibility', 'Tools that reduce friction and widen participation.'],
            ['Worker Safety', 'Systems that help people operate with greater control.'],
            ['Ethical AI', 'Automation with accountability and user agency.'],
            ['Climate Resilience', 'Technology positioned for utility and disaster response.'],
            ['Practical Education', 'Training that leads to useful, real-world outcomes.'],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-sky-400/8"
            >
              <div className="mb-4 h-12 w-12 rounded-2xl border border-sky-400/20 bg-sky-400/10" />
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export default Mission;
