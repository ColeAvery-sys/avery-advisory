import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { siteName, siteUrl, tagline } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | AI Automation & Business Consulting`,
    template: `%s | ${siteName}`,
  },
  description: 'Helping businesses implement AI, automation, and operational systems that save time, reduce costs, and scale efficiently.',
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    title: `${siteName} | AI Automation & Business Consulting`,
    description: tagline,
    url: siteUrl,
    siteName,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | AI Automation & Business Consulting`,
    description: tagline,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-[#0a0a0a] text-white antialiased`}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_28%),radial-gradient(circle_at_80%_12%,_rgba(255,255,255,0.08),_transparent_20%),linear-gradient(180deg,_rgba(10,10,10,0.5),_rgba(10,10,10,0.96))]" />
          <div className="pointer-events-none absolute inset-0 grid-fade opacity-50" />
          <div className="relative">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
