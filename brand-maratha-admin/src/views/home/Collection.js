import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config';
import {
    _categories_create,
    _categories_delete,
    _categories_get,
    _categories_update,
    _productbycollecion_get,
    _url
} from '../../config/api.endpoints';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CRow, CSpinner } from '@coreui/react';
import Modal from '../base/modal/Modal';
import Table from '../base/tables/CategoriesTable';
import { Formik } from 'formik';
import * as yup from "yup";
import { handleApiError } from '../../utils/errorHelper';
import ImageCropper from '../../components/image-cropper/ImageCropper';
import ImagePreview from '../../components/image-cropper/ImagePreview';

const Collection = () => {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [activeFrom, setActiveForm] = useState(false)
    const [updateFormData, setUpdateFormData] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [preview, setPreview] = useState(updateFormData.image || "");
    const [isLoading, setIsloading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fileInputRef = useRef(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const [modalTitle, setModalTitle] = useState('Confirm Deletion')
    const [modalMessage, setModalMessage] = useState('Are you sure you want to delete this category?')
    const validationSchema = yup.object().shape({
        title: yup
            .string()
            .nullable()
            .notRequired()
            .test("no-whitespace", "Title cannot be empty or only spaces", (value) => {
                if (value === undefined || value === null) return true;
                return value.trim().length > 0;
            })
            .max(255, "Title must be at most 255 characters"),

        subtitle: yup
            .string()
            .nullable()
            .notRequired()
            .test("no-whitespace", "Subtitle cannot be empty or only spaces", (value) => {
                if (value === undefined || value === null) return true;
                return value.trim().length > 0;
            })
            .max(255, "Subtitle must be at most 255 characters"),
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
            .max(255, "Title must be at most 255 characters"),

        subtitle: yup
            .string()
            .nullable()
            .notRequired()
            .test("no-whitespace", "Subtitle cannot be empty or only spaces", (value) => {
                if (value === undefined || value === null) return true;
                return value.trim().length > 0;
            })
            .max(255, "Subtitle must be at most 255 characters"),
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
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message, error]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setPreview(updateFormData.image || "");
    }, [updateFormData]);

    const fetchCategories = async () => {
        setIsloading(true);
        setError('');

        try {
            const { data } = await axiosInstance.get(_categories_get);
            setData(data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsloading(false);
        }
    };

    async function handleSubmit(values, { resetForm }) {
        setIsloading(true);
        setError('');

        const trims = {
            title: values.title.trim(),
            subtitle: values.subtitle.trim(),
        };

        const formData = new FormData();

        formData.append('title', trims.title)
        formData.append('subtitle', trims.subtitle)
        formData.append('image', values.image)

        try {
            await axiosInstance.post(_categories_create, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setMessage('Category created successfully!');
            fetchCategories();

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            };
            resetForm();
            setShowForm(false);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsloading(false);
        }
    }

    const handleDelete = async (id) => {
        try {
            const { data } = await axiosInstance.get(`${_productbycollecion_get}/${id}`);
            const result = data?.data || [];

            const hasProducts = result.length > 0;

            setModalTitle(hasProducts ? 'Shift Products First' : 'Confirm Deletion');
            setModalMessage(
                hasProducts
                    ? `Please shift all ${result.length} product's to another collection before deleting this one.`
                    : 'Are you sure you want to delete this collection?'
            );
            setDeleteId(hasProducts ? null : id);
            setOpenModal(true);
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    async function handleConfirmDelete() {
        if (deleteId === null) {
            setOpenModal(false);
            return;
        };

        setIsloading(true);

        try {
            await axiosInstance.delete(`${_categories_delete}/${deleteId}`)
            fetchCategories();
            setActiveForm(false);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setOpenModal(false);
            setDeleteId(null);
            setIsloading(false);
        }
    };

    async function handleUpdate(values, { resetForm }) {
        setIsloading(true);
        setMessage('');
        setError('');

        if (updateFormData.id === null) {
            setMessage("Please select first category.");
            return;
        };

        const trims = {
            title: values.title.trim(),
            subtitle: values.subtitle.trim(),
        };

        const formData = new FormData();

        formData.append('title', trims.title);
        formData.append('subtitle', trims.subtitle);
        formData.append('image', values.image);

        try {
            await axiosInstance.put(`${_categories_update}/${updateFormData.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("Category updated successfully!");
            fetchCategories();

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            };

            setActiveForm(false);
            setPreview('');
            setShowForm(false);
            resetForm();
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

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{!activeFrom ? "Add" : "Update"}</strong> <small>Collection</small>
                                </div>
                                <CButton
                                    as="input"
                                    type="button"
                                    color="primary"
                                    value={showForm !== true ? "Add" : "Close"}
                                    onClick={handleActiveForm}
                                />
                            </div>
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
                                            <CForm
                                                className="row g-3"
                                                onSubmit={handleSubmit}
                                            >
                                                <CCol md={4}>
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
                                                <CCol md={4}>
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
                                    <CCardBody className='row g-3'>
                                        <Formik
                                            initialValues={{
                                                title: updateFormData.title || '',
                                                subtitle: updateFormData.subtitle || '',
                                                image: null,
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
                                                    <CCol md={4}>
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
                                                    <CCol md={4}>
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
                                                                imageFile={preview.startsWith("blob:") ? preview : _url + preview}
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
                                            )}
                                        </Formik>
                                    </CCardBody>
                                </>
                            :
                            null
                        }
                    </CCard>
                    <div className='mt-4'>
                        {message && <CAlert color="primary">{message}</CAlert>}
                        {error && <CAlert color="danger">{error}</CAlert>}
                    </div>
                    <Table
                        data={data}
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
                    title={modalTitle}
                    message={modalMessage}
                />
            </CRow>
        </>
    )
}

export default Collection;