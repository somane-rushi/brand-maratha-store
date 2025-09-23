"use client";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Register from "@/components/othersPages/Register";
import Head from "next/head";
import Topbar1 from "@/components/headers/Topbar1";
import React from "react";

// export const metadata = {
//   title: "Register || Brand Maratha",
//   description: "Brand Maratha",
// };
export default function page() {
    return (
        <>
            <Head>
                title: "Register || Brand Maratha", description: "Brand
                Maratha",
            </Head>
            <Topbar1 />
            <Header />
            <div className="tf-page-title marginTopHeader bs-innerpage style-2 textureAdd">
                <div className="container h-100">
                    <div className="heading text-left h-100">{"register"}</div>
                </div>
            </div>
            <Register />
            <Footer1 />
        </>
    );
}

