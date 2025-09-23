import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config';
import {
    _magazinebanner_get,
    _magazinebanner_create,
    _magazinebanner_update,
    _magazinebanner_delete
} from '../../config/api.endpoints';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CRow, CSpinner } from '@coreui/react';
import Modal from '../base/modal/Modal';
import Table from '../base/tables/AboutUsBannerTable';
import { Formik } from 'formik';
import * as yup from "yup";
import { handleApiError } from '../../utils/errorHelper';
import ImageCropper from '../../components/image-cropper/ImageCropper';
import ImagePreview from '../../components/image-cropper/ImagePreview';


const ImageBanner = () => {
    const [banners, setBanners] = useState([]);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [activeFrom, setActiveForm] = useState(false)
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({});
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [originalImage, setOriginalImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const validationSchema = yup.object().shape({
        title: yup
            .string()
            .trim()
            .max(255, "Title must be at most 255 characters")
            .test("no-whitespace", "Title cannot be only spaces", value => {
                if (!value || value.trim() === "") return true;
                return value.trim().length > 0;
            }),
        subtitle: yup
            .string()
            .trim()
            .max(255, "Subtitle must be at most 255 characters")
            .test("no-whitespace", "Subtitle cannot be only spaces", value => {
                if (!value || value.trim() === "") return true;
                return value.trim().length > 0;
            }),
        image: yup.mixed()
            .nullable()
            .test("fileRequired", "Image is required", function (value) {
                const { existing_image } = this.parent;

                if (!existing_image && !value) {
                    return this.createError({ message: "Image is required" });
                };

                return true;
            })
            .test("fileType", "Only JPG, PNG, and WebP files are allowed", (value) => {
                if (!value || typeof value !== "object") return true;
                return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
            })
            .test("fileSize", "File size must be less than 5MB", function (value) {
                if (!value || typeof value !== "object") return true;
                if (value.size > 5 * 1024 * 1024) {
                    return this.createError({ message: "File exceeds 5MB limit" });
                }
                return true;
            }),
    });

    const updateValidationSchema = yup.object().shape({
        title: yup
            .string()
            .nullable()
            .notRequired()
            .test("no-whitespace", "Title cannot be empty or only spaces", (value) => {
                if (value === undefined || value === null) return true;
                return value.trim().length > 0;
            })
            .max(255, "Title must be at most 255 characters")
            .test("no-whitespace", "Title cannot be only spaces", value => {
                if (!value || value.trim() === "") return true;
                return value.trim().length > 0;
            }),

        subtitle: yup
            .string()
            .nullable()
            .notRequired()
            .test("no-whitespace", "Subtitle cannot be empty or only spaces", (value) => {
                if (value === undefined || value === null) return true;
                return value.trim().length > 0;
            })
            .max(255, "Subtitle must be at most 255 characters")
            .test("no-whitespace", "Subtitle cannot be only spaces", value => {
                if (!value || value.trim() === "") return true;
                return value.trim().length > 0;
            }),

        image: yup.mixed()
            .nullable()
            .test("fileType", "Only JPG, PNG, and WebP files are allowed", (value) => {
                if (!value || typeof value !== "object") return true;
                return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
            })
            .test("fileSize", "File size must be less than 5MB", function (value) {
                if (!value || typeof value !== "object") return true;
                if (value.size > 5 * 1024 * 1024) {
                    return this.createError({ message: "File exceeds 5MB limit" });
                }
                return true;
            }),
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (updateFormData.image) {
            setPreview(updateFormData.image)
        }
    }, [updateFormData]);

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const fetchBanners = async () => {
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axiosInstance.get(_magazinebanner_get);
            setBanners(data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    async function handleSubmit(values, { resetForm }) {
        setIsLoading(true);
        setMessage('');
        setError('');

        const trims = {
            title: values.title.trim(),
            subtitle: values.subtitle.trim(),
        };

        const formData = new FormData();
        formData.append('title', trims.title);
        formData.append('subtitle', trims.subtitle);
        formData.append('image', values.image);

        try {
            const { data } = await axiosInstance.post(_magazinebanner_create, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setMessage(data?.message)

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            };
            fetchBanners();
            resetForm();
            setShowForm(false);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenModal(true);
    };

    async function handleConfirmDelete() {
        setIsLoading(true);
        setError('');

        try {
            await axiosInstance.delete(`${_magazinebanner_delete}/${deleteId}`)
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

    async function handleUpdate(values, { resetForm }) {
        setIsLoading(true);
        setMessage('');
        setError('');

        if (!updateFormData?.id) {
            setMessage("Please select a banner first.");
            setIsLoading(false);
            return;
        }

        const trims = {
            title: values.title?.trim() || '',
            subtitle: values.subtitle?.trim() || '',
        };

        const originalTitle = updateFormData.title?.trim() || '';
        const originalSubtitle = updateFormData.subtitle?.trim() || '';
        const originalImage = updateFormData.image || '';

        const isImageChanged = values.image instanceof File;
        const isTitleChanged = trims.title !== originalTitle;
        const isSubtitleChanged = trims.subtitle !== originalSubtitle;

        if (!isTitleChanged && !isSubtitleChanged && !isImageChanged) {
            setMessage("No changes detected.");
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', trims.title);
        formData.append('subtitle', trims.subtitle);
        if (isImageChanged) {
            formData.append('image', values.image);
        }

        try {
            await axiosInstance.put(`${_magazinebanner_update}/${updateFormData.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("Banner updated successfully!");
            fetchBanners();

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setUpdateFormData({});
            setPreview('');
            resetForm();
            setShowForm(false);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    }

    const handleActiveForm = () => {
        setShowForm(!showForm);
        setActiveForm(false)
    };

    if (isLoading) return <CSpinner color='primary' />

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader className='d-flex justify-content-between align-items-center'>
                            <div>
                                <strong> {!activeFrom ? "Add" : "Update"}</strong> <small>banner</small>
                            </div>
                            {!banners?.length > 0
                                ?
                                <CButton as="input" type="button" color="primary" value={showForm !== true ? "Add" : "Close"} onClick={() => handleActiveForm()} />
                                :
                                !activeFrom || showForm && <CButton as="input" type="button" color="primary" value="Close" onClick={() => handleActiveForm()} />
                            }
                        </CCardHeader>
                        {showForm ?
                            !activeFrom ?
                                <CCardBody className='row g-3'>
                                    <Formik
                                        initialValues={{
                                            title: '',
                                            subtitle: '',
                                            image: null
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                            <CForm className="row g-3" onSubmit={handleSubmit}>
                                                <CCol md={4}>
                                                    <CFormLabel htmlFor="title">Title</CFormLabel>
                                                    <CFormInput type="text" name='title' value={values.title} onChange={handleChange} />
                                                    {errors.title && touched.title &&
                                                        <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={4}>
                                                    <CFormLabel htmlFor="subtitle">Sub Title</CFormLabel>
                                                    <CFormInput type="text" name='subtitle' value={values.subtitle} onChange={handleChange} />
                                                    {errors.subtitle && touched.subtitle &&
                                                        <CFormFeedback className="text-danger small">{errors.subtitle}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={4}>
                                                    <CFormLabel htmlFor="image">Image<span className='text-danger'>*</span></CFormLabel>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <CFormInput
                                                            type="file"
                                                            accept="image/*"
                                                            name="image"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];

                                                                if (file) {
                                                                    setOriginalImage(file);
                                                                    setShowCropModal(true);
                                                                }
                                                            }}
                                                            ref={fileInputRef}
                                                        />

                                                        {values.image && (
                                                            <CButton
                                                                color="primary"
                                                                size="md"
                                                                type="button"
                                                                onClick={() => setShowPreviewModal(true)}
                                                            >
                                                                Preview
                                                            </CButton>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <ImageCropper
                                                            show={showCropModal}
                                                            imageFile={originalImage}
                                                            onClose={() => setShowCropModal(false)}
                                                            onCropDone={(blob) => {
                                                                setFieldValue('image', blob);
                                                            }}
                                                        />
                                                        <ImagePreview
                                                            visible={showPreviewModal}
                                                            imageFile={values.image}
                                                            onClose={() => setShowPreviewModal(false)}
                                                        />
                                                    </div>
                                                    {errors.image && touched.image &&
                                                        <CFormFeedback className="text-danger small">{errors.image}</CFormFeedback>}
                                                </CCol>
                                                <CCol xs={12}>
                                                    <CButton color="primary" type="submit">
                                                        Submit
                                                    </CButton>
                                                </CCol>
                                            </CForm>
                                        )}
                                    </Formik>
                                </CCardBody>
                                :
                                <>
                                    <Formik
                                        initialValues={{
                                            title: updateFormData.title || '',
                                            subtitle: updateFormData.subtitle || '',
                                            image: updateFormData.image || null
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={updateValidationSchema}
                                        onSubmit={handleUpdate}
                                    >
                                        {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                            <CCardBody>
                                                <CForm className="row g-3" onSubmit={handleSubmit}>
                                                    <CCol md={4}>
                                                        <CFormLabel htmlFor="title">Title</CFormLabel>
                                                        <CFormInput type="text" name='title' value={values.title} onChange={handleChange} />
                                                        {errors.title && touched.title &&
                                                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                                    </CCol>
                                                    <CCol md={4}>
                                                        <CFormLabel htmlFor="subtitle">Sub Title</CFormLabel>
                                                        <CFormInput type="text" name='subtitle' value={values.subtitle} onChange={handleChange} />
                                                        {errors.subtitle && touched.subtitle &&
                                                            <CFormFeedback className="text-danger small">{errors.subtitle}</CFormFeedback>}
                                                    </CCol>
                                                    <CCol md={4}>
                                                        <CFormLabel htmlFor="image">Image<span className='text-danger'>*</span></CFormLabel>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <CFormInput
                                                                type="file"
                                                                accept="image/*"
                                                                name="image"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];

                                                                    if (file) {
                                                                        setOriginalImage(file);
                                                                        setShowCropModal(true);
                                                                    }
                                                                }}
                                                                ref={fileInputRef}
                                                            />

                                                            {preview && (
                                                                <CButton
                                                                    color="primary"
                                                                    size="md"
                                                                    type="button"
                                                                    onClick={() => setShowPreviewModal(true)}
                                                                >
                                                                    Preview
                                                                </CButton>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <ImageCropper
                                                                show={showCropModal}
                                                                imageFile={originalImage}
                                                                onClose={() => setShowCropModal(false)}
                                                                onCropDone={(blob) => {
                                                                    setFieldValue('image', blob);
                                                                    setPreview(URL.createObjectURL(blob));
                                                                }}
                                                            />
                                                            <ImagePreview
                                                                visible={showPreviewModal}
                                                                imageFile={preview.startsWith("blob:") ? preview : preview}
                                                                onClose={() => setShowPreviewModal(false)}
                                                            />
                                                        </div>
                                                        {errors.image && touched.image &&
                                                            <CFormFeedback className="text-danger small">{errors.image}</CFormFeedback>}
                                                    </CCol>
                                                    <CCol xs={12}>
                                                        <CButton color="primary" type="submit">
                                                            Update
                                                        </CButton>
                                                    </CCol>
                                                </CForm>
                                            </CCardBody>
                                        )}
                                    </Formik>
                                </> : null
                        }
                    </CCard>
                    <div className='mt-4'>
                        {message && <CAlert color="primary">{message}</CAlert>}
                        {error && <CAlert color="danger">{error}</CAlert>}
                    </div>
                    <Table
                        name='magazine'
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
            </CRow>
        </>
    )
}

export default ImageBanner;
