// "use client";

// import { useEffect, useState } from "react";
// import { _url, fetchSubcategories } from "@/utlis/apiService"; // Import API service
// import { Autoplay } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import Image from "next/image";
// import Link from "next/link";
// import APP_URL from "@/utlis/config";

// export default function Collections2() {
//     const [subcategories, setSubcategories] = useState([]);

//     useEffect(() => {
//         const loadSubcategories = async () => {
//             const data = await fetchSubcategories();
//             console.log("fetchSubcategories", data);

//             setSubcategories(data);
//         };

//         loadSubcategories();
//     }, []);

//     return (
//         <section className="flat-spacing-32">
//             <div className="container">
//                 <Swiper
//                     dir="ltr"
//                     slidesPerView={3}
//                     breakpoints={{
//                         576: { slidesPerView: 3 },
//                         0: { slidesPerView: 1.3 },
//                     }}
//                     modules={[Autoplay]}
//                     spaceBetween={15}
//                     autoplay={{ delay: 3000 }}
//                     className="tf-sw-recent"
//                 >
//                     {Array.isArray(subcategories) &&
//                         subcategories.map((subcategory, index) => {
//                             console.log("Category", subcategory.image);
//                             return (
//                                 <SwiperSlide key={index}>
//                                     <div className="collection-item-v4 lg hover-img">
//                                         <div className="collection-inner">
//                                             <Link
//                                                 href="#"
//                                                 className="collection-image img-style"
//                                             >
//                                                 <Image
//                                                     className="lazyload"
//                                                     // src={`${_url}/${subcategory.image}`}
//                                                     src="https://brand-maratha.vercel.app/images/brand-maratha/products/athleisure-wear.jpg"
//                                                     alt="image"
//                                                     width={600}
//                                                     height={771}
//                                                 />
//                                             </Link>
//                                             <div className="collection-content wow fadeInUp">
//                                                  <h5 className="heading text_white">
//                                                     {subcategory.title}
//                                                 </h5>
//                                                 <p className="subheading text_white">
//                                                     {subcategory.subtitle}
//                                                 </p>

//                                                 <Link
//                                                     href={`/shop-collection-sub`}
//                                                     className="tf-btn style-3 fw-6 btn-light-icon animate-hover-btn"
//                                                 >
//                                                     <span>Shop now</span>
//                                                 </Link>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </SwiperSlide>
//                             );
//                         })}
//                 </Swiper>

//             </div>
//         </section>
//     );
// }

{
    /* <div className="collection-item-v4 lg hover-img">
                    <div className="collection-inner">
                        <Link href="#" className="collection-image img-style">
                            <Image
                                className="lazyload"
                                // src={`${_url}/${subcategory.image}`}
                                src="https://brand-maratha.vercel.app/images/brand-maratha/products/essential-basic.jpg"
                                alt="image"
                                width={600}
                                height={771}
                            />
                        </Link>
                        <div className="collection-content wow fadeInUp">
                            <p className="subheading text_white">
                                Up to 30% off
                            </p>
                            <h5 className="heading text_white">
                                Essential Basics
                            </h5>
                            <Link
                                href={`/shop-collection-sub`}
                                className="tf-btn style-3 fw-6 btn-light-icon animate-hover-btn"
                            >
                                <span>Shop now</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="collection-item-v4 lg hover-img">
                    <div className="collection-inner">
                        <Link href="#" className="collection-image img-style">
                            <Image
                                className="lazyload"
                                // src={`${_url}/${subcategory.image}`}
                                src="https://brand-maratha.vercel.app/images/brand-maratha/products/essential-basic.jpg"
                                alt="image"
                                width={600}
                                height={771}
                            />
                        </Link>
                        <div className="collection-content wow fadeInUp">
                            <p className="subheading text_white">
                                Up to 30% off
                            </p>
                            <h5 className="heading text_white">
                                Athleisure Wear
                            </h5>
                            <Link
                                href={`/shop-collection-sub`}
                                className="tf-btn style-3 fw-6 btn-light-icon animate-hover-btn"
                            >
                                <span>Shop now</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="collection-item-v4 lg hover-img">
                    <div className="collection-inner">
                        <Link href="#" className="collection-image img-style">
                            <Image
                                className="lazyload"
                                // src={`${_url}/${subcategory.image}`}
                                src="https://brand-maratha.vercel.app/images/brand-maratha/products/essential-basic.jpg"
                                alt="image"
                                width={600}
                                height={771}
                            />
                        </Link>
                        <div className="collection-content wow fadeInUp">
                            <p className="subheading text_white">
                                Up to 30% off
                            </p>
                            <h5 className="heading text_white">
                                Seasonal Favorites
                            </h5>
                            <Link
                                href={`/shop-collection-sub`}
                                className="tf-btn style-3 fw-6 btn-light-icon animate-hover-btn"
                            >
                                <span>Shop now</span>
                            </Link>
                        </div>
                    </div>
                </div> */
}

// "use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";

export default function Collections2() {
    const subcategories = [
        {
            title: "Traditional Marathi ",
            subtitle: "(TAM)",
            query: "tam",
            image: "https://brand-maratha.vercel.app/images/brand-maratha/products/athleisure-wear.jpg",
        },
        {
            title: "Look-a-Like Marathi ",
            subtitle: "(LAM)",
            query: "lam",
            image: "https://brand-maratha.vercel.app/images/brand-maratha/products/athleisure-wear.jpg",
        },
        {
            title: "Re-Imagined Marathi ",
            subtitle: "(RIM)",
            query: "rim",
            image: "https://brand-maratha.vercel.app/images/brand-maratha/products/athleisure-wear.jpg",
        },
    ];

    return (
        <section className="flat-spacing-32">
            <div className="container">
                <Swiper
                    dir="ltr"
                    slidesPerView={3}
                    breakpoints={{
                        576: { slidesPerView: 3 },
                        0: { slidesPerView: 1.3 },
                    }}
                    modules={[Autoplay]}
                    spaceBetween={15}
                    autoplay={{ delay: 3000 }}
                    className="tf-sw-recent"
                >
                    {subcategories.map((subcategory, index) => (
                        <SwiperSlide key={index}>
                            <div className="collection-item-v4 lg hover-img">
                                <div className="collection-inner">
                                    <Link
                                        href={`/product-listing?traditional=${subcategory?.query}`}
                                        className="collection-image img-style"
                                    >
                                        <Image
                                            className="lazyload"
                                            src={subcategory.image}
                                            alt="image"
                                            width={600}
                                            height={771}
                                        />
                                    </Link>
                                    <div className="collection-content wow fadeInUp">
                                        <h5 className="heading text_white">
                                            {subcategory.title}
                                        </h5>

                                        <p className="heading text_white">
                                            {subcategory.subtitle}
                                        </p>
                                        <Link
                                            href={`/product-listing?traditional=${subcategory?.query}`}
                                            className="tf-btn style-3 fw-6 btn-light-icon animate-hover-btn"
                                        >
                                            <span>Shop now</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
