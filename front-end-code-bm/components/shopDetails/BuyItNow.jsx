"use client";

import { buyItNow } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { BuyProductCard } from "../shopCards/BuyProductCard";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
export default function BuyItNow() {
  return (
    <section className="flat-spacing-4 ">
      <div className="container">
        <div className="flat-title typ-flex-item">
          <span className="title">Buy It With</span>
          {/* <Link href={`/contact-2`} className="tf-btn btn-line line-height-normal">
          View all
                    <i className="icon icon-arrow1-top-left" />
                  </Link> */}
        </div>
        <div className="hover-sw-nav hover-sw-2">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-product-sell wrap-sw-over"
            slidesPerView={4} // Equivalent to data-preview={4}
            spaceBetween={30} // Equivalent to data-space-lg={30}
            breakpoints={{
              1024: {
                slidesPerView: 4, // Equivalent to data-tablet={3}
              },
              640: {
                slidesPerView: 3, // Equivalent to data-tablet={3}
              },
              0: {
                slidesPerView: 2, // Equivalent to data-mobile={2}
                spaceBetween: 15, // Equivalent to data-space-md={15}
              },
            }}
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp3080",
              nextEl: ".snbn3080",
            }}
            pagination={{ clickable: true, el: ".spd3080" }}
          >
            {buyItNow.map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <BuyProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-recent box-icon w_46 round snbp3080">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-recent box-icon w_46 round snbn3080">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-recent justify-content-center spd3080" />
        </div>
      </div>
    </section>
  );
}
