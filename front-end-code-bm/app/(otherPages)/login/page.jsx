"use client";
import Footer1 from "@/components/footers/Footer1";
import Topbar1 from "@/components/headers/Topbar1";
import Header from "@/components/headers/Header";
import Head from "next/head";
import Login from "@/components/othersPages/Login";
import React from "react";

export default function page() {
    return (
        <>
            <Head>
                title: "Log in || Brand Maratha", description: "Brand Maratha",
            </Head>
            <Topbar1 />
            <Header />
            <div className="tf-page-title marginTopHeader bs-innerpage style-2 textureAdd">
                <div className="container h-100">
                    <div className="heading text-left h-100">{"login"}</div>
                </div>
            </div>

            <Login />
            <Footer1 />
        </>
    );
}

