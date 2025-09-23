"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
import emailjs from "@emailjs/browser";
import { aboutLinks, footerLinks, paymentImages } from "@/data/footerLinks";
import { subscribeNewsletter } from "@/utlis/apiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

export default function Footer1({ bgColor = "" }) {
    useEffect(() => {
        const headings = document.querySelectorAll(".footer-heading-moblie");

        const toggleOpen = (event) => {
            const parent = event.target.closest(".footer-col-block");

            parent.classList.toggle("open");
        };

        headings.forEach((heading) => {
            heading.addEventListener("click", toggleOpen);
        });

        // Clean up event listeners when the component unmounts
        return () => {
            headings.forEach((heading) => {
                heading.removeEventListener("click", toggleOpen);
            });
        };
    }, []); // Empty dependency array means this will run only once on mount

    const formRef = useRef();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const { language } = useContext(LanguageContext); 
    const handleShowMessage = () => {
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await subscribeNewsletter(email);
            toast.success(response.message || "Subscribed successfully!");
            setEmail(""); // Reset the input field
            formRef.current.reset();
        } catch (error) {
            toast.error("Email Already Subscribed");
        } finally {
            setLoading(false);
        }
    };

    const sendMail = (e) => {
        emailjs
            .sendForm("service_noj8796", "template_fs3xchn", formRef.current, {
                publicKey: "iG4SCmR-YtJagQ4gV",
            })
            .then((res) => {
                if (res.status === 200) {
                    setSuccess(true);
                    handleShowMessage();
                    formRef.current.reset();
                } else {
                    setSuccess(false);
                    handleShowMessage();
                }
            });
    };

    return (
        <footer id="footer" className={`footer md-pb-70 ${bgColor}`}>
            <div className="footer-wrap">
                <div className="footer-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 col-md-6 col-12">
                                <div className="footer-infor">
                                    <div className="footer-logo">
                                        <Link href={`/`}>
                                            <Image
                                                alt="image"
                                                src="/images/brand-maratha/logo/logo.png"
                                                width="88"
                                                height="52"
                                            />
                                        </Link>
                                    </div>
                                    <ul>
                                        <li>
                                            <p className="max-280">
                                                <a href="https://maps.app.goo.gl/WwR6RruyCNgD6BsC8">
                                                    {" "}
                                                    {t("address-full", language)}
                                                </a>
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                {t("email", language)}:{" "}
                                                <a href="mailto:brandmarathaofficial@gmail.com">
                                                    brandmarathaofficial@gmail.com
                                                </a>
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                {t("phone", language)}:{" "}
                                                <a href="tel:02231645644">
                                                    +91 2231645644{" "}
                                                </a>
                                            </p>
                                        </li>
                                    </ul>
                                    <Link
                                        href={`/contact-us`}
                                        className="tf-btn btn-line line-height-normal"
                                    >
                                        {t("get_direction",language)}
                                        <i className="icon icon-arrow1-top-left" />
                                    </Link>
                                    <ul className="tf-social-icon d-flex gap-10">
                                        <li>
                                            <a
                                                href="https://www.facebook.com/brandmarathasocial/"
                                                className="box-icon w_34 round social-facebook social-line"
                                            >
                                                <i className="icon fs-14 icon-fb" />
                                            </a>
                                        </li>
                                        {/* <li>
                      <a
                        href="#"
                        className="box-icon w_34 round social-twiter social-line"
                      >
                        <i className="icon fs-12 icon-Icon-x" />
                      </a>
                    </li> */}
                                        <li>
                                            <a
                                                href="https://www.instagram.com/brandmarathasocial/"
                                                className="box-icon w_34 round social-instagram social-line"
                                            >
                                                <i className="icon fs-14 icon-instagram" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.youtube.com/@BrandMarathaSocial"
                                                className="box-icon w_34 round social-youtube social-line"
                                            >
                                                <i className="icon fs-14 icon-youtube" />
                                            </a>
                                        </li>
                                        {/* <li>
                      <a
                        href="#"
                        className="box-icon w_34 round social-tiktok social-line"
                      >
                        <i className="icon fs-14 icon-tiktok" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="box-icon w_34 round social-pinterest social-line"
                      >
                        <i className="icon fs-14 icon-pinterest-1" />
                      </a>
                    </li> */}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                                <div className="footer-heading footer-heading-desktop">
                                    <h6>{t("help", language)}</h6>
                                </div>
                                <div className="footer-heading footer-heading-moblie">
                                    <h6>{t("help", language)}</h6>
                                </div>
                                <ul className="footer-menu-list tf-collapse-content">
                                    {footerLinks.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                href={link.href}
                                                className="footer-menu_item"
                                            >
                                                {link.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                                <div className="footer-heading footer-heading-desktop">
                                    <h6>{t("about_us", language)}</h6>
                                </div>
                                <div className="footer-heading footer-heading-moblie">
                                    <h6>{t("about_us", language)}</h6>
                                </div>
                                <ul className="footer-menu-list tf-collapse-content">
                                    {aboutLinks
                                        .slice(0, 4)
                                        .map((link, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={link.href}
                                                    className="footer-menu_item"
                                                >
                                                    {link.text}
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                            <div className="col-xl-3 col-md-6 col-12">
                                <div className="footer-newsletter footer-col-block">
                                    <div className="footer-heading footer-heading-desktop">
                                        <h6>{t("sign_up_for_email", language)}</h6>
                                    </div>
                                    <div className="footer-heading footer-heading-moblie">
                                        <h6>{t("sign_up_for_email", language)}</h6>
                                    </div>
                                    <div className="tf-collapse-content">
                                        <div className="footer-menu_item">
                                            {t("subscribe", language)}
                                        </div>
                                        <div
                                            className={`tfSubscribeMsg ${
                                                showMessage ? "active" : ""
                                            }`}
                                        >
                                            {success ? (
                                                <p
                                                    style={{
                                                        color: "rgb(52, 168, 83)",
                                                    }}
                                                >
                                                    {t("successfully", language)}
                                                </p>
                                            ) : (
                                                <p style={{ color: "red" }}>
                                                    {t("Something_went_wrong", language)}
                                                </p>
                                            )}
                                        </div>
                                        <ToastContainer
                                            position="top-right"
                                            autoClose={3000}
                                        />
                                        <form
                                            ref={formRef}
                                            onSubmit={handleSubmit}
                                            className="form-newsletter subscribe-form"
                                            action="#"
                                            method="post"
                                            acceptCharset="utf-8"
                                            data-mailchimp="true"
                                        >
                                            <div className="subscribe-content">
                                                <fieldset className="email">
                                                    <input
                                                        required
                                                        type="email"
                                                        name="email"
                                                        className="subscribe-email"
                                                        placeholder="Enter your email...."
                                                        tabIndex={0}
                                                        aria-required="true"
                                                        autoComplete="off"
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </fieldset>
                                                <div className="button-submit">
                                                    <button
                                                        className="subscribe-button tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                                                        type="submit"
                                                        disabled={loading}
                                                    >
                                                        {loading
                                                            ? "Subscribing..."
                                                            : "Subscribe"}
                                                        <i className="icon icon-arrow1-top-left" />
                                                    </button>
                                                </div>
                                            </div>
                                            {message && (
                                                <div className="subscribe-msg">
                                                    {message}
                                                </div>
                                            )}
                                        </form>
                                        <div className="tf-cur">
                                            {/* <div className="tf-currencies">
                        <CurrencySelect />
                      </div> */}
                                            <div className="tf-languages">
                                                <LanguageSelect />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="footer-bottom-wrap d-flex gap-20 flex-wrap justify-content-between align-items-center">
                                    <div className="footer-menu_item">
                                        © {new Date().getFullYear()}{" "}
                                        <Link
                                            href={`https://creativewebo.com/`}
                                        >
                                            Creativewebo
                                        </Link>
                                        . All Rights Reserved
                                    </div>
                                    <div className="tf-payment">
                                        {paymentImages.map((image, index) => (
                                            <Image
                                                key={index}
                                                src={image.src}
                                                width={image.width}
                                                height={image.height}
                                                alt="image"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

