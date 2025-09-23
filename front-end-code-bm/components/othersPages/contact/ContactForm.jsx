"use client";
import { socialLinksWithBorder } from "@/data/socials";
import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleContactUsService } from "@/utlis/apiService";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

export default function ContactForm() {
    const [error, setError] = useState("");
    const [isMessage, setIsMessage] = useState("");
    const { language } = useContext(LanguageContext);

    const handleShowMessage = (msg) => {
        setIsMessage(msg);
        setTimeout(() => {
            setIsMessage("");
        }, 2000);
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            message: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, "Must be at least 3 characters")
                .max(50, "Must be less than 50 characters")
                .required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            message: Yup.string().required("Message is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const { status } = await handleContactUsService(values);
                if (status === 201) {
                    handleShowMessage("Message has been sent successfully.");
                }
            } catch (err) {
                const { data } = err.response || {};
                handleShowMessage("Something went wrong.");
                setError(data?.error || data?.message || err?.message);
            } finally {
                resetForm();
            }
        },
    });
    return (
        <section className="flat-spacing-36">
            <div className="container">
                <div className="tf-grid-layout gap30 lg-col-2">
                    <div className="tf-content-left">
                        <h5 className="mb_20">{t("Visit_Our_Store", language)}</h5>
                        <div className="mb_24">
                            <p className="mb_12">
                                <span className="fw-5">{t("Address", language)}</span>
                            </p>
                            <Link href="https://maps.app.goo.gl/WwR6RruyCNgD6BsC8">
                                {t("address-full", language)}
                            </Link>
                        </div>
                        <div className="mb_24">
                            <p className="mb_12">
                                <span className="fw-5">{t("Phone", language)}</span>
                            </p>
                            <Link href="tel:02231645644 ">+91 2231645644 </Link>
                        </div>
                        <div className="mb_24">
                            <p className="mb_12">
                                <span className="fw-5">{t("Email", language)}</span>
                            </p>
                            <Link href="mailto:brandmarathaofficial@gmail.com">
                                brandmarathaofficial@gmail.com
                            </Link>
                        </div>
                        {/* <div className="mb_24">
                            <p className="mb_12">
                                <span className="fw-5">{t("Open_Time", language)}</span>
                            </p>
                            <p className="mb_0">
                                Our store has re-opened for shopping,
                            </p>
                            <p className="mb_0">
                                exchange Every day 11am to 7pm
                            </p>
                        </div> */}
                        <div>
                            <ul className="tf-social-icon d-flex gap-20 style-default">
                                {socialLinksWithBorder.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className={`box-icon link round ${link.className} ${link.borderClass}`}
                                        >
                                            <i
                                                className={`icon ${link.iconSize} ${link.iconClass}`}
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="tf-content-right">
                        <h5 className="mb_20">{t("Get_in_Touch", language)}</h5>
                        <p className="mb_24">{t("Touch_para", language)}</p>
                        <div>
                            <form
                                onSubmit={formik.handleSubmit}
                                className="form-contact"
                                id="contactform"
                                action="/"
                                method=""
                            >
                                <div className="d-flex gap-15 mb_15">
                                    <fieldset className="w-100">
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Full Name *"
                                            name="name"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.name}
                                        />
                                        {formik.touched.name &&
                                            formik.errors.name && (
                                                <div className="text-danger text-xs">
                                                    {formik.errors.name}
                                                </div>
                                            )}
                                    </fieldset>
                                    <fieldset className="w-100">
                                        <input
                                            type="email"
                                            autoComplete="abc@xyz.com"
                                            name="email"
                                            id="email"
                                            placeholder="Email *"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                        />
                                        {formik.touched.email &&
                                            formik.errors.email && (
                                                <div className="text-danger text-xs">
                                                    {formik.errors.email}
                                                </div>
                                            )}
                                    </fieldset>
                                </div>
                                <div className="mb_15">
                                    <textarea
                                        placeholder="Message"
                                        name="message"
                                        id="message"
                                        cols={30}
                                        rows={10}
                                        defaultValue={""}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.message}
                                    />
                                    {formik.touched.message &&
                                        formik.errors.message && (
                                            <div className="text-danger text-xs">
                                                {formik.errors.message}
                                            </div>
                                        )}
                                </div>
                                {isMessage && (
                                    <span className="text-success">
                                        {isMessage}
                                    </span>
                                )}
                                {error && (
                                    <span className="text-danger">{error}</span>
                                )}
                                <div className="send-wrap">
                                    <button
                                        type="submit"
                                        className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

