"use client";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

import { handleInternationalPolicyService } from "@/utlis/apiService";

export default function page() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        fetchData("en");
    }, []);

    async function fetchData(lang) {
        try {
            const result = await handleInternationalPolicyService(lang);
            if (result.data.length === 0) throw new Error("No data available");

            setData(result?.data);
        } catch (err) {
            const { message, error } = err.response.data || "";
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
                            {t("international_policy", language)}
                        </div>
                    </div>
                </div>
                {/* /page-title */}
                {/* main-page */}
                <section className="flat-spacing-36">
                    <div className="container">
                        <div className="tf-main-area-page">
                            <h4>{t("international_heading", language)}</h4>
                            {/* <p>
              </p> */}
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: data.description,
                                }}
                            />
                            {/* <p>
                Please be advised that the practices described in this Privacy
                Policy apply to information gathered by us or our subsidiaries,
                affiliates or agents: (i) through this Website, (ii) where
                applicable, through our Customer Service Department in
                connection with this Website, (iii) through information provided
                to us in our free standing retail stores, and (iv) through
                information provided to us in conjunction with marketing
                promotions and sweepstakes.
              </p>
              <p>
                We are not responsible for the content or privacy practices on
                any websites.
              </p>
              <p>
                We reserve the right, in our sole discretion, to modify, update,
                add to, discontinue, remove or otherwise change any portion of
                this Privacy Policy, in whole or in part, at any time. When we
                amend this Privacy Policy, we will revise the “last updated”
                date located at the top of this Privacy Policy.
              </p>
              <p>
                If you provide information to us or access or use the Website in
                any way after this Privacy Policy has been changed, you will be
                deemed to have unconditionally consented and agreed to such
                changes. The most current version of this Privacy Policy will be
                available on the Website and will supersede all previous
                versions of this Privacy Policy.
              </p>
              <p>
                If you have any questions regarding this Privacy Policy, you
                should contact our Customer Service Department by email at
                marketing@company.com
              </p> */}
                        </div>
                    </div>
                </section>
            </>

            <Footer1 />
        </>
    );
}

