"use client";
import Topbar1 from "@/components/headers/Topbar1";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import ContactForm from "@/components/othersPages/contact/ContactForm";
import Map from "@/components/othersPages/contact/Map";
import React from "react";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";
// export const metadata = {
//   title: "Contact 1 || Brand Maratha",
//   description: "Brand Maratha",
// };
export default function page() {
    const { language } = useContext(LanguageContext);
    return (
        <>
            <Topbar1 />
            <Header />
            <div className="tf-page-title marginTopHeader bs-innerpage style-2 textureAdd">
                <div className="container h-100">
                    <div className="heading text-left h-100">
                        {t("Contact_Us", language)}
                    </div>
                </div>
            </div>
            {/* <Map /> */}
            <ContactForm />
            <Footer1 />
        </>
    );
}

