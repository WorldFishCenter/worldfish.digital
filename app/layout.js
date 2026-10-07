import '../public/assets/css/style.css'
import '../styles/app.css'
import '../styles/wf-components.css'
import { Chivo, Source_Serif_4 } from 'next/font/google'
import Script from 'next/script'
import WowInit from '@/components/elements/WowInit'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import ErrorBoundaryWrapper from '@/components/layout/ErrorBoundaryWrapper'
import { DEFAULT_METADATA, GA_ENABLED, GA_ID, WORLD_FISH_SITE } from '@/lib/constants'

function metadataBaseUrl() {
    const raw = (process.env.NEXT_PUBLIC_SITE_URL || WORLD_FISH_SITE.url || 'https://peskas.show').replace(/\/$/, '')
    try {
        return new URL(`${raw}/`)
    } catch {
        return new URL('https://peskas.show/')
    }
}

const chivo = Chivo({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: "--chivo",
    display: 'swap',
})
// Editorial serif for display headings and long-form reading. Chosen over the
// previous Noto Sans to move the site out of the product-launch register and
// into the institutional/research one the funder audience expects.
const sourceSerif = Source_Serif_4({
    weight: ['300', '400', '600', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: "--serif",
    display: 'swap',
})

export const metadata = {
    metadataBase: metadataBaseUrl(),
    ...DEFAULT_METADATA,
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${chivo.variable} ${sourceSerif.variable}`}>
            <head>
                {GA_ENABLED ? (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GA_ID}');
                            `}
                        </Script>
                    </>
                ) : null}
                
                {/* Preload critical resources */}
                <link
                    rel="preload"
                    href="/assets/fonts/uicons/uicons-regular-rounded.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
            </head>
            <body className="wf-site">
                <WowInit />
                {GA_ENABLED ? <AnalyticsTracker /> : null}
                <ErrorBoundaryWrapper>
                    {children}
                </ErrorBoundaryWrapper>
            </body>
        </html>
    )
}
