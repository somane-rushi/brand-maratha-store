"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";
import APP_URL from "@/utlis/config";

export default function InstagramDetails({ product }) {
    const { language } = useContext(LanguageContext);
    return (
        <section className="flat-spacing-33">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-title-section">
                            <div className="d-block text-center">
                                <h2 className="typ-gredient">
                                    {t("instagram", language)}
                                </h2>
                            </div>
                            <p>{t("inspire_and_be_inspired", language)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <Swiper
                            className="swiper instagramItem"
                            loop={true} 
                            autoplay={{
                                delay: 70000,
                                disableOnInteraction: false,
                            }}
                            spaceBetween={75} // Equivalent to data-space-lg
                            slidesPerView={5} // Equivalent to data-preview
                            breakpoints={{
                                1024: {
                                    slidesPerView: 5, // Equivalent to data-tablet
                                    spaceBetween: 24, // Equivalent to data-space-md
                                },
                                640: {
                                    slidesPerView: 3, // Equivalent to data-tablet
                                    spaceBetween: 12, // Equivalent to data-space-md
                                },
                                0: {
                                    slidesPerView: 2, // Equivalent to data-mobile
                                    spaceBetween: 12, // Equivalent to data-space-md
                                },
                            }}
                            modules={[Pagination, Autoplay]}
                            pagination={{ clickable: true, el: ".sp1060" }}
                        >
                            {product?.map((brand, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div className="instagram-item">
                                            <Link
                                                href={`/product-detail/${brand.id}`}
                                            >
                                                <Image
                                                    className="lazyload"
                                                    src="/images/brand-maratha/home/top-frame.jpg"
                                                    alt="img-slider"
                                                    width={352}
                                                    height={44}
                                                />
                                                <Image
                                                    className="lazyload w-100"
                                                    data-src={brand.src}
                                                    alt="img-slider"
                                                    src={`${APP_URL}/${brand.thumbnail_image}`}
                                                    width={352}
                                                    height={100}
                                                />
                                                <Image
                                                    className="lazyload"
                                                    src="/images/brand-maratha/home/bottom-frame.jpg"
                                                    alt="img-slider"
                                                    width={352}
                                                    height={44}
                                                />
                                            </Link>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                        <div className="d-md-none sw-dots style-2 sw-pagination-brand justify-content-center sp1060" />
                    </div>
                </div>
            </div>
        </section>
    );
}
