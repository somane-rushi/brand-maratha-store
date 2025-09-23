"use client";
import React, { useState, useEffect } from "react";
import { editAccountDetails, changePassword } from "@/utlis/apiService"; // Import functions
import API_BASE_URL from "@/utlis/apiService";
export default function AccountEdit() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [success, setSuccess] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    useEffect(() => {
        // Fetch user details from API when component mounts
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${API_BASE_URL}/auth/user?id=${localStorage.getItem(
                        "id"
                    )}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const data = await response.json();
                setFormData({
                    first_name: data.name || "",
                    email: data.email || "",
                });
            } catch (error) {
                console.error("Error fetching user details:", error);
                setError("Failed to load user details.");
            }
        };

        fetchUserDetails();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                name: `${formData.first_name} ${formData.last_name}`,
                email: formData.email,
            };

            await editAccountDetails(payload);
            setSuccess("Account details updated successfully!");
        } catch (error) {
            setError(
                error.response?.data?.error ||
                    "Failed to update account details."
            );
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccess("");
                setError("");
            }, 3000);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError("");
        setPasswordSuccess("");

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError("New password and confirm password must match.");
            setPasswordLoading(false);
            return;
        }

        try {
            await changePassword(passwordData);
            setPasswordSuccess("Password changed successfully!");
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        } catch (error) {
            setPasswordError(
                error.response?.data?.error || "Failed to change password."
            );
        } finally {
            setPasswordLoading(false);
            setTimeout(() => {
                setPasswordSuccess("");
                setPasswordError("");
            }, 3000);
            
        }
    };

    return (
        <div className="my-account-content account-edit">
            <div>
                {/* Update Account Details Form */}
                <form onSubmit={handleSubmit} className="wd-form">
                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>}

                    <div className="tf-field style-1 mb_15">
                        <input
                            className="tf-field-input tf-input"
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                        <label
                            className="tf-field-label fw-4 text_black-2"
                            htmlFor="first_name"
                        >
                            First name <span style={{ color: "red" }}>*</span>
                        </label>
                    </div>
                    <div className="tf-field style-1 mb_15">
                        <input
                            className="tf-field-input tf-input"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled
                            required
                        />
                        <label
                            className="tf-field-label fw-4 text_black-2"
                            htmlFor="email"
                        >
                            Email <span style={{ color: "red" }}>*</span>
                        </label>
                    </div>

                    <div className="mb_20">
                        <button
                            type="submit"
                            className="tf-btn w-100 radius-3 btn-fill"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>

                {/* Change Password Form */}
                <h6 className="mb_20">Change Password</h6>
                <form onSubmit={handlePasswordSubmit} className="wd-form">
                    {passwordError && (
                        <p className="text-danger">{passwordError}</p>
                    )}
                    {passwordSuccess && (
                        <p className="text-success">{passwordSuccess}</p>
                    )}

                    <div className="tf-field style-1 mb_30">
                        <input
                            className="tf-field-input tf-input"
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            autoComplete="current-password"
                            required
                        />
                        <label
                            className="tf-field-label fw-4 text_black-2"
                            htmlFor="oldPassword"
                        >
                            Current password <span style={{ color: "red" }}>*</span>
                        </label>
                    </div>

                    <div className="tf-field style-1 mb_30">
                        <input
                            className="tf-field-input tf-input"
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            autoComplete="new-password"
                            required
                        />
                        <label
                            className="tf-field-label fw-4 text_black-2"
                            htmlFor="newPassword"
                        >
                            New password <span style={{ color: "red" }}>*</span>
                        </label>
                    </div>

                    <div className="tf-field style-1 mb_30">
                        <input
                            className="tf-field-input tf-input"
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            value={passwordData.confirmNewPassword}
                            onChange={handlePasswordChange}
                            autoComplete="new-password"
                            required
                        />
                        <label
                            className="tf-field-label fw-4 text_black-2"
                            htmlFor="confirmNewPassword"
                        >
                            Confirm password <span style={{ color: "red" }}>*</span>
                        </label>
                    </div>

                    <div className="mb_20">
                        <button
                            type="submit"
                            className="tf-btn w-100 radius-3 btn-fill"
                            disabled={passwordLoading}
                        >
                            {passwordLoading
                                ? "Changing..."
                                : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

