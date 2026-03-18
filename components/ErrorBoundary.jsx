'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // TODO: Log error to error tracking service (e.g., Sentry)
        // Example:
        // if (typeof window !== 'undefined' && window.Sentry) {
        //     window.Sentry.captureException(error, {
        //         contexts: { react: { componentStack: errorInfo.componentStack } }
        //     });
        // }
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="container mt-100 mb-100">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <h1 className="text-display-1 color-gray-900 mb-20">
                                Something went wrong
                            </h1>
                            <p className="text-body-lead-large color-gray-600 mb-40">
                                We're sorry, but something unexpected happened. Please try refreshing the page.
                            </p>
                            <div className="d-flex gap-15 justify-content-center">
                                <button
                                    onClick={() => {
                                        this.setState({ hasError: false, error: null });
                                        window.location.href = '/';
                                    }}
                                    className="btn btn-black icon-arrow-right-white"
                                >
                                    Go to Homepage
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="btn btn-black icon-arrow-right-white"
                                >
                                    Refresh Page
                                </button>
                            </div>
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mt-40 text-start" style={{ maxWidth: '800px', margin: '40px auto 0' }}>
                                    <summary style={{ cursor: 'pointer', color: '#dc3545' }}>
                                        Error Details (Development Only)
                                    </summary>
                                    <pre style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '4px', overflow: 'auto' }}>
                                        {this.state.error.toString()}
                                        {this.state.error.stack && (
                                            <div style={{ marginTop: '10px' }}>
                                                {this.state.error.stack}
                                            </div>
                                        )}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
