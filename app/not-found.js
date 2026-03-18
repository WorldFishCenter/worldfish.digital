import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function NotFound() {
    return (
        <Layout>
            <section className="section-box">
                <div className="container mt-100">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <h1 className="text-display-1 color-gray-900 mb-20">404</h1>
                            <h2 className="text-heading-2 color-gray-900 mb-20">Page Not Found</h2>
                            <p className="text-body-lead-large color-gray-600 mb-40">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                            <Link href="/" className="btn btn-black icon-arrow-right-white">
                                Back to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
