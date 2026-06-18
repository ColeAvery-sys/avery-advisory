'use client';

import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { trackEvent, type AnalyticsEventName } from '@/lib/analytics';

type TrackedLinkProps = {
  href: string;
  eventName: AnalyticsEventName;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'className' | 'onClick'>;

export default function TrackedLink({ href, eventName, children, className, ...props }: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent(eventName)}
      {...props}
    >
      {children}
    </Link>
  );
}
