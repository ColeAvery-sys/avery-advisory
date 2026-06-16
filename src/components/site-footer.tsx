import Link from 'next/link';
import { contactEmail, companyLegalName, navLinks, responseTime, siteName } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d4af37]">{siteName}</p>
          <p className="max-w-md text-sm leading-6 text-white/65">
            Business automation, AI consulting, and operational systems for teams that want clearer workflows and stronger revenue
            execution.
          </p>
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {companyLegalName}. All rights reserved.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Site</h2>
          <div className="mt-4 grid gap-2 text-sm">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-white/65 transition hover:text-[#f4df9d]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Contact</h2>
          <div className="mt-4 space-y-2 text-sm text-white/65">
            <p>
              Email:{' '}
              <a className="text-[#f4df9d] transition hover:text-[#ffe9a8]" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </p>
            <p>Response Time: {responseTime}</p>
            <p>
              Legal entity: <span className="text-white/80">{companyLegalName}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
