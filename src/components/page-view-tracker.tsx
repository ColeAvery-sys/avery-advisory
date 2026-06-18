'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, type AnalyticsEventName } from '@/lib/analytics';

type PageViewTrackerProps = {
  eventName: AnalyticsEventName;
  page?: string;
};

export default function PageViewTracker({ eventName, page }: PageViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) {
      return;
    }

    tracked.current = true;
    trackEvent(eventName, { page });
  }, [eventName, page]);

  return null;
}
