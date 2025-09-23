"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { _url, handleAboutUsPageOurJourneyService } from "@/utlis/apiService";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

export default function About() {
    const { language } = useContext(LanguageContext);
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData(language);
    }, [language]);

    async function fetchData(lang) {
        try {
            const result = await handleAboutUsPageOurJourneyService(lang);
            setData(result?.data[0]);
        } catch (err) {
            const { message, error } = err?.response?.data || "";
            setData([]);
            setError(
                message || error || err.message || "something went wrong!"
            );
        }
    }

    if (data === undefined) return;
    return (
        <>
            {data && (
                <section className="flat-spacing-23 flat-image-text-section paddingTop0 pb_0">
                    <div className="container">
                        <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
                            <div className="flowerImg">
                                <Image
                                    className="lazyload"
                                    data-src="/images/brand-maratha/common/flowers.png"
                                    alt="collection-img"
                                    src="/images/brand-maratha/common/flowers.png"
                                    width={415}
                                    height={408}
                                />
                            </div>
                            <div className="tf-image-wrap bg-remove width-col-md-3">
                                <Image
                                    className="lazyload"
                                    // data-src="/images/brand-maratha/about/our-journey.jpg"
                                    data-src={data?.image}
                                    alt="collection-img"
                                    // src="/images/brand-maratha/about/our-journey.jpg"
                                    src={`${_url}/${data?.image}`}
                                    width={376}
                                    height={412}
                                />
                            </div>
                            <div className="tf-content-wrap px-0 d-flex justify-content-center">
                                <div>
                                    <div className="heading typ42">
                                        {t("our_journey", language)}
                                    </div>
                                    <div className="text typ16">
                                        {data?.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}




