import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../config/axios.config';
import { _blogs_delete, _blogs_get } from '../../config/api.endpoints';
import {
    CCard, CCardBody, CCardHeader, CImage, CContainer, CRow, CCol,
    CButton, CSpinner, CAlert
} from '@coreui/react';
import LZString from 'lz-string';
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
    // let decompressedContent;

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
            try {
                const { data } = await axiosInstance.get(`${_blogs_get}/${id}`);
                // const decompressedContent = LZString.decompressFromUTF16(data.content);

                // setBlog({ ...data, content: decompressedContent });
                setBlog(data);
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    useEffect(() => {
        console.log("view blog content", blog);
    }, [blog]);

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenModal(true);
    };

    async function handleConfirmDelete() {
        try {
            await axiosInstance.delete(`${_blogs_delete}/${deleteId}`);
            navigate("/base/blogs");
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
                        <CCardHeader className="bg-dark text-white text-center">
                            <h2 className="mb-0">{blog.title}</h2>
                            <h6 className="text-light">{blog.subtitle}</h6>
                        </CCardHeader>
                        <CImage
                            src={blog.banner_image || ''}
                            alt="Thumbnail"
                            className="img-fluid rounded shadow-sm"
                        />
                        <CCardBody className="p-4">
                            <CRow className="align-items-center mb-3">
                                <CCol md={3} className="text-center">
                                    {blog.thumbnail_image && (
                                        <CImage
                                            src={blog.thumbnail_image}
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
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: 10, }}>
                                    <h6>Meta Title : </h6>
                                    <span>{blog?.metatitle || 'NA'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 10, }}>
                                    <h6>Meta Description : </h6>
                                    <span>{blog?.metadescription || 'NA'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 10, }}>
                                    <h6>Meta Keyword : </h6>
                                    <span>{blog.metakeyword || 'NA'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 10, }}>
                                    <h6>Thumbnail Content : </h6>
                                    <span>{blog.thumbnail_content || 'NA'}</span>
                                </div>
                            </div>
                            <hr />
                            <div
                                className="blog-content p-3 bg-light rounded shadow-sm"
                                style={{
                                    wordBreak: 'break-word',
                                    whiteSpace: 'normal',
                                }}
                            >
                                <div className="desc typ-18 prose prose-lg"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <CButton
                                    type="button"
                                    color="success"
                                    onClick={() => navigate(`/base/blog/update/${id}`)}
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
