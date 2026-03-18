'use client'
import Image from "next/image"
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"


const OfferSlider = () => {

	const data = [
		{
			img: "market.svg",
			title: "Market research",
			text: "One make creepeth, man bearing theira firmament."
		},
		{
			img: "consulting.svg",
			title: "Strategic Consulting",
			text: "One make creepeth, man bearing theira firmament."
		},
		{
			img: "cognity.svg",
			title: "Cognitive Solution",
			text: "One make creepeth, man bearing theira firmament."
		}
	]

	const duplicatedData = [...data, ...data]; 

	return (
		<>
			<div className="box-swiper">
				<div className="swiper-container swiper-group-4">
					<Swiper
						modules={[Autoplay, Navigation]}
						slidesPerView={3}
						spaceBetween={30}
						loop={true}
						autoplay={{
							delay: 2500,
							disableOnInteraction: false
						}}
						navigation={{
							prevEl: ".swiper-button-prev-5",
							nextEl: ".swiper-button-next-5"
						}}
						className="swiper-wrapper pb-70 pt-5"
					>
						{duplicatedData.map((item, i) => (
							<SwiperSlide key={i}>
								<div className="swiper-slide">
									<div className="card-grid-style-2 hover-up">
										<div className="grid-2-img">
											<Image
												width="0"
												height="0"
												sizes="100vw"
												style={{ width: "auto", height: "auto" }} src={`/assets/imgs/page/homepage1/${item.img}`} alt="Agon" />
										</div>
										<h3 className="text-heading-5 mt-20">{item.title}</h3>
										<p className="text-body-text color-gray-600 mt-20">{item.text}</p>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</>
	)
}

export default OfferSlider;

