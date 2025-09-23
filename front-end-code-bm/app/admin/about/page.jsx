import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
// import Sidebar from '../admin/Sidebar'
// import Header from '../admin/Header'

const page = () => {
    return (
        <>
            <Header />
            <div className="typ-flex-admin">
                <Sidebar />
                <div className="typ-admin-dashbord">
                    <div className="container">
                        <form action="">
                            <div className="row">
                                <div className="col-lg-6">
                                    <h5 className="typ-admin-heading">
                                        English
                                    </h5>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">
                                            Description
                                        </label>
                                        <textarea
                                            placeholder="Enter Description"
                                            name="message"
                                            id="message"
                                            required
                                            cols={30}
                                            rows={10}
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
                                        />z
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="banner">
                                            Secondary Image
                                        </label>
                                        <input
                                            type="file"
                                            name="banner"
                                            id="banner"
                                            required
                                            className="upload-image"
                                        />
                                    </fieldset>
                                    <h4 className="typ-small-heading">
                                        Who We Are
                                    </h4>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title2">Title</label>
                                        <input
                                            type="text"
                                            name="title2"
                                            id="title2"
                                            required
                                            placeholder="Enter Title *"
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
                                        />
                                    </fieldset>
                                    <h4 className="typ-small-heading">
                                        Journey
                                    </h4>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">Subtitle</label>
                                        <textarea
                                            placeholder="Enter Journey"
                                            name="message"
                                            id="message"
                                            required
                                            cols={30}
                                            rows={10}
                                        />
                                    </fieldset>
                                </div>
                                <div className="col-lg-6">
                                    <h5 className="typ-admin-heading">
                                        Marathi
                                    </h5>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">
                                            Description
                                        </label>
                                        <textarea
                                            placeholder="Enter Description"
                                            name="message"
                                            id="message"
                                            required
                                            cols={30}
                                            rows={10}
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
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="banner">
                                            Secondary Image
                                        </label>
                                        <input
                                            type="file"
                                            name="banner"
                                            id="banner"
                                            required
                                            className="upload-image"
                                        />
                                    </fieldset>
                                    <h4 className="typ-small-heading">
                                        Who We Are
                                    </h4>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title2">Title</label>
                                        <input
                                            type="text"
                                            name="title2"
                                            id="title2"
                                            required
                                            placeholder="Enter Title *"
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
                                        />
                                    </fieldset>
                                    <h4 className="typ-small-heading">
                                        Journey
                                    </h4>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">Subtitle</label>
                                        <textarea
                                            placeholder="Enter Journey"
                                            name="message"
                                            id="message"
                                            required
                                            cols={30}
                                            rows={10}
                                        />
                                    </fieldset>
                                </div>
                                <div className="col-lg-12">
                                    <div className="send-wrap">
                                        <button
                                            type="submit"
                                            className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                                        >
                                            Submit
                                        </button>
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

export default page;
