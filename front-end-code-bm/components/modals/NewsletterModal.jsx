"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { usePathname } from "next/navigation";
import { newslaterIsSubscribed, subscribeNewsletter } from "@/utlis/apiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

export default function NewsletterModal() {
    const pathname = usePathname();
    const formRef = useRef();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(true);
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
            setEmail("");
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

    const modalElement = useRef();

    // useEffect(() => {
    //     const showModal = async () => {
    //         if (pathname === "/") {
    //             const bootstrap = await import("bootstrap");
    //             const myModal = new bootstrap.Modal(
    //                 document.getElementById("newsletterPopup"),
    //                 {
    //                     keyboard: false,
    //                 }
    //             );

    //             await new Promise((resolve) => setTimeout(resolve, 2000));
    //             myModal.show();

    //             modalElement.current.addEventListener("hidden.bs.modal", () => {
    //                 myModal.hide();
    //             });
    //         }
    //     };

    //     showModal();
    // }, [pathname]);

    useEffect(() => {
        const showModal = async () => {
            if (pathname === "/") {
                const token = localStorage.getItem("token");
                let email = null;

                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split(".")[1]));
                        email = payload?.email;
                        console.log("email", email);
                    } catch (error) {
                        console.error("Error decoding token:", error);
                    }
                }

                if (email) {
                    try {
                        const { isSubscribed } = await newslaterIsSubscribed(
                            email
                        );

                        if (isSubscribed) {
                            return;
                        }
                    } catch (error) {
                        console.error("Newsletter check failed", error);
                    }
                }

                const lastShown = localStorage.getItem(
                    "newsletterModalLastShown"
                );

                const today = new Date().toDateString();

                if (lastShown !== today) {
                    const bootstrap = await import("bootstrap");
                    const myModal = new bootstrap.Modal(
                        document.getElementById("newsletterPopup"),
                        { keyboard: false }
                    );

                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    myModal.show();

                    localStorage.setItem("newsletterModalLastShown", today);

                    modalElement.current.addEventListener(
                        "hidden.bs.modal",
                        () => {
                            myModal.hide();
                        }
                    );
                }
            }
        };

        showModal();
    }, [pathname]);

    return (
        <div
            ref={modalElement}
            className="modal modalCentered fade auto-popup modal-newleter"
            id="newsletterPopup"
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <span
                        className="close-btn btn-hide-popup"
                        data-bs-dismiss="modal"
                    >
                        {" "}
                        <Image
                            className="lazyload "
                            data-src="/images/brand-maratha/icon/close.svg"
                            alt="modal-img"
                            width={28}
                            height={28}
                            src="/images/brand-maratha/icon/close.svg"
                        />
                    </span>
                    <div className="row g-0">
                        <div className="col-md-6">
                            <div className="img-section">
                                <Image
                                    className="lazyload w-100"
                                    data-src="/images/brand-maratha/home/modal-img.jpg"
                                    alt="modal-img"
                                    width={505}
                                    height={626}
                                    src="/images/brand-maratha/home/modal-img.jpg"
                                />
                            </div>
                        </div>
                        <div className="col-md-6 align-self-center">
                            <div className="text-section">
                                <div className="modal-bottom">
                                    <h4 className="">
                                        {t("dont_miss_out", language)}
                                    </h4>
                                    <h6 className="">
                                        {t("modal_content", language)}
                                    </h6>
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
                                                Something went wrong
                                            </p>
                                        )}
                                    </div>

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
                                                        setEmail(e.target.value)
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
                                    <div className="note">
                                        <span>{t("no_spam", language)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
