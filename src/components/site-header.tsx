'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navLinks, siteName } from '@/lib/site';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const visibleLinks = useMemo(() => navLinks.filter((link) => link.href !== '/privacy-policy' && link.href !== '/terms-of-service' && link.href !== '/refund-policy'), []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-[180px] overflow-hidden rounded-md border border-white/8 bg-[#0f1621] px-2 py-1 sm:w-[220px]">
            <Image
              src="/avery-advisory-brand.png"
              alt={`${siteName} logo`}
              fill
              priority
              sizes="(max-width: 640px) 180px, 220px"
              className="object-contain object-left"
            />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-[11px] uppercase tracking-[0.32em] text-white/55">Marketing Systems</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {visibleLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active ? 'bg-[#d4af37] text-[#0a0a0a]' : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="rounded-full border border-[#d4af37]/40 px-4 py-2 text-sm font-medium text-[#f4df9d] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10"
          >
            Start a Project
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center justify-center rounded-full border border-white/10 p-2 text-white/80 lg:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#0a0a0a] lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm ${
                  pathname === link.href ? 'bg-[#d4af37] text-[#0a0a0a]' : 'bg-white/5 text-white/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-2xl border border-[#d4af37]/40 px-4 py-3 text-center text-sm font-medium text-[#f4df9d]"
            >
              Start a Project
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
