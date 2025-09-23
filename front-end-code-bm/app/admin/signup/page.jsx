import React from "react";
import Header from "../Header";

const page = () => {
    return (
        <>
            <Header />
            <section className="login-section">
                <div className="container">
                    <div className="typ-login-form">
                        <div className="row">
                            <div className="col-lg-12">
                                <form action="">
                                    <h5 className="typ-admin-heading typ-mb-20">
                                        Sign Up
                                    </h5>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">Full Name</label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            required
                                            placeholder="Enter Full Name *"
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">Email</label>
                                        <input
                                            type="email"
                                            name="title"
                                            id="title"
                                            required
                                            placeholder="Enter Email *"
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">Password</label>
                                        <input
                                            type="password"
                                            name="title"
                                            id="title"
                                            required
                                            placeholder="Enter Password *"
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">
                                            Choose Role
                                        </label>
                                        <select
                                            className="tf-select w-100"
                                            tabIndex="null"
                                        >
                                            <option value="">Admin</option>
                                            <option value="">User</option>
                                        </select>
                                    </fieldset>
                                    <button
                                        type="submit"
                                        className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                                    >
                                        Login
                                    </button>
                                    <div className="typ-footer-form">
                                        Already Have an Account ?{" "}
                                        <a href="/admin/login"> Login Now</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default page;

