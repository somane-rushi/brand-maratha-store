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
      //delete credentials.mobile;

      try {
        const result = await handleRegistereService(credentials)

        const { status, data } = result || {};

        if (status === 201) {
          router.push("/login");
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
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Register</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <form onSubmit={formik.handleSubmit} className="">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  name="firstName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
                <label className="tf-field-label" htmlFor="">
                  First name
                </label>
                {formik.touched.firstName && formik.errors.firstName &&
                  (
                    <div className="text-danger text-sm">{formik.errors.firstName}</div>
                  )
                }
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  name="lastName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
                <label className="tf-field-label" htmlFor="">
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
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  autoComplete="abc@xyz.com"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <label className="tf-field-label" htmlFor="">
                  Email *
                </label>
                {formik.touched.email && formik.errors.email &&
                  (
                    <div className="text-danger text-sm">{formik.errors.email}</div>
                  )
                }
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
                <label className="tf-field-label" htmlFor="">
                  Password *
                </label>
                {formik.touched.password && formik.errors.password &&
                  (
                    <div className="text-danger text-sm">{formik.errors.password}</div>
                  )
                }
              </div>
              {error && <span className="text-danger">{error}</span>}
              <div className="bottom">
                <div className="w-100">
                  {/* <Link
                    href={`/register`}
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  >
                    <span>Register</span>
                  </Link> */}
                  <button
                    type="submit"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  >
                    <span>Register</span>
                  </button>
                </div>
                <div className="w-100">
                  <a
                    href="#login"
                    data-bs-toggle="modal"
                    className="btn-link fw-6 w-100 link"
                  >
                    Already have an account? Log in here
                    <i className="icon icon-arrow1-top-left" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
