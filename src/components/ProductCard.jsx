import React from 'react';
import { ArrowRight, PlusCircle } from 'lucide-react';

function ProductCard({ product, onOpen }) {
  return (
    <button
      type="button"
      className="group w-full rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-left shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-sky-400/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      onClick={() => onOpen(product)}
      aria-haspopup="dialog"
      aria-label={`Open details for ${product.name}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300/90">
          {product.category}
        </span>
        <div className="h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.9)]" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-white">{product.name}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-300">{product.mission}</p>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-200">
        {product.useCases.map((useCase) => (
          <li key={useCase} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-300" />
            <span>{useCase}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-2xl border border-sky-400/15 bg-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
          Development status
        </p>
        <p className="mt-2 text-sm text-slate-100">{product.status}</p>
      </div>
      <div className="mt-6">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-200 transition group-hover:text-white">
          <PlusCircle className="h-4 w-4" />
          Open product details
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}

export default ProductCard;
