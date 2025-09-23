"use client";
import React, { useState } from "react";
import { requestOtp, resetPassword } from "@/utlis/apiService"; // Import API functions

export default function ResetPass() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Function to handle OTP request
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const data = await requestOtp(mobile); // Call API service function

    if (data.error) {
      setErrorMessage(data.error);
    } else {
      setOtpSent(true);
      setSuccessMessage(data.message);
    }
  };

  // Function to handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const data = await resetPassword(mobile, otp, newPassword); // Call API service function

    if (data.error) {
      setErrorMessage(data.error);
    } else {
      setSuccessMessage(data.message);

      // Reset form fields after successful password reset
      setMobile("");
      setOtp("");
      setNewPassword("");
      setOtpSent(false); // Reset OTP sent state
    }
  };

  return (
    <div className="modal modalCentered fade form-sign-in modal-part-content" id="forgotPassword">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Reset your password</div>
            <span className="icon-close icon-close-popup" data-bs-dismiss="modal" />
          </div>
          <div className="tf-login-form">
            <form onSubmit={otpSent ? handleResetPassword : handleRequestOtp}>
              <div>
                <p>
                  Sign up for early Sale access plus tailored new arrivals, trends, and promotions.
                  To opt out, click unsubscribe in our emails.
                </p>
              </div>

              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                <label className="tf-field-label" htmlFor="">
                  Mobile Number *
                </label>
              </div>

              {otpSent && (
                <>
                  <div className="tf-field style-1">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <label className="tf-field-label" htmlFor="">
                      OTP *
                    </label>
                  </div>
                  <div className="tf-field style-1">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label className="tf-field-label" htmlFor="">
                      New Password *
                    </label>
                  </div>
                </>
              )}

              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              {successMessage && <p className="text-success">{successMessage}</p>}

              <div>
                <a href="#login" data-bs-toggle="modal" className="btn-link link">
                  Cancel
                </a>
              </div>
              <div className="bottom">
                <div className="w-100">
                  <button
                    type="submit"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  >
                    <span>{otpSent ? "Reset Password" : "Send OTP"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
