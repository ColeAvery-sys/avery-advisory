import React from 'react';
import { CalendarClock } from 'lucide-react';

const roadmap = [
  { year: '2026', title: 'EchoFrame Prototype' },
  { year: '2027', title: 'ATLAS AI Expansion' },
  { year: '2028', title: 'Avery Academy Launch' },
  { year: '2029', title: 'ATLAS Mark I Research Platform' },
  { year: '2030+', title: 'Human Augmentation Systems' },
];

function RoadmapTimeline() {
  return (
    <section id="roadmap" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
          Timeline
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
          ATLAS timeline for the AveryTech portfolio.
        </h2>
      </div>

      <div className="relative mt-12">
        <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-sky-400/0 via-sky-400/50 to-sky-400/0 lg:block" />
        <div className="grid gap-5 lg:pl-12">
          {roadmap.map((item, index) => (
            <article
              key={item.year}
              className="timeline-card relative rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-sky-400/8"
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <div className="absolute left-[-2.2rem] top-6 hidden h-4 w-4 rounded-full border border-sky-300 bg-slate-950 shadow-[0_0_22px_rgba(56,189,248,0.9)] lg:block" />
              <div className="flex items-center gap-3">
                <CalendarClock className="h-5 w-5 text-sky-300" />
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                  {item.year}
                </p>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoadmapTimeline;
