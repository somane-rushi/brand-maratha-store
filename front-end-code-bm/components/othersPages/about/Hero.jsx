"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    _url_without_upload_path,
    handleAboutUsPageBannerService,
} from "@/utlis/apiService";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

export default function Hero() {
    const { language } = useContext(LanguageContext);
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData(language);
    }, [language]);

    async function fetchData(lang) {
        try {
            const result = await handleAboutUsPageBannerService(lang);
            setData(result?.data);
        } catch (err) {
            const { message, error } = err?.response?.data || "";
            setData([]);
            setError(
                message || error || err.message || "something went wrong!"
            );
        }
    }

    if (data === undefined) return;

    return (
        <>
            {Array.isArray(data) && data.length > 0 && (
                <div className="tf-slideshow slider-effect-fade position-relative main-banner-section">
                    <Swiper
                        dir="ltr"
                        className="swiper tf-sw-slideshow main-swiper"
                        loop={true}
                        autoplay={{
                            delay: 700000,
                            // disableOnInteraction: false,
                        }}
                        modules={[Pagination, Autoplay]}
                        pagination={{ clickable: true, el: ".sp1" }}
                        speed={1000}
                    >
                        {data?.map((slide, index) => (
                            <SwiperSlide className="swiper-slide" key={index}>
                                <div className="wrap-slider">
                                    <Image
                                        priority
                                        alt="fashion-slideshow"
                                        src={`${_url_without_upload_path}/${slide.image}`}
                                        width="1380"
                                        height="598"
                                    />
                                    <div className="box-content h-100">
                                        <div className="container h-100">
                                            <h1 className="fade-item fade-item-1 text-white title pt-5">
                                                {slide?.title
                                                    .split("\n")
                                                    .map((line, i) => (
                                                        <React.Fragment key={i}>
                                                            {line}
                                                            <br />
                                                        </React.Fragment>
                                                    ))}
                                            </h1>
                                            <p className="fade-item fade-item-2 text-white para max-536">
                                                {slide?.subtitle}
                                            </p>
                                            {slide?.link && (
                                                <Link
                                                    href={slide?.link}
                                                    className="fade-item fade-item-3 tf-btn btn-light-icon animate-hover-btn btn-xl radius-3"
                                                >
                                                    <span>Shop Collection</span>
                                                    <i className="icon icon-arrow-right" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="wrap-pagination">
                        <div className="container">
                            <div className="sw-dots sp1 sw-pagination-slider justify-content-center" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
