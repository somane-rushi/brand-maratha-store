"use client";
import React, { useEffect, useState } from "react";
import { handleAbouUsPageWhoAreWeService } from "@/utlis/apiService";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

export default function FlatTitle() {
    const { language } = useContext(LanguageContext);
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData(language);
    }, [language]);

    async function fetchData(lang) {
        try {
            const result = await handleAbouUsPageWhoAreWeService(lang);
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
                <section className="flat-spacing-9 typ-about">
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-md-6">
                                <div className="flat-title">
                                    <span className="title">
                                        {t("who_we_are", language)}
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="flat-title typ-pdL33">
                                    <h4 className="hd">{data?.title}</h4>
                                    <p className="para">{data?.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
