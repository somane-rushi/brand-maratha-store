// "use client";
// import Image from "next/image";
// import { aboutTestimonial } from "@/data/testimonials";
// import React, { useContext, useEffect, useState } from "react";
// import Link from "next/link";
// import { Navigation, Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { handleAboutUsPageTestimonialsService } from "@/utlis/apiService";
// import { LanguageContext } from "@/context/LanguageContext";

// export default function Testimonials() {
//     const { language } = useContext(LanguageContext);
//     const [data, setData] = useState([]);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         fetchData(language);
//     }, [language]);

//     async function fetchData(lang) {
//         try {
//             const { data } = await handleAboutUsPageTestimonialsService(lang);
//             setData(data);
//         } catch (err) {
//             const { message, error } = err?.response?.data || "";
//             setData([]);
//             setError(
//                 message || error || err.message || "something went wrong!"
//             );
//         }
//     }

//     if (data.length === 0) return;
//     return (
//         <>
//             {Array.isArray(data) && data.length > 0 && (
//                 <section
//                     className="flat-spacing-5 flat-testimonial bs-happy-clients"
//                     style={{ maxWidth: "100vw", overflow: "hidden" }}
//                 >
//                     <div className="container">
//                         <div
//                             className="flat-title wow fadeInUp"
//                             data-wow-delay="0s"
//                         >
//                             <span className="title">{"happy_clients"}</span>
//                             <p className="sub-title">
//                                 {"happy_clients_content"}
//                             </p>
//                         </div>
//                         <div className="wrap-carousel">
//                             <Swiper
//                                 dir="ltr"
//                                 className="swiper tf-sw-testimonial happy-clients"
//                                 spaceBetween={30} // Equivalent to data-space-lg
//                                 slidesPerView={3} // Equivalent to data-preview
//                                 breakpoints={{
//                                     0: {
//                                         slidesPerView: 1, // Equivalent to data-mobile
//                                         spaceBetween: 15, // Equivalent to data-space-md
//                                     },
//                                     640: {
//                                         slidesPerView: 2, // Equivalent to data-mobile
//                                         spaceBetween: 15, // Equivalent to data-space-md
//                                     },
//                                     1024: {
//                                         slidesPerView: 3, // Equivalent to data-tablet
//                                         spaceBetween: 30, // Equivalent to data-space-md
//                                     },
//                                 }}
//                                 modules={[Navigation, Pagination]}
//                                 navigation={{
//                                     prevEl: ".snbp3010",
//                                     nextEl: ".snbn3010",
//                                 }}
//                                 pagination={{ clickable: true, el: ".spb3010" }}
//                             >
//                                 {data.map((testimonial, index) => {
//                                     console.log("testimonial", testimonial);

//                                     return (
//                                         <SwiperSlide
//                                             className="swiper-slide"
//                                             key={index}
//                                         >
//                                             <div
//                                                 className="testimonial-item style-column wow fadeInUp"
//                                                 data-wow-delay={
//                                                     testimonial.delay
//                                                 }
//                                             >
//                                                 <div className="card-body">
//                                                     {/* <div className="rating">
//                                                         <i className="icon-start" />
//                                                         <i className="icon-start" />
//                                                         <i className="icon-start" />
//                                                         <i className="icon-start" />
//                                                         <i className="icon-start" />
//                                                     </div> */}
//                                                     <div className="rating">
//                                                         {[...Array(5)].map(
//                                                             (_, index) => (
//                                                                 <i
//                                                                     key={index}
//                                                                     className={`icon-start ${
//                                                                         index <
//                                                                         testimonial.rating
//                                                                             ? "filled"
//                                                                             : ""
//                                                                     }`}
//                                                                 />
//                                                             )
//                                                         )}
//                                                     </div>
//                                                     <div className="heading">
//                                                         {testimonial.heading}
//                                                     </div>
//                                                     <div className="text">
//                                                         {testimonial.text}
//                                                     </div>
//                                                 </div>
//                                                 <div className="author">
//                                                     <div className="name">
//                                                         {testimonial.name}
//                                                     </div>
//                                                     <div className="metas">
//                                                         {testimonial.metas}
//                                                     </div>
//                                                 </div>

//                                                 <div className="product">
//                                                     <div className="image">
//                                                         <a href={`#`}>
//                                                             <Image
//                                                                 className="lazyload"
//                                                                 data-src={
//                                                                     testimonial.imageSrc
//                                                                 }
//                                                                 src={
//                                                                     testimonial.imageSrc
//                                                                 }
//                                                                 width={70}
//                                                                 height={98}
//                                                                 alt="image"
//                                                             />
//                                                         </a>
//                                                     </div>
//                                                     <div className="content-wrap">
//                                                         <div className="product-title">
//                                                             <a href={`#`}>
//                                                                 {
//                                                                     testimonial.productTitle
//                                                                 }
//                                                             </a>
//                                                         </div>
//                                                         <div className="price">
//                                                             {testimonial.price}
//                                                         </div>
//                                                     </div>
//                                                     <a href={`#`} className="">
//                                                         <i className="icon-arrow1-top-left" />
//                                                     </a>
//                                                 </div>
//                                             </div>
//                                         </SwiperSlide>
//                                     );
//                                 })}
//                             </Swiper>
//                             <div className="nav-sw nav-next-slider nav-next-testimonial lg snbp3010">
//                                 <span className="icon icon-arrow-left" />
//                             </div>
//                             <div className="nav-sw nav-prev-slider nav-prev-testimonial lg snbn3010">
//                                 <span className="icon icon-arrow-right" />
//                             </div>
//                             <div className="sw-dots style-2 sw-pagination-testimonial justify-content-center spb3" />
//                         </div>
//                     </div>
//                 </section>
//             )}
//         </>
//     );
// }

"use client";
import Image from "next/image";
import { aboutTestimonial } from "@/data/testimonials";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { handleAboutUsPageTestimonialsService } from "@/utlis/apiService";
import { LanguageContext } from "@/context/LanguageContext";
import APP_URL from "@/utlis/config";

export default function Testimonials() {
    const { language } = useContext(LanguageContext);
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData(language);
    }, [language]);

    async function fetchData(lang) {
        try {
            const { data } = await handleAboutUsPageTestimonialsService(lang);
            setData(data);
        } catch (err) {
            const { message, error } = err?.response?.data || "";
            setData([]);
            setError(
                message || error || err.message || "something went wrong!"
            );
        }
    }

    if (data.length === 0) return;
    return (
        <>
            {Array.isArray(data) && data.length > 0 && (
                <section
                    className="flat-spacing-5 flat-testimonial bs-happy-clients"
                    style={{ maxWidth: "100vw", overflow: "hidden" }}
                >
                    <div className="container">
                        <div
                            className="flat-title wow fadeInUp"
                            data-wow-delay="0s"
                        >
                            <span className="title">{"happy_clients"}</span>
                            <p className="sub-title">
                                {"happy_clients_content"}
                            </p>
                        </div>
                        <div className="wrap-carousel">
                            <Swiper
                                dir="ltr"
                                className="swiper tf-sw-testimonial happy-clients"
                                spaceBetween={30}
                                slidesPerView={3}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                        spaceBetween: 15,
                                    },
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 15,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 30,
                                    },
                                }}
                                modules={[Navigation, Pagination]}
                                navigation={{
                                    prevEl: ".snbp3010",
                                    nextEl: ".snbn3010",
                                }}
                                pagination={{ clickable: true, el: ".spb3010" }}
                            >
                                {data.map((testimonial, index) => {
                                    return (
                                        <SwiperSlide
                                            className="swiper-slide"
                                            key={index}
                                        >
                                            <div
                                                className="testimonial-item style-column wow fadeInUp"
                                                data-wow-delay={
                                                    testimonial.delay
                                                }
                                            >
                                                <div className="card-body">
                                                    <div className="rating">
                                                        {[
                                                            ...Array(
                                                                testimonial?.rating
                                                            ),
                                                        ].map((_, index) => (
                                                            <i
                                                                key={index}
                                                                className={`icon-start ${
                                                                    index <
                                                                    testimonial.rating
                                                                        ? "filled"
                                                                        : ""
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="heading">
                                                        {testimonial?.title}
                                                    </div>
                                                    <div className="text">
                                                        {
                                                            testimonial?.description
                                                        }
                                                    </div>
                                                </div>
                                                <div className="author">
                                                    <div className="name">
                                                        {testimonial?.user}
                                                    </div>
                                                    {testimonial?.location && (
                                                        <div className="metas">
                                                            Customer from{" "}
                                                            {
                                                                testimonial?.location
                                                            }
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="product">
                                                    <div className="image">
                                                        <a href={`#`}>
                                                            <Link
                                                                href={`/product-detail/${testimonial?.product_id}`}
                                                            >
                                                                <Image
                                                                    className="lazyload"
                                                                    data-src={
                                                                        testimonial.image
                                                                    }
                                                                    src={`${APP_URL}/${testimonial.image}`}
                                                                    width={70}
                                                                    height={98}
                                                                    alt="image"
                                                                />
                                                            </Link>
                                                        </a>
                                                    </div>
                                                    <div className="content-wrap">
                                                        <div className="product-title">
                                                            <Link
                                                                href={`/product-detail/${testimonial?.product_id}`}
                                                            >
                                                                {
                                                                    testimonial?.product_name
                                                                }
                                                            </Link>
                                                        </div>
                                                        <div className="price">
                                                            Rs.{" "}
                                                            {testimonial?.price}
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/product-detail/${testimonial?.product_id}`}
                                                    >
                                                        <i className="icon-arrow1-top-left" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            <div className="nav-sw nav-next-slider nav-next-testimonial lg snbp3010">
                                <span className="icon icon-arrow-left" />
                            </div>
                            <div className="nav-sw nav-prev-slider nav-prev-testimonial lg snbn3010">
                                <span className="icon icon-arrow-right" />
                            </div>
                            <div className="sw-dots style-2 sw-pagination-testimonial justify-content-center spb3" />
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
