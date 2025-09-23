"use client";

import { useEffect, useState } from "react";

import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";
import HomesModal from "@/components/modals/HomesModal";
import Context from "@/context/Context";
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

import { usePathname } from "next/navigation";
import NewsletterModal from "@/components/modals/NewsletterModal";
import ShareModal from "@/components/modals/ShareModal";
import ScrollTop from "@/components/common/ScrollTop";
import RtlToggle from "@/components/common/RtlToggle";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({ children }) {
    const pathname = usePathname();
    useEffect(() => {
        if (typeof window !== "undefined") {
            const initBootstrap = async () => {
                await import("bootstrap/dist/js/bootstrap.esm");
            };
            initBootstrap();
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

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
        if (typeof window === "undefined") return;

        const closeModals = async () => {
            const { Modal, Offcanvas } = await import("bootstrap");

            // Close any open modal
            const modalElements = document.querySelectorAll(".modal.show");
            modalElements.forEach((modal) => {
                const modalInstance = Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });

            // Close any open offcanvas
            const offcanvasElements =
                document.querySelectorAll(".offcanvas.show");
            offcanvasElements.forEach((offcanvas) => {
                const offcanvasInstance = Offcanvas.getInstance(offcanvas);
                if (offcanvasInstance) {
                    offcanvasInstance.hide();
                }
            });
        };

        closeModals();
    }, [pathname]);

    const [scrollDirection, setScrollDirection] = useState("down");

    useEffect(() => {
        setScrollDirection("up");
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 250) {
                if (currentScrollY > lastScrollY.current) {
                    // Scrolling down
                    setScrollDirection("down");
                } else {
                    // Scrolling up
                    setScrollDirection("up");
                }
            } else {
                // Below 250px
                setScrollDirection("down");
            }

            lastScrollY.current = currentScrollY;
        };

        const lastScrollY = {
            current: typeof window !== "undefined" ? window.scrollY : 0,
        };

        if (typeof window !== "undefined") {
            window.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("scroll", handleScroll);
            }
        };
    }, [pathname]);
    useEffect(() => {
        if (typeof window === "undefined") return;

        const header = document.querySelector("header");
        if (header) {
            if (scrollDirection === "up") {
                header.style.top = "0px";
            } else {
                header.style.top = "-185px";
            }
        }
    }, [scrollDirection]);
    useEffect(() => {
        if (typeof window !== "undefined") {
            import("wowjs").then(({ WOW }) => {
                const wow = new WOW({
                    mobile: false,
                    live: false,
                });
                wow.init();
            });
        }
    }, [pathname]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const initializeDirection = () => {
            const direction = localStorage.getItem("direction");

            if (direction) {
                const parsedDirection = JSON.parse(direction);
                document.documentElement.dir = parsedDirection.dir;
                document.body.classList.add(parsedDirection.dir);
            } else {
                document.documentElement.dir = "ltr";
            }

            const preloader = document.getElementById("preloader");
            if (preloader) {
                preloader.classList.add("disabled");
            }
        };

        initializeDirection();
    }, []); // Only runs once on component mount

    return (
        <html lang="en">
            <body className="preload-wrapper">
                <div className="preload preload-container" id="preloader">
                    <div className="preload-logo">
                        <div className="spinner"></div>
                    </div>
                </div>{" "}
                <Context>
                    <div id="wrapper">{children}</div>
                    {/* <RtlToggle /> */}
                    <HomesModal /> <QuickView />
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
                    <ShareModal />{" "}
                </Context>
                <ScrollTop />
                <AskReview />
                <VideoModalPopup />
                <FilterSliderMobile />
            </body>
            <GoogleAnalytics gaId="G-4CD047N8YS" />
        </html>
    );
}

