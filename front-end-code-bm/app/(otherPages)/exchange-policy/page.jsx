"use client";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import React from "react";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

export default function page() {
    const { language } = useContext(LanguageContext);
    return (
        <>
            <Topbar1 />
            <Header />
            <>
                {/* page-title */}
                <div className="tf-page-title style-2 marginTopHeader bs-innerpage textureAdd">
                    <div className="container h-100">
                        <div className="heading text-left h-100">
                            {t("Exchange_Policy", language)}
                        </div>
                    </div>
                </div>
                {/* /page-title */}
                {/* main-page */}
                <section className="flat-spacing-36">
                    <div className="container">
                        <div class="tf-main-area-page tf-page-delivery tf-terms-conditions">
                            <div class="box">
                                <h4>Delivery</h4>
                                <ul class="tag-list">
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit.{" "}
                                    </li>
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit.{" "}
                                    </li>
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit.{" "}
                                    </li>
                                </ul>
                            </div>
                            <div class="box">
                                <h4>Return</h4>
                                <ul class="tag-list">
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit.{" "}
                                    </li>
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Etiam eu turpis
                                        molestie, dictum est a, mattis tellus.
                                        Sed dignissim{" "}
                                    </li>
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit.{" "}
                                    </li>
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit.{" "}
                                    </li>
                                </ul>
                            </div>
                            <div class="box">
                                <h4>Help</h4>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.{" "}
                                </p>
                                <p>
                                    Email:{" "}
                                    <a
                                        href="mailto:info@creativewebo.com"
                                        className="cf-mail"
                                    >
                                        info@creativewebo.com
                                    </a>
                                </p>
                                <p>
                                    Phone:{" "}
                                    <a href="tel:9004480375" className="">
                                        +91-9004480375
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </>

            <Footer1 />
        </>
    );
}

