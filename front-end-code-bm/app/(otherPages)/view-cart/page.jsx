"use client";
import Testimonials from "@/components/common/Testimonials";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Cart from "@/components/othersPages/Cart";
import RecentProducts from "@/components/shopDetails/RecentProducts";
import Topbar1 from "@/components/headers/Topbar1";
import React from "react";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";
// export const metadata = {
//   title: "View Cart || Brand Maratha",
//   description: "Brand Maratha",
// };
export default function page() {
    const { language } = useContext(LanguageContext);
    return (
        <>
            <Topbar1 />
            <Header />
            <div className="tf-page-title marginTopHeader bs-innerpage textureAdd">
                <div className="container h-100">
                    <div className="heading text-left h-100">
                        {t("Shopping_Cart", language)}
                    </div>
                </div>
            </div>

            <Cart />
            {/* <Testimonials />
      <RecentProducts /> */}
            <Footer1 />
        </>
    );
}

