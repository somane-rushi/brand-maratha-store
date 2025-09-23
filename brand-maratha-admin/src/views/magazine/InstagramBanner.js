import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config';
import {
    _magazineinstagram_get,
    _magazineinstagram_create,
    _magazineinstagram_update,
    _magazineinstagram_delete
} from '../../config/api.endpoints';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CModal, CModalBody, CModalHeader, CRow, CSpinner } from '@coreui/react';
import Modal from '../base/modal/Modal';
import Table from '../base/tables/MagazineInstagramTable';
import { Formik } from 'formik';
import * as yup from "yup";
import { handleApiError } from '../../utils/errorHelper';

const validationSchema = yup.object().shape({
    video: yup
        .mixed()
        .required("Video is required")
        .test("is-valid-video", "Invalid video input", function (value) {
            const isBrowser = typeof window !== "undefined";
            const isFile = isBrowser && value instanceof File;

            if (!isFile) {
                return this.createError({
                    message: "Please upload a valid video file",
                });
            }

            const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
            if (!allowedTypes.includes(value.type)) {
                return this.createError({
                    message: "Only MP4, MOV, AVI formats are allowed",
                });
            }

            if (value.size > 20 * 1024 * 1024) {
                return this.createError({
                    message: "File exceeds 20MB limit",
                });
            }

            return true;
        }),
});

const updateValidationSchema = yup.object().shape({
    video: yup
        .mixed()
        .required("Video is required")
        .test("is-valid-video", "Invalid video input", function (value) {
            const isBrowser = typeof window !== "undefined";
            const isFile = isBrowser && value instanceof File;

            if (!isFile) {
                return this.createError({
                    message: "Please upload a valid video file",
                });
            }

            const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
            if (!allowedTypes.includes(value.type)) {
                return this.createError({
                    message: "Only MP4, MOV, AVI formats are allowed",
                });
            }

            if (value.size > 20 * 1024 * 1024) {
                return this.createError({
                    message: "File exceeds 20MB limit",
                });
            }

            return true;
        }),
});

const InstagramBanner = () => {
    const [banners, setBanners] = useState([]);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [activeFrom, setActiveForm] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const [videoModal, setVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [preview, setPreview] = useState({
        image: updateFormData.thumbnail || '',
        video: updateFormData.video || '',
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    useEffect(() => {
        const { thumbnail, video } = updateFormData;
        if (thumbnail || video) {
            setPreview({ image: thumbnail, video });
        }
    }, [updateFormData]);

    const fetchBanners = async () => {
        setIsLoading(true);
        setError('');
        try {
            const { data } = await axiosInstance.get(_magazineinstagram_get);
            setBanners(data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        setError('');
        setMessage('');
        const formData = new FormData();

        if (values.video) {
            formData.append('video', values.video);
        }

        try {
            const { data } = await axiosInstance.post(_magazineinstagram_create, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage(data?.message);
            fetchBanners();
            if (fileInputRef.current) fileInputRef.current.value = '';
            setShowForm(false);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (values, { resetForm }) => {
        setIsLoading(true);
        setMessage('');
        setError('');

        if (!updateFormData.id) {
            setMessage('Please select a banner first.');
            return;
        }

        const formData = new FormData();
        if (values.video instanceof File) {
            formData.append('video', values.video);
        }

        try {
            await axiosInstance.put(`${_magazineinstagram_update}/${updateFormData.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage('Banner updated successfully!');
            fetchBanners();
            if (fileInputRef.current) fileInputRef.current.value = '';
            setUpdateFormData({});
            setPreview({ video: '' });
            setShowForm(false);
            resetForm();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        setError('');
        try {
            await axiosInstance.delete(`${_magazineinstagram_delete}/${deleteId}`);
            fetchBanners();
            setActiveForm(false);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setOpenModal(false);
            setDeleteId(null);
            setIsLoading(false);
        }
    };

    const handleActiveForm = () => {
        setShowForm(!showForm);
        setActiveForm(false);
    };

    const openVideoModal = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setVideoModal(true);
    };

    if (isLoading) return <CSpinner color="primary" />;

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{!activeFrom ? 'Add' : 'Update'}</strong> <small>banner</small>
                        </div>
                        {/* {banners.length < 2 || (showForm && !activeFrom) ? (
                            <CButton
                                type="button"
                                color="primary"
                                value={showForm ? 'Close' : 'Add'}
                                onClick={handleActiveForm}
                            >
                                {showForm ? 'Close' : 'Add'}
                            </CButton>
                        ) : null}*/}
                        {(banners.length < 2 || (showForm && activeFrom)) && (
                            <CButton
                                type="button"
                                color="primary"
                                onClick={handleActiveForm}
                            >
                                {showForm && activeFrom ? 'Close' : 'Add'}
                            </CButton>
                        )}
                    </CCardHeader>
                    {showForm && (
                        <CCardBody className="row g-3">
                            {!activeFrom && banners.length < 2 ? (
                                <Formik
                                    initialValues={{ video: null }}
                                    enableReinitialize
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ setFieldValue, handleSubmit, errors, touched }) => (
                                        <CForm className="row g-3" onSubmit={handleSubmit}>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="video">
                                                    Video <span className="text-danger">*</span>
                                                </CFormLabel>
                                                <div className="d-flex align-items-center gap-3">
                                                    <CFormInput
                                                        type="file"
                                                        accept="video/*"
                                                        name="video"
                                                        onChange={(e) => setFieldValue('video', e.target.files[0])}
                                                        ref={fileInputRef}
                                                    />
                                                    <CButton color="primary" type="submit">
                                                        Submit
                                                    </CButton>
                                                </div>
                                                {errors.video && touched.video && (
                                                    <CFormFeedback className="text-danger small d-block mt-1">
                                                        {errors.video}
                                                    </CFormFeedback>
                                                )}
                                            </CCol>
                                        </CForm>
                                    )}
                                </Formik>
                            ) : (
                                <Formik
                                    initialValues={{ video: updateFormData.video || null }}
                                    enableReinitialize
                                    validationSchema={updateValidationSchema}
                                    onSubmit={handleUpdate}
                                >
                                    {({ setFieldValue, handleSubmit, errors, touched }) => (
                                        <CForm className="row g-3" onSubmit={handleSubmit}>
                                            <CCol xs={7}>
                                                <CFormLabel htmlFor="video">
                                                    Video <span className="text-danger">*</span>
                                                </CFormLabel>
                                                <div className="d-flex align-items-center gap-3">
                                                    <CFormInput
                                                        type="file"
                                                        accept="video/*"
                                                        name="video"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                setFieldValue('video', file);
                                                                setPreview((prev) => ({
                                                                    ...prev,
                                                                    video: URL.createObjectURL(file),
                                                                }));
                                                            }
                                                        }}
                                                        ref={fileInputRef}
                                                    />
                                                    {preview.video && (
                                                        <CButton
                                                            color="primary"
                                                            size="md"
                                                            type="button"
                                                            onClick={() => openVideoModal(preview.video)}
                                                        >
                                                            Preview
                                                        </CButton>
                                                    )}
                                                    <CButton color="primary" type="submit">
                                                        Update
                                                    </CButton>
                                                </div>

                                                {errors.video && touched.video && (
                                                    <CFormFeedback className="text-danger small d-block mt-1">
                                                        {errors.video}
                                                    </CFormFeedback>
                                                )}
                                            </CCol>
                                        </CForm>
                                    )}
                                </Formik>
                            )}
                        </CCardBody>
                    )}
                </CCard>

                <div className="mt-4">
                    {message && <CAlert color="primary">{message}</CAlert>}
                    {error && <CAlert color="danger">{error}</CAlert>}
                </div>

                <Table
                    banners={banners}
                    formData={setUpdateFormData}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                    setActiveForm={setActiveForm}
                    setShowForm={setShowForm}
                />
            </CCol>

            <Modal
                visible={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this banner?"
            />

            <CModal visible={videoModal} onClose={() => setVideoModal(false)} size="lg">
                <CModalHeader closeButton>Video Preview</CModalHeader>
                <CModalBody className="d-flex justify-content-center">
                    {selectedVideo && (
                        <video width="100%" controls autoPlay>
                            <source src={selectedVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </CModalBody>
            </CModal>
        </CRow>
    );
};

export default InstagramBanner;
