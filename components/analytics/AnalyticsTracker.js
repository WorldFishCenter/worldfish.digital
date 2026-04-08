'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent, trackPageView } from '@/lib/analytics';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const query = searchParams?.toString();
        const url = `${window.location.origin}${pathname}${query ? `?${query}` : ''}`;
        trackPageView(url);
    }, [pathname, searchParams]);

    useEffect(() => {
        const onClick = (event) => {
            const target = event.target instanceof Element
                ? event.target.closest('[data-analytics-event]')
                : null;
            if (!target) return;

            const { analyticsEvent, analyticsLabel, analyticsCategory, analyticsLocation, analyticsValue } = target.dataset;
            const value = analyticsValue ? Number(analyticsValue) : undefined;

            trackEvent(analyticsEvent, {
                event_category: analyticsCategory,
                event_label: analyticsLabel,
                link_location: analyticsLocation,
                value: Number.isFinite(value) ? value : undefined,
            });
        };

        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    return null;
}
