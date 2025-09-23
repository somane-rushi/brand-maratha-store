"use client"
import React, { useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
// import ReactQuill from 'react-quill';
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Page = () => {
    const [englishTitle, setEnglishTitle] = useState('');
    const [marathiTitle, setMarathiTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("English Title:", englishTitle);
        console.log("Marathi Title:", marathiTitle);
    };

    return (
        <>  
            <Header/>
            <div className='typ-flex-admin'>
                <Sidebar />
                <div className='typ-admin-dashbord'>
                    <div className="container">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <h5 className='typ-admin-heading'>English</h5>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">Disclaimer</label>
                                        <ReactQuill
                                            value={englishTitle}
                                            onChange={setEnglishTitle}
                                            placeholder="Enter Disclaimer *"
                                        />
                                    </fieldset>
                                </div>
                                <div className="col-lg-6">
                                    <h5 className='typ-admin-heading'>Marathi</h5>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title2">Disclaimer</label>
                                        <ReactQuill
                                            value={marathiTitle}
                                            onChange={setMarathiTitle}
                                            placeholder="Enter Disclaimer *"
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

export default Page;