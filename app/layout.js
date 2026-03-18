import '../public/assets/css/style.css'
import '../public/assets/css/modal.css'
import "../public/assets/css/swiper-custom.css";
import { Chivo, Noto_Sans } from 'next/font/google'
import Script from 'next/script'
import WowInit from '@/components/elements/WowInit'
import ErrorBoundaryWrapper from '@/components/layout/ErrorBoundaryWrapper'
import { DEFAULT_METADATA, GA_ID } from '@/lib/constants'

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
    ...DEFAULT_METADATA,
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Google Tag (gtag.js) */}
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
                
                {/* Preload critical resources */}
                <link
                    rel="preload"
                    href="/assets/fonts/uicons/uicons-regular-rounded.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @font-face {
                            font-family: 'uicons-regular-rounded';
                            font-display: swap;
                        }
                    `
                }} />
            </head>
            <body className={`${chivo.variable} ${noto.variable}`}>
                <WowInit />
                <ErrorBoundaryWrapper>
                    {children}
                </ErrorBoundaryWrapper>
            </body>
        </html>
    )
}
