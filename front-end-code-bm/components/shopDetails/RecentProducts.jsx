"use client";

import { products1 } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context";
import  RecentlyViewed  from "../shopCards/RecentlyViewed";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
export default function RecentProducts() {

  const [recentProducts, setRecentProducts] = useState([]);
    const { addToWishlist, isAddedtoWishlist } = useContextElement();
  
    // Fetch recently viewed products from localStorage on component mount
    useEffect(() => {
      const storedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      setRecentProducts(storedProducts);
    }, []);
  return (
    <section className="flat-spacing-4 ">
      <div className="container">
        <div className="flat-title typ-flex-item justify-content-center">
          <span className="title">Recently Viewed</span>
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
              prevEl: ".snbp308",
              nextEl: ".snbn308",
            }}
            pagination={{ clickable: true, el: ".spd308" }}
          >
            {recentProducts.slice(0, 8).map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <RecentlyViewed product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-recent box-icon w_46 round snbp308">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-recent box-icon w_46 round snbn308">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-recent justify-content-center spd308" />
        </div>
      </div>
    </section>
  );
}
