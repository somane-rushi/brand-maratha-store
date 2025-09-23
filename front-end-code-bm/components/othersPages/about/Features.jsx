"use client";

import { abouticonBoxes } from "@/data/features";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

export default function Features() {    
const { language } = useContext(LanguageContext);

    return (
        <section className="bg-icon">
            <div className="container">
                <div className="radius-10 flat-wrap-iconbox">
                    <div className="flat-title lg">
                        <span className="title fw-4">
                            {t("uncompromised_quality", language)}
                        </span>
                        <div>
                            <p className="sub-title text_black-2">
                                {t("uncompromised_quality_content", language)}
                            </p>
                            {/* <p className="sub-title text_black-2">
                They've variety of ways to inspire your next fashion-forward
                look.
              </p> */}
                        </div>
                    </div>
                    <div className="flat-iconbox-v3 lg">
                        <div className="wrap-carousel wrap-mobile">
                            <Swiper
                                dir="ltr"
                                spaceBetween={15}
                                slidesPerView={3}
                                breakpoints={{
                                    768: { slidesPerView: 3, spaceBetween: 15 },
                                    480: { slidesPerView: 2, spaceBetween: 15 },
                                    0: { slidesPerView: 1, spaceBetween: 15 },
                                }}
                                className="swiper tf-sw-mobile"
                                modules={[Pagination]}
                                pagination={{ clickable: true, el: ".spd303" }}
                            >
                                {abouticonBoxes.map((box, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="tf-icon-box text-center">
                                            <div className="icon">
                                                <Image
                                                    className="lazyload"
                                                    data-src={box.imgSrc}
                                                    alt={box.alt}
                                                    src={box.imgSrc}
                                                    width={box.width}
                                                    height={box.height}
                                                />
                                                {/* <i className={box.iconClass} /> */}
                                            </div>
                                            <div className="content">
                                                <div className="title">
                                                    {box.title}
                                                </div>
                                                <p className="text_black-2">
                                                    {box.description}
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                                <div className="sw-dots style-2 sw-pagination-mb justify-content-center spd303" />
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

