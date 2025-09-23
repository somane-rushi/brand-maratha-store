"use client";

import Productcart3 from "@/components/shopCards/Productcart3";
import { priviousEdition } from "@/data/products";
import React from "react";
import { Navigation,Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { handleProductListService } from "@/utlis/apiService";
import Link from "next/link";
import Image from "next/image";

export default function Products() {
  
  return (
    <section className="our-previous-editions">
      <div className="container">
        <div className="bs-heading">
          <h2 className="hd mrgB40">
          Our Previous Editions
          </h2>
        </div>
        <div className="hover-sw-nav hover-sw-2">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-product-sell wrap-sw-over "
            slidesPerView={3} // Equivalent to data-preview={4}
            spaceBetween={40} // Equivalent to data-space-lg={30}
            breakpoints={{
              1024: {
                slidesPerView: 3, // Equivalent to data-tablet={3}
                spaceBetween:40,
              },
              640: {
                slidesPerView: 2, // Equivalent to data-tablet={3}
                spaceBetween:20,
              },
              0: {
                slidesPerView: 1, // Equivalent to data-mobile={2}
                spaceBetween: 20, // Equivalent to data-space-md={15}
                
              },
            }}
            modules={[Navigation,Pagination]}
            navigation={{
              prevEl: ".snbp1160",
              nextEl: ".snbn1160",
            }}
            pagination={{ clickable: true, el: ".spb390" }}
          >
            {priviousEdition.map((product, index) => (
              <SwiperSlide key={index}>
                <a href={product.pdfUrl} className="blog-article-item w-100" download={product.pdfUrl.split('/').pop()}>
                        <div className="article-thumb radius-10">
                            <div className="hoverImg">
                            <Image
                                src={product.imgSrc}
                                alt="product-image"
                                width={414}
                                height={517}
                                className="lazyload w-100"
                            />
                            </div>
                        </div>
                        <div className="article-content">
                            <div className="article-title">
                            {product.title}
                            </div>
                            <div className="article-btn">
                            <span className="tf-btn orange-color btn-line fw-6">
                                Download PDF
                            </span>
                            </div>
                        </div>
                        </a>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-product box-icon w_46 round snbp1160">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-product box-icon w_46 round snbn1160">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-testimonial justify-content-center spb390" />
        </div>
      </div>
    </section>
  );
}
