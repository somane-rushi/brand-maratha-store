import React from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
// import Sidebar from '../admin/Sidebar'
// import Header from '../admin/Header'

const page = () => {
    return (
        <>  
            <Header/>
            <div className='typ-flex-admin'>
                <Sidebar />
                <div className='typ-admin-dashbord'>
                    <div className="container">
                        <form action="">
                            <div className="row">
                                <div className="col-lg-6">
                                    <h5 className='typ-admin-heading'>English</h5>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="title">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            required
                                            placeholder="Enter Title *"
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
                                        <label htmlFor="subtitle">Subtitle</label>
                                        <input
                                            type="text"
                                            name="subtitle"
                                            id="subtitle"
                                            required
                                            placeholder="Enter Subtitle *"
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="link">Link</label>
                                        <input
                                            type="text"
                                            name="link"
                                            id="link"
                                            required
                                            placeholder="Enter Link *"
                                        />
                                    </fieldset>
                                </div>
                                <div className="col-lg-6">
                                <h5 className='typ-admin-heading'>Marathi</h5>
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
                                        <label htmlFor="banner2">Banner Image</label>
                                        <input
                                            type="file"
                                            name="banner2"
                                            id="banner2"
                                            required
                                            className='upload-image'
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="subtitle2">Subtitle</label>
                                        <input
                                            type="text"
                                            name="subtitle2"
                                            id="subtitle2"
                                            required
                                            placeholder="Enter Subtitle *"
                                        />
                                    </fieldset>
                                    <fieldset className="w-100 typ-mb-20">
                                        <label htmlFor="link2">Link</label>
                                        <input
                                            type="text"
                                            name="link2"
                                            id="link2"
                                            required
                                            placeholder="Enter Link *"
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
    )
}

export default page