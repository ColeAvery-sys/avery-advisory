import React, { useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';

function ProductModal({ product, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-sky-300">
              {product.category}
            </p>
            <h3 id="product-modal-title" className="mt-2 text-2xl font-semibold text-white">
              {product.name}
            </h3>
          </div>
          <button
            type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-sky-400/30 hover:bg-sky-400/10"
            aria-label="Close product details"
            onClick={onClose}
            ref={closeButtonRef}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Overview
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{product.overview}</p>
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Mission
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{product.mission}</p>
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Use Cases
              </p>
              <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-200">
                {product.useCases.map((useCase) => (
                  <li key={useCase} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-300" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-sky-400/20 bg-[linear-gradient(135deg,rgba(14,165,233,0.18),rgba(2,6,23,0.92)_55%)] p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-300">
                Development Status
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-100">{product.status}</p>
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Future Vision
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{product.futureVision}</p>
            </section>
            <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Next Step
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Route the conversation through the investor or contact pages for approval-gated follow-up.
              </p>
              <button
                type="button"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                onClick={onClose}
              >
                Close Details
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
