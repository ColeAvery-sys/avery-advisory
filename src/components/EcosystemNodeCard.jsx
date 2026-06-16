import React from 'react';
import { Layers3 } from 'lucide-react';

function EcosystemNodeCard({ name, detail, index }) {
  return (
    <article className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-sky-400/8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Layers3 className="h-5 w-5 text-sky-300" />
            <h3 className="text-xl font-semibold text-white">{name}</h3>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            {detail}
          </p>
        </div>
        <div className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
          Node {index + 1}
        </div>
      </div>
    </article>
  );
}

export default EcosystemNodeCard;
