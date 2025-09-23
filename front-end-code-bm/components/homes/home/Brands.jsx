"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { fetchBrands } from "@/utlis/apiService";
import APP_URL from "@/utlis/config";

export default function Brands() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const getBrands = async () => {
            try {
                const data = await fetchBrands();
                setBrands(data);
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };

        getBrands();
    }, []);

    if (!brands) return;
    return (
        <section className="flat-spacing-5 pt_0">
            <div className="container">
                <Swiper
                    dir="ltr"
                    className="swiper tf-sw-brand"
                    loop={true}
                    autoplay={{
                        delay: 7000,
                        // disableOnInteraction: false,
                    }}
                    spaceBetween={0}
                    slidesPerView={6}
                    breakpoints={{
                        1024: { slidesPerView: 6, spaceBetween: 0 },
                        640: { slidesPerView: 3, spaceBetween: 0 },
                        0: { slidesPerView: 2, spaceBetween: 0 },
                    }}
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true, el: ".sp106" }}
                >
                    {brands.map((brand, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <Link
                                    href={`/brand-details/${brand.id}`}
                                    className="brand-item"
                                    style={{ cursor: "pointer" }}
                                >
                                    <Image
                                        className="lazyload"
                                        alt="image"
                                        src={`${APP_URL}/${brand.image}`}
                                        width={150}
                                        height={150}
                                    />
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                <div className="d-md-none sw-dots style-2 sw-pagination-brand justify-content-center sp106" />
            </div>
        </section>
    );
}
