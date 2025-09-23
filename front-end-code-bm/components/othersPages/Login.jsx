"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleLoginService, requestOtp, resetPassword } from "@/utlis/apiService";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  // Formik for Login
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
        .min(4, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("🚀 Submitting:", values);
      try {

        const result = await handleLoginService(values);
        console.log("✅ Login API Response:", result);
        const { status, data } = result || {};

        if (status === 200) {
          const { id } = await jwtDecode(data.token);
          localStorage.setItem("token", data.token);
          localStorage.setItem("id", id);
          router.push("/");
        }
      } catch (err) {
        console.error("❌ Login Error:", err);
        const { data } = err.response || {};
        setError(data?.error || data?.message || err?.message);
      } finally {
        resetForm();
      }
    },
  });

  // Handle OTP Request
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    const data = await requestOtp(mobile);

    if (data.error) {
      setResetError(data.error);
    } else {
      setOtpSent(true);
      setResetSuccess("OTP sent successfully! Check your phone.");
    }
  };

  // Handle OTP Verification & Show Password Fields
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    // Simulating OTP verification (since OTP is verified in resetPassword API)
    setOtpVerified(true);
    setResetSuccess("OTP verified! Set your new password.");
  };

  // Handle Password Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match!");
      return;
    }

    const data = await resetPassword(mobile, otp, newPassword);

    if (data.error) {
      setResetError(data.error);
    } else {
      setResetSuccess("Password reset successfully! You can now log in.");

      // Reset Fields
      setMobile("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setOtpSent(false);
      setOtpVerified(false);
      setShowResetForm(false);
    }
  };

  return (
    <section className="flat-spacing-10">
      <div className="container">
        <div className="tf-grid-layout lg-col-2 tf-login-wrap">
          <div className="tf-login-form">
            {showResetForm ? (
              // Reset Password Form
              <div id="reset-password">
                <h5 className="mb_24">Reset your password</h5>
                <p className="mb_30">Enter your mobile number to receive OTP.</p>
                <form onSubmit={!otpSent ? handleRequestOtp : otpVerified ? handleResetPassword : handleVerifyOtp}>

                  {/* Mobile Number Input */}
                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      placeholder="Mobile Number *"
                      type="text"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      disabled={otpSent}
                    />
                    <label className="tf-field-label" htmlFor="">
                      Mobile *
                    </label>
                  </div>

                  {/* OTP Input (Only visible after sending OTP) */}
                  {otpSent && !otpVerified && (
                    <div className="tf-field style-1 mb_15">
                      <input
                        className="tf-field-input tf-input"
                        placeholder="Enter OTP *"
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <label className="tf-field-label" htmlFor="">
                        OTP *
                      </label>
                    </div>
                  )}

                  {/* New Password & Confirm Password (Only visible after OTP verification) */}
                  {otpVerified && (
                    <>
                      <div className="tf-field style-1 mb_15">
                        <input
                          className="tf-field-input tf-input"
                          placeholder="New Password *"
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <label className="tf-field-label" htmlFor="">
                          New Password *
                        </label>
                      </div>
                      <div className="tf-field style-1 mb_15">
                        <input
                          className="tf-field-input tf-input"
                          placeholder="Confirm New Password *"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label className="tf-field-label" htmlFor="">
                          Confirm New Password *
                        </label>
                      </div>
                    </>
                  )}

                  {resetError && <p className="text-danger">{resetError}</p>}
                  {resetSuccess && <p className="text-success">{resetSuccess}</p>}

                  <div className="mb_20">
                    <button
                      type="button"
                      className="tf-btn btn-line line-height-normal"
                      onClick={() => setShowResetForm(false)}
                    >
                      Back to Login
                    </button>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                    >
                      {!otpSent ? "Send OTP" : otpVerified ? "Reset Password" : "Verify OTP"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // Login Form
              <div id="login">
                <h5 className="mb_36">Log in</h5>
                <form onSubmit={formik.handleSubmit}>
                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="email"
                      name="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    <label className="tf-field-label" htmlFor="">
                      Email *
                    </label>
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-danger">{formik.errors.email}</div>
                    )}
                  </div>
                  <div className="tf-field style-1 mb_30">
                    <input
                      className="tf-field-input tf-input"
                      placeholder="Password *"
                      type="password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    <label className="tf-field-label" htmlFor="">
                      Password *
                    </label>
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-danger">{formik.errors.password}</div>
                    )}
                  </div>
                  <div className="mb_20">
                    <button
                      type="button"
                      className="tf-btn btn-line line-height-normal"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot your password?
                    </button>
                  </div>
                  {error && <span className="text-danger">{error}</span>}
                  <div>
                    <button
                      type="submit" // ✅ This will trigger Formik's handleSubmit
                      className="tf-btn w-100 radius-3 btn-fill animate-hover-btn"
                      onClick={() => console.log("Login button clicked")}
                    >
                      Log in
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="tf-login-content">
            <h5 className="mb_36">I'm new here</h5>
            <p className="mb_20">
              Sign up for early Sale access plus tailored new arrivals, trends and promotions.
            </p>
            <Link href={`/register`} className="tf-btn btn-line line-height-normal">
              Register
              <i className="icon icon-arrow1-top-left" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
