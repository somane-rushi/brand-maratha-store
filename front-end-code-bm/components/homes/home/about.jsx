"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchhomepageaboutus } from "@/utlis/apiService";
import APP_URL from "@/utlis/config";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

const About = ({ headingKey, contentKey, buttonKey }) => {
    const [aboutData, setAboutData] = useState(null);
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        const getAboutData = async () => {
            try {
                const { data } = await fetchhomepageaboutus(language);
                setAboutData(data[0]);
            } catch (error) {
                console.error("Error fetching About Us data:", error);
            }
        };

        getAboutData();
    }, [language]);

    // if (!aboutData) {
    //     return <p>Loading...</p>;
    // }

    return (
        <>
            {aboutData && (
                <section className="flat-spacing-15 typ-pdT0-desk">
                    <div className="container background-texture">
                        <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
                            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                                <div>
                                    <div className="heading">
                                        {t(headingKey, language)}
                                    </div>
                                    <div className="text max-452 typ16">
                                        {aboutData.description}
                                    </div>
                                    <div className="article-btn">
                                        <a
                                            className="tf-btn btn-line line-height-normal fw-6 about-btn"
                                            href="#"
                                        >
                                            {t(buttonKey, language)}
                                            <i className="icon icon-arrow1-top-left"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="grid-img-group">
                                <div className="tf-image-wrap box-img item-1">
                                    <div className="img-style">
                                        <Image
                                            className="lazyload"
                                            src={`${APP_URL}/${aboutData.image_primary}`}
                                            alt="About Us"
                                            width={492}
                                            height={539}
                                        />
                                    </div>
                                </div>
                                <div className="tf-image-wrap box-img item-2">
                                    <div className="img-style">
                                        <Image
                                            className="lazyload"
                                            src={`${APP_URL}/${aboutData.image_secondary}`}
                                            alt="About Us"
                                            width={282}
                                            height={326}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default About;
