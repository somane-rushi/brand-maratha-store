"use client";
import React, { useState, useEffect, useTransition } from "react";
// import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
// import axios from "axios";
// import CurrencySelect from "../common/CurrencySelect";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";

export default function Topbar1({ query, setQuery }) {
    const [placeholder, setPlaceholder] = useState("Search for product");
    const [searchQuery, setSearchQuery] = useState("");
    // const router = useRouter();
    const textSequence = [
        "Kolhapuri Chappals",
        "Nauvari Sadi",
        "Paithani",
        "Shervani",
        "Dhoti Pajama",
        "Peta",
        "kurtas",
        "Khadi",
    ];
    const typingSpeed = 100; // Speed for typing animation (in ms)
    const pauseTime = 1000; // Pause before switching to the next text

    useEffect(() => {
        let currentIndex = 0;
        let isDeleting = false;
        let charIndex = 0;
        let timeoutId;

        const typeAnimation = () => {
            const currentText = textSequence[currentIndex];
            let updatedText;

            if (isDeleting) {
                updatedText = currentText.slice(0, charIndex--);
            } else {
                updatedText = currentText.slice(0, charIndex++);
            }

            setPlaceholder(`Search for ${updatedText}`);

            if (!isDeleting && charIndex === currentText.length) {
                timeoutId = setTimeout(() => (isDeleting = true), pauseTime);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % textSequence.length;
            }

            timeoutId = setTimeout(
                typeAnimation,
                isDeleting ? typingSpeed / 2 : typingSpeed
            );
        };

        typeAnimation();

        return () => clearTimeout(timeoutId);
    }, []);

    // const handleSearchSubmit = (e) => {
    //     e.preventDefault();
    //     if (searchQuery.trim()) {
    //         router.push(`/product-new?query=${searchQuery}`);
    //     }
    // };
    return (
        <div className="tf-top-bar bg_white line">
            <div className="px_15 lg-px_40">
                <div className="tf-top-bar_wrap grid-3 gap-30 align-items-center">
                    <ul className="tf-top-bar_item tf-social-icon d-flex gap-10">
                        <li>
                            <a
                                href="https://www.facebook.com/brandmarathasocial/"
                                className="box-icon w_28 round social-facebook bg_line"
                            >
                                <i className="icon fs-12 icon-fb" />
                            </a>
                        </li>

                        <li>
                            <a
                                href="https://www.instagram.com/brandmarathasocial/"
                                className="box-icon w_28 round social-instagram bg_line"
                            >
                                <i className="icon fs-12 icon-instagram" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.youtube.com/@BrandMarathaSocial"
                                className="box-icon w_28 round social-youtube bg_line"
                            >
                                <i className="icon fs-12 icon-youtube" />
                            </a>
                        </li>
                    </ul>
                    <div className="tf-search-sticky">
                        <form className="tf-mini-search-frm">
                            <fieldset className="text">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    name="search"
                                    value={query}
                                    tabIndex={0}
                                    onChange={(e) => setQuery(e.target.value)}
                                    aria-required="true"
                                    required
                                />
                            </fieldset>
                            <div className="searchIon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M16.893 16.92L19.973 20M19 11.5C19 13.4891 18.2098 15.3968 16.8033 16.8033C15.3968 18.2098 13.4891 19 11.5 19C9.51088 19 7.60322 18.2098 6.1967 16.8033C4.79018 15.3968 4 13.4891 4 11.5C4 9.51088 4.79018 7.60322 6.1967 6.1967C7.60322 4.79018 9.51088 4 11.5 4C13.4891 4 15.3968 4.79018 16.8033 6.1967C18.2098 7.60322 19 9.51088 19 11.5Z"
                                        stroke="#545454"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </form>
                    </div>
                    <div className="top-bar-language tf-cur justify-content-end">
                        <div className="tf-languages">
                            <LanguageSelect
                                parentClassName={
                                    "image-select center style-default type-languages"
                                }
                                topStart
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
