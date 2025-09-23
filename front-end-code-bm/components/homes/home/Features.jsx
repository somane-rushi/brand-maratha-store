"use client";
import { iconBoxData } from "@/data/features";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

export default function Features() {
  return (
    <section
      className="flat-spacing-7 flat-iconbox pb-0 wow fadeInUp"
      data-wow-delay="0s"
    >
      <div className="container">
        <div className="wrap-carousel wrap-mobile">
          <Swiper
            dir="ltr"
            slidesPerView={4}
            spaceBetween={30}
            breakpoints={{
              1200: {
                slidesPerView: 4,
              },
              800: {
                slidesPerView: 3,
              },
              600: {
                slidesPerView: 2,
              },
              0: {
                slidesPerView: 1,
              },
            }}
            className="swiper tf-sw-mobile"
            data-preview={1}
            data-space={15}
            modules={[Pagination]}
            pagination={{ clickable: true, el: ".spd103" }}
          >
            {iconBoxData.map((elm, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <div className="tf-icon-box style-border-line text-center">
                  <div className="icon mb_20">
                  {/* <i className={`${elm.iconClass} orange-color`} /> */}
                  <Image
                      className="lazyload"
                      data-src={elm.imgSrc}
                      alt="icons"
                      src={elm.imgSrc}
                      width="48"
                      height="48"
                    />
                  </div>
                  <div className="content">
                    <div className="title">{elm.title}</div>
                    {/* <p>{elm.description}</p> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="sw-dots style-2 sw-pagination-mb justify-content-center spd103" />
        </div>
      </div>
    </section>
  );
}
