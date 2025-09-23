import React, { Fragment, useEffect, useRef, useState } from "react";
import axiosInstance from "../../config/axios.config";
import { _branddetails_get, _branddetails_update, _branddetails_create, _url_aboutusBanner_img, _brands_get } from "../../config/api.endpoints";
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormFeedback,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CRow,
    CSpinner,
} from "@coreui/react";
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import { handleApiError } from "../../utils/errorHelper";
import ImagePreview from "../../components/image-cropper/ImagePreview";
import ImageCropper from "../../components/image-cropper/ImageCropper";

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
    author: yup.string()
        .required("Author is required")
        .test("no-whitespace", "Author cannot be empty or only spaces", (value) => value && value.trim().length > 0)
        .max(255, "Author must be at most 255 characters")
        .test("word-count", function (value) {
            if (!value) return this.createError({ message: "Author is required" });

            const wordCount = value.trim().split(/\s+/).length;

            if (wordCount > 5) {
                return this.createError({ message: `Author must not exceed 5 words. Currently, it has ${wordCount}.` });
            }
            return true;
        })
        .matches(/^[a-zA-Z0-9\s.,!?()-]+$/, "Author contains invalid characters"),
    brand: yup.number()
        .required("brand is required"),
    date: yup.date()
        .required("Date is required")
        .typeError("Invalid date format"),
    content: yup.string()
        .required("Content is required"),
    thumbnail_image: yup.mixed()
        .required("Thumbnail image is required")
        .test("fileType", "Only JPG, PNG, and WebP files are allowed", (value) => {
            if (!value || typeof value !== "object") return true;
            return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
        })
        .test("fileSize", "Image size must be less than 5MB", (value) => {
            if (!value || typeof value !== "object") return true;
            return value.size <= 5 * 1024 * 1024;
        }),
    banner_image: yup.mixed()
        .nullable()
        .required("Banner image is required")
        .test("fileType", "Only JPG, PNG, and WebP files are allowed", (value) => {
            if (!value || typeof value !== "object") return true;
            return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
        })
        .test("fileSize", "Image size must be less than 5MB", (value) => {
            if (!value || typeof value !== "object") return true;
            return value.size <= 5 * 1024 * 1024;
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
    author: yup.string()
        .required("Author is required")
        .test("no-whitespace", "Author cannot be empty or only spaces", (value) => value && value.trim().length > 0)
        .max(255, "Author must be at most 255 characters")
        .test("word-count", function (value) {
            if (!value) return this.createError({ message: "Author is required" });

            const wordCount = value.trim().split(/\s+/).length;

            if (wordCount > 5) {
                return this.createError({ message: `Author must not exceed 5 words. Currently, it has ${wordCount}.` });
            }
            return true;
        })
        .matches(/^[a-zA-Z0-9\s.,!?()-]+$/, "Author contains invalid characters"),
    brand: yup.number()
        .required("brand is required"),
    date: yup.date()
        .nullable()
        .required("Date is required")
        .typeError("Invalid date format"),
    content: yup.string()
        .required("Content is required"),
    thumbnail_image: yup.mixed()
        .nullable()
        .test("fileType", "Only JPG, PNG, and WebP files are allowed", (value) => {
            if (!value || typeof value !== "object") return true;
            return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
        })
        .test("fileSize", "Image size must be less than 5MB", (value) => {
            if (!value || typeof value !== "object") return true;
            return value.size <= 5 * 1024 * 1024;
        }),
    banner_image: yup.mixed()
        .nullable()
        .test("fileType", "Only JPG, PNG, and WebP files are allowed", (value) => {
            if (!value || typeof value !== "object") return true;
            return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
        })
        .test("fileSize", "Image size must be less than 5MB", (value) => {
            if (!value || typeof value !== "object") return true;
            return value.size <= 5 * 1024 * 1024;
        }),
});

const AddBlog = ({ licenseKey }) => {
    const navigate = useNavigate();
    const cloud = useCKEditorCloud({ version: '44.2.0', premium: true });
    const [item, setItem] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState("");

    const [originalImage, setOriginalImage] = useState(null);
    const [currentCroppingField, setCurrentCroppingField] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);

    const [showThumbnailPreview, setShowThumbnailPreview] = useState(false);
    const [showBannerPreview, setShowBannerPreview] = useState(false);

    const fileInputRef = useRef(null);

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
        fetchItem();
    }, []);

    const fetchItem = async () => {
        setIsLoading(true)

        try {
            const { data } = await axiosInstance.get(_brands_get)
            setItem(data)
        } catch (err) {
            setError(handleApiError(err))
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        setError('');
        setMessage('');

        const trims = {
            title: values.title.trim(),
            subtitle: values.subtitle.trim(),
            author: values.author.trim(),
            content: values.content.trim(),
        };

        const data = new FormData();

        data.append("title", trims.title);
        data.append("subtitle", trims.subtitle);
        data.append("author", trims.author);
        data.append("brand", Number(values.brand));
        data.append("date", values.date);
        data.append("content", trims.content);
        data.append("thumbnail_image", values.thumbnail_image);
        data.append("banner_image", values.banner_image);

        try {
            await axiosInstance.post(_branddetails_create, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Blog added successfully!");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            };

            resetForm();
            navigate("/brand-details");
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };


    if (cloud.status === 'error') return <CAlert>Error...</CAlert>;
    if (cloud.status === 'loading') return <CSpinner color="primary" />;

    if (isLoading) return <CSpinner color="primary" />
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Add</strong> <small>Blog</small>
                    </CCardHeader>
                    <CCardBody className="row g-3">
                        <Formik
                            initialValues={{
                                title: "",
                                subtitle: "",
                                author: "",
                                brand: null,
                                date: null,
                                content: "",
                                thumbnail_image: null,
                                banner_image: null,
                            }}
                            enableReinitialize={true}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}>
                            {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                <CForm
                                    className="row g-3"
                                    onSubmit={handleSubmit}
                                >
                                    <CCol md={4}>
                                        <CFormLabel>Title</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                        />
                                        {errors.title && touched.title &&
                                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={8}>
                                        <CFormLabel>Subtitle</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="subtitle"
                                            value={values.subtitle}
                                            onChange={handleChange}
                                        />
                                        {errors.subtitle && touched.subtitle &&
                                            <CFormFeedback className="text-danger small">{errors.subtitle}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel>Author<span className='text-danger'>*</span></CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="author"
                                            value={values.author}
                                            onChange={handleChange}
                                        />
                                        {errors.author && touched.author &&
                                            <CFormFeedback className="text-danger small">{errors.author}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel htmlFor="brand">Brand<span className='text-danger'>*</span></CFormLabel>
                                        <CFormSelect name="brand" onChange={handleChange}>
                                            <option>Select Brand</option>
                                            {item?.map((brand) => (
                                                <Fragment key={brand.id}>
                                                    <option value={brand.id}>
                                                        {brand?.name}
                                                    </option>
                                                </Fragment>
                                            ))}
                                        </CFormSelect>
                                        {errors.brand && touched.brand && <div className="text-danger small">{errors.brand}</div>}
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel>Date<span className='text-danger'>*</span></CFormLabel>
                                        <CFormInput
                                            type="date"
                                            name="date"
                                            value={values.date}
                                            onChange={handleChange}
                                        />
                                        {errors.date && touched.date &&
                                            <CFormFeedback className="text-danger small">{errors.date}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel>Thumbnail Image<span className='text-danger'>*</span></CFormLabel>
                                        <div className="d-flex align-items-center gap-2">
                                            <CFormInput
                                                type="file"
                                                accept="image/*"
                                                name="thumbnail_image"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];

                                                    if (file) {
                                                        setOriginalImage(file);
                                                        setCurrentCroppingField("thumbnail_image");
                                                        setShowCropModal(true);
                                                    }
                                                }}
                                            />

                                            {values.thumbnail_image && (
                                                <CButton
                                                    color="primary"
                                                    size="md"
                                                    type="button"
                                                    onClick={() => setShowThumbnailPreview(true)}
                                                >
                                                    Preview
                                                </CButton>
                                            )}
                                        </div>
                                        <div>
                                            <ImageCropper
                                                show={showCropModal}
                                                imageFile={originalImage}
                                                onClose={() => {
                                                    setShowCropModal(false);
                                                    setOriginalImage(null);
                                                    setCurrentCroppingField(null);
                                                }}
                                                onCropDone={(blob) => {
                                                    if (currentCroppingField) {
                                                        setFieldValue(currentCroppingField, blob);
                                                    }
                                                    setShowCropModal(false);
                                                    setOriginalImage(null);
                                                    setCurrentCroppingField(null);
                                                }}
                                            />
                                            <ImagePreview
                                                visible={showThumbnailPreview}
                                                imageFile={values.thumbnail_image}
                                                onClose={() => setShowThumbnailPreview(false)}
                                            />
                                        </div>
                                        {errors.thumbnail_image && touched.thumbnail_image &&
                                            <CFormFeedback className="text-danger small">{errors.thumbnail_image}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel>Banner Image<span className='text-danger'>*</span></CFormLabel>
                                        <div className="d-flex align-items-center gap-2">
                                            <CFormInput
                                                type="file"
                                                accept="image/*"
                                                name="banner_image"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];

                                                    if (file) {
                                                        setOriginalImage(file);
                                                        setCurrentCroppingField("banner_image");
                                                        setShowCropModal(true);
                                                    }
                                                }}
                                            />

                                            {values.banner_image && (
                                                <CButton
                                                    color="primary"
                                                    size="md"
                                                    type="button"
                                                    onClick={() => setShowBannerPreview(true)}
                                                >
                                                    Preview
                                                </CButton>
                                            )}
                                        </div>
                                        <div>
                                            <ImageCropper
                                                show={showCropModal}
                                                imageFile={originalImage}
                                                onClose={() => {
                                                    setShowCropModal(false);
                                                    setOriginalImage(null);
                                                    setCurrentCroppingField(null);
                                                }}
                                                onCropDone={(blob) => {
                                                    if (currentCroppingField) {
                                                        setFieldValue(currentCroppingField, blob);
                                                    }
                                                    setShowCropModal(false);
                                                    setOriginalImage(null);
                                                    setCurrentCroppingField(null);
                                                }}
                                            />
                                            <ImagePreview
                                                visible={showBannerPreview}
                                                imageFile={values.banner_image}
                                                onClose={() => setShowBannerPreview(false)}
                                            />
                                        </div>
                                        {errors.banner_image && touched.banner_image &&
                                            <CFormFeedback className="text-danger small">{errors.banner_image}</CFormFeedback>}
                                    </CCol>

                                    <CCol xs={12}>
                                        <CKEditor
                                            editor={cloud.CKEditor.ClassicEditor}
                                            data={values.content}
                                            config={{
                                                licenseKey: licenseKey,
                                                plugins: [
                                                    cloud.CKEditor.Essentials,
                                                    cloud.CKEditor.Paragraph,
                                                    cloud.CKEditor.Heading,
                                                    cloud.CKEditor.Bold,
                                                    cloud.CKEditor.Italic,
                                                    cloud.CKEditor.RemoveFormat,
                                                    cloud.CKEditor.Strikethrough,
                                                    cloud.CKEditor.Autoformat,

                                                    // Font & Style
                                                    cloud.CKEditor.Font,
                                                    cloud.CKEditor.FontSize,
                                                    cloud.CKEditor.Alignment,

                                                    // Lists
                                                    cloud.CKEditor.List,
                                                    cloud.CKEditor.ListProperties,

                                                    // Tables
                                                    cloud.CKEditor.Table,

                                                    // Links & Embeds
                                                    cloud.CKEditor.Link,
                                                    // cloud.CKEditor.MediaEmbed,

                                                    // Images
                                                    cloud.CKEditor.Image,
                                                    cloud.CKEditor.ImageToolbar,
                                                    cloud.CKEditor.ImageStyle,
                                                    cloud.CKEditor.ImageInsert,
                                                    // cloud.CKEditor.ImageUpload,
                                                    cloud.CKEditor.Base64UploadAdapter,
                                                    cloud.CKEditor.AutoImage,

                                                    cloud.CKEditor.ImageUpload,
                                                    cloud.CKEditor.Alignment,
                                                ],
                                                toolbar: {
                                                    items: [
                                                        // Undo/Redo
                                                        'undo', 'redo',

                                                        // Headings
                                                        '|', 'heading',

                                                        // Font & Styles
                                                        '|', 'fontfamily', 'fontsize',
                                                        '|', 'fontColor', 'fontBackgroundColor',
                                                        '|', 'bold', 'italic', 'strikethrough', 'removeFormat',
                                                        '|', 'alignment',

                                                        // Lists
                                                        '|', 'bulletedList', 'numberedList', 'todoList',

                                                        // Indentation
                                                        '|', 'outdent', 'indent',

                                                        // Image & Media
                                                        '|', 'insertImage',
                                                        // 'uploadImage', 'mediaEmbed',

                                                        // Links & Blocks
                                                        '|', 'link', 'blockQuote', 'codeBlock'
                                                    ],
                                                    shouldNotGroupWhenFull: false
                                                },
                                                image: {
                                                    styles: [
                                                        'alignLeft',
                                                        'alignCenter',
                                                        'alignRight',
                                                    ],
                                                    toolbar: [
                                                        'imageTextAlternative',
                                                        'imageStyle:alignLeft',
                                                        'imageStyle:alignCenter',
                                                        'imageStyle:alignRight',
                                                    ],
                                                    style: {
                                                        definitions: [
                                                            {
                                                                name: 'Align left',
                                                                title: 'Align left',
                                                                modelElements: ['imageBlock'],
                                                                class: 'image-style-align-left'
                                                            },
                                                            {
                                                                name: 'Align center',
                                                                title: 'Align center',
                                                                modelElements: ['imageBlock'],
                                                                class: 'image-style-align-center'
                                                            },
                                                            {
                                                                name: 'Align right',
                                                                title: 'Align right',
                                                                modelElements: ['imageBlock'],
                                                                class: 'image-style-align-right'
                                                            },
                                                            {
                                                                name: 'Full size image',
                                                                title: 'Full',
                                                                modelElements: ['imageBlock'],
                                                                class: 'image-style-full'
                                                            },
                                                            {
                                                                name: 'Side image',
                                                                title: 'Side',
                                                                modelElements: ['imageBlock'],
                                                                class: 'image-style-side'
                                                            }
                                                        ]
                                                    }

                                                },
                                            }}
                                            onChange={(event, editor) => {
                                                setFieldValue('content', editor.getData());
                                            }}
                                        />
                                        {errors.content && touched.content &&
                                            <CFormFeedback className="text-danger small">{errors.content}</CFormFeedback>}
                                    </CCol>
                                    <CCol xs={12}>
                                        <CButton color="primary" type="submit">
                                            Submit
                                        </CButton>
                                    </CCol>
                                </CForm>
                            )}
                        </Formik>
                        <div className='mt-4'>
                            {message && <CAlert color="primary">{message}</CAlert>}
                            {error && <CAlert color="danger">{error}</CAlert>}
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

const UpdateBlog = ({ blogId, licenseKey }) => {
    const cloud = useCKEditorCloud({ version: "44.2.0", premium: true });
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        author: "",
        date: "",
        content: "",
        thumbnail_image: null,
        banner_image: null,
    });
    const [item, setItem] = useState([])
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState({
        thumbnailPreview: '',
        bannerPreview: ''
    });

    const [originalImage, setOriginalImage] = useState(null);
    const [currentCroppingField, setCurrentCroppingField] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);

    const [showThumbnailPreview, setShowThumbnailPreview] = useState(false);
    const [showBannerPreview, setShowBannerPreview] = useState(false);

    useEffect(() => {
        fetchItem();
    }, []);

    const fetchItem = async () => {
        setIsLoading(true)

        try {
            const { data } = await axiosInstance.get(_brands_get)
            setItem(data)
        } catch (err) {
            setError(handleApiError(err))
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        const fetchBlog = async () => {
            setIsLoading(true);

            try {
                const response = await axiosInstance.get(`${_branddetails_get}/${blogId}`);
                const data = response.data;

                const { thumbnail_image, banner_image } = data;

                if (thumbnail_image || banner_image) {
                    setPreview({
                        thumbnailPreview: thumbnail_image,
                        bannerPreview: banner_image
                    });
                };

                setFormData((prevData) => ({
                    title: data.title,
                    subtitle: data.subtitle,
                    author: data.author,
                    brand: data?.brand_id?.toString(),
                    date: data.date.split("T")[0],
                    content: data.content,
                    thumbnail_image: data.thumbnail_image instanceof File ? data.thumbnail_image : prevData.thumbnail_image,
                    banner_image: data.banner_image instanceof File ? data.banner_image : prevData.banner_image,
                }));
            } catch (err) {
                setError(handleApiError(Err));
            } finally {
                setIsLoading(false);
            }
        };

        if (blogId) fetchBlog();
    }, [blogId]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        setMessage('');


        if (!blogId || blogId === null) {
            setMessage("Please select a banner first.");
            return;
        };

        const trims = {
            title: values.title.trim(),
            subtitle: values.subtitle.trim(),
            author: values.author.trim(),
            content: values.content.trim(),
        };

        const data = new FormData();
        data.append('title', trims.title);
        data.append('subtitle', trims.subtitle);
        data.append('author', trims.author);
        data.append('brand', Number(values.brand));
        data.append('date', values.date);
        data.append('content', trims.content);

        if (values.thumbnail_image instanceof File) {
            data.append('thumbnail_image', values.thumbnail_image);
        }

        if (values.banner_image instanceof File) {
            data.append('banner_image', values.banner_image);
        }

        try {
            await axiosInstance.put(`${_branddetails_update}/${blogId}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("Blog updated successfully!");
            resetForm();

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            };

            setPreview({
                thumbnailPreview: '',
                bannerPreview: ''
            })
            navigate(`/brand-details`);
        } catch (err) {
            console.log("Brand details error", err);
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (cloud.status === "error") return <CAlert>Error...</CAlert>;
    if (cloud.status === "loading") return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;

    // const {
    //     ClassicEditor,
    //     Essentials, Paragraph, Bold, Italic, Autoformat, Font, Table, Link,
    //     FontSize, Alignment, RemoveFormat, List, ListProperties
    // } = cloud.CKEditor;
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Update</strong> <small>Blog</small>
                    </CCardHeader>
                    <CCardBody className="row g-3">
                        <Formik
                            initialValues={{
                                title: formData.title,
                                subtitle: formData.subtitle,
                                author: formData.author,
                                brand: formData.brand,
                                date: formData.date,
                                content: formData.content,
                                thumbnail_image: formData.thumbnail_image,
                                banner_image: formData.banner_image,
                            }}
                            enableReinitialize={true}
                            validationSchema={updateValidationSchema}
                            onSubmit={handleSubmit}>
                            {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                <CForm
                                    className="row g-3 needs-validation"
                                    onSubmit={handleSubmit}
                                >
                                    <CCol md={4}>
                                        <CFormLabel>Title</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                        />
                                        {errors.title && touched.title &&
                                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={8}>
                                        <CFormLabel>Subtitle</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="subtitle"
                                            value={values.subtitle}
                                            onChange={handleChange}
                                        />
                                        {errors.subtitle && touched.subtitle &&
                                            <CFormFeedback className="text-danger small">{errors.subtitle}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel>Author<span className='text-danger'>*</span></CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="author"
                                            value={values.author}
                                            onChange={handleChange}
                                        />
                                        {errors.author && touched.author &&
                                            <CFormFeedback className="text-danger small">{errors.author}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel htmlFor="brand">Brand<span className='text-danger'>*</span></CFormLabel>
                                        <CFormSelect
                                            name="brand"
                                            value={values.brand}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Brand</option>
                                            {item?.map((brand) => (
                                                <Fragment key={brand.id}>
                                                    <option value={brand.id}>
                                                        {brand.name}
                                                    </option>
                                                </Fragment>
                                            ))}
                                        </CFormSelect>

                                        {errors.brand && touched.brand && <div className="text-danger small">{errors.brand}</div>}
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel>Date<span className='text-danger'>*</span></CFormLabel>
                                        <CFormInput
                                            type="date"
                                            name="date"
                                            value={values.date}
                                            onChange={handleChange}
                                        />
                                        {errors.date && touched.date &&
                                            <CFormFeedback className="text-danger small">{errors.date}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel>Thumbnail Image<span className='text-danger'>*</span></CFormLabel>
                                        {/* <CFormInput
                                            type="file"
                                            accept="image/*"
                                            name="thumbnail_image"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setFieldValue("thumbnail_image", file);
                                                    setPreview((prev) => ({
                                                        ...prev,
                                                        thumbnailPreview: URL.createObjectURL(file)
                                                    }));
                                                }
                                            }}
                                            ref={fileInputRef}
                                        /> */}
                                        <div className="d-flex align-items-center gap-2">
                                            <CFormInput
                                                type="file"
                                                accept="image/*"
                                                name="thumbnail_image"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];

                                                    if (file) {
                                                        setOriginalImage(file);
                                                        setCurrentCroppingField("thumbnail_image");
                                                        setShowCropModal(true);
                                                    }
                                                }}
                                            />

                                            {preview.thumbnailPreview && (
                                                <CButton
                                                    color="primary"
                                                    size="md"
                                                    type="button"
                                                    onClick={() => setShowThumbnailPreview(true)}
                                                >
                                                    Preview
                                                </CButton>
                                            )}
                                        </div>
                                        <div>
                                            <ImageCropper
                                                show={showCropModal}
                                                imageFile={originalImage}
                                                onClose={() => {
                                                    setShowCropModal(false);
                                                    setOriginalImage(null);
                                                    setCurrentCroppingField(null);
                                                }}
                                                onCropDone={(blob) => {
                                                    if (currentCroppingField) {
                                                        setFieldValue(currentCroppingField, blob);
                                                    }
                                                    setShowCropModal(false);
                                                    setOriginalImage(null);
                                                    setCurrentCroppingField(null);
                                                }}
                                            />
                                            <ImagePreview
                                                visible={showThumbnailPreview}
                                                imageFile={preview.thumbnailPreview.startsWith("blob:") ? preview.thumbnailPreview : _url_aboutusBanner_img + preview.thumbnailPreview}
                                                onClose={() => setShowThumbnailPreview(false)}
                                            />
                                        </div>
                                        {errors.thumbnail_image && touched.thumbnail_image &&
                                            <CFormFeedback className="text-danger small">{errors.thumbnail_image}</CFormFeedback>}
                                        {/* {preview.thumbnailPreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={preview.thumbnailPreview.startsWith("blob:") ? preview.thumbnailPreview : _url_aboutusBanner_img + preview.thumbnailPreview}
                                                    alt="Preview"
                                                    width="100"
                                                    style={{ borderRadius: "5px" }}
                                                />
                                            </div>
                                        )} */}
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel>Banner Image<span className='text-danger'>*</span></CFormLabel>
                                        {/* <CFormInput
                                            type="file"
                                            accept="image/*"
                                            name="banner_image"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setFieldValue("banner_image", file);
                                                    setPreview((prev) => ({
                                                        ...prev,
                                                        bannerPreview: URL.createObjectURL(file)
                                                    }));
                                                }
                                            }}
                                            ref={fileInputRef}
                                        /> */}
                                        <div className="d-flex align-items-center gap-2">
                                            <CFormInput
                                                type="file"
                                                accept="image/*"
                                                name="banner_image"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];

                                                    if (file) {
                                                        setOriginalImage(file);
                                                        setCurrentCroppingField("banner_image");
                                                        setPreview((prev) => ({
                                                            ...prev,
                                                            bannerPreview: URL.createObjectURL(file)
                                                        }));
                                                        setShowCropModal(true);
                                                    }
                                                }}
                                            />

                                            {preview.bannerPreview && (
                                                <CButton
                                                    color="primary"
                                                    size="md"
                                                    type="button"
                                                    onClick={() => setShowBannerPreview(true)}
                                                >
                                                    Preview
                                                </CButton>
                                            )}
                                        </div>
                                        <div>
                                            <ImageCropper
                                                show={showCropModal}
                                                imageFile={originalImage}
                                                onClose={() => {
                                                    setShowCropModal(false);
                                                    setOriginalImage(null);
                                                    setCurrentCroppingField(null);
                                                }}
                                                onCropDone={(blob) => {
                                                    if (currentCroppingField) {
                                                        setFieldValue(currentCroppingField, blob);
                                                    }
                                                    setShowCropModal(false);
                                                    setOriginalImage(null);
                                                    setCurrentCroppingField(null);
                                                }}
                                            />
                                            <ImagePreview
                                                visible={showBannerPreview}
                                                imageFile={preview.bannerPreview.startsWith("blob:") ? preview.bannerPreview : _url_aboutusBanner_img + preview.bannerPreview}
                                                onClose={() => setShowBannerPreview(false)}
                                            />
                                        </div>

                                        {errors.banner_image && touched.banner_image &&
                                            <CFormFeedback className="text-danger small">{errors.banner_image}</CFormFeedback>}
                                        {/* {preview.bannerPreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={preview.bannerPreview.startsWith("blob:") ? preview.bannerPreview : _url_aboutusBanner_img + preview.bannerPreview}
                                                    alt="Preview"
                                                    width="100"
                                                    style={{ borderRadius: "5px" }}
                                                />
                                            </div>
                                        )} */}
                                    </CCol>

                                    <CCol xs={12}>
                                        {/* <CFormLabel>Content<span className='text-danger'>*</span></CFormLabel>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={formData.content}
                                            config={{
                                                licenseKey: licenseKey,
                                                plugins: [Essentials, Paragraph, Bold, Italic, Autoformat, Font, Table,
                                                    Link, FontSize, Alignment, RemoveFormat, List, ListProperties],
                                                toolbar: {
                                                    items: [
                                                        'undo', 'redo',
                                                        '|',
                                                        'heading',
                                                        '|',
                                                        'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                                        '|',
                                                        'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                                                        '|',
                                                        'link', 'uploadImage', 'blockQuote', 'codeBlock',
                                                        '|',
                                                        'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                                                    ],
                                                    shouldNotGroupWhenFull: false
                                                }
                                            }}
                                            onChange={(event, editor) => {
                                                setFieldValue('content', editor.getData());
                                            }}
                                        /> */}
                                        <CKEditor
                                            editor={cloud.CKEditor.ClassicEditor}
                                            data={values.content}
                                            config={{
                                                licenseKey: licenseKey,
                                                plugins: [
                                                    cloud.CKEditor.Essentials,
                                                    cloud.CKEditor.Paragraph,
                                                    cloud.CKEditor.Heading,
                                                    cloud.CKEditor.Bold,
                                                    cloud.CKEditor.Italic,
                                                    cloud.CKEditor.RemoveFormat,
                                                    cloud.CKEditor.Strikethrough,
                                                    cloud.CKEditor.Autoformat,

                                                    // Font & Style
                                                    cloud.CKEditor.Font,
                                                    cloud.CKEditor.FontSize,
                                                    cloud.CKEditor.Alignment,

                                                    // Lists
                                                    cloud.CKEditor.List,
                                                    cloud.CKEditor.ListProperties,

                                                    // Tables
                                                    cloud.CKEditor.Table,

                                                    // Links & Embeds
                                                    cloud.CKEditor.Link,
                                                    // cloud.CKEditor.MediaEmbed,

                                                    // Images
                                                    cloud.CKEditor.Image,
                                                    cloud.CKEditor.ImageToolbar,
                                                    cloud.CKEditor.ImageStyle,
                                                    cloud.CKEditor.ImageInsert,
                                                    // cloud.CKEditor.ImageUpload,
                                                    cloud.CKEditor.Base64UploadAdapter,
                                                    cloud.CKEditor.AutoImage,

                                                    cloud.CKEditor.ImageUpload,
                                                    cloud.CKEditor.Alignment,
                                                ],
                                                toolbar: {
                                                    items: [
                                                        // Undo/Redo
                                                        'undo', 'redo',

                                                        // Headings
                                                        '|', 'heading',

                                                        // Font & Styles
                                                        '|', 'fontfamily', 'fontsize',
                                                        '|', 'fontColor', 'fontBackgroundColor',
                                                        '|', 'bold', 'italic', 'strikethrough', 'removeFormat',
                                                        '|', 'alignment',

                                                        // Lists
                                                        '|', 'bulletedList', 'numberedList', 'todoList',

                                                        // Indentation
                                                        '|', 'outdent', 'indent',

                                                        // Image & Media
                                                        '|', 'insertImage',
                                                        // 'uploadImage', 'mediaEmbed',

                                                        // Links & Blocks
                                                        '|', 'link', 'blockQuote', 'codeBlock'
                                                    ],
                                                    shouldNotGroupWhenFull: false
                                                },
                                                image: {
                                                    styles: [
                                                        'alignLeft',
                                                        'alignCenter',
                                                        'alignRight',
                                                    ],
                                                    toolbar: [
                                                        'imageTextAlternative',
                                                        'imageStyle:alignLeft',
                                                        'imageStyle:alignCenter',
                                                        'imageStyle:alignRight',
                                                    ],
                                                    style: {
                                                        definitions: [
                                                            {
                                                                name: 'Align left',
                                                                title: 'Align left',
                                                                modelElements: ['imageBlock'],
                                                                class: 'image-style-align-left'
                                                            },
                                                            {
                                                                name: 'Align center',
                                                                title: 'Align center',
                                                                modelElements: ['imageBlock'],
                                                                class: 'image-style-align-center'
                                                            },
                                                            {
                                                                name: 'Align right',
                                                                title: 'Align right',
                                                                modelElements: ['imageBlock'],
                                                                class: 'image-style-align-right'
                                                            },
                                                            {
                                                                name: 'Full size image',
                                                                title: 'Full',
                                                                modelElements: ['imageBlock'],
                                                                class: 'image-style-full'
                                                            },
                                                            {
                                                                name: 'Side image',
                                                                title: 'Side',
                                                                modelElements: ['imageBlock'],
                                                                class: 'image-style-side'
                                                            }
                                                        ]
                                                    }

                                                },
                                            }}
                                            onChange={(event, editor) => {
                                                setFieldValue('content', editor.getData());
                                            }}
                                        />
                                        {errors.content && touched.content &&
                                            <CFormFeedback className="text-danger small">{errors.content}</CFormFeedback>}
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
                    <div className='mt-4'>
                        {message && <CAlert color="primary">{message}</CAlert>}
                        {/* {error && <CAlert color="danger">{error}</CAlert>} */}
                    </div>
                </CCard>
            </CCol>
        </CRow>
    );
};


const Add_UpdateBlog = () => {
    const licenseKey = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzEwMjcxOTksImp0aSI6ImZjYzExNTVkLWE2NWUtNDU3YS04Yzc2LTEzYzZiNDZiMzFjMCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCJdLCJ2YyI6ImU5OTY3YTBlIn0.cnf8PWSdcKOrwPfY4WDKCG9VCwoNYz2PCH11m_T_kMlkOXgoiTeiRchDrQZx-q2ZuszSZZz63naxSB8d9fKb5A';
    const location = useLocation();
    const pathParts = location.pathname.split("/");

    const isUpdatePath = pathParts.includes("update");
    const blogId = isUpdatePath ? pathParts[pathParts.length - 1] : null;

    return (
        <>
            {isUpdatePath && blogId ? (
                <UpdateBlog blogId={blogId} licenseKey={licenseKey} />
            ) : (
                <AddBlog licenseKey={licenseKey} />
            )}
        </>
    );
};

export default Add_UpdateBlog;