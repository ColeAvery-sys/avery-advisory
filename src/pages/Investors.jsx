import React from 'react';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Factory, LineChart, Route } from 'lucide-react';

const investorCards = [
  {
    title: 'Accessibility Market',
    icon: Route,
    opportunity: 'Growing demand for assistive systems that reduce friction in daily life.',
    impact: 'Improves independence, accessibility, and participation across user groups.',
    strategicFit: 'Supports EchoFrame and the broader human-centered product vision.',
  },
  {
    title: 'Human Augmentation',
    icon: Factory,
    opportunity: 'Long-horizon platform potential in safety, logistics, and field support.',
    impact: 'Creates a differentiated research story and industrial relevance.',
    strategicFit: 'Directly connected to ATLAS Mark I concept development.',
  },
  {
    title: 'AI Productivity',
    icon: LineChart,
    opportunity: 'Teams want smarter automation without losing oversight or accountability.',
    impact: 'Raises execution speed while keeping human judgment in the loop.',
    strategicFit: 'ATLAS AI is the operating layer for this category.',
  },
  {
    title: 'Workforce Safety',
    icon: BriefcaseBusiness,
    opportunity: 'Workplace safety remains a critical market where practical tech matters.',
    impact: 'Reduces strain, improves awareness, and supports safer operations.',
    strategicFit: 'Strong fit with ATLAS Mark I and industrial applications.',
  },
  {
    title: 'Climate Resilience',
    icon: Factory,
    opportunity: 'Utility, disaster response, and resilience tools are increasingly valuable.',
    impact: 'Supports field readiness and continuity during difficult conditions.',
    strategicFit: 'Connects to ATLAS Mark I, labs, and future support platforms.',
  },
  {
    title: 'Education Technology',
    icon: Route,
    opportunity: 'Practical education remains a durable market when tied to real outcomes.',
    impact: 'Builds skills, confidence, and repeatable competency development.',
    strategicFit: 'Avery Academy rounds out the ecosystem and expands reach.',
  },
];

function Investors() {
  return (
    <>
      <Seo
        title="Investors"
        description="Investor dashboard for AveryTech covering accessibility, human augmentation, AI productivity, workforce safety, climate resilience, and education technology."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="Investors"
          title="Invest in human-centered technology."
          description="AveryTech is framed around product categories that can compound across accessibility, operations, education, and safety."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {investorCards.map(({ title, icon: Icon, opportunity, impact, strategicFit }) => (
            <article
              key={title}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-sky-400/8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              </div>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
                <p><span className="font-semibold text-slate-100">Opportunity:</span> {opportunity}</p>
                <p><span className="font-semibold text-slate-100">Impact:</span> {impact}</p>
                <p><span className="font-semibold text-slate-100">Strategic fit:</span> {strategicFit}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard label="Positioning" value="Serious, ethical, and investor-ready." />
          <StatCard label="Risk Stance" value="Future platforms are framed as research and roadmap items only." />
          <StatCard label="Next Step" value="Request a brief through the contact page." />
        </div>

        <div className="mt-10 rounded-[2rem] border border-sky-400/20 bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(2,6,23,0.95)_55%)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.32)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
                Investor CTA
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Help build the human-centered technology company of the future.
              </h2>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:translate-y-[-1px] hover:bg-sky-300"
            >
              Request Investor Brief
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Investors;
