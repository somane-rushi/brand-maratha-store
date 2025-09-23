"use client";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import Checkout from "@/components/othersPages/Checkout";
import Head from "next/head";
import React from "react";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";
// export const metadata = {
//   title: "Checkout || Brand Maratha",
//   description: "Brand Maratha",
// };
export default function page() {
    const { language } = useContext(LanguageContext);
    return (
        <>
            <Head>
                title: "Checkout || Brand Maratha", description: "Brand
                Maratha",
            </Head>
            <Topbar1 />
            <Header />
            <div className="tf-page-title marginTopHeader bs-innerpage style-2 textureAdd">
                <div className="container h-100">
                    <div className="heading text-left h-100">{t("Checkout", language)}</div>
                </div>
            </div>

            <Checkout />
            <Footer1 />
        </>
    );
}

