import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="hero-particles pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_34%)]" />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.18fr_0.82fr] lg:px-8 lg:py-24">
        <div className="relative z-10 max-w-3xl animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-sky-100">
            <Sparkles className="h-4 w-4" />
            Avery Industries LLC technology division
          </div>
          <h1 className="hero-title max-w-3xl text-white">
            Technology For Humanity
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Building accessibility tools, AI systems, workforce augmentation technologies, and educational platforms that empower people.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/ecosystem"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.32)] transition duration-300 hover:translate-y-[-1px] hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Explore Ecosystem
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ecosystem#roadmap"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-sky-400/40 hover:bg-sky-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              View Roadmap
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {['Accessibility systems', 'AI operations', 'Human augmentation'].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-sm animate-slide-up"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Brand Signal
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    AveryTech
                  </p>
                </div>
                <div className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
                  Flagship company website
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {[
                  ['Purpose', 'Useful technology for independence and leverage.'],
                  ['Focus', 'Accessibility, automation, operations, and augmentation.'],
                  ['Parent', 'Avery Industries LLC'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                      {label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-100">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ['Ethical', 'Human-centered systems'],
                  ['Operational', 'Dense and practical'],
                  ['Accessible', 'Built for real users'],
                  ['Investor-ready', 'Clear product narrative'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-sky-400/15 bg-slate-900/80 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.26em] text-sky-300">
                      {label}
                    </p>
                    <p className="mt-2 text-sm text-slate-200">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
