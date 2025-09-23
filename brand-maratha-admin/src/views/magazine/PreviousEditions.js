import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config';
import {
    _magazinepreviousedition_get,
    _magazinepreviousedition_create,
    _magazinepreviousedition_update,
    _magazinepreviousedition_delete,
    _url
} from '../../config/api.endpoints';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CRow, CSpinner } from '@coreui/react';
import Modal from '../base/modal/Modal';
import Table from '../base/tables/PreviousEditionTable';
import { Formik } from 'formik';
import * as yup from "yup";
import { handleApiError } from '../../utils/errorHelper';
import ImageCropper from '../../components/image-cropper/ImageCropper';
import ImagePreview from '../../components/image-cropper/ImagePreview';

const validationSchema = yup.object().shape({
    title: yup
        .string()
        .trim()
        .max(255, "Title must be at most 255 characters")
        .test("no-whitespace", "Title cannot be only spaces", value => {
            if (!value || value.trim() === "") return true; // Allow empty
            return value.trim().length > 0;
        }),
    image: yup.mixed()
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
    pdf: yup.mixed()
        .required("PDF is required")
        .test("fileType", "Only PDF files are allowed", (value) => {
            if (!value || typeof value !== "object") return true;
            return value.type === "application/pdf";
        })
        .test("fileSize", "PDF size must be less than 10MB", function (value) {
            if (!value || typeof value !== "object") return true;
            return value.size <= 10 * 1024 * 1024;
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
    pdf: yup.mixed()
        .nullable()
        .test("fileType", "Only PDF files are allowed", (value) => {
            if (!value || typeof value !== "object") return true;
            return value.type === "application/pdf";
        })
        .test("fileSize", "PDF size must be less than 10MB", function (value) {
            if (!value || typeof value !== "object") return true;
            return value.size <= 10 * 1024 * 1024;
        }),
});

const PreviousEditions = () => {
    const [editions, setEditions] = useState([]);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [activeFrom, setActiveForm] = useState(false)
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({});
    const [preview, setPreview] = useState("");
    const [previewPDF, setPreviewPDF] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const [originalImage, setOriginalImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        fetchEditions();
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
        const { image } = updateFormData;

        if (image) {
            setPreview(image);
        }
    }, [updateFormData.image]);

    const fetchEditions = async () => {
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axiosInstance.get(_magazinepreviousedition_get);
            setEditions(data);
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
        };

        const formData = new FormData();

        formData.append('title', trims.title)
        formData.append('image', values.image)
        formData.append('pdf', values.pdf)

        try {
            const { data } = await axiosInstance.post(_magazinepreviousedition_create, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setMessage(data?.message)
            fetchEditions();
            resetForm()
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
            await axiosInstance.delete(`${_magazinepreviousedition_delete}/${deleteId}`)
            fetchEditions();
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

        if (updateFormData.id === null) {
            setMessage("Please select a banner first.");
            return;
        };

        const trims = {
            title: values.title.trim(),
        };

        const formData = new FormData();

        formData.append('title', trims.title);

        if (values.image instanceof File) {
            formData.append("image", values.image);
        };

        if (values.pdf instanceof File) {
            formData.append("pdf", values.pdf);
        };

        try {
            await axiosInstance.put(`${_magazinepreviousedition_update}/${updateFormData.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Edition updated successfully!");
            fetchEditions();
            setUpdateFormData({});
            setPreview('');
            resetForm();
            setShowForm(false)
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
                                <strong> {!activeFrom ? "Add" : "Update"}</strong> <small>Edition</small>
                            </div>
                            <CButton as="input" type="button" color="primary" value={showForm !== true ? "Add" : "Close"} onClick={() => handleActiveForm()} />
                        </CCardHeader>
                        {showForm ?
                            !activeFrom ?
                                <CCardBody className='row g-3'>
                                    <Formik
                                        initialValues={{
                                            title: '',
                                            image: null,
                                            pdf: null
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}>
                                        {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}>
                                                <CCol md={12}>
                                                    <CFormLabel htmlFor="title">Title</CFormLabel>
                                                    <CFormInput type="text" name='title' value={values.title} onChange={handleChange} />
                                                    {errors.title && touched.title &&
                                                        <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="image">Thumbnail<span className='text-danger'>*</span></CFormLabel>
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
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="pdf">PDF<span className='text-danger'>*</span></CFormLabel>
                                                    <CFormInput
                                                        type="file"
                                                        accept="pdf/*"
                                                        name='pdf'
                                                        onChange={(e) => setFieldValue("pdf", e.target.files[0])}
                                                        ref={fileInputRef}
                                                    />
                                                    {errors.pdf && touched.pdf &&
                                                        <CFormFeedback className="text-danger small">{errors.pdf}</CFormFeedback>}
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
                                    <CCardBody>
                                        <Formik
                                            initialValues={{
                                                title: updateFormData.title || '',
                                                image: updateFormData.image || null,
                                                pdf: updateFormData.pdf || null
                                            }}
                                            enableReinitialize={true}
                                            validationSchema={updateValidationSchema}
                                            onSubmit={handleUpdate}>
                                            {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                                <CForm className="row g-3 needs-validation" onSubmit={handleSubmit} >
                                                    <CCol md={12}>
                                                        <CFormLabel htmlFor="title">Title</CFormLabel>
                                                        <CFormInput type="text" name='title' value={values.title} onChange={handleChange} />
                                                        {errors.title && touched.title &&
                                                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                                    </CCol>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="image">Thumbnail<span className='text-danger'>*</span></CFormLabel>
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
                                                                imageFile={preview?.startsWith("blob:") ? preview : _url + preview}
                                                                onClose={() => setShowPreviewModal(false)}
                                                            />
                                                        </div>

                                                        {errors.image && touched.image &&
                                                            <CFormFeedback className="text-danger small">{errors.image}</CFormFeedback>}
                                                    </CCol>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="pdf">PDF<span className='text-danger'>*</span></CFormLabel>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <CFormInput
                                                                type="file"
                                                                accept="application/pdf"
                                                                name="pdf"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        setFieldValue("pdf", file);
                                                                        setPreviewPDF(URL.createObjectURL(file));
                                                                    }
                                                                }}
                                                                ref={fileInputRef}
                                                            />

                                                            {values.pdf && !previewPDF && (
                                                                <a
                                                                    href={_url + values.pdf}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-primary"
                                                                >
                                                                    View
                                                                </a>
                                                            )}

                                                            {previewPDF && (
                                                                <a
                                                                    href={previewPDF}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-primary"
                                                                >
                                                                    Preview
                                                                </a>
                                                            )}
                                                        </div>
                                                        {errors.pdf && touched.pdf &&
                                                            <CFormFeedback className="text-danger small">{errors.pdf}</CFormFeedback>}
                                                    </CCol>
                                                    <CCol xs={12}>
                                                        <CButton color="primary" type="submit">
                                                            Update
                                                        </CButton>
                                                    </CCol>
                                                </CForm>
                                            )}
                                        </Formik>
                                    </CCardBody>
                                </> : null
                        }
                    </CCard>
                    <div className='mt-4'>
                        {message && <CAlert color="primary">{message}</CAlert>}
                        {error && <CAlert color="danger">{error}</CAlert>}
                    </div>
                    <Table
                        editions={editions}
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
                    message="Are you sure you want to delete this edition?"
                />
            </CRow >
        </>
    )
}

export default PreviousEditions;
