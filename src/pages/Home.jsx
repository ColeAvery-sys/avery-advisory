import React, { useState } from 'react';
import Seo from '../components/Seo';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Mission from '../components/Mission';
import AtlasMarkI from '../components/AtlasMarkI';
import Impact from '../components/Impact';
import InvestorCTA from '../components/InvestorCTA';
import ProductModal from '../components/ProductModal';

function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <Seo
        title="Home"
        description="AveryTech flagship technology website for accessibility, AI, workforce augmentation, education, and research."
      />
      <Hero />
      <ProductGrid onOpenProduct={setSelectedProduct} />
      <Mission />
      <AtlasMarkI />
      <Impact />
      <InvestorCTA />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}

export default Home;
