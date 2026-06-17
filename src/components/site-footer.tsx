import Link from 'next/link';
import { contactEmail, companyLegalName, navLinks, responseTime, secondaryContactEmail, siteName } from '@/lib/site';

export default function SiteFooter() {
  const primaryLinks = navLinks.slice(0, 4);
  const supportLinks = navLinks.slice(4);

  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.9fr_0.95fr]">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d4af37]">{siteName}</p>
              <p className="max-w-md text-sm leading-6 text-white/65">
                Marketing consolidation, clearer operations, and practical AI support for brands that want a tighter operating
                layer.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">Avery Industries LLC</span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">Response within 1 business day</span>
            </div>

            <p className="text-sm text-white/50">
              &copy; {new Date().getFullYear()} {companyLegalName}. All rights reserved.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Site</h2>
            <div className="mt-4 grid gap-2 text-sm">
              {primaryLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-white/65 transition hover:text-[#f4df9d]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Support</h2>
              <div className="mt-4 grid gap-2 text-sm">
                {supportLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-white/65 transition hover:text-[#f4df9d]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#d4af37]/20 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Contact</h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[#f4df9d]">Primary inbox</p>
                </div>
                <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f4df9d]">
                  Fast response
                </span>
              </div>

              <div className="mt-4 space-y-4 text-sm text-white/65">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Primary Email</p>
                  <a
                    className="mt-2 block break-all text-base font-semibold text-[#f4df9d] transition hover:text-[#ffe9a8]"
                    href={`mailto:${contactEmail}`}
                  >
                    {contactEmail}
                  </a>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Secondary Email</p>
                  <a className="mt-2 block break-all text-sm text-white/75 transition hover:text-white" href={`mailto:${secondaryContactEmail}`}>
                    {secondaryContactEmail}
                  </a>
                </div>

                <div className="grid gap-2 text-sm text-white/65">
                  <p>Response Time: {responseTime}</p>
                  <p>
                    Legal entity: <span className="text-white/80">{companyLegalName}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] transition hover:bg-[#e8c55d]"
                >
                  Contact Page
                </Link>
                <Link
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75 transition hover:border-[#d4af37]/40 hover:text-white"
                >
                  Email Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
