'use client';

import ErrorBoundary from '../ErrorBoundary';

/**
 * Wrapper component to provide error boundary functionality
 * This needs to be a client component to wrap server components
 */
export default function ErrorBoundaryWrapper({ children }) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
}
