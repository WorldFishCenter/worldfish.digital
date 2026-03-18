
'use client'
/* eslint-disable @next/next/no-img-element */
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import RichText from "@/components/content/RichText"
import data from "@/content/pages/terms.json"


function Terms() {
	return (
		<>
			<Layout>
				<section className="section-box mt-50 mb-50">
					<div className="container text-center">
						<h1 className="text-heading-1">{data.hero.title}</h1>
					</div>
				</section>
				<section className="section-box mt-50">
					<div className="container">
						<div className="row">
							<div className="col-lg-12 mx-auto">
								<div className="row">
									<div className="col-lg-2">
										<div className="table-of-content">
											<h6 className="mb-15">Table of content</h6>
											<ul>
												{data.tableOfContents.map((item) => (
													<li key={item.id}>
														<Link href={`#${item.id}`}>{item.label}</Link>
													</li>
												))}
											</ul>
										</div>
									</div>
									<div className="col-lg-8">
										<div className="single-detail">
											{data.sections.map((section) => (
												<div key={section.id}>
													<h6 className="mt-35 mb-25" id={section.id}>{section.title}</h6>
													<RichText content={section.body} />
												</div>
											))}
											{data.footerNote && (
												<h6 className="mt-50">{data.footerNote}</h6>
											)}
										</div>
									</div>
									{/* <div className="col-lg-2">
										<h3 className="text-heading-6 color-gray-400 mb-20 mt-150">Share</h3>
										<Link href="https://facebook.com" className="share-social share-fb" target="_blank" rel="noreferrer" ></Link><br />
										<Link href="https://twitter.com" className="share-social share-tw" target="_blank" rel="noreferrer" ></Link><br />
										<Link href="https://www.pinterest.com" className="share-social share-pi" target="_blank" rel="noreferrer" ></Link>
									</div> */}
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* <section className="section-box overflow-visible mb-100">
					<div className="container mt-100">
						<div className="row">
							<div className="col-lg-10 mx-auto">
								<div className="bg-6 box-newsletter position-relative">
									<div className="row">
										<div className="col-lg-5 col-md-7"><span className="text-body-capitalized color-gray-500 text-uppercase">newsletter</span>
											<h4 className="text-heading-2 mb-10 mt-10">Subscribe our newsletter</h4>
											<p className="text-body-text color-gray-500">By clicking the button, you are agreeing with our</p>
											<Link href="/page-terms" >Term and Conditions</Link>

											<div className="box-form-newsletter mt-30">
												<form className="form-newsletter"><input className="input-newsletter" placeholder="Enter you mail .." /><button className="btn btn-send" /></form>
											</div>
										</div>
										<div className="col-lg-7 col-md-5 mt-30 mt-lg-0 mt-md-30 mt-sm-30 position-relative text-end">
											<div className="block-chart shape-1"><Image
												width="0"
												height="0"
												sizes="100vw"
												style={{ width: "auto", height: "auto" }} src="/assets/imgs/template/chart.png" alt="Agon" /></div><Image
												width="0"
												height="0"
												sizes="100vw"
												style={{ width: "auto", height: "auto" }} className="img-responsive img-newsletter" src="/assets/imgs/template/img-newsletter.png" alt="Agon" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section> */}

			</Layout>

		</>
	)
}

export default Terms