import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function InvestorCTA() {
  return (
    <section id="investors" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-sky-400/20 bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(2,6,23,0.95)_55%)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
              Investors
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
              Help build the human-centered technology company of the future.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Request a brief to review AveryTech&apos;s vision, product direction, and long-term opportunity. Outbound sharing stays approval-gated.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Next Step
              </p>
              <p className="mt-3 text-lg font-medium text-white">
                Investor brief requests are reviewed before any outbound response.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:translate-y-[-1px] hover:bg-sky-300"
              >
                Request Investor Brief
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InvestorCTA;
