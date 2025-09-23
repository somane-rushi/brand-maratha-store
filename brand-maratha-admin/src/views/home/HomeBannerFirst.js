import React, { useEffect, useRef, useState } from 'react'
import Table from '../base/tables/HomeTablesFirst'
import axiosInstance from '../../config/axios.config';
import {
    _homebannerfirst_create,
    _homebannerfirst_delete,
    _homebannerfirst_get,
    _homebannerfirst_update,
    _homebannerfirstmarathi_get,
    _homebannerfirstmarathi_create,
    _homebannerfirstmarathi_update,
    _homebannerfirstmarathi_delete,
    _url
} from '../../config/api.endpoints';
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol, CForm,
    CFormFeedback,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CRow,
    CSpinner
} from '@coreui/react';
import * as yup from "yup";
import Modal from '../base/modal/Modal';
import { Formik } from 'formik';
import { handleApiError } from '../../utils/errorHelper';
import ImageCropper from '../../components/image-cropper/ImageCropper';
import ImagePreview from '../../components/image-cropper/ImagePreview';

const HomeBannerFirst = () => {
    const [banners, setBanners] = useState([]);
    const [language, setLanguage] = useState('english');
    const [showForm, setShowForm] = useState(false);
    const [activeFrom, setActiveForm] = useState(false)
    const [endpoint, setEndpoint] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({});
    const isFirstRender = useRef(true);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsloading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [originalImage, setOriginalImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const validationSchema = yup.object().shape({
        // title: yup.string()
        //     .required("Title is required")
        //     .test("no-whitespace", "Title cannot be empty or only spaces", (value) => value && value.trim().length > 0)
        //     .max(255, "Title must be at most 255 characters")
        //     .test("word-count", function (value) {
        //         if (!value) return this.createError({ message: "Title is required" });

        //         const wordCount = value.trim().split(/\s+/).length;

        //         if (wordCount > 5) {
        //             return this.createError({ message: `Title must not exceed 5 words. Currently, it has ${wordCount}.` });
        //         }
        //         return true;
        //     })
        //     .matches(language === 'english' ? /^[a-zA-Z0-9\s.,!?()-]+$/ : /^[\u0900-\u097F\s.,!?()\-\d]+$/, "Title contains invalid characters"),
        // subtitle: yup.string()
        //     .required("Subtitle is required")
        //     .test("no-whitespace", "Subtitle cannot be empty or only spaces", (value) => value && value.trim().length > 0)
        //     .max(255, "Subtitle must be at most 255 characters")
        //     .test("word-count", function (value) {
        //         if (!value) return this.createError({ message: "Subtitle is required" });

        //         const wordCount = value.trim().split(/\s+/).length;

        //         if (wordCount > 5) {
        //             return this.createError({ message: `Subtitle must not exceed 5 words. Currently, it has ${wordCount}.` });
        //         }
        //         return true;
        //     })
        //     .matches(language === 'english' ? /^[a-zA-Z0-9\s.,!?()-]+$/ : /^[\u0900-\u097F\s.,!?()\-\d]+$/, "Subtitle contains invalid characters"),
        link: yup.string()
            .url("Invalid URL format"),
        // .required("Link is required")
        // .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
        banner_image: yup.mixed()
            .nullable()
            .test("fileRequired", "Image is required", function (value) {
                const { existing_image } = this.parent;

                if (!existing_image && !value) {
                    return this.createError({ message: "Image is required" });
                }

                return true;
            })
            .test("fileType", "Only JPG, PNG, and WebP files are allowed", (value) => {
                if (!value || typeof value !== "object") return true;
                return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
            })
            .test("fileSize", "File size must be less than 5MB", function (value) {
                if (!value || typeof value !== "object") return true;
                if (value.size > 12 * 1024 * 1024) {
                    return this.createError({ message: "File exceeds 12MB limit" });
                }
                return true;
            }),
    });

    const updateValidationSchema = yup.object().shape({
        // title: yup.string()
        //     .required("Title is required")
        //     .test("no-whitespace", "Title cannot be empty or only spaces", (value) => value && value.trim().length > 0)
        //     .max(255, "Title must be at most 255 characters")
        //     .test("word-count", function (value) {
        //         if (!value) return this.createError({ message: "Title is required" });

        //         const wordCount = value.trim().split(/\s+/).length;

        //         if (wordCount > 5) {
        //             return this.createError({ message: `Title must not exceed 5 words. Currently, it has ${wordCount}.` });
        //         }
        //         return true;
        //     })
        //     .matches(language === 'english' ? /^[a-zA-Z0-9\s.,!?()-]+$/ : /^[\u0900-\u097F\s.,!?()\-\d]+$/, "Title contains invalid characters"),
        // subtitle: yup.string()
        //     .required("Subtitle is required")
        //     .test("no-whitespace", "Subtitle cannot be empty or only spaces", (value) => value && value.trim().length > 0)
        //     .max(255, "Subtitle must be at most 255 characters")
        //     .test("word-count", function (value) {
        //         if (!value) return this.createError({ message: "Subtitle is required" });

        //         const wordCount = value.trim().split(/\s+/).length;

        //         if (wordCount > 5) {
        //             return this.createError({ message: `Subtitle must not exceed 5 words. Currently, it has ${wordCount}.` });
        //         }
        //         return true;
        //     })
        //     .matches(language === 'english' ? /^[a-zA-Z0-9\s.,!?()-]+$/ : /^[\u0900-\u097F\s.,!?()\-\d]+$/, "Subtitle contains invalid characters"),
        link: yup.string()
            .url("Invalid URL format"),
        // .required("Link is required")
        // .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
        banner_image: yup.mixed()
            .nullable()
            .test("fileType", "Only JPG, PNG, and WebP files are allowed", (value) => {
                if (!value || typeof value !== "object") return true;
                return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
            })
            .test("fileSize", "File size must be less than 5MB", function (value) {
                if (!value || typeof value !== "object") return true;

                if (value.size > 12 * 1024 * 1024) {
                    return this.createError({ message: "File exceeds 12MB limit" });
                };
                return true;
            }),
    });

    useEffect(() => {
        const newEndpoint = {
            getBanner: language === "english" ? _homebannerfirst_get : _homebannerfirstmarathi_get,
            postBanner: language === "english" ? _homebannerfirst_create : _homebannerfirstmarathi_create,
            putBanner: language === "english" ? _homebannerfirst_update : _homebannerfirstmarathi_update,
            deleteBanner: language === "english" ? _homebannerfirst_delete : _homebannerfirstmarathi_delete,
        };

        setEndpoint(newEndpoint);
    }, [language]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (endpoint) {
            fetchBanners(endpoint);
        }
    }, [endpoint]);

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
        setPreview(updateFormData.banner_image || "");
    }, [updateFormData.banner_image]);

    const fetchBanners = async (endpoint) => {
        setIsloading(true);
        setError('');

        try {
            const result = await axiosInstance.get(endpoint.getBanner);
            setBanners(result?.data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsloading(false);
        }
    };

    async function handleSubmit(values, { resetForm }) {
        setError('');
        setMessage('');
        setIsloading(true);

        const trims = {
            title: values.title.trim(),
            subtitle: values.subtitle.trim(),
            link: values.link.trim(),
        };

        const formData = new FormData();

        formData.append('title', trims.title)
        formData.append('subtitle', trims.subtitle)
        formData.append('link', trims.link)
        formData.append('banner_image', values.banner_image)

        try {
            await axiosInstance.post(endpoint.postBanner, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setMessage('Banner created successfully!');
            fetchBanners(endpoint);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            };

            if (banners?.length < 7) {
                setShowForm(false);
            };

            setShowForm(false);
            resetForm();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsloading(false);
        }
    };

    async function handleUpdate(values, { resetForm }) {
        setError('');
        setMessage('');
        setIsloading(true);

        if (updateFormData.id === null) {
            setMessage("Please select a banner first.");
            return;
        };

        const trims = {
            title: values.title.trim(),
            subtitle: values.subtitle.trim(),
            link: values.link.trim(),
        };

        const formData = new FormData();

        formData.append('title', trims.title);
        formData.append('subtitle', trims.subtitle);
        formData.append('link', trims.link);
        formData.append('banner_image', values.banner_image);

        setIsloading(true);

        try {
            await axiosInstance.put(`${endpoint.putBanner}/${updateFormData.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("Banner updated successfully!");
            fetchBanners(endpoint);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            };
            setUpdateFormData({});
            setPreview('');
            resetForm();
            setShowForm(false);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsloading(false);
        }
    }

    const handleActiveForm = () => {
        setShowForm(!showForm);
        setActiveForm(false)
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenModal(true);
    };

    async function handleConfirmDelete() {
        setError('');
        setIsloading(true);

        try {
            await axiosInstance.delete(`${endpoint.deleteBanner}/${deleteId}`)
            fetchBanners(endpoint);
            setActiveForm(false);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setOpenModal(false);
            setDeleteId(null);
            setIsloading(false);
        }
    };

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong> {!activeFrom ? "Add" : "Update"}</strong> <small>Banner</small>
                        </CCardHeader>
                        <CCardBody className='row g-3'>
                            <CCol xs={12} md={4} lg={2}>
                                <CFormSelect
                                    aria-label="Default select example"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    disabled={showForm}
                                >
                                    <option value="english">English</option>
                                    <option value="marathi">मराठी</option>
                                </CFormSelect>
                            </CCol>
                            {banners?.length < 7 && (
                                <CCol xs={12} md={6} lg>
                                    <CButton
                                        as="input"
                                        type="button"
                                        color="primary"
                                        value={showForm ? "Close" : "Add"}
                                        onClick={handleActiveForm}
                                    />
                                </CCol>
                            )}
                            {showForm ?
                                !activeFrom && banners?.length < 7 ?
                                    <Formik
                                        initialValues={{
                                            title: "",
                                            subtitle: "",
                                            link: "",
                                            banner_image: null,
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                            <CForm
                                                className="row g-3 needs-validation"
                                                onSubmit={handleSubmit}
                                            >
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="title">Title</CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        name='title'
                                                        value={values.title}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.title && touched.title &&
                                                        <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="subtitle">Sub Title</CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        name='subtitle'
                                                        value={values.subtitle}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.subtitle && touched.subtitle &&
                                                        <CFormFeedback className="text-danger small">{errors.subtitle}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="link">Link</CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        name='link'
                                                        value={values.link}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.link && touched.link &&
                                                        <CFormFeedback className="text-danger small">{errors.link}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="banner_image">Image<span className='text-danger'>*</span></CFormLabel>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <CFormInput
                                                            type="file"
                                                            accept="image/*"
                                                            name="banner_image"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];

                                                                if (file) {
                                                                    setOriginalImage(file);
                                                                    setShowCropModal(true);
                                                                }
                                                            }}
                                                            ref={fileInputRef}
                                                        />

                                                        {values.banner_image && (
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
                                                                setFieldValue('banner_image', blob);
                                                            }}
                                                        />
                                                        <ImagePreview
                                                            visible={showPreviewModal}
                                                            imageFile={values.banner_image}
                                                            onClose={() => setShowPreviewModal(false)}
                                                        />
                                                    </div>

                                                    {errors.banner_image && touched.banner_image &&
                                                        <CFormFeedback className="text-danger small">{errors.banner_image}</CFormFeedback>}
                                                </CCol>

                                                <CCol xs={12}>
                                                    <CButton color="primary" type="submit">
                                                        Submit
                                                    </CButton>
                                                </CCol>
                                            </CForm>
                                        )}
                                    </Formik>
                                    :
                                    <Formik
                                        initialValues={{
                                            title: updateFormData.title || '',
                                            subtitle: updateFormData.subtitle || '',
                                            link: updateFormData.link || '',
                                            banner_image: null,
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={updateValidationSchema}
                                        onSubmit={handleUpdate}
                                    >
                                        {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                            <CForm
                                                className="row g-3 needs-validation"
                                                onSubmit={handleSubmit}
                                            >
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="title">Title</CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        name='title'
                                                        value={values.title}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.title && touched.title &&
                                                        <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="subtitle">Sub Title</CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        name='subtitle'
                                                        value={values.subtitle}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.subtitle && touched.subtitle &&
                                                        <CFormFeedback className="text-danger small">{errors.subtitle}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="link">Link</CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        name='link'
                                                        value={values.link}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.link && touched.link &&
                                                        <CFormFeedback className="text-danger small">{errors.link}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="banner_image">Image<span className='text-danger'>*</span></CFormLabel>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <CFormInput
                                                            type="file"
                                                            accept="image/*"
                                                            name="banner_image"
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
                                                                setFieldValue('banner_image', blob);
                                                                setPreview(URL.createObjectURL(blob));
                                                            }}
                                                        />
                                                        <ImagePreview
                                                            visible={showPreviewModal}
                                                            imageFile={preview?.startsWith("blob:") ? preview : _url + preview}
                                                            onClose={() => setShowPreviewModal(false)}
                                                        />
                                                    </div>

                                                    {errors.banner_image && touched.banner_image &&
                                                        <CFormFeedback className="text-danger small">{errors.banner_image}</CFormFeedback>}
                                                </CCol>
                                                <CCol xs={12}>
                                                    <CButton color="primary" type="submit">
                                                        Update
                                                    </CButton>
                                                </CCol>
                                            </CForm>
                                        )}
                                    </Formik>
                                : null
                            }
                        </CCardBody>
                    </CCard>

                    <div className='mt-4'>
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
            </CRow >
        </>
    )
}

export default HomeBannerFirst;