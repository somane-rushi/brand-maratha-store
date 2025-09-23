"use client";

import { useEffect, useState } from "react";

import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";

import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";

import Context from "@/context/Context";
import { LanguageProvider } from "@/context/LanguageContext";

import HomesModal from "@/components/modals/HomesModal";
import QuickView from "@/components/modals/QuickView";
import ProductSidebar from "@/components/modals/ProductSidebar";
import QuickAdd from "@/components/modals/QuickAdd";
import Compare from "@/components/modals/Compare";
import ShopCart from "@/components/modals/ShopCart";
import AskQuestion from "@/components/modals/AskQuestion";
import BlogSidebar from "@/components/modals/BlogSidebar";
import ColorCompare from "@/components/modals/ColorCompare";
import DeliveryReturn from "@/components/modals/DeliveryReturn";
import FindSize from "@/components/modals/FindSize";
import Login from "@/components/modals/Login";
import MobileMenu from "@/components/modals/MobileMenu";
import Register from "@/components/modals/Register";
import ResetPass from "@/components/modals/ResetPass";
import SearchModal from "@/components/modals/SearchModal";
import ToolbarBottom from "@/components/modals/ToolbarBottom";
import ToolbarShop from "@/components/modals/ToolbarShop";
import AskReview from "@/components/modals/AskReview";
import VideoModalPopup from "@/components/modals/VideoModal";
import FilterSliderMobile from "@/components/shop/FilterSliderMobile";
import NewsletterModal from "@/components/modals/NewsletterModal";
import ShareModal from "@/components/modals/ShareModal";
import ScrollTop from "@/components/common/ScrollTop";
// import RtlToggle from "@/components/common/RtlToggle";

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const [scrollDirection, setScrollDirection] = useState("down");

    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        console.warn = () => { };
        console.error = () => { };
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const initBootstrap = async () => {
                await import("bootstrap/dist/js/bootstrap.esm");
            };
            initBootstrap();
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector("header");
            if (window.scrollY > 100) {
                header?.classList.add("header-bg");
            } else {
                header?.classList.remove("header-bg");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const closeModals = async () => {
            const { Modal, Offcanvas } = await import("bootstrap");

            document.querySelectorAll(".modal.show").forEach((modal) => {
                Modal.getInstance(modal)?.hide();
            });

            document.querySelectorAll(".offcanvas.show").forEach((canvas) => {
                Offcanvas.getInstance(canvas)?.hide();
            });
        };

        closeModals();
    }, [pathname]);

    useEffect(() => {
        setScrollDirection("up");

        const lastScrollY = {
            current: typeof window !== "undefined" ? window.scrollY : 0,
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollDirection(
                currentScrollY > 250
                    ? currentScrollY > lastScrollY.current
                        ? "down"
                        : "up"
                    : "down"
            );
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    useEffect(() => {
        const header = document.querySelector("header");
        if (header) {
            header.style.top = scrollDirection === "up" ? "0px" : "-185px";
        }
    }, [scrollDirection]);

    // useEffect(() => {
    //     import("wowjs").then(({ WOW }) => {
    //         new WOW({ mobile: false, live: false }).init();
    //     });
    // }, [pathname]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js";
            script.async = true;
            script.onload = () => {
                if (window.WOW) {
                    new window.WOW({ mobile: false, live: false }).init();
                }
            };
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [pathname]);




    useEffect(() => {
        const initializeDirection = () => {
            const direction = localStorage.getItem("direction");

            if (direction) {
                const parsedDirection = JSON.parse(direction);
                document.documentElement.dir = parsedDirection.dir;
                document.body.classList.add(parsedDirection.dir);
            } else {
                document.documentElement.dir = "ltr";
            }

            document.getElementById("preloader")?.classList.add("disabled");
        };

        initializeDirection();
    }, []);

    return (
        <html lang="en">
            <body className="preload-wrapper">
                <div className="preload preload-container" id="preloader">
                    <div className="preload-logo">
                        <div className="spinner"></div>
                    </div>
                </div>

                <LanguageProvider>
                    <Context>
                        <div id="wrapper">{children}</div>
                        {/* <RtlToggle /> */}
                        <HomesModal />
                        <QuickView />
                        <QuickAdd />
                        <ProductSidebar />
                        <Compare />
                        <ShopCart />
                        <AskQuestion />
                        <BlogSidebar />
                        <ColorCompare />
                        <DeliveryReturn />
                        <FindSize />
                        <Login />
                        <MobileMenu />
                        <Register />
                        <ResetPass />
                        <SearchModal />
                        <ToolbarBottom />
                        <ToolbarShop />
                        <NewsletterModal />
                        <ShareModal />
                    </Context>

                    <ScrollTop />
                    <AskReview />
                    <VideoModalPopup />
                    <FilterSliderMobile />
                </LanguageProvider>

                <GoogleAnalytics gaId="G-4CD047N8YS" />
            </body>
        </html>
    );
}
