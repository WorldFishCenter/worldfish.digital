"use client";
import data from "@/util/shopData";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const FeaturedSlider = () => {
    const isLoopMode = data.length > 1; // Check if enough slides for loop mode

    return (
        <>
            <div className="box-swiper">
                <div className="swiper-container swiper-group-4">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        slidesPerView={1}
                        spaceBetween={30}
                        loop={isLoopMode}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            prevEl: ".swiper-button-prev-5",
                            nextEl: ".swiper-button-next-5",
                        }}
                        className="swiper-wrapper pb-70 pt-5"
                    >
                        {data.map((item, i) => (
                            <SwiperSlide key={i}>
                                <div className="row">
                                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
                                        <div className="product-item-2 hover-up">
                                            <Link href={`/shop/${item.id}`}>
                                                <div className="product-image">
                                                    <Image width="0" height="0" sizes="100vw" style={{ width: "auto", height: "auto" }} className="img-fluid" src={`/assets/imgs/page/homepage5/${item.img}`} alt="" />
                                                </div>
                                            </Link>

                                            <div className="box-quick-view">
                                                <div className="quick-view">
                                                    <Link href="#" className="like-product"></Link>
                                                    <Link href="#" className="shuffle-product"></Link>
                                                    <Link href="#" className="view-product"></Link>
                                                </div>
                                            </div>
                                            <div className="product-info">
                                                <span className="text-body-small color-gray-500 font-bold">{item.brand}</span>
                                                <Link href={`/shop/${item.id}`}>
                                                    <h3 className="text-body-lead color-gray-900">{item.title}</h3>
                                                </Link>
                                                <div className="rating mt-10">
                                                    <div className="box-rating">
                                                        {[...Array(4)].map((_, idx) => (
                                                            <Image key={idx} width="0" height="0" sizes="100vw" style={{ width: "auto", height: "auto" }} src="/assets/imgs/page/homepage5/star-active.svg" alt="agon" />
                                                        ))}
                                                        <Image width="0" height="0" sizes="100vw" style={{ width: "auto", height: "auto" }} src="/assets/imgs/page/homepage5/star.svg" alt="agon" />
                                                    </div>
                                                    <span className="text-semibold">
                                                        (<span>{item.rating}</span>&nbsp;rates)
                                                    </span>
                                                </div>
                                                <div className="d-flex mt-20">
                                                    <div className="box-prices">
                                                        <span className="price-regular mr-5">${item.oldPrice}</span>
                                                        <span className="price-regular price-line">${item.newPrice}</span>
                                                    </div>
                                                    <div className="button-add text-end">
                                                        <Link href="#" className="btn btn-cart">
                                                            Add
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className="swiper-button-next swiper-button-next-5" />
                <div className="swiper-button-prev swiper-button-prev-5" />
            </div>
        </>
    );
};

export default FeaturedSlider;
