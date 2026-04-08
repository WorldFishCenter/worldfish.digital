import '../public/assets/css/style.css'
import '../public/assets/css/modal.css'
import '../public/assets/css/swiper-custom.css'
import '../styles/app.css'
import '../styles/wf-components.css'
import { Chivo, Noto_Sans } from 'next/font/google'
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
const noto = Noto_Sans({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: "--noto",
    display: 'swap',
})

export const metadata = {
    metadataBase: metadataBaseUrl(),
    ...DEFAULT_METADATA,
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${chivo.variable} ${noto.variable}`}>
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
