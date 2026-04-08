export function trackEvent(eventName, params = {}) {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params);
}

export function trackPageView(url) {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
        page_location: url,
        page_path: window.location.pathname + window.location.search,
        page_title: document.title,
    });
}
