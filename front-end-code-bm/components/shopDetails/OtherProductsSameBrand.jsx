"use client";
import { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context";
import { products1 } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCardo } from "../shopCards/ProductCardo";
import { addToRecentlyViewed } from "@/utlis/recentlyViewedUtils";
import { fetchproductsbybrands, fetchallproducts } from "@/utlis/apiService";
import APP_URL from "@/utlis/config";

import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";

export default function OtherProductsSameBrand() {

  const [products, setProducts] = useState([]); 
    const [varr, setVarr] = useState(null); // Change initial state to null (not an array)
    const { addToWishlist, isAddedtoWishlist } = useContextElement();
  
    useEffect(() => {
      const fetchProducts = async () => {
        const data = await fetchallproducts();
        if (data.length > 0) {
          setVarr(data[0]); // Pick the first product (assuming data is an array)
        }
      };
      fetchProducts();
    }, []);
  
    useEffect(() => {
      if (varr && varr.brand_id) {  
        const fetchFilteredProducts = async () => {
          console.log("Fetching products for brand_id:", varr.brand_id); 
          const data = await fetchproductsbybrands(varr.brand_id);
          setProducts(data); 
          console.log("PP",data)
        };
        fetchFilteredProducts();
      }
    }, [varr]);
  return (
    <section className="texture-grey-background">
      <div className="container">
        <div className="flat-title typ-flex-item">
          <span className="title">Other Products Of Same Brand</span>
          {/* <Link href={`/contact-2`} className="tf-btn btn-line line-height-normal"> */}
          {/* <Link href="#" className="tf-btn btn-line line-height-normal">
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
              prevEl: ".snbp3500",
              nextEl: ".snbn3500",
            }}
            pagination={{ clickable: true, el: ".spd3500" }}
          >
            {products.slice(2, 12).map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <ProductCardo product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-recent box-icon w_46 round snbp3500">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-recent box-icon w_46 round snbn3500">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-recent justify-content-center spd3500" />
        </div>
      </div>
    </section>
  );
}
