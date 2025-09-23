"use client"
import React,{useState} from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
// import ReactQuill from 'react-quill'
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const page = () => {
    const [englishTitle, setEnglishTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("English Title:", englishTitle);
    };
    return (
        <>
            <Header />
            <div className='typ-flex-admin'>
                <Sidebar />
                <div className='typ-admin-dashbord'>
                    <div className="container">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-12">
                                    {/* <h5 className='typ-admin-heading'>English</h5> */}
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
                                            defaultValue={""}
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title2">Author</label>
                                        <input
                                            type="text"
                                            name="title2"
                                            id="title2"
                                            required
                                            placeholder="Enter Author Name *"
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title2">Category</label>
                                        <input
                                            type="text"
                                            name="title2"
                                            id="title2"
                                            required
                                            placeholder="Enter Category *"
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="banner">Banner Image</label>
                                        <input
                                            type="file"
                                            name="banner"
                                            id="banner"
                                            required
                                            className='upload-image'
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="banner">Thumbnail Image</label>
                                        <input
                                            type="file"
                                            name="banner"
                                            id="banner"
                                            required
                                            className='upload-image'
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title2">Disclaimer</label>
                                        <ReactQuill
                                            value={englishTitle}
                                            onChange={setEnglishTitle}
                                            placeholder="Enter Disclaimer *"
                                        />
                                    </fieldset>
                                </div>
                                <div className="col-lg-12">
                                    <div className="text-end">
                                        <button
                                            type="submit"
                                            className="tf-btn radius-3 btn-fill animate-hover-btn justify-content-center"
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
    )
}

export default page