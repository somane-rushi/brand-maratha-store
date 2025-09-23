"use client";

import { slidesBlog } from "@/data/heroslides";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";

export default function Hero({ blogs }) {
  return (
    <div className="tf-slideshow slider-effect-fade position-relative main-banner-section ">
      <Swiper
        dir="ltr"
        className="swiper tf-sw-slideshow blog-swiper"
        modules={[Pagination]}
        pagination={{ clickable: true, el: ".spdblog" }}
        speed={1000}
      >
        {blogs?.map((slide, index) => (
          <SwiperSlide className="swiper-slide" key={index}>
            <div className="wrap-slider">
              <Image
                priority
                alt="fashion-slideshow"
                src={slide.banner_image}
                width="1440"
                height="650"
              />
              <div className="box-content">
                <div className="container">
                  <h2 className="heading fade-item fade-item-1 text-white title typ-40 max-750">
                    {slide.title}
                  </h2>
                  {/* <p className="fade-item fade-item-2 text-white para max-536">{slide.text}</p> */}
                  <div className="fade-item fade-item-3">
                    <Link href={`/blog-detail/${slide.id}`} className="tf-btn btn-line line-height-normal btn-line-light collection-other-link fw-5">
                      <span>Read More</span>
                      <i className="icon icon-arrow1-top-left" />
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="wrap-pagination">
        <div className="container">
          <div className="sw-dots spdblog sw-pagination-slider dots-fill-orange large " />
        </div>
      </div>
    </div>
  );
}
