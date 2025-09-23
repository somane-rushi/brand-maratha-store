"use client";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";
import React from "react";
import Link from "next/link";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { instaData } from "@/data/instagramData";

export default function InstagramCard() {
  return (
    <section
      className="flat-spacing-5 pt_0 flat-testimonial"
      style={{maxWidth: "100vw", overflow: "hidden" }}
    >
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title">Happy Clients</span>
          <p className="sub-title">Hear what they say about us</p>
        </div>
        <div className="wrap-carousel">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-testimonial"
            spaceBetween={30} // Equivalent to data-space-lg
            slidesPerView={3} // Equivalent to data-preview
            loop={true}
            autoplay={{
              delay: 7000,
              // disableOnInteraction: false, 
            }}
            breakpoints={{
              0: {
                slidesPerView: 1, // Equivalent to data-mobile
                spaceBetween: 15, // Equivalent to data-space-md
              },
              640: {
                slidesPerView: 3, // Equivalent to data-mobile
                spaceBetween: 15, // Equivalent to data-space-md
              },
              1024: {
                slidesPerView: 5, // Equivalent to data-tablet
                spaceBetween: 30, // Equivalent to data-space-md
              },
            }}
            modules={[Pagination, Autoplay]}
            // navigation={{
            //   prevEl: ".snbp3",
            //   nextEl: ".snbn3",
            // }}
            pagination={{ clickable: true, el: ".spb39" }}
          >
          {instaData.map((brand, index) => (
            <SwiperSlide key={index}>
              <div className="instagram-item">
                <Link href={`/`}>
                  <Image
                    className="lazyload"
                    src="/images/brand-maratha/home/top-frame.jpg"
                    alt="img-slider"
                    width={352}
                    height={44}
                  />
                  <Image
                    className="lazyload w-100 main-img"
                    data-src={brand.src}
                    alt="image-slider"
                    src={brand.src}
                    width={brand.width}
                    height={brand.height}
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
          ))}
          </Swiper>
          {/* <div className="nav-sw nav-next-slider nav-next-testimonial lg snbp3">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-testimonial lg snbn3">
            <span className="icon icon-arrow-right" />
          </div> */}
          <div className="sw-dots style-2 sw-pagination-testimonial justify-content-center spb39" />
        </div>
      </div>
    </section>
  );
}
