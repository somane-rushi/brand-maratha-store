"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleLoginService } from "@/utlis/apiService";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [modal, setModal] = useState(null);

    // Ensure code runs only on the client
    useEffect(() => {
        setIsClient(true);
        const initModal = async () => {
            if (typeof window !== "undefined") {
                const { Modal } = await import("bootstrap");
                const _modal = document.getElementById("login");
                if (_modal) {
                    setModal(new Modal(_modal));
                }
            }
        };
        initModal();
    }, []);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                 .required("Password is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const result = await handleLoginService(values);
                const { status, data } = result || {};

                if (status === 200) {
                    const { id } = await jwtDecode(data.token);

                    localStorage.setItem("token", data.token);
                    localStorage.setItem("id", id);

                    router.push("/");

                    // Hide modal (only if client-side is available)
                    if (modal) {
                        modal.hide();
                    }
                }
            } catch (err) {
                console.log(err);
                const { data } = err.response || {};
                setError(data?.error || data?.message || err?.message);
            } finally {
                resetForm();
            }
        },
    });

    return isClient ? (
        <div
            className="modal modalCentered fade form-sign-in modal-part-content"
            id="login"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="header">
                        <div className="demo-title">Log in</div>
                        <span
                            className="icon-close icon-close-popup"
                            data-bs-dismiss="modal"
                        />
                    </div>
                    <div className="tf-login-form">
                        <form
                            onSubmit={formik.handleSubmit}
                            acceptCharset="utf-8"
                        >
                            <div className="tf-field style-1">
                                <input
                                    className="tf-field-input tf-input"
                                    placeholder=" "
                                    type="email"
                                    name="email"
                                    autoComplete="abc@xyz.com"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                                <label className="tf-field-label">
                                    Email *
                                </label>
                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <div className="text-danger text-sm">
                                            {formik.errors.email}
                                        </div>
                                    )}
                            </div>
                            <div className="tf-field style-1">
                                <input
                                    className="tf-field-input tf-input"
                                    placeholder=" "
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                                <label className="tf-field-label">
                                    Password *
                                </label>
                                {formik.touched.password &&
                                    formik.errors.password && (
                                        <div className="text-danger text-sm">
                                            {formik.errors.password}
                                        </div>
                                    )}
                            </div>
                            <div>
                                <a
                                    href="#forgotPassword"
                                    data-bs-toggle="modal"
                                    className="btn-link link"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            {error && (
                                <span className="text-danger">{error}</span>
                            )}
                            <div className="bottom">
                                <div className="w-100">
                                    <button
                                        type="submit"
                                        className="tf-btn btn-fill animate-hover-btn radius-3 w-100"
                                    >
                                        <span>Log in</span>
                                    </button>
                                </div>
                                <div className="w-100">
                                    <a
                                        href="#register"
                                        data-bs-toggle="modal"
                                        className="btn-link fw-6 w-100 link"
                                    >
                                        New customer? Create your account
                                        <i className="icon icon-arrow1-top-left" />
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

