"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import APP_URL from "@/utlis/config";
import { fetchHeroBannerMarathi, fetchHeroBanners } from "@/utlis/apiService";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

export default function Hero() {
    const { language } = useContext(LanguageContext);
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const getBanners = async () => {
            try {
                let data;

                if (language === "mr") {
                    data = await fetchHeroBannerMarathi();
                } else {
                    data = await fetchHeroBanners();
                }

                setBanners(data);
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        getBanners();
    }, [language]);

    return (
        <div className="tf-slideshow slider-effect-fade position-relative main-banner-section">
            <Swiper
                dir="ltr"
                className="swiper tf-sw-slideshow main-swiper"
                loop={true}
                autoplay={{
                    delay: 7000,
                    // disableOnInteraction: false,
                }}
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true, el: ".sp1" }}
                speed={1000}
            >
                {banners.length > 0 ? (
                    banners.map((slide, index) => (
                        <SwiperSlide className="swiper-slide" key={index}>
                            <div className="wrap-slider">
                                <Image
                                    priority
                                    alt="banner-slideshow"
                                    src={`${APP_URL}/${slide.banner_image}`}
                                    width="1380"
                                    height="598"
                                />
                                <div className="box-content h-100">
                                    <div className="container h-100">
                                        <h1 className="fade-item fade-item-1 text-white title pt-5">
                                            {slide.title
                                                .split("\n")
                                                .map((line, i) => (
                                                    <React.Fragment key={i}>
                                                        {line}
                                                        <br />
                                                    </React.Fragment>
                                                ))}
                                        </h1>
                                        <p className="fade-item fade-item-2 text-white para max-536">
                                            {slide.subtitle} 
                                        </p>
                                        {slide?.link && (
                                            <Link
                                                href={slide?.link || "#"}
                                                className="fade-item fade-item-3 tf-btn btn-light-icon animate-hover-btn btn-xl radius-3"
                                            >
                                                <span>Shop Now</span>
                                                <i className="icon icon-arrow-right" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <p className="text-white text-center">Loading banners...</p>
                )}
            </Swiper>
            <div className="wrap-pagination">
                <div className="container">
                    <div className="sw-dots sp1 sw-pagination-slider justify-content-center" />
                </div>
            </div>
        </div>
    );
}
