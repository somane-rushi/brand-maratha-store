"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleRegistereService } from "@/utlis/apiService";
import { useRouter } from 'next/navigation'
import { AxiosError } from "axios";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobile: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "Must be at least 3 characters")
        .max(50, "Must be less than 50 characters")
        .required("First name is required"),
      lastName: Yup.string()
        .min(3, "Must be at least 3 characters")
        .max(50, "Must be less than 50 characters")
        .required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/\d/, "Must contain at least one number")
        .matches(/[!@#$%^&*]/, "Must contain at least one special character")
        .required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const { firstName, lastName } = values;

      const credentials = {
        ...values,
        name: `${firstName} ${lastName}`
      };

      delete credentials.firstName;
      delete credentials.lastName;

      try {
        const result = await handleRegistereService(credentials)

        const { status, data } = result || {};

        if (status === 201) {
          router.push("/login")
        };
      } catch (err) {
        const { data } = err.response || {};
        setError(data?.error || data?.message || err?.message);
      } finally {
        resetForm();
      }
    },
  });

  return (
    <section className="flat-spacing-10">
      <div className="container">
        <div className="form-register-wrap">
          <div className="flat-title align-items-start gap-0 mb_30 px-0">
            <h5 className="mb_18">Register</h5>
            <p className="text_black-2">
              Sign up for early Sale access plus tailored new arrivals, trends
              and promotions. To opt out, click unsubscribe in our emails
            </p>
          </div>
          <div>
            <form
              onSubmit={formik.handleSubmit}
              className=""
              id="register-form"
              action="#"
              method="post"
              acceptCharset="utf-8"
              data-mailchimp="true"
            >
              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="property1"
                  name="firstName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                // required
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="property1"
                >
                  First name
                </label>

                {formik.touched.firstName && formik.errors.firstName &&
                  (
                    <div className="text-danger text-sm">{formik.errors.firstName}</div>
                  )
                }
              </div>

              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="property2"
                  name="lastName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                // required
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="property2"
                >
                  Last name
                </label>
                {formik.touched.lastName && formik.errors.lastName &&
                  (
                    <div className="text-danger text-sm">{formik.errors.lastName}</div>
                  )
                }
              </div>

              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="property5"
                  name="mobile"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mobile}
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="property5"
                >
                  Mobile Number *
                </label>
                {formik.touched.mobile && formik.errors.mobile && (
                  <div className="text-danger text-sm">{formik.errors.mobile}</div>
                )}
              </div>


              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  autoComplete="abc@xyz.com"
                  id="property3"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                // required
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="property3"
                >
                  Email *
                </label>
                {formik.touched.email && formik.errors.email &&
                  (
                    <div className="text-danger text-sm">{formik.errors.email}</div>
                  )
                }
              </div>

              <div className="tf-field style-1 mb_30">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="password"
                  id="property4"
                  name="password"
                  autoComplete="current-password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                // required
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="property4"
                >
                  Password *
                </label>
                {formik.touched.password && formik.errors.password &&
                  (
                    <div className="text-danger text-sm">{formik.errors.password}</div>
                  )
                }
              </div>
              {error && <span className="text-danger">{error}</span>}
              <div className="mb_20">
                <button
                  type="submit"
                  className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                >
                  Register
                </button>
              </div>
              <div className="text-center">
                <Link href={`/login`} className="tf-btn btn-line line-height-normal">
                  Already have an account? Log in here
                  <i className="icon icon-arrow1-top-left" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
