import React from 'react';
import { Link } from 'react-router-dom';

const links = [
  { label: 'Mission', to: '/mission' },
  { label: 'Products', to: '/products' },
  { label: 'Ecosystem', to: '/ecosystem' },
  { label: 'Labs', to: '/labs' },
  { label: 'ATLAS Mark I', to: '/atlas-mark-1' },
  { label: 'Investors', to: '/investors' },
  { label: 'Contact', to: '/contact' },
];

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">
            AveryTech - A division of Avery Industries LLC
          </p>
          <p className="mt-2 text-sm text-slate-400">Technology for Humanity</p>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
