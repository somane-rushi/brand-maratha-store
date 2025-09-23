"use client";
import Drift from "drift-zoom";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchproducts } from "@/utlis/apiService";
import APP_URL from "@/utlis/config";
import APP_BASE_URL from "@/utlis/apiService";

export default function Slider1ZoomOuter({ varientImages }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const swiperRef = useRef(null);

    useEffect(() => {
        // Function to initialize Drift
        const imageZoom = () => {
            const driftAll = document.querySelectorAll(".tf-image-zoom");
            const pane = document.querySelector(".tf-zoom-main");

            driftAll.forEach((el) => {
                new Drift(el, {
                    zoomFactor: 2,
                    paneContainer: pane,
                    inlinePane: false,
                    handleTouch: false,
                    hoverBoundingBox: true,
                    containInline: true,
                });
            });
        };
        imageZoom();
        const zoomElements = document.querySelectorAll(".tf-image-zoom");

        const handleMouseOver = (event) => {
            const parent = event.target.closest(".section-image-zoom");
            if (parent) {
                parent.classList.add("zoom-active");
            }
        };

        const handleMouseLeave = (event) => {
            const parent = event.target.closest(".section-image-zoom");
            if (parent) {
                parent.classList.remove("zoom-active");
            }
        };

        zoomElements.forEach((element) => {
            element.addEventListener("mouseover", handleMouseOver);
            element.addEventListener("mouseleave", handleMouseLeave);
        });

        // Cleanup event listeners on component unmount
        return () => {
            zoomElements.forEach((element) => {
                element.removeEventListener("mouseover", handleMouseOver);
                element.removeEventListener("mouseleave", handleMouseLeave);
            });
        };
    }, []); // Empty dependency array to run only once on mount

    return (
        <>
            {/* Thumbnail Swiper */}
            <Swiper
                dir="ltr"
                direction="vertical"
                spaceBetween={36}
                slidesPerView={4}
                className="tf-product-media-thumbs other-image-zoom"
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                breakpoints={{
                    0: { direction: "horizontal" },
                    1150: { direction: "vertical" },
                }}
            >
                {Array.isArray(varientImages) &&
                    varientImages.map((slide, index) => {
                        console.log("Slide", slide);
                        return (
                            <SwiperSlide key={index} className="stagger-item">
                                <div className="item">
                                    <Image
                                        className="lazyload"
                                        src={`${APP_URL}/${slide}`}
                                        alt=""
                                        width={770}
                                        height={1075}
                                    />
                                </div>
                            </SwiperSlide>
                        );
                    })}
            </Swiper>

            {/* Main Image Swiper */}
            <div
                className="tf-zoom-main"
                style={{ position: "relative", zIndex: 999 }}
            />

            <Gallery>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    thumbs={{ swiper: thumbsSwiper }}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    className="tf-product-media-main"
                    modules={[Thumbs, Navigation]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    {Array.isArray(varientImages) &&
                        varientImages.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <Item
                                    original={`${APP_URL}/${slide}`}
                                    thumbnail={`${APP_URL}/${slide}`}
                                    width={770}
                                    height={1075}
                                >
                                    {({ ref, open }) => (
                                        <a
                                            className="item section-image-zoom"
                                            onClick={open}
                                        >
                                            <Image
                                                className="tf-image-zoom"
                                                ref={ref}
                                                alt="image"
                                                width={770}
                                                height={1075}
                                                src={`${APP_URL}/${slide}`}
                                                loading="lazy"
                                            />
                                        </a>
                                    )}
                                </Item>
                            </SwiperSlide>
                        ))}

                    <div className="swiper-button-next button-style-arrow thumbs-next"></div>
                    <div className="swiper-button-prev button-style-arrow thumbs-prev"></div>
                </Swiper>
            </Gallery>
        </>
    );
}
