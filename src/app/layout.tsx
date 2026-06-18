import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
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
    default: `${siteName} | Marketing Consolidation & AI`,
    template: `%s | ${siteName}`,
  },
  description: 'Avery Advisory helps consolidate marketing, simplify execution, and apply AI where it creates leverage.',
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    title: `${siteName} | Marketing Consolidation & AI`,
    description: tagline,
    url: siteUrl,
    siteName,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Marketing Consolidation & AI`,
    description: tagline,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? '';
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID?.trim() ?? '';

  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-[#0a0a0a] text-white antialiased`}>
        {gaId ? (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { anonymize_ip: true, page_path: window.location.pathname });
              `}
            </Script>
          </>
        ) : null}
        {clarityId ? (
          <Script id="clarity-init" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        ) : null}
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
