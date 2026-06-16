import React from 'react';
import { ArrowDown } from 'lucide-react';
import EcosystemNodeCard from './EcosystemNodeCard';

const nodes = [
  { name: 'EchoFrame', detail: 'Accessibility intelligence and smart glasses support.' },
  { name: 'ATLAS AI', detail: 'Automation, operations, and workflow intelligence.' },
  { name: 'ATLAS Mark I', detail: 'Human augmentation concept and safety roadmap.' },
  { name: 'Avery Academy', detail: 'Practical education and training platform.' },
  { name: 'AveryTech Labs', detail: 'Research and future platform incubation.' },
];

function EcosystemFlow() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
          Ecosystem
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
          The AveryTech Ecosystem
        </h2>
        <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
          Technology designed to improve human capability, accessibility, safety, and independence.
        </p>
      </div>

      <div className="mt-12 grid gap-4">
        {nodes.map((node, index) => (
          <div key={node.name} className="relative">
            {index < nodes.length - 1 ? (
              <div className="absolute left-1/2 top-[100%] hidden h-8 w-px -translate-x-1/2 bg-gradient-to-b from-sky-400/70 to-transparent lg:block" />
            ) : null}
            <EcosystemNodeCard name={node.name} detail={node.detail} index={index} />

            {index < nodes.length - 1 ? (
              <div className="mx-auto my-4 flex h-12 w-12 items-center justify-center rounded-full border border-sky-400/20 bg-slate-950/80 text-sky-300 shadow-[0_0_22px_rgba(56,189,248,0.22)]">
                <ArrowDown className="h-5 w-5 animate-pulse" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default EcosystemFlow;
