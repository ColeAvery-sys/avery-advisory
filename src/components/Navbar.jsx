import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Ecosystem', to: '/ecosystem' },
  { label: 'Mission', to: '/mission' },
  { label: 'Labs', to: '/labs' },
  { label: 'ATLAS Mark I', to: '/atlas-mark-1' },
  { label: 'Investors', to: '/investors' },
  { label: 'Contact', to: '/contact' },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-sm font-bold text-sky-300 shadow-[0_0_25px_rgba(14,165,233,0.18)] transition duration-300 group-hover:scale-105">
            A
          </div>
          <div>
            <div className="text-lg font-semibold tracking-[0.28em] text-white">
              AVERYTECH
            </div>
            <div className="text-[0.7rem] uppercase tracking-[0.28em] text-slate-400">
              Technology for Humanity
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-sky-400/12 text-white ring-1 ring-inset ring-sky-400/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-sky-400/30 hover:bg-sky-400/10 lg:hidden"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`border-t border-white/10 bg-slate-950/95 px-4 lg:hidden ${
          open ? 'mobile-nav-open' : 'hidden'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 py-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  'rounded-2xl border px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'border-sky-400/30 bg-sky-400/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/30 hover:bg-sky-400/10',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
