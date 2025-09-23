"use client";
import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
// import Sidebar from '../admin/Sidebar'
// import Header from '../admin/Header'

const Page = () => {
    const [formData, setFormData] = useState({
        english: {
            title: "",
            subtitle: "",
            image: null,
        },
        marathi: {
            title: "",
            subtitle: "",
            image: null,
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
    };

    const handleChange = (lang, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [lang]: {
                ...prev[lang],
                [field]: value,
            },
        }));
    };

    return (
        <>
            <Header />
            <div className="typ-flex-admin">
                <Sidebar />
                <div className="typ-admin-dashbord">
                    <div className="container">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <h4 className="typ-admin-heading">
                                        Our Previous Editions
                                    </h4>
                                    <h5 className="typ-small-heading">
                                        English
                                    </h5>

                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title2">Title</label>
                                        <input
                                            type="text"
                                            name="title2"
                                            id="title2"
                                            required
                                            placeholder="Enter Title *"
                                            value={formData.english.title}
                                            onChange={(e) =>
                                                handleChange(
                                                    "english",
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">Subtitle</label>
                                        <textarea
                                            placeholder="Enter Subtitle"
                                            name="message"
                                            id="message"
                                            required
                                            cols={30}
                                            rows={10}
                                            value={formData.english.subtitle}
                                            onChange={(e) =>
                                                handleChange(
                                                    "english",
                                                    "subtitle",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="banner">
                                            Primary Image
                                        </label>
                                        <input
                                            type="file"
                                            name="banner"
                                            id="banner"
                                            required
                                            className="upload-image"
                                            onChange={(e) =>
                                                handleChange(
                                                    "english",
                                                    "image",
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                    </fieldset>

                                    <div className="col-lg-12">
                                        <div className="text-end">
                                            <button
                                                type="submit"
                                                className="tf-btn radius-3 btn-fill animate-hover-btn justify-content-end"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <h4 className="typ-admin-heading">
                                        Our Previous Editions
                                    </h4>
                                    <h5 className="typ-small-heading">
                                        Marathi
                                    </h5>

                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title2">Title</label>
                                        <input
                                            type="text"
                                            name="title2"
                                            id="title2"
                                            required
                                            placeholder="Enter Title *"
                                            value={formData.marathi.title}
                                            onChange={(e) =>
                                                handleChange(
                                                    "marathi",
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">Subtitle</label>
                                        <textarea
                                            placeholder="Enter Subtitle"
                                            name="message"
                                            id="message"
                                            required
                                            cols={30}
                                            rows={10}
                                            value={formData.marathi.subtitle}
                                            onChange={(e) =>
                                                handleChange(
                                                    "marathi",
                                                    "subtitle",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </fieldset>

                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="banner">
                                            Primary Image
                                        </label>
                                        <input
                                            type="file"
                                            name="banner"
                                            id="banner"
                                            required
                                            className="upload-image"
                                            onChange={(e) =>
                                                handleChange(
                                                    "marathi",
                                                    "image",
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                    </fieldset>

                                    <div className="col-lg-12">
                                        <div className="text-end">
                                            <button
                                                type="submit"
                                                className="tf-btn radius-3 btn-fill animate-hover-btn justify-content-end"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;

