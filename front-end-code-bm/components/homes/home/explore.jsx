// "use client";
// import { useEffect, useState } from "react";
// import {
//     fetchHomepageBannerSecond,
//     fetchHomepageBannerSecondMarathi,
// } from "@/utlis/apiService";
// import APP_URL from "@/utlis/config";
// import { useContext } from "react";
// import { LanguageContext } from "@/context/LanguageContext";
// import { t } from "@/components/translate";

// const Explore = () => {
//     const [banner, setBanner] = useState({ image: null, title: "" });
//     const { language } = useContext(LanguageContext);

//     useEffect(() => {
//         const fetchBanner = async () => {
//             let data;

//             if (language === "mr") {
//                 data = await fetchHomepageBannerSecondMarathi();
//             } else {
//                 data = await fetchHomepageBannerSecond();
//             }

//             if (data) {
//                 setBanner({
//                     image: data.image ? `${APP_URL}/${data.image}` : null,
//                     title: data.title || "",
//                 });
//             }
//         };

//         fetchBanner();
//     }, [language]);

//     return (
//         <section className="bs-explore">
//             <div className="container bg-explore-img">
//                 <div className="image">
//                     <picture>
//                         <source
//                             media="(max-width: 767px)"
//                             srcSet={
//                                 banner.image
//                                     ? banner.image
//                                     : "/images/brand-maratha/banner/mobile-banner.jpg"
//                             }
//                         />
//                         <img
//                             className="img-fluid"
//                             src={
//                                 banner.image
//                                     ? banner.image
//                                     : "/images/brand-maratha/home/explore-banner.jpg"
//                             }
//                             alt="explore_image_alt"
//                         />
//                     </picture>
//                 </div>
//                 <div className="row">
//                     <div className="col-12 col-md-6">
//                         <div className="position-relative-custom">
//                             <div className="content-wrapper">
//                                 <h2 className="title">
//                                     {banner.title
//                                         ? banner.title
//                                         : t(
//                                               "explore_all_new_maratha_attire",
//                                               language
//                                           )}
//                                 </h2>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Explore;

"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import APP_URL from "@/utlis/config";
import {
    _url,
    fetchHomepageBannerSecond,
    fetchHomepageBannerSecondMarathi,
} from "@/utlis/apiService";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
// import Brands from "@/components/homes/home/Brands";

const Explore = () => {
    const [banner, setBanner] = useState({ image: null, title: "" });
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        const fetchBanner = async () => {
            let data;

            if (language === "mr") {
                data = await fetchHomepageBannerSecondMarathi();
            } else {
                data = await fetchHomepageBannerSecond();
            }

            setBanner(data);
        };

        fetchBanner();
    }, [language]);

    return (
        
        <div className="tf-slideshow slider-effect-fade position-relative main-banner-section banner-second banner swiper-explore1 ">

<div className="container">

            <Swiper
                dir="ltr"
                className="swiper tf-sw-slideshow main-swiper swiper-explore"
                loop={true}
                autoplay={{
                    delay: 7000,
                    // disableOnInteraction: false,
                }}
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true, el: ".sp1" }}
                speed={1000}
            >
                {Array.isArray(banner) &&
                    banner.map((dt, ind) => {
                        const imageSrc = `${_url}/${dt.image}`;
                        const isExternalLink = !!dt?.link;

                        const SlideContent = (
                            <section className="bs-explore">
                                <div className=" bg-explore-img">
                                    <div className="image ">
                                        <picture>
                                            <source
                                                media="(max-width: 767px)"
                                                srcSet={imageSrc}
                                            />
                                            <img
                                                className="img-fluid"
                                                src={imageSrc}
                                                alt="explore_image_alt"
                                            />
                                        </picture>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <div className="position-relative-custom">
                                                <div className="content-wrapper">
                                                    <h2 className="title">
                                                        {dt?.title}
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );

                        return (
                            <SwiperSlide key={ind} className="swiper-slide">
                                <div className="wrap-slider">
                                    {isExternalLink ? (
                                        <a
                                            href={dt.link}
                                            target="_self"
                                            rel="noopener noreferrer"
                                            className="d-block"
                                        >
                                            {SlideContent}
                                        </a>
                                    ) : (
                                        SlideContent
                                    )}
                                </div>
                            </SwiperSlide>
                        );
                    })}
            </Swiper>
</div>
            <div className="wrap-pagination">
                <div className="container">
                    <div className="sw-dots sp1 sw-pagination-slider justify-content-center" />
                </div>
            </div>
        </div>
    );
};

export default Explore;
