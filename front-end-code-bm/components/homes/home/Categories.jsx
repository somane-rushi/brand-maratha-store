"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Autoplay } from "swiper/modules";
import { fetchCategoriesHomepage } from "@/utlis/apiService"; // ✅ Import API function
import APP_URL from "@/utlis/config";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";
// API URL

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategoriesHomepage();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        getCategories();
    }, []);

    return (
        <section className="flat-spacing-12 bg_grey-img">
            <div className="container">
                <div
                    className="flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp"
                    data-wow-delay="0s"
                >
                    <h3 className="title">
                        {t("season_collection", language)}
                    </h3>
                </div>
                <div className="hover-sw-nav hover-sw-2">
                    <Swiper
                        dir="ltr"
                        className="tf-sw-collection"

                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false
                        }}
                        breakpoints={{
                            1366: { slidesPerView: 6, spaceBetween: 35 },
                            992: { slidesPerView: 5, spaceBetween: 15 },
                            768: { slidesPerView: 5, spaceBetween: 25 },
                            576: { slidesPerView: 3, spaceBetween: 15 },
                            0: { slidesPerView: 3, spaceBetween: 15 },
                        }}
                        modules={[Navigation, Autoplay]}
                        navigation={{ prevEl: ".snbp130", nextEl: ".snbn130" }}
                    >
                        {categories.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="collection-item-circle hover-img">
                                    <Link
                                        href="#"
                                        className="collection-image img-style"
                                    >
                                        <Image
                                            className="lazyload"
                                            alt="image"
                                            src={`${APP_URL}/${item.image}`} 
                                            width={150}
                                            height={150}
                                        />
                                    </Link>
                                    <div className="collection-content text-center">
                                        <Link
                                            href={`/shop-collection-sub`}
                                            className="link title fw-5"
                                        >
                                            {item.title}
                                        </Link>
                                        <div className="count">
                                            {item.subtitle}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="sw-dots style-2 sw-pagination-collection justify-content-center" />
                    <div className="nav-sw nav-next-slider nav-next-collection snbp130">
                        <span className="icon icon-arrow-left" />
                    </div>
                    <div className="nav-sw nav-prev-slider nav-prev-collection snbn130">
                        <span className="icon icon-arrow-right" />
                    </div>
                </div>
            </div>
        </section>
    );
}



