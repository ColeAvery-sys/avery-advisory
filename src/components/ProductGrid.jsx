import React from 'react';
import SectionHeader from './SectionHeader';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function ProductGrid({ onOpenProduct }) {
  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        kicker="Products"
        title="Systems designed to remove friction from real life."
        description="AveryTech focuses on tools that make work safer, learning easier, and operations more intelligent."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} onOpen={onOpenProduct} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/ecosystem"
          className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-5 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-300/60 hover:bg-sky-400/15"
        >
          Explore Ecosystem
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default ProductGrid;
