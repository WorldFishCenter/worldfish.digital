'use client'
import Image from "next/image"
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const TestimonialSlider = () => {

  const data = [
    {
      avatar: "1.png",
      name: "Wade Warren",
      company: "Louis Vuitton",
      quote: "Even factoring differences in body weight between children and adults into account.",
      bg: ""
    },
    {
      avatar: "2.png",
      name: "Brooklyn Simmons",
      company: "Nintendo",
      quote: "So yes, the alcohol (ethanol) in hand sanitizers can be absorbed through the skin, but no, it would not cause intoxication",
      bg: "bd-bg-6"
    },
    {
      avatar: "3.png",
      name: "Jenny Wilson",
      company: "Starbucks",
      quote: "Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L",
      bg: "bd-bg-10"
    },
    {
      avatar: "4.png",
      name: "Albert Flores",
      company: "Bank of America",
      quote: "So yes, the alcohol (ethanol) in hand sanitizers can be absorbed through the skin, but no, it would not cause intoxication",
      bg: "bd-bg-6"
    }
  ]

  // Duplicate the slides to ensure enough for loop mode
  const duplicatedData = [...data, ...data];

  return (
    <div className="box-swiper">
      <div className="swiper-container swiper-group-4">
        <Swiper
          modules={[Autoplay, Navigation]}
          slidesPerView={4}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false
          }}
          navigation={{
            prevEl: ".swiper-button-prev-4",
            nextEl: ".swiper-button-next-4"
          }}
          className="swiper-wrapper pb-70 pt-5"
        >
          {duplicatedData.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="swiper-slide active">
                <div className={`card-grid-style-3 hover-up ${item.bg}`}>
                  <div className="grid-3-img">
                    <Image
                      width="0"
                      height="0"
                      sizes="100vw"
                      style={{ width: "auto", height: "auto" }}
                      src={`/assets/imgs/page/homepage1/user-${item.avatar}`}
                      alt={item.name}
                    />
                  </div>
                  <h3 className="text-heading-6 mb-5 mt-20">{item.name}</h3>
                  <span className="text-body-small d-block">{item.company}</span>
                  <p className="text-body-text text-desc color-gray-500 mt-20">{item.quote}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="swiper-button-next swiper-button-next-4" />
      <div className="swiper-button-prev swiper-button-prev-4" />
    </div>
  )
}

export default TestimonialSlider;
