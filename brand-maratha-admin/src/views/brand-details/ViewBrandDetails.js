// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from '../../config/axios.config';
// import { _branddetails_get, _branddetails_delete, _url_aboutusBanner_img } from '../../config/api.endpoints';
// import {
//     CCard, CCardBody, CCardHeader, CImage, CContainer, CRow, CCol,
//     CButton, CCollapse, CSpinner, CAlert
// } from '@coreui/react';
// import Modal from '../base/modal/Modal';
// import { handleApiError } from '../../utils/errorHelper';

// const ViewBlogs = () => {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const [blog, setBlog] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [visible, setVisible] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [deleteId, setDeleteId] = useState(null)

//     useEffect(() => {
//         if (error) {
//             const timer = setTimeout(() => {
//                 setError('');
//             }, 3000);

//             return () => clearTimeout(timer);
//         }
//     }, [error]);

//     useEffect(() => {
//         if (!id) {
//             setError("Invalid blog ID");
//             setLoading(false);
//             return;
//         }

//         (async () => {
//             setLoading(true);
//             setError('');

//             try {
//                 const result = await axiosInstance.get(`${_branddetails_get}/${id}`);
//                 setBlog(result.data);
//             } catch (err) {
//                 setError(handleApiError(err));
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, [id]);

//     const handleDelete = (id) => {
//         setDeleteId(id);
//         setOpenModal(true);
//     };

//     async function handleConfirmDelete() {
//         setLoading(true);
//         setError('');

//         try {
//             await axiosInstance.delete(`${_branddetails_delete}/${deleteId}`);
//             navigate("/brand-details");
//         } catch (err) {
//             setError(handleApiError(err));
//         } finally {
//             setOpenModal(false);
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <CSpinner color="primary" className="d-block mx-auto my-5" />;
//     };

//     return (
//         <CContainer fluid className="px-4 py-4">
//             <CRow className="justify-content-center">
//                 <CCol xs={12} lg={10}>
//                     <CCard className="shadow-lg border-0">
//                         {blog.banner_image && (
//                             <CImage
//                                 src={_url_aboutusBanner_img + blog.banner_image}
//                                 alt="Banner"
//                                 className="w-100 rounded-top"
//                                 style={{ maxHeight: '400px', objectFit: 'cover' }}
//                             />
//                         )}
//                         <CCardHeader className="bg-dark text-white text-center">
//                             <h2 className="mb-0">{blog.title}</h2>
//                             <h6 className="text-light">{blog.subtitle}</h6>
//                         </CCardHeader>
//                         <CCardBody className="p-4">
//                             <CRow className="align-items-center">
//                                 <CCol md={3} className="text-center">
//                                     {blog.thumbnail_image && (
//                                         <CImage
//                                             src={_url_aboutusBanner_img + blog.thumbnail_image}
//                                             alt="Thumbnail"
//                                             className="img-fluid rounded shadow-sm"
//                                         />
//                                     )}
//                                 </CCol>
//                                 <CCol md={9}>
//                                     <h5 className="mb-2">By: {blog.author}</h5>
//                                     <p className="text-muted mb-2">
//                                         <strong>Date:</strong>
//                                         {new Date(blog.date).toLocaleDateString("en-US", {
//                                             year: "numeric",
//                                             month: "short",
//                                             day: "numeric",
//                                         })}
//                                     </p>
//                                 </CCol>
//                             </CRow>
//                             <hr />
//                             <div className='d-flex justify-content-between'>
//                                 <CButton color="primary" className="mb-3" onClick={() => setVisible(!visible)}>
//                                     {visible ? 'Hide Content' : 'Show Content'}
//                                 </CButton>

//                                 <div>
//                                     <CButton
//                                         type="button"
//                                         color="success"
//                                         onClick={() => navigate(`/brand-details/update/${id}`)}
//                                     >
//                                         Edit
//                                     </CButton>
//                                     <CButton
//                                         style={{ marginLeft: '10px' }}
//                                         type="button"
//                                         color="danger"
//                                         onClick={() => handleDelete(blog.id)}
//                                     >
//                                         Delete
//                                     </CButton>
//                                 </div>
//                             </div>
//                             <CCollapse visible={visible}>
//                                 <div
//                                     className="p-3 bg-light rounded shadow-sm"
//                                     style={{ maxHeight: '500px', overflowY: 'auto' }}
//                                 >
//                                     <p dangerouslySetInnerHTML={{ __html: blog.content }} />
//                                 </div>
//                             </CCollapse>
//                         </CCardBody>
//                     </CCard>
//                 </CCol>
//                 <div className='mt-4'>
//                     {error && <CAlert color="danger">{error}</CAlert>}
//                 </div>
//             </CRow>
//             <Modal
//                 visible={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onConfirm={handleConfirmDelete}
//                 title="Confirm Delete"
//                 message="Are you sure you want to delete this banner?"
//             />
//         </CContainer >
//     );
// };

// export default ViewBlogs;



import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../config/axios.config';
import { _branddetails_delete, _branddetails_get, _url, _url_aboutusBanner_img } from '../../config/api.endpoints';
import {
    CCard, CCardBody, CImage, CContainer, CRow, CCol,
    CButton, CSpinner, CAlert
} from '@coreui/react';
import Modal from '../base/modal/Modal';
import { handleApiError } from '../../utils/errorHelper';

const ViewBlogs = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (!id) {
            setError("Invalid blog ID");
            setLoading(false);
            return;
        }

        (async () => {
            setLoading(true);
            setError('');

            try {
                const result = await axiosInstance.get(`${_branddetails_get}/${id}`);
                setBlog(result.data);
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenModal(true);
    };

    async function handleConfirmDelete() {
        try {
            await axiosInstance.delete(`${_branddetails_delete}/${deleteId}`);
            navigate("/brand-details");
        } catch (err) {
            setError(err?.response?.data?.message || err.message || err?.response?.data?.error);
        } finally {
            setOpenModal(false);
        }
    }

    if (loading) {
        return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    }

    if (error) {
        return <CAlert color="danger" className="text-center my-4">{error}</CAlert>;
    }

    return (
        <CContainer fluid className="px-4 py-4">
            <CRow className="justify-content-center">
                <CCol xs={12} lg={10}>
                    <CCard className="shadow-lg border-0">
                        <div className="relative w-full h-[512px] overflow-hidden" style={{ position: 'relative', top: 0, left: 0 }}>
                            <img
                                src={_url_aboutusBanner_img + blog.banner_image}
                                alt="Twamev Banner"
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>

                            <div className="flex items-center px-6 lg:px-12"
                                style={{
                                    position: "absolute",
                                    top: '50%',
                                    left: '70px',
                                    transform: 'translateY(-50%)',
                                }}>
                                <div className="max-w-xl text-white space-y-4">
                                    <img
                                        src={_url + blog.brand_image}
                                        alt="brand Logo"
                                        width={150}
                                        height='auto'
                                        style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))' }}
                                    />

                                    <h2 className="text-3xl lg:text-4xl font-semibold leading-tight">{blog.title}</h2>
                                    <p className="text-md lg:text-lg">{blog.subtitle}</p>
                                </div>
                            </div>
                        </div>

                        <CCardBody className="p-4">
                            <CRow className="align-items-center mb-3">
                                <CCol md={3} className="text-center">
                                    {blog.thumbnail_image && (
                                        <CImage
                                            src={_url_aboutusBanner_img + blog.thumbnail_image}
                                            alt="Thumbnail"
                                            className="img-fluid rounded shadow-sm"
                                        />
                                    )}
                                </CCol>
                                <CCol md={9}>
                                    <h5 className="mb-2">By: {blog.author}</h5>
                                    <p className="text-muted mb-0">
                                        <strong>Date: </strong>
                                        {new Date(blog.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                </CCol>
                            </CRow>

                            <hr />

                            <div
                                className="blog-content p-3 bg-light rounded shadow-sm"
                                style={{
                                    wordBreak: 'break-word',
                                    whiteSpace: 'normal',
                                }}
                            >
                                <div
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <CButton
                                    type="button"
                                    color="success"
                                    // onClick={() => navigate(`/base/blog/update/${id}`)}
                                    onClick={() => navigate(`/brand-details/update/${id}`)}
                                >
                                    Edit
                                </CButton>
                                <CButton
                                    type="button"
                                    color="danger"
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => handleDelete(blog.id)}
                                >
                                    Delete
                                </CButton>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <Modal
                visible={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this blog?"
            />
        </CContainer>
    );
};

export default ViewBlogs;
