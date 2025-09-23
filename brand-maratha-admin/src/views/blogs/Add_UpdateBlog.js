import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../config/axios.config";
import { _blogs_get, _blogs_create, _blogs_update } from "../../config/api.endpoints";
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
    CFormTextarea,
    CRow,
    CSpinner,
} from "@coreui/react";
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import { handleApiError } from "../../utils/errorHelper";
import ImageCropper from "../../components/image-cropper/ImageCropper";
import ImagePreview from "../../components/image-cropper/ImagePreview";

const validationSchema = yup.object().shape({
    title: yup.string()
        .required("Title is required")
        .test("no-whitespace", "Title cannot be empty or only spaces", (value) => value && value.trim().length > 0)
        .max(255, "Title must be at most 255 characters"),
    label: yup.string()
        .required("Label is required")
        .test("no-whitespace", "Label cannot be empty or only spaces", (value) => value && value.trim().length > 0)
        .max(255, "Label must be at most 255 characters"),
    author: yup.string()
        .required("Author is required")
        .test("no-whitespace", "author cannot be empty or only spaces", (value) => value && value.trim().length > 0)
        .max(255, "Author name must be at most 255 characters"),
    date: yup.date()
        .typeError("Invalid date format")
        .required("Date is required"),
    metatitle: yup.string().nullable().notRequired(),
    metakeyword: yup.string().nullable().notRequired(),
    metadescription: yup.string().nullable().notRequired(),
    thumbnail_content: yup.string().nullable().notRequired(),
    content: yup.string()
        .required("Content is required"),
    thumbnail_image: yup.mixed()
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
    banner_image: yup.mixed()
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

const AddBlog = ({ licenseKey }) => {
    const navigate = useNavigate();
    const [originalImages, setOriginalImages] = useState({
        thumbnail: null,
        banner: null,
    });
    const [activeCropType, setActiveCropType] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const cloud = useCKEditorCloud({ version: '44.2.0', premium: true });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        setError('');

        const trims = {
            title: values.title.trim(),
            label: values.label.trim(),
            author: values.author.trim(),
            metatitle: values.metatitle.trim(),
            metadescription: values.metadescription.trim(),
            metakeyword: values.metakeyword.trim(),
            thumbnail_content: values.thumbnail_content.trim(),
        };

        try {
            const formData = new FormData();

            formData.append("title", trims.title);
            formData.append("label", trims.label);
            formData.append("author", trims.author);
            formData.append("date", values.date);
            formData.append("thumbnail_content", values.thumbnail_content);
            formData.append("content", values.content);
            formData.append("metatitle", trims.metatitle);
            formData.append("metadescription", trims.metadescription);
            formData.append("metakeyword", trims.metakeyword);

            if (values.thumbnail_image instanceof File) {
                formData.append("thumbnail_image", values.thumbnail_image);
            }

            if (values.banner_image instanceof File) {
                formData.append("banner_image", values.banner_image);
            }

            await axiosInstance.post(_blogs_create, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            resetForm();
            navigate("/base/blogs");
        } catch (err) {
            console.log("custom error", err)
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (cloud.status === 'error') return <CAlert color="danger">Error!</CAlert>;
    if (cloud.status === 'loading') return <CSpinner color="primary" className="d-block mx-auto my-5" />;

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    if (error) return <CAlert color="danger">{error}</CAlert>
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
                                label: "",
                                author: "",
                                date: "",
                                metatitle: "",
                                metadescription: '',
                                metakeyword: "",
                                thumbnail_content: '',
                                content: "",
                                thumbnail_image: null,
                                banner_image: null,
                            }}
                            enableReinitialize={true}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                <CForm className="row g-3" onSubmit={handleSubmit}>
                                    <CCol md={6}>
                                        <CFormLabel>Title<span className='text-danger'>*</span></CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                        />
                                        {errors.title && touched.title &&
                                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel>
                                            Label
                                            <span className='text-danger'>*</span>
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="label"
                                            value={values.label}
                                            onChange={handleChange}
                                        />
                                        {errors.label && touched.label &&
                                            <CFormFeedback className="text-danger small">{errors.label}</CFormFeedback>}
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

                                    <CCol md={4}>
                                        <CFormLabel>
                                            Thumbnail<span className="text-danger">*</span>
                                        </CFormLabel>
                                        <div className="d-flex align-items-center gap-2">
                                            <CFormInput
                                                type="file"
                                                accept="image/*"
                                                name="thumbnail_image"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setOriginalImages((prev) => ({ ...prev, thumbnail: file }));
                                                        setActiveCropType("thumbnail");
                                                        setShowCropModal(true);
                                                    }
                                                }}
                                            />
                                            {values.thumbnail_image && (
                                                <CButton
                                                    color="primary"
                                                    size="md"
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveCropType("thumbnail");
                                                        setShowPreviewModal(true);
                                                    }}
                                                >
                                                    Preview
                                                </CButton>
                                            )}
                                        </div>
                                        {errors.thumbnail_image && touched.thumbnail_image && (
                                            <CFormFeedback className="text-danger small">{errors.thumbnail_image}</CFormFeedback>
                                        )}
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel>
                                            Banner <span className="text-danger">*</span>
                                        </CFormLabel>
                                        <div className="d-flex align-items-center gap-2">
                                            <CFormInput
                                                type="file"
                                                accept="image/*"
                                                name="banner_image"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setOriginalImages((prev) => ({ ...prev, banner: file }));
                                                        setActiveCropType("banner");
                                                        setShowCropModal(true);
                                                    }
                                                }}
                                            />
                                            {values.banner_image && (
                                                <CButton
                                                    color="primary"
                                                    size="md"
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveCropType("banner");
                                                        setShowPreviewModal(true);
                                                    }}
                                                >
                                                    Preview
                                                </CButton>
                                            )}
                                        </div>
                                        {errors.banner_image && touched.banner_image && (
                                            <CFormFeedback className="text-danger small">{errors.banner_image}</CFormFeedback>
                                        )}

                                        <ImageCropper
                                            show={showCropModal}
                                            imageFile={originalImages[activeCropType]}
                                            onClose={() => setShowCropModal(false)}
                                            onCropDone={(blob) => {
                                                setFieldValue(`${activeCropType}_image`, blob);
                                                setShowCropModal(false);
                                            }}
                                        />

                                        <ImagePreview
                                            visible={showPreviewModal}
                                            imageFile={values[`${activeCropType}_image`]}
                                            onClose={() => setShowPreviewModal(false)}
                                        />
                                    </CCol>
                                    <CCol md={8}>
                                        <CFormLabel>Meta Title</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="metatitle"
                                            value={values.metatitle}
                                            onChange={handleChange}
                                        />
                                        {errors.metatitle && touched.metatitle &&
                                            <CFormFeedback className="text-danger small">{errors.metatitle}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel>Meta Description</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="metadescription"
                                            value={values.metadescription}
                                            onChange={handleChange}
                                        />
                                        {errors.metadescription && touched.metadescription &&
                                            <CFormFeedback className="text-danger small">{errors.metadescription}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel>Meta Keywords</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="metakeyword"
                                            value={values.metakeyword}
                                            onChange={handleChange}
                                        />
                                        {errors.metakeyword && touched.metakeyword &&
                                            <CFormFeedback className="text-danger small">{errors.metakeyword}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={12}>
                                        <CFormLabel>Thumbnil Content</CFormLabel>
                                        <CFormTextarea
                                            type="text"
                                            name="thumbnail_content"
                                            value={values.thumbnail_content}
                                            onChange={handleChange}
                                        />
                                        {errors.thumbnail_content && touched.thumbnail_content &&
                                            <CFormFeedback className="text-danger small">{errors.thumbnail_content}</CFormFeedback>}
                                    </CCol>

                                    <CCol xs={12}>
                                        <CKEditor
                                            editor={cloud.CKEditor.ClassicEditor}
                                            data={values.content}
                                            // onReady={(editor) => {
                                            //     console.log('Editor is ready to use!', editor);
                                            //     console.log(
                                            //         'Available toolbar items:',
                                            //         Array.from(editor.ui.componentFactory.names())
                                            //     );
                                            //     console.log("Loaded plugins:", editor.plugins._plugins.keys());
                                            // }}
                                            onChange={(event, editor) => {
                                                setFieldValue('content', editor.getData());
                                            }}
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
                                                    cloud.CKEditor.FontColor,
                                                    cloud.CKEditor.FontBackgroundColor,

                                                    // Lists
                                                    cloud.CKEditor.List,
                                                    cloud.CKEditor.ListProperties,

                                                    // Tables
                                                    cloud.CKEditor.Table,

                                                    // Links & Embeds
                                                    cloud.CKEditor.Link,

                                                    // Images
                                                    cloud.CKEditor.Image,
                                                    cloud.CKEditor.ImageToolbar,
                                                    cloud.CKEditor.ImageStyle,
                                                    cloud.CKEditor.ImageInsert,
                                                    cloud.CKEditor.Base64UploadAdapter,
                                                    cloud.CKEditor.AutoImage,
                                                    cloud.CKEditor.ImageUpload,
                                                    cloud.CKEditor.Alignment,

                                                    // MediaEmbed tools
                                                    cloud.CKEditor.MediaEmbed,

                                                    // Block tools
                                                    cloud.CKEditor.BlockQuote,
                                                    cloud.CKEditor.CodeBlock,

                                                    cloud.CKEditor.GeneralHtmlSupport,

                                                    // Horizontal Line
                                                    cloud.CKEditor.HorizontalLine,
                                                ],
                                                toolbar: {
                                                    items: [
                                                        // Undo/Redo
                                                        'undo', 'redo',

                                                        // Headings
                                                        '|', 'heading',

                                                        // Font & Styles
                                                        '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                                        '|', 'bold', 'italic', 'strikethrough', 'removeFormat',
                                                        '|', 'alignment', 'horizontalLine',

                                                        // Lists
                                                        '|', 'bulletedList', 'numberedList',

                                                        // Image & Media
                                                        '|', 'insertImage', 'mediaEmbed',
                                                        // 'uploadImage', ,

                                                        // Links & Blocks
                                                        '|', 'link', 'blockQuote',

                                                        '|', 'mediaAlign:left', 'mediaAlign:center', 'mediaAlign:right',
                                                    ],
                                                    shouldNotGroupWhenFull: false
                                                },
                                                mediaEmbed: {
                                                    previewsInData: true,
                                                    providers: [
                                                        {
                                                            name: 'instagram',
                                                            url: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/.*$/,
                                                            html: match => {
                                                                const url = match[0];
                                                                const postId = url.split('/')[4];
                                                                const isReel = url.includes('/reel/');
                                                                const embedUrl = `https://www.instagram.com/${isReel ? 'reel' : 'p'}/${postId}/embed`;

                                                                return `
                                                                    <div class="media-style-align-left">
                                                                        <div class="instagram-embed ${isReel ? 'reel' : 'post'}">
                                                                        <div class="iframe-container">
                                                                            <iframe
                                                                            src="${embedUrl}"
                                                                            frameborder="0"
                                                                            scrolling="no"
                                                                            allowtransparency="true"
                                                                            allowfullscreen
                                                                            style="border: none; overflow: hidden;">
                                                                            </iframe>
                                                                        </div>
                                                                        </div>
                                                                    </div>
                                                                `;
                                                            }
                                                        },
                                                        {
                                                            name: 'youtube',
                                                            url: [
                                                                /^https?:\/\/(www\.)?youtube\.com\/watch\?v=.*$/,
                                                                /^https?:\/\/youtu\.be\/.*$/
                                                            ],
                                                            html: (match) => {
                                                                const url = match[0];
                                                                const embedUrl = url.includes('youtu.be')
                                                                    ? url.replace('youtu.be/', 'www.youtube.com/embed/')
                                                                    : url.replace('watch?v=', 'embed/');

                                                                return `
                                                                    <div class="video-wrapper">
                                                                        <iframe
                                                                        src="${embedUrl}"
                                                                        frameborder="0"
                                                                        allowfullscreen
                                                                        ></iframe>
                                                                    </div>
                                                                `;
                                                            }
                                                        }

                                                    ]
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
                                                htmlSupport: {
                                                    allow: [
                                                        {
                                                            name: 'div',
                                                            classes: [
                                                                'media-style-align-left',
                                                                'instagram-embed',
                                                                'reel',
                                                                'post',
                                                                'iframe-container'
                                                            ],
                                                            styles: true,
                                                            attributes: true
                                                        },
                                                        {
                                                            name: 'iframe',
                                                            styles: true,
                                                            attributes: true,
                                                            classes: true
                                                        }
                                                    ]
                                                }
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
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

const UpdateBlog = ({ blogId, licenseKey }) => {
    const cloud = useCKEditorCloud({ version: "44.2.0", premium: true });

    const [originalImage, setOriginalImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [preview, setPreview] = useState({
        thumbnail: null,
        banner: null,
    });
    const [activeField, setActiveField] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        lebel: "",
        author: "",
        date: "",
        thumbnail_content: '',
        content: "",
        metatitle: "",
        metakeyword: "",
        thumbnail_image: null,
        banner_image: null,
    });

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        console.log("showPreviewModal", showPreviewModal);
    }, [showPreviewModal])

    const validationSchema = yup.object().shape({
        title: yup.string()
            .required("Title is required")
            .test("no-whitespace", "Title cannot be empty or only spaces", value => value && value.trim().length > 0)
            .max(255, "Title must be at most 255 characters"),

        label: yup.string()
            .required("Label is required")
            .test("no-whitespace", "Label cannot be empty or only spaces", value => value && value.trim().length > 0)
            .max(255, "Label must be at most 255 characters"),

        author: yup.string()
            .required("Author is required")
            .test("no-whitespace", "Author cannot be empty or only spaces", value => value && value.trim().length > 0)
            .max(255, "Author name must be at most 255 characters"),

        date: yup.date()
            .typeError("Invalid date format")
            .required("Date is required"),

        metatitle: yup.string().nullable().notRequired(),

        metakeyword: yup.string().nullable().notRequired(),

        metadescription: yup.string().nullable().notRequired(),

        thumbnail_content: yup.string().nullable().notRequired(),

        content: yup.string()
            .required("Content is required"),

        thumbnail_image: yup.mixed()
            .nullable()
            .test("fileType", "Only JPG, PNG, and WebP files are allowed", (value) => {
                if (!value || typeof value !== "object") return true;
                return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
            })
            .test("fileSize", "File size must be less than 5MB", function (value) {
                if (!value || typeof value !== "object") return true;
                if (value.size > 12 * 1024 * 1024) {
                    return this.createError({ message: "File exceeds 5MB limit" });
                }
                return true;
            }),

        banner_image: yup.mixed()
            .nullable()
            .test("fileType", "Only JPG, PNG, and WebP files are allowed", value => {
                if (!value || typeof value !== "object") return true;
                return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
            })
            .test("fileSize", "File size must be less than 5MB", function (value) {
                if (!value || typeof value !== "object") return true;
                return value.size <= 12 * 1024 * 1024;
            }),
    });

    useEffect(() => {
        const fetchBlog = async () => {
            setIsLoading(true);

            try {
                const { data } = await axiosInstance.get(`${_blogs_get}/${blogId}`);
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                }));

                setPreview({
                    thumbnail: data.thumbnail_image || '',
                    banner: data.banner_image || '',
                })
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setIsLoading(false);
            }
        };

        if (blogId) fetchBlog();
    }, [blogId]);

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const handleSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        setError('');

        if (!blogId) {
            setMessage("Please select a banner first.");
            return;
        };

        const trims = {
            title: values.title.trim(),
            label: values.label.trim(),
            author: values.author.trim(),
            thumbnail_content: values.thumbnail_content.trim(),
            metatitle: values.metatitle.trim(),
            metadescription: values.metadescription.trim(),
            metakeyword: values.metakeyword.trim(),
        };

        const formData = new FormData();

        formData.append('title', trims.title);
        formData.append('label', trims.label);
        formData.append('author', trims.author);
        formData.append('date', values.date);
        formData.append('thumbnail_content', values.thumbnail_content);
        formData.append('metatitle', values.metatitle);
        formData.append('metadescription', values.metadescription);
        formData.append('metakeyword', values.metakeyword);
        formData.append('content', values.content);

        if (values.thumbnail_image instanceof File) {
            formData.append("thumbnail_image", values.thumbnail_image);
        }

        if (values.banner_image instanceof File) {
            formData.append("banner_image", values.banner_image);
        }

        try {
            await axiosInstance.put(`${_blogs_update}/${blogId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            resetForm();
            setPreview({
                thumbnail: '',
                banner: ''
            });
            navigate(`/base/blogs`);
        } catch (err) {
            console.log("Update Error: ", err)
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (cloud.status === "error") return <div>Error!</div>;
    if (cloud.status === "loading") return <CSpinner color="primary" className="d-block mx-auto my-5" />;

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    if (error) return <CAlert>{error}</CAlert>

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
                                title: formData.title || "",
                                label: formData.label || "",
                                author: formData.author || "",
                                date: formData.date ? new Date(formData.date).toISOString().split("T")[0] : null,
                                thumbnail_content: formData.thumbnail_content || "",
                                metatitle: formData.metatitle || "",
                                metadescription: formData.metadescription || "",
                                metakeyword: formData.metakeyword || "",
                                content: formData.content || "",
                                thumbnail_image: formData.thumbnail_image || null,
                                banner_image: formData.banner_image || null,
                            }}
                            enableReinitialize={true}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                                <CForm className="row g-3" onSubmit={handleSubmit}>
                                    <CCol md={6}>
                                        <CFormLabel>Title<span className='text-danger'>*</span></CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                        />
                                        {errors.title && touched.title &&
                                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel>Label<span className='text-danger'>*</span></CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="label"
                                            value={values.label}
                                            onChange={handleChange}
                                        />
                                        {errors.label && touched.label &&
                                            <CFormFeedback className="text-danger small">{errors.label}</CFormFeedback>}
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

                                    <CCol md={4}>
                                        <CFormLabel>
                                            Thumbnail<span className="text-danger">*</span>
                                        </CFormLabel>
                                        <div className="d-flex align-items-center gap-2">
                                            <CFormInput
                                                type="file"
                                                accept="image/*"
                                                name="thumbnail_image"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setOriginalImage(file);
                                                        setActiveField("thumbnail_image");
                                                        setShowCropModal(true);
                                                    }
                                                }}
                                                ref={fileInputRef}
                                            />

                                            {preview.thumbnail && (
                                                <CButton
                                                    color="primary"
                                                    size="md"
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveField("thumbnail_image");
                                                        setShowPreviewModal(true);
                                                    }}
                                                >
                                                    Preview
                                                </CButton>
                                            )}
                                        </div>

                                        <ImageCropper
                                            show={showCropModal && activeField === "thumbnail_image"}
                                            imageFile={originalImage}
                                            onClose={() => setShowCropModal(false)}
                                            onCropDone={(blob) => {
                                                setFieldValue("thumbnail_image", blob);
                                                setPreview((prev) => ({
                                                    ...prev,
                                                    thumbnail: URL.createObjectURL(blob),
                                                }));
                                            }}
                                        />

                                        <ImagePreview
                                            visible={showPreviewModal && activeField === "thumbnail_image"}
                                            imageFile={preview.thumbnail}
                                            onClose={() => setShowPreviewModal(false)}
                                        />

                                        {errors.thumbnail_image && touched.thumbnail_image && (
                                            <CFormFeedback className="text-danger small">
                                                {errors.thumbnail_image}
                                            </CFormFeedback>
                                        )}
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel>Banner<span className="text-danger">*</span></CFormLabel>
                                        <div className="d-flex align-items-center gap-2">
                                            <CFormInput
                                                type="file"
                                                accept="image/*"
                                                name="banner_image"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setOriginalImage(file);
                                                        setActiveField("banner_image");
                                                        setShowCropModal(true);
                                                    }
                                                }}
                                                ref={fileInputRef}
                                            />

                                            {preview.banner && (
                                                <CButton
                                                    color="primary"
                                                    size="md"
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveField("banner_image");
                                                        setShowPreviewModal(true);
                                                    }}
                                                >
                                                    Preview
                                                </CButton>
                                            )}
                                        </div>

                                        <ImageCropper
                                            show={showCropModal && activeField === "banner_image"}
                                            imageFile={originalImage}
                                            onClose={() => setShowCropModal(false)}
                                            onCropDone={(blob) => {
                                                setFieldValue("banner_image", blob);
                                                setPreview((prev) => ({
                                                    ...prev,
                                                    banner: URL.createObjectURL(blob),
                                                }));
                                            }}
                                        />

                                        <ImagePreview
                                            visible={showPreviewModal && activeField === "banner_image"}
                                            imageFile={preview.banner}
                                            onClose={() => setShowPreviewModal(false)}
                                        />

                                        {errors.banner_image && touched.banner_image && (
                                            <CFormFeedback className="text-danger small">
                                                {errors.banner_image}
                                            </CFormFeedback>
                                        )}
                                    </CCol>

                                    <CCol md={8}>
                                        <CFormLabel>Meta Title</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="metatitle"
                                            value={values.metatitle}
                                            onChange={handleChange}
                                        />
                                        {errors.metatitle && touched.metatitle &&
                                            <CFormFeedback className="text-danger small">{errors.metatitle}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel>Meta Description</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="metadescription"
                                            value={values.metadescription}
                                            onChange={handleChange}
                                        />
                                        {errors.metadescription && touched.metadescription &&
                                            <CFormFeedback className="text-danger small">{errors.metadescription}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={6}>
                                        <CFormLabel>Meta Keywords</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="metakeyword"
                                            value={values.metakeyword}
                                            onChange={handleChange}
                                        />
                                        {errors.metakeyword && touched.metakeyword &&
                                            <CFormFeedback className="text-danger small">{errors.metakeyword}</CFormFeedback>}
                                    </CCol>

                                    <CCol md={12}>
                                        <CFormLabel>Thumbnail Content</CFormLabel>
                                        <CFormTextarea
                                            type="text"
                                            name="thumbnail_content"
                                            value={values.thumbnail_content}
                                            onChange={handleChange}
                                        />
                                        {errors.thumbnail_content && touched.thumbnail_content &&
                                            <CFormFeedback className="text-danger small">{errors.thumbnail_content}</CFormFeedback>}
                                    </CCol>

                                    <CCol xs={12}>
                                        {/* <CFormLabel>Content<span className='text-danger'>*</span></CFormLabel> */}
                                        {/* <CKEditor
                                            editor={cloud.CKEditor.ClassicEditor}
                                            data={values.content}
                                            onChange={(event, editor) => {
                                                setFieldValue('content', editor.getData());
                                                console.log("Editor", cloud.CKEditor.ClassicEditor.builtinPlugins.map(p => p.pluginName));
                                            }}
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
                                                    cloud.CKEditor.FontColor,
                                                    cloud.CKEditor.FontBackgroundColor,


                                                    // Lists
                                                    cloud.CKEditor.List,
                                                    cloud.CKEditor.ListProperties,

                                                    // Tables
                                                    cloud.CKEditor.Table,

                                                    // Links & Embeds
                                                    cloud.CKEditor.Link,

                                                    // Images
                                                    cloud.CKEditor.Image,
                                                    cloud.CKEditor.ImageToolbar,
                                                    cloud.CKEditor.ImageStyle,
                                                    cloud.CKEditor.ImageInsert,
                                                    cloud.CKEditor.Base64UploadAdapter,
                                                    cloud.CKEditor.AutoImage,
                                                    cloud.CKEditor.ImageUpload,
                                                    cloud.CKEditor.Alignment,

                                                    // MediaEmbed tools
                                                    cloud.CKEditor.MediaEmbed,

                                                    // Block tools
                                                    cloud.CKEditor.BlockQuote,
                                                    cloud.CKEditor.CodeBlock,

                                                ],
                                                toolbar: {
                                                    items: [
                                                        // Undo/Redo
                                                        'undo', 'redo',

                                                        // Headings
                                                        '|', 'heading',

                                                        // Font & Styles
                                                        '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                                        '|', 'bold', 'italic', 'strikethrough', 'removeFormat',
                                                        '|', 'alignment',

                                                        // Lists
                                                        '|', 'bulletedList', 'numberedList',
                                                        // 'todoList',

                                                        // Image & Media
                                                        '|', 'insertImage', 'uploadImage', 'mediaEmbed',

                                                        // Links & Blocks
                                                        '|', 'link', 'blockQuote', 'codeBlock'
                                                    ], shouldNotGroupWhenFull: false
                                                },
                                                mediaEmbed: {
                                                    previewsInData: true
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
                                        /> */}
                                        {/* <CKEditor
                                            editor={cloud.CKEditor.ClassicEditor}
                                            data={values.content}
                                            onReady={(editor) => {
                                                console.log('✅ Editor is ready to use!', editor);
                                                console.log(
                                                    'Available toolbar items:',
                                                    Array.from(editor.ui.componentFactory.names())
                                                );
                                                console.log("Loaded plugins:", editor.plugins._plugins.keys());
                                            }}
                                            onChange={(event, editor) => {
                                                setFieldValue('content', editor.getData());
                                            }}
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
                                                    cloud.CKEditor.FontColor,
                                                    cloud.CKEditor.FontBackgroundColor,

                                                    // Lists
                                                    cloud.CKEditor.List,
                                                    cloud.CKEditor.ListProperties,

                                                    // Tables
                                                    cloud.CKEditor.Table,

                                                    // Links & Embeds
                                                    cloud.CKEditor.Link,

                                                    // Images
                                                    cloud.CKEditor.Image,
                                                    cloud.CKEditor.ImageToolbar,
                                                    cloud.CKEditor.ImageStyle,
                                                    cloud.CKEditor.ImageInsert,
                                                    cloud.CKEditor.Base64UploadAdapter,
                                                    cloud.CKEditor.AutoImage,
                                                    cloud.CKEditor.ImageUpload,
                                                    cloud.CKEditor.Alignment,

                                                    // MediaEmbed tools
                                                    cloud.CKEditor.MediaEmbed,
                                                    // cloud.CKEditor.HorizontalLine,

                                                    // Block tools
                                                    cloud.CKEditor.BlockQuote,
                                                    cloud.CKEditor.CodeBlock,

                                                    cloud.CKEditor.GeneralHtmlSupport,

                                                    // Horizontal Line
                                                    cloud.CKEditor.HorizontalLine,
                                                ],
                                                toolbar: {
                                                    items: [
                                                        // Undo/Redo
                                                        'undo', 'redo',

                                                        // Headings
                                                        '|', 'heading',

                                                        // Font & Styles
                                                        '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                                        '|', 'bold', 'italic', 'strikethrough', 'removeFormat',
                                                        '|', 'alignment', 'horizontalLine',

                                                        // Lists
                                                        '|', 'bulletedList', 'numberedList',

                                                        // Image & Media
                                                        '|', 'insertImage', 'mediaEmbed',
                                                        // 'uploadImage', ,

                                                        // Links & Blocks
                                                        '|', 'link', 'blockQuote',
                                                    ],
                                                    shouldNotGroupWhenFull: false
                                                },
                                                mediaEmbed: {
                                                    previewsInData: true,
                                                    providers: [
                                                        {
                                                            name: 'instagram',
                                                            url: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/.*$/,
                                                            html: (match) => {
                                                                const url = match[0];
                                                                const postId = url.split('/')[4];
                                                                const embedUrl = `https://www.instagram.com/reel/${postId}/embed`;

                                                                return `
                                                                        <div class="media-style-align-center">
                                                                            <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:block; text-decoration:none;">
                                                                            <iframe
                                                                                src="${embedUrl}"
                                                                                width="400"
                                                                                height="715"
                                                                                frameborder="0"
                                                                                scrolling="no"
                                                                                allowtransparency="true"
                                                                                allowfullscreen
                                                                                style="border: none; overflow: hidden;">
                                                                            </iframe>
                                                                            </a>
                                                                        </div>
                                                                        `;
                                                            }
                                                        },
                                                        {
                                                            name: 'youtube',
                                                            url: [
                                                                /^https?:\/\/(www\.)?youtube\.com\/watch\?v=.*$/,
                                                                /^https?:\/\/youtu\.be\/.*$/
                                                            ],
                                                            html: (match) => {
                                                                const url = match[0];
                                                                const embedUrl = url.includes('youtu.be')
                                                                    ? url.replace('youtu.be/', 'www.youtube.com/embed/')
                                                                    : url.replace('watch?v=', 'embed/');

                                                                return `
                                                                        <div class="media-style-align-center">
                                                                        <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:block; text-decoration:none;">
                                                                            <iframe
                                                                            width="560"
                                                                            height="315"
                                                                            src="${embedUrl}"
                                                                            frameborder="0"
                                                                            allowfullscreen
                                                                            style="border: none; overflow: hidden;"
                                                                            ></iframe>
                                                                        </a>
                                                                        </div>
                                                                    `;
                                                            }

                                                        }
                                                    ]
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
                                                htmlSupport: {
                                                    allow: [
                                                        {
                                                            name: 'div',
                                                            classes: [
                                                                'media-style-align-left',
                                                                'media-style-align-center',
                                                                'media-style-align-right'
                                                            ],
                                                            styles: true,
                                                            attributes: true
                                                        },
                                                        {
                                                            name: 'iframe',
                                                            styles: true,
                                                            attributes: true,
                                                            classes: true
                                                        }
                                                    ]
                                                }
                                            }}
                                        /> */}
                                        <CKEditor
                                            editor={cloud.CKEditor.ClassicEditor}
                                            data={values.content}
                                            // onReady={(editor) => {
                                            //     console.log('Editor is ready to use!', editor);
                                            //     console.log(
                                            //         'Available toolbar items:',
                                            //         Array.from(editor.ui.componentFactory.names())
                                            //     );
                                            //     console.log("Loaded plugins:", editor.plugins._plugins.keys());
                                            // }}
                                            onChange={(event, editor) => {
                                                setFieldValue('content', editor.getData());
                                            }}
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
                                                    cloud.CKEditor.FontColor,
                                                    cloud.CKEditor.FontBackgroundColor,

                                                    // Lists
                                                    cloud.CKEditor.List,
                                                    cloud.CKEditor.ListProperties,

                                                    // Tables
                                                    cloud.CKEditor.Table,

                                                    // Links & Embeds
                                                    cloud.CKEditor.Link,

                                                    // Images
                                                    cloud.CKEditor.Image,
                                                    cloud.CKEditor.ImageToolbar,
                                                    cloud.CKEditor.ImageStyle,
                                                    cloud.CKEditor.ImageInsert,
                                                    cloud.CKEditor.Base64UploadAdapter,
                                                    cloud.CKEditor.AutoImage,
                                                    cloud.CKEditor.ImageUpload,
                                                    cloud.CKEditor.Alignment,

                                                    // MediaEmbed tools
                                                    cloud.CKEditor.MediaEmbed,

                                                    // Block tools
                                                    cloud.CKEditor.BlockQuote,
                                                    cloud.CKEditor.CodeBlock,

                                                    cloud.CKEditor.GeneralHtmlSupport,

                                                    // Horizontal Line
                                                    cloud.CKEditor.HorizontalLine,
                                                ],
                                                toolbar: {
                                                    items: [
                                                        // Undo/Redo
                                                        'undo', 'redo',

                                                        // Headings
                                                        '|', 'heading',

                                                        // Font & Styles
                                                        '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                                        '|', 'bold', 'italic', 'strikethrough', 'removeFormat',
                                                        '|', 'alignment', 'horizontalLine',

                                                        // Lists
                                                        '|', 'bulletedList', 'numberedList',

                                                        // Image & Media
                                                        '|', 'insertImage', 'mediaEmbed',
                                                        // 'uploadImage', ,

                                                        // Links & Blocks
                                                        '|', 'link', 'blockQuote',

                                                        '|', 'mediaAlign:left', 'mediaAlign:center', 'mediaAlign:right',
                                                    ],
                                                    shouldNotGroupWhenFull: false
                                                },
                                                mediaEmbed: {
                                                    previewsInData: true,
                                                    providers: [
                                                        {
                                                            name: 'instagram',
                                                            url: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/.*$/,
                                                            html: match => {
                                                                const url = match[0];
                                                                const postId = url.split('/')[4];
                                                                const isReel = url.includes('/reel/');
                                                                const embedUrl = `https://www.instagram.com/${isReel ? 'reel' : 'p'}/${postId}/embed`;

                                                                return `
                                                                    <div class="media-style-align-left">
                                                                        <div class="instagram-embed ${isReel ? 'reel' : 'post'}">
                                                                        <div class="iframe-container">
                                                                            <iframe
                                                                            src="${embedUrl}"
                                                                            frameborder="0"
                                                                            scrolling="no"
                                                                            allowtransparency="true"
                                                                            allowfullscreen
                                                                            style="border: none; overflow: hidden;">
                                                                            </iframe>
                                                                        </div>
                                                                        </div>
                                                                    </div>
                                                                `;
                                                            }
                                                        },
                                                        {
                                                            name: 'youtube',
                                                            url: [
                                                                /^https?:\/\/(www\.)?youtube\.com\/watch\?v=.*$/,
                                                                /^https?:\/\/youtu\.be\/.*$/
                                                            ],
                                                            html: (match) => {
                                                                const url = match[0];
                                                                const embedUrl = url.includes('youtu.be')
                                                                    ? url.replace('youtu.be/', 'www.youtube.com/embed/')
                                                                    : url.replace('watch?v=', 'embed/');

                                                                return `
                                                                    <div class="video-wrapper">
                                                                        <iframe
                                                                        src="${embedUrl}"
                                                                        frameborder="0"
                                                                        allowfullscreen
                                                                        ></iframe>
                                                                    </div>
                                                                `;
                                                            }
                                                        }

                                                    ]
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
                                                htmlSupport: {
                                                    allow: [
                                                        {
                                                            name: 'div',
                                                            classes: [
                                                                'media-style-align-left',
                                                                'instagram-embed',
                                                                'reel',
                                                                'post',
                                                                'iframe-container'
                                                            ],
                                                            styles: true,
                                                            attributes: true
                                                        },
                                                        {
                                                            name: 'iframe',
                                                            styles: true,
                                                            attributes: true,
                                                            classes: true
                                                        }
                                                    ]
                                                }
                                            }}
                                        />
                                        {errors.content && touched.content &&
                                            <CFormFeedback className="text-danger small">{errors.content}</CFormFeedback>}
                                    </CCol>

                                    <CCol xs={12} className="d-flex gap-2">
                                        <CButton color="primary" type="submit">
                                            Update
                                        </CButton>

                                        <CButton
                                            color="secondary"
                                            type="submit"
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancel
                                        </CButton>
                                    </CCol>

                                    {message && <CAlert color="primary mt-4">{message}</CAlert>}
                                </CForm>
                            )}
                        </Formik>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow >
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