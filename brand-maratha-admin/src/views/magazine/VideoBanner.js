import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config';
import {
    _magazinevideobanner_get,
    _magazinevideobanner_create,
    _magazinevideobanner_update,
    _magazinevideobanner_delete
} from '../../config/api.endpoints';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CModal, CModalBody, CModalHeader, CRow, CSpinner } from '@coreui/react';
import Modal from '../base/modal/Modal';
import Table from '../base/tables/MagazineVideoTable';
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
    duration: yup
        .string()
        .nullable()
        .notRequired()
        .test("no-whitespace", "Duration cannot be empty or only spaces", (value) => {
            if (value === undefined || value === null) return true;
            return value.trim().length > 0;
        })
        .matches(/^\d{1,2}:\d{2}$/, "Duration must be in MM:SS format"),
    thumbnail: yup.mixed()
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
    video: yup
        .mixed()
        .required("Video is required")
        .test("is-valid-video-or-url", "Invalid video input", function (value) {
            const isBrowser = typeof window !== "undefined";
            const isFile = isBrowser && value instanceof File;
            const isString = typeof value === "string";

            if (isFile) {
                const allowedTypes = [
                    "video/mp4",
                    "video/quicktime",
                    "video/x-msvideo",
                ];

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
            }

            if (isString) {
                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
                if (!youtubeRegex.test(value.trim())) {
                    return this.createError({
                        message: "Enter a valid YouTube URL",
                    });
                }

                return true;
            }

            return this.createError({
                message: "Invalid input: must be a YouTube URL or video file",
            });
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

    duration: yup
        .string()
        .nullable()
        .notRequired()
        .test("no-whitespace", "Duration cannot be empty or only spaces", (value) => {
            if (value === undefined || value === null) return true;
            return value.trim().length > 0;
        })
        .matches(/^\d{1,2}:\d{2}$/, "Duration must be in MM:SS format"),

    thumbnail: yup
        .mixed()
        .nullable()
        .notRequired()
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

    video: yup
        .mixed()
        .required("Video is required")
        .test("is-valid-video-or-url", "Enter a valid YouTube URL or upload a video file", function (value) {
            if (!value) return false;

            const isBrowser = typeof window !== "undefined";
            const isFile = isBrowser && value instanceof File;
            const isString = typeof value === "string";

            if (isFile) {
                const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
                if (!allowedTypes.includes(value.type)) {
                    return this.createError({ message: "Only MP4, MOV, AVI formats are allowed" });
                }
                if (value.size > 20 * 1024 * 1024) {
                    return this.createError({ message: "File exceeds 20MB limit" });
                }
                return true;
            }

            if (isString) {
                const trimmed = value.trim();

                const isLocalPath =
                    trimmed.startsWith("/uploads/") ||
                    trimmed.startsWith("uploads/") ||
                    trimmed.includes("://") && trimmed.includes("/uploads/");

                if (isLocalPath) return true;

                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
                if (youtubeRegex.test(trimmed)) return true;

                return false;
            }

            return false;
        }),
});

const VideoBanner = () => {
    const [banners, setBanners] = useState([]);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [activeFrom, setActiveForm] = useState(false)
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({});
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [originalImage, setOriginalImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [videoInputType, setVideoInputType] = useState(updateFormData.video?.startsWith("http") ? "url" : "file");

    const [videoModal, setVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState('');

    const [preview, setPreview] = useState({
        image: updateFormData.thumbnail || '',
        video: updateFormData.video || ''
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
            setPreview({
                image: thumbnail,
                video: video
            });
        }
    }, [updateFormData]);

    useEffect(() => {
        if (updateFormData.video && typeof updateFormData.video === 'string' && updateFormData.video.includes('youtu')) {
            setVideoInputType('url');
            setPreview((prev) => ({ ...prev, video: updateFormData.video }));
        } else if (updateFormData.video) {
            setVideoInputType('file');
            setPreview((prev) => ({ ...prev, video: updateFormData.video }));
        }
    }, [updateFormData]);

    const fetchBanners = async () => {
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axiosInstance.get(_magazinevideobanner_get);
            setBanners(data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    async function handleSubmit(values, { resetForm }) {
        setIsLoading(true);
        setError('');
        setMessage('');

        const trims = {
            title: values.title.trim(),
            duration: values.duration.trim(),
        };

        const formData = new FormData();

        formData.append('title', trims.title)
        formData.append('duration', trims.duration)
        if (values.thumbnail) {
            formData.append('thumbnail', values.thumbnail);
        }
        if (typeof values.video === 'string') {
            formData.append('video', values.video);
        } else if (values.video instanceof File) {
            formData.append('video', values.video);
        }

        try {
            const { data } = await axiosInstance.post(_magazinevideobanner_create, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setMessage(data?.message)
            fetchBanners();

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            };

            // resetForm();
            setShowForm(!showForm);
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
            await axiosInstance.delete(`${_magazinevideobanner_delete}/${deleteId}`)
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

        if (updateFormData.id === null) {
            setMessage("Please select a banner first.");
            return;
        }

        const trims = {
            title: values.title.trim(),
            duration: values.duration.trim(),
        };

        const formData = new FormData();
        formData.append('title', trims.title);
        formData.append('duration', trims.duration);

        if (values.thumbnail instanceof File) {
            formData.append('thumbnail', values.thumbnail);
        }

        if (videoInputType === 'file' && values.video instanceof File) {
            formData.append('video', values.video);
        } else if (videoInputType === 'url' && typeof values.video === 'string') {
            formData.append('video', values.video.trim());
        }

        try {
            await axiosInstance.put(`${_magazinevideobanner_update}/${updateFormData.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Banner updated successfully!");
            fetchBanners();

            if (fileInputRef.current) fileInputRef.current.value = "";

            setUpdateFormData({});
            setPreview({ image: '', video: '' });
            setShowForm(false);
            resetForm();
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

    const openVideoModal = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setVideoModal(true);
    }

    const extractYouTubeVideoId = (url) => {
        const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : '';
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
                            {banners?.length < 2
                                ?
                                <CButton as="input" type="button" color="primary" value={showForm !== true ? "Add" : "Close"} onClick={() => handleActiveForm()} />
                                :
                                !activeFrom || showForm && <CButton as="input" type="button" color="primary" value="Close" onClick={() => handleActiveForm()} />
                            }
                        </CCardHeader>
                        {showForm ?
                            !activeFrom ?
                                banners?.length < 2 &&
                                <CCardBody className='row g-3'>
                                    <Formik
                                        initialValues={{
                                            title: '',
                                            duration: '',
                                            thumbnail: null,
                                            video: null
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}>
                                        {({ values, setFieldValue, handleChange, handleSubmit, handleBlur, errors, touched }) => (
                                            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}>
                                                <CCol md={5}>
                                                    <CFormLabel htmlFor="title">Title</CFormLabel>
                                                    <CFormInput type="text" name='title' value={values.title} onChange={handleChange} />
                                                    {errors.title && touched.title &&
                                                        <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={2}>
                                                    <CFormLabel htmlFor="duration">Duration</CFormLabel>
                                                    <CFormInput type="text" name='duration' value={values.duration} onChange={handleChange} />
                                                    {errors.duration && touched.duration &&
                                                        <CFormFeedback className="text-danger small">{errors.duration}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={5}>
                                                    <CFormLabel htmlFor="thumbnail">Thumbnail<span className='text-danger'>*</span></CFormLabel>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <CFormInput
                                                            type="file"
                                                            accept="image/*"
                                                            name="thumbnail"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];

                                                                if (file) {
                                                                    setOriginalImage(file);
                                                                    setShowCropModal(true);
                                                                }
                                                            }}
                                                            ref={fileInputRef}
                                                        />

                                                        {values.thumbnail && (
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
                                                                setFieldValue('thumbnail', blob);
                                                            }}
                                                        />
                                                        <ImagePreview
                                                            visible={showPreviewModal}
                                                            imageFile={values.thumbnail}
                                                            onClose={() => setShowPreviewModal(false)}
                                                        />
                                                    </div>
                                                    {errors.thumbnail && touched.thumbnail &&
                                                        <CFormFeedback className="text-danger small">{errors.thumbnail}</CFormFeedback>}
                                                </CCol>
                                                <CCol md={2}>
                                                    <CFormLabel htmlFor="videoType">Video Type</CFormLabel>
                                                    <CFormSelect
                                                        id="videoType"
                                                        value={videoInputType}
                                                        onChange={(e) => {
                                                            const selectedType = e.target.value;
                                                            setVideoInputType(selectedType);
                                                            setFieldValue("video", "");
                                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                                        }}
                                                    >
                                                        <option value="file">Upload File</option>
                                                        <option value="url">YouTube URL</option>
                                                    </CFormSelect>
                                                </CCol>

                                                {videoInputType === "file" && (
                                                    <CCol md={5}>
                                                        <CFormLabel htmlFor="video">Video File<span className="text-danger">*</span></CFormLabel>
                                                        <CFormInput
                                                            type="file"
                                                            accept="video/*"
                                                            name="video"
                                                            onChange={(e) => setFieldValue("video", e.target.files[0])}
                                                            ref={fileInputRef}
                                                        />
                                                        {errors.video && touched.video && (
                                                            <CFormFeedback className="text-danger small">{errors.video}</CFormFeedback>
                                                        )}
                                                    </CCol>
                                                )}

                                                {videoInputType === "url" && (
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="video">YouTube URL<span className="text-danger">*</span></CFormLabel>
                                                        <CFormInput
                                                            type="url"
                                                            name="video"
                                                            placeholder="https://www.youtube.com/watch?v=..."
                                                            value={values.video}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        {errors.video && touched.video && (
                                                            <CFormFeedback className="text-danger small">{errors.video}</CFormFeedback>
                                                        )}
                                                    </CCol>
                                                )}
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
                                                duration: updateFormData.duration || '',
                                                thumbnail: updateFormData.thumbnail || null,
                                                video: updateFormData.video || null
                                            }}
                                            enableReinitialize={true}
                                            validationSchema={updateValidationSchema}
                                            onSubmit={handleUpdate}>
                                            {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                                <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}>
                                                    <CCol md={5}>
                                                        <CFormLabel htmlFor="title">Title</CFormLabel>
                                                        <CFormInput type="text" id="validationCustom01" name='title' value={values.title} onChange={handleChange} />
                                                        {errors.title && touched.title &&
                                                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                                    </CCol>
                                                    <CCol md={2}>
                                                        <CFormLabel htmlFor="duration">Duration</CFormLabel>
                                                        <CFormInput type="text" name='duration' value={values.duration} onChange={handleChange} />
                                                        {errors.duration && touched.duration &&
                                                            <CFormFeedback className="text-danger small">{errors.duration}</CFormFeedback>}
                                                    </CCol>
                                                    <CCol md={5}>
                                                        <CFormLabel htmlFor="thumbnail">Thumbnail<span className='text-danger'>*</span></CFormLabel>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <CFormInput
                                                                type="file"
                                                                accept="image/*"
                                                                name="thumbnail"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];

                                                                    if (file) {
                                                                        setOriginalImage(file);
                                                                        setShowCropModal(true);
                                                                    }
                                                                }}
                                                                ref={fileInputRef}
                                                            />

                                                            {preview.image && (
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
                                                                    setFieldValue('thumbnail', blob);
                                                                    setPreview((prev) => ({
                                                                        ...prev,
                                                                        image: URL.createObjectURL(blob)
                                                                    }));
                                                                }}
                                                            />
                                                            <ImagePreview
                                                                visible={showPreviewModal}
                                                                imageFile={preview.image.startsWith("blob:") ? preview.image : preview.image}
                                                                onClose={() => setShowPreviewModal(false)}
                                                            />
                                                        </div>

                                                        {errors.thumbnail && touched.thumbnail &&
                                                            <CFormFeedback className="text-danger small">{errors.thumbnail}</CFormFeedback>}
                                                    </CCol>
                                                    <CCol md={2}>
                                                        <CFormLabel htmlFor="video">Video Type</CFormLabel>
                                                        <CFormSelect
                                                            className="mb-2"
                                                            value={videoInputType}
                                                            onChange={(e) => {
                                                                const type = e.target.value;
                                                                setVideoInputType(type);
                                                                setPreview(prev => ({ ...prev, video: '' }));
                                                                setFieldValue("video", '');
                                                            }}
                                                        >
                                                            <option value="file">Video File</option>
                                                            <option value="url">YouTube URL</option>
                                                        </CFormSelect>
                                                    </CCol>

                                                    <CCol xs={5}>
                                                        {videoInputType === "file" && (
                                                            <>
                                                                <CFormLabel htmlFor="video">Video <span className="text-danger">*</span></CFormLabel>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <CFormInput
                                                                        type="file"
                                                                        accept="video/*"
                                                                        name="video"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) {
                                                                                setFieldValue("video", file);
                                                                                setPreview(prev => ({
                                                                                    ...prev,
                                                                                    video: URL.createObjectURL(file)
                                                                                }));
                                                                            }
                                                                        }}
                                                                        ref={fileInputRef}
                                                                    />
                                                                    {preview.video && (
                                                                        <CButton color="primary" size="md" type="button" onClick={() => openVideoModal(preview.video)}>
                                                                            Preview
                                                                        </CButton>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}

                                                        {videoInputType === "url" && (
                                                            <>
                                                                <CFormLabel htmlFor="video">Video <span className="text-danger">*</span></CFormLabel>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <CFormInput
                                                                        type="url"
                                                                        name="video"
                                                                        placeholder="https://www.youtube.com/watch?v=..."
                                                                        value={values.video}
                                                                        onChange={(e) => {
                                                                            handleChange(e);
                                                                            setPreview(prev => ({ ...prev, video: e.target.value }));
                                                                        }}
                                                                    />
                                                                    {preview.video && (
                                                                        <CButton color="primary" size="md" type="button" onClick={() => openVideoModal(preview.video)}>
                                                                            Preview
                                                                        </CButton>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}

                                                        <CModal visible={videoModal} onClose={() => setVideoModal(false)} size="lg">
                                                            <CModalHeader closeButton>Video Preview</CModalHeader>
                                                            <CModalBody className="d-flex justify-content-center">
                                                                {selectedVideo && (
                                                                    videoInputType === "file" ? (
                                                                        <video width="100%" controls autoPlay>
                                                                            <source src={selectedVideo} type="video/mp4" />
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                    ) : (
                                                                        extractYouTubeVideoId(selectedVideo) ? (
                                                                            <iframe
                                                                                width="100%"
                                                                                height="400"
                                                                                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(selectedVideo)}`}
                                                                                title="YouTube video preview"
                                                                                frameBorder="0"
                                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                allowFullScreen
                                                                            ></iframe>
                                                                        ) : (
                                                                            <p className="text-danger">Invalid YouTube URL</p>
                                                                        )
                                                                    )
                                                                )}
                                                            </CModalBody>
                                                        </CModal>

                                                        {errors.video && touched.video && (
                                                            <CFormFeedback className="text-danger small">{errors.video}</CFormFeedback>
                                                        )}
                                                    </CCol>
                                                    <CCol xs={12}>
                                                        <CButton color="primary" type="submit">
                                                            Update
                                                        </CButton>
                                                    </CCol>
                                                    {message && <CAlert color="primary mt-4">{message}</CAlert>}
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

export default VideoBanner;
