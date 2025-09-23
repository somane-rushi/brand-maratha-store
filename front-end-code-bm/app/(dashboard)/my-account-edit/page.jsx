"use client";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import Head from "next/head";
import AccountEdit from "@/components/othersPages/dashboard/AccountEdit";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import React from "react";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";
// export const metadata = {
//   title: "My Account Edit || Brand Maratha",
//   description: "Ecomus - Ultimate React Nextjs Ecommerce Template",
// };
export default function page() {
    const { language } = useContext(LanguageContext);
    return (
        <>
            <Head>
                title: "My Account Edit || Brand Maratha", description: "Brand
                Maratha",
            </Head>
            <Topbar1 />
            <Header />
            <div className="tf-page-title marginTopHeader bs-innerpage style-2 textureAdd">
                <div className="container h-100">
                    <div className="heading text-left h-100">
                        {t("my_account_details", language)}
                    </div>
                </div>
            </div>
            <section className="flat-spacing-11">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <DashboardNav />
                        </div>
                        <div className="col-lg-9">
                            <AccountEdit />
                        </div>
                    </div>
                </div>
            </section>
            <Footer1 />
        </>
    );
}

