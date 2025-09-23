"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "swiper/modules";
import { fetchCategoriesHomepage } from "@/utlis/apiService"; // ✅ Import API function
import APP_URL from "@/utlis/config";
// API URL

export default function Categories() {
    const [categories, setCategories] = useState([]); // Store fetched categories

    // ✅ Fetch categories from API on component mount
    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategoriesHomepage(); // ✅ Fetch data
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        getCategories();
    }, []); // Runs only on component mount

    return (
        <section className="flat-spacing-12 bg_grey-img">
            <div className="container">
                <div
                    className="flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp"
                    data-wow-delay="0s"
                >
                    <h3 className="title">{"season_collection"}</h3>
                    <Link
                        href="#"
                        className="tf-btn btn-line line-height-normal"
                    >
                        {"view_all_categories"}
                        <i className="icon icon-arrow1-top-left" />
                    </Link>
                </div>
                <div className="hover-sw-nav hover-sw-2">
                    <Swiper
                        dir="ltr"
                        className="tf-sw-collection"
                        slidesPerView={5}
                        breakpoints={{
                            1366: { slidesPerView: 5, spaceBetween: 55 },
                            768: { slidesPerView: 5, spaceBetween: 25 },
                            576: { slidesPerView: 3, spaceBetween: 15 },
                            0: { slidesPerView: 2, spaceBetween: 15 },
                        }}
                        loop={false}
                        autoplay={false}
                        modules={[Navigation]}
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
                                            src={`${APP_URL}/${item.image}`} // Ensure correct image path
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

