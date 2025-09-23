"use client";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import React, { useEffect, useState } from "react";

import { handleTermsOfConditionService } from "@/utlis/apiService";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

export default function page() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        fetchData("en");
    }, []);

    async function fetchData(lang) {
        try {
            const result = await handleTermsOfConditionService(lang);
            setData(result?.data);
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
            <Topbar1 />
            <Header />
            <>
                {/* page-title */}
                <div className="tf-page-title style-2 marginTopHeader bs-innerpage textureAdd">
                    <div className="container h-100">
                        <div className="heading text-left h-100">
                            {t("terms_conditions", language)}
                        </div>
                    </div>
                </div>
                {/* /page-title */}
                {/* main-page */}
                <section className="flat-spacing-36">
                    <div className="container">
                        <div className="tf-main-area-page tf-terms-conditions">
                            <div className="box">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: data.content,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </>

            <Footer1 />
        </>
    );
}

