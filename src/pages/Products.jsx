import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { products } from '../data/products';
import { atlasMarkISpecs } from '../data/specs';
import StatCard from '../components/StatCard';
import { colors } from '../theme/colors';

function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <Seo
        title="Products"
        description="Explore AveryTech product dossiers including EchoFrame, ATLAS AI, ATLAS Mark I, and Avery Academy."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="Products"
          title="A focused portfolio of systems built for leverage."
          description="Each concept is framed as a serious product direction with clear user value, operational use, and future roadmap potential."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <div key={product.name} className="product-dossier">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300/90">
                    {product.category}
                  </span>
                  <div className="h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.9)]" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white">{product.name}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{product.overview}</p>
                <p className="mt-4 text-sm leading-7 text-slate-200">{product.mission}</p>
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
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.cta}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-sky-400/40 hover:bg-sky-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section id="atlas-mark-i" className="mt-20">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
                  ATLAS Mark I
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  Industrial human-augmentation concept with a safety-first roadmap.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  This section intentionally uses concept language only. It describes engineering targets, not a finished product.
                </p>
              </div>
              <Link
                to="/atlas-mark-1"
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-5 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-300/60 hover:bg-sky-400/15"
              >
                Dedicated ATLAS Mark I Page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {atlasMarkISpecs.map((spec) => (
                <StatCard key={spec.label} label={spec.label} value={spec.value} />
              ))}
            </div>

            <div
              className="mt-8 rounded-[1.5rem] border border-sky-400/20 p-5"
              style={{ background: colors.deepNavy }}
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Usage Direction
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Construction, logistics, utilities, and disaster response are the intended target environments for future exploration.
              </p>
            </div>
          </div>
        </section>
      </div>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}

export default Products;
