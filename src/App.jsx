import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './layout/SiteLayout';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Mission = lazy(() => import('./pages/Mission'));
const Labs = lazy(() => import('./pages/Labs'));
const Investors = lazy(() => import('./pages/Investors'));
const Contact = lazy(() => import('./pages/Contact'));
const Ecosystem = lazy(() => import('./pages/Ecosystem'));
const AtlasMarkI = lazy(() => import('./pages/AtlasMarkI'));

function RouteFallback() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 text-sm text-slate-300 sm:px-6 lg:px-8">
      Loading AveryTech...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/ecosystem" element={<Ecosystem />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/atlas-mark-1" element={<AtlasMarkI />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
