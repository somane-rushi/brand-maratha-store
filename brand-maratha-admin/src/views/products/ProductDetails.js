import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../config/axios.config';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
    CContainer, CRow, CCol, CCard, CCardBody, CCardTitle, CCardText,
    CSpinner, CAlert, CButton, CBadge, CTable, CTableBody,
    CTableRow, CTableDataCell, CNav, CNavItem, CNavLink, CTabContent,
    CTabPane, CForm, CFormInput, CFormSelect, CFormLabel,
    CCardHeader
} from '@coreui/react';
import { _color_create, _color_get, _colorbyid_delete, _colorbyid_update, _products_get, _sizebyid_delete, _sizebyid_update, _sizes_create, _sizes_delete, _sizes_get, _url } from '../../config/api.endpoints';
import ColorTable from './ColorTable';
import Modal from '../base/modal/Modal';
import Dropdown from '../../components/Dropdown';
import { standardColors, standardSizes } from '../../utils/data';

const AdminProductDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedType, setSelectedType] = useState("");
    const [sizeOptions, setSizeOptions] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [messages, setMessages] = useState({
        message: "",
        sizeMessage: "",
        colorMessage: ""
    });
    const [toggleColorForm, setToggleColorForm] = useState(true);
    const [colorUpdate, setColorUpdate] = useState({});
    const [openSizeModal, setOpenSizeModal] = useState(false);
    const [deleteSizeId, setDeleteSizeId] = useState(null);
    const [openColorModal, setOpenColorModal] = useState(false);
    const [deleteColorId, setDeleteColorId] = useState(null);
    const [preview, setPreview] = useState({
        video: '',
        images: []
    })
    const [isClose, setIsClose] = useState(false);
    const [hasChangedImages, setHasChangedImages] = useState(false);
    const fileInputRef = useRef(null);

    const sizeSchema = Yup.object().shape({
        size: Yup.string()
            .required("Size is required")
    });

    useEffect(() => {
        const typeKeys = standardSizes.map((obj) => Object.keys(obj)[0]);
        console.log("Types:", typeKeys);
    }, []);


    const colorSchema = () =>
        Yup.object().shape({
            size_id: Yup.string().required("Size is required"),
            color: Yup.string()
                .required("Color name is required")
                .test("no-whitespace", "Color name cannot be only spaces", (value) => value && value.trim().length > 0)
                .matches(/^[A-Za-z\s]+$/, "Color name can only contain letters and spaces"),
            color_code: Yup.string()
                .matches(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color code")
                .required("Color code is required"),
            stock: Yup.number()
                .typeError("Stock must be a number")
                .required("Stock is required")
                .positive("Stock must be a positive number")
                .integer("Stock must be an integer"),
            mrp: Yup.number()
                .typeError("MRP must be a number")
                .required("MRP is required")
                .min(0, "MRP must be 0 or a positive number")
                .integer("MRP must be an integer"),
            hsn: Yup.string()
                .required('HSN Code is required'),
            gst: Yup.string()
                .required('GST is required'),
            images: Yup.array()
                .of(
                    Yup.mixed()
                        .test("fileType", "Only JPG, JPEG, and PNG formats are allowed", (file) =>
                            file instanceof File
                                ? ["image/jpg", "image/jpeg", "image/png"].includes(file.type)
                                : true
                        )
                        .test("fileSize", "Each file must be less than 12MB", (file) =>
                            file instanceof File
                                ? file.size <= 12 * 1024 * 1024
                                : true
                        )
                )
                .min(3, "You must select at least 3 images")
                .max(6, "You can upload up to 6 images only"),
            video: Yup.mixed()
                .nullable()
                .test("fileType", "Only MP4, MOV, AVI formats are allowed", (file) => {
                    if (!file) return true;
                    return ["video/mp4", "video/quicktime", "video/x-msvideo"].includes(file.type);
                })
                .test("fileSize", "File exceeds 20MB limit", (file) => {
                    if (!file) return true;
                    return file.size <= 20 * 1024 * 1024;
                })
        });

    const colorSchemaForUpdate = () =>
        Yup.object().shape({
            size_id: Yup.string().required("Size is required"),

            color: Yup.string()
                .required("Color name is required")
                .test("no-whitespace", "Color name cannot be only spaces", (value) => value && value.trim().length > 0)
                .matches(/^[A-Za-z\s]+$/, "Color name can only contain letters and spaces"),

            color_code: Yup.string()
                .matches(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color code")
                .required("Color code is required"),

            stock: Yup.number()
                .typeError("Stock must be a number")
                .required("Stock is required")
                .positive("Stock must be a positive number")
                .integer("Stock must be an integer"),

            mrp: Yup.number()
                .typeError("MRP must be a number")
                .required("MRP is required")
                .min(0, "MRP must be 0 or a positive number")
                .integer("MRP must be an integer"),

            hsn: Yup.string().required("HSN Code is required"),

            gst: Yup.string().required("GST is required"),

            images: Yup.array()
                .nullable()
                .test("min-images", "You must select at least 3 images", function (images) {
                    const count = images?.filter(img => img && (typeof img === "string" || img instanceof File)).length || 0;
                    return count >= 3;
                })
                .test("max-images", "You can upload a maximum of 6 images", function (images) {
                    const count = images?.filter(img => img && (typeof img === "string" || img instanceof File)).length || 0;
                    return count <= 6;
                })
                .test("file-type", "Only JPG, JPEG, and PNG formats are allowed", function (images) {
                    if (!images || images.length === 0) return true;

                    return images.every(file => {
                        if (!file || typeof file === "string") return true;
                        return ["image/jpg", "image/jpeg", "image/png"].includes(file.type);
                    });
                })
                .test("file-size", "Each image must be less than 12MB", function (images) {
                    if (!images || images.length === 0) return true;

                    return images.every(file => {
                        if (!file || typeof file === "string") return true;
                        return file.size <= 12 * 1024 * 1024;
                    });
                }),
            video: Yup.mixed()
                .nullable()
                .test("is-valid-video", "Only MP4, MOV, AVI formats are allowed", (file) => {
                    if (!file || typeof file === "string") return true;
                    return ["video/mp4", "video/quicktime", "video/x-msvideo"].includes(file.type);
                })
                .test("videoSize", "Video must be less than 20MB", (file) => {
                    if (!file || typeof file === "string") return true;
                    return file.size <= 20 * 1024 * 1024;
                }),
        });

    useEffect(() => {
        const timers = [];

        Object.keys(messages).forEach((key) => {
            if (messages[key]) {
                const timer = setTimeout(() => {
                    setMessages((prev) => ({ ...prev, [key]: "" }));
                }, 2000);
                timers.push(timer);
            }
        });

        return () => timers.forEach((timer) => clearTimeout(timer));
    }, [messages]);

    useEffect(() => {
        if (activeTab === 0) {
            fetchSizes();
            fetchColors();
        }
    }, [activeTab]);

    useEffect(() => {
        fetchProducts();
    }, [id]);

    useEffect(() => {
        console.log("sizes", sizes);
    }, [sizes]);

    const getContrastColor = (hex) => {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? "#000" : "#fff";
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        setMessages((prev) => ({ ...prev, message: "" }));
        try {
            const { data } = await axiosInstance.get(`${_products_get}/${id}`);
            setProduct(data);
        } catch (err) {
            setMessages((prev) => ({
                ...prev,
                message: err?.response?.data?.message ||
                    err?.response?.data?.err ||
                    err.message ||
                    "Something went wrong!",
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSizes = async () => {
        try {
            const response = await axiosInstance.get(`${_sizes_get}/${id}/sizes`);
            setSizes(response.data);
        } catch (error) {
            console.error("Error fetching sizes:", error);
        };
    };

    const fetchColors = async () => {
        try {
            const response = await axiosInstance.get(`${_color_get}/${id}/colors`);
            setColors(response.data);
        } catch (error) {
            console.error("Error fetching sizes:", error);
        };
    };

    const handleSizeSubmit = async (values, { resetForm }) => {
        const { size } = values;

        try {
            const payload = {
                size,
                product_id: Number(id)
            };
            await axiosInstance.post(_sizes_create, payload);
            setMessages((prev) => ({ ...prev, sizeMessage: "Size added successfully!" }));
            await fetchSizes();
            await fetchProducts();
        } catch (err) {
            setMessages((prev) => ({
                ...prev,
                sizeMessage: err?.response?.data?.message ||
                    err?.response?.data?.err ||
                    err.message ||
                    "Something went wrong!",
            }));
        } finally {
            resetForm();
        }
    };

    const colorHandler = async (data) => {
        const {
            id,
            size_id,
            color,
            product_id,
            size,
            stock,
            color_code,
            gst,
            hsn,
            mrp,
            image1,
            image2,
            image3,
            image4,
            image5,
            image6,
            video
        } = data;

        if (
            image1 ||
            image2 ||
            image3 ||
            image4 ||
            image5 ||
            image6 ||
            video
        ) {
            setPreview({
                images: [image1, image2, image3, image4, image5, image6].filter(Boolean),
                video
            })
        }

        setColorUpdate({
            id,
            size_id,
            color,
            product_id,
            size,
            stock,
            color_code,
            gst,
            hsn,
            mrp
        });
        setToggleColorForm(false);
    };

    const handleColorSubmit = async (values, { resetForm }) => {
        try {
            const formData = new FormData();

            formData.append("color", values.color.trim());
            formData.append("color_code", values.color_code);
            formData.append("stock", Number(values.stock));
            formData.append("product_id", Number(id));
            formData.append("size_id", Number(values.size_id));
            formData.append("mrp", Number(values.mrp));
            formData.append("hsn", values.hsn);
            formData.append("gst", Number(values.gst));

            if (Array.isArray(values.images)) {
                values.images.forEach((file, index) => {
                    if (file instanceof File && index < 5) {
                        formData.append(`image${index + 1}`, file);
                    }
                });
            }

            if (values.video instanceof File) {
                formData.append("video", values.video);
            }

            await axiosInstance.post(_color_create, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setMessages((prev) => ({ ...prev, colorMessage: "Color added successfully!" }));
            await fetchColors();
            await fetchProducts();
        } catch (err) {
            console.log("Color add error", err);
            setMessages((prev) => ({
                ...prev,
                colorMessage:
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err.message ||
                    "Something went wrong!",
            }));
        }
    };

    const handleColorUpdate = async (values, { resetForm }) => {
        console.log("Values", values);

        if (!colorUpdate?.id) {
            setMessage("Please select a color first.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("product_id", colorUpdate.product_id);
            formData.append("color", values.color.trim());
            formData.append("color_code", values.color_code);
            formData.append("size_id", values.size_id);
            formData.append("stock", values.stock);
            formData.append("mrp", values.mrp);
            formData.append("hsn", values.hsn);
            formData.append("gst", values.gst);

            const newImages = values.images.filter((img) => typeof img !== "string");
            newImages.forEach((file, index) => {
                formData.append(`image${index + 1}`, file);
            });

            const oldImages = values.images.filter((img) => typeof img === "string");
            const imageFields = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'];

            oldImages.forEach((img, index) => {
                if (imageFields[index]) {
                    formData.append(`old_${imageFields[index]}`, img);
                }
            });

            if (typeof values.video !== "string" && values.video) {
                formData.append("video", values.video);
            } else if (typeof values.video === "string") {
                formData.append("old_video", values.video);
            }

            const result = await axiosInstance.put(
                `${_colorbyid_update}/${colorUpdate.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (result.data.success === true) {
                setToggleColorForm(true);
                setMessages((prev) => ({
                    ...prev,
                    colorMessage: "Color updated successfully!"
                }));
            }

            await fetchColors();
        } catch (err) {
            setMessages((prev) => ({
                ...prev,
                colorMessage:
                    err?.response?.data?.message ||
                    err?.response?.data?.err ||
                    err.message ||
                    "Something went wrong!",
            }));
        } finally {
            resetForm();
        }
    };

    const handleSizeDelete = async (sid) => {
        setDeleteSizeId(sid);
        setOpenSizeModal(true);
    };

    async function handleConfirmSizeDelete() {
        try {
            await axiosInstance.delete(`${_sizebyid_delete}/${deleteSizeId}`)
            fetchSizes();
            fetchColors();
            setMessages((prev) => ({ ...prev, sizeMessage: "Size deleted successfully!" }));
        } catch (err) {
            setMessages((prev) => ({
                ...prev,
                sizeMessage: err?.response?.data?.message ||
                    err?.response?.data?.err ||
                    err.message ||
                    "Something went wrong!",
            }));
        } finally {
            setOpenSizeModal(false);
            setDeleteSizeId(null);
        }
    };

    const handleColorDelete = async (cid) => {
        setDeleteColorId(cid);
        setOpenColorModal(true);
    };

    async function handleConfirmColorDelete() {
        try {
            await axiosInstance.delete(`${_colorbyid_delete}/${deleteColorId}`)
            fetchColors();
            setMessages((prev) => ({ ...prev, colorMessage: "Color deleted successfully!" }));
        } catch (err) {
            setMessages((prev) => ({
                ...prev,
                colorMessage: err?.response?.data?.message ||
                    err?.response?.data?.err ||
                    err.message ||
                    "Something went wrong!",
            }));
        } finally {
            setOpenColorModal(false);
            setDeleteColorId(null);
        }
    };

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    if (!product) return <CAlert color="warning">No product found.</CAlert>;
    return (
        <CContainer className="mt-4">
            <CNav variant="tabs" className="align-items-center mb-3 px-1">
                <CNavItem className="me-3">
                    <CButton
                        color="secondary"
                        variant="outline"
                        className="d-flex align-items-center gap-2 px-3"
                        onClick={() => navigate(-1)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back
                    </CButton>
                </CNavItem>

                <CNavItem>
                    <CNavLink
                        active={activeTab === 0}
                        onClick={() => setActiveTab(0)}
                        style={{ cursor: "pointer" }}
                        className="fw-bold"
                    >
                        SIZES
                    </CNavLink>
                </CNavItem>

                <CNavItem>
                    <CNavLink
                        active={activeTab === 1}
                        onClick={() => setActiveTab(1)}
                        style={{ cursor: "pointer" }}
                        className="fw-bold"
                    >
                        DETAILS
                    </CNavLink>
                </CNavItem>
            </CNav>

            <CTabContent className="mt-3">
                <CTabPane visible={activeTab === 0}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                SIZE - COLOUR VARIANT(S)
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    size: '',
                                }}
                                validationSchema={sizeSchema}
                                onSubmit={handleSizeSubmit}
                            >
                                {({ values, errors, touched, setFieldValue, handleSubmit }) => (
                                    <CForm onSubmit={handleSubmit}>
                                        <CRow>
                                            <CCol xs={4}>
                                                <div className="mb-2">
                                                    <label className="form-label fw-bold">SIZE TYPE</label>
                                                    <select
                                                        className="form-select"
                                                        value={selectedType}
                                                        onChange={(e) => {
                                                            const type = e.target.value;
                                                            setSelectedType(type);

                                                            const found = standardSizes.find(obj => Object.keys(obj)[0] === type);
                                                            const sizes = found ? found[type] : [];

                                                            setSizeOptions(sizes);
                                                            setFieldValue("size", "");
                                                        }}
                                                    >
                                                        <option value="">Select type...</option>
                                                        {standardSizes.map((obj, index) => {
                                                            const key = Object.keys(obj)[0];
                                                            return (
                                                                <option key={index} value={key}>
                                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </CCol>
                                            {selectedType && (
                                                <>
                                                    <CCol xs={4}>
                                                        <Dropdown
                                                            label="Sizes"
                                                            name="size"
                                                            placeholder="Sizes..."
                                                            options={sizeOptions}
                                                            value={values.size}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.size}
                                                            touched={touched.size}
                                                        />
                                                    </CCol>
                                                    <CCol style={{ marginTop: '2.0rem' }}>
                                                        <CButton type="submit" color="primary">Add</CButton>
                                                    </CCol>
                                                </>
                                            )}
                                        </CRow>
                                    </CForm>
                                )}
                            </Formik>

                            <div className="d-flex flex-wrap gap-2">
                                {Array.isArray(sizes.data) && sizes.data.map((dt) => (
                                    <CBadge
                                        key={dt.id}
                                        color="secondary"
                                        className="d-flex align-items-center px-3 py-2 rounded-pill"
                                        style={{ fontSize: '14px', cursor: 'pointer', backgroundColor: '#f0f0f0', color: '#333' }}
                                    >
                                        {dt.size}
                                        <svg
                                            onClick={() => handleSizeDelete(dt.id)}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            className="ms-2"
                                            viewBox="0 0 16 16"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <path d="M4.646 4.646a.5.5 0 011 .708L5.707 6l1.147 1.146a.5.5 0 01-.708.708L5 6.707 3.854 7.854a.5.5 0 01-.708-.708L4.293 6 3.146 4.854a.5.5 0 11.708-.708L5 5.293l1.146-1.147a.5.5 0 11.708.708L5.707 6l1.147 1.146a.5.5 0 11-.708.708L5 6.707l-1.146 1.147a.5.5 0 11-.708-.708L4.293 6l-1.147-1.146a.5.5 0 11.708-.708L5 5.293 6.146 4.146a.5.5 0 01.708.708L5.707 6l1.147 1.146a.5.5 0 11-.708.708L5 6.707l-1.146 1.147a.5.5 0 01-.708-.708L4.293 6l-1.147-1.146a.5.5 0 11.708-.708L5 5.293z" />
                                        </svg>
                                    </CBadge>
                                ))}
                            </div>
                            {messages.sizeMessage && <CAlert className='mt-4'>{messages.sizeMessage}</CAlert>}

                            <Modal
                                visible={openSizeModal}
                                onClose={() => setOpenSizeModal(false)}
                                onConfirm={handleConfirmSizeDelete}
                                title="Confirm Delete"
                                message="Are you sure you want to delete this size?"
                            />
                        </CCardBody>
                    </CCard>


                    <CRow>
                        <CCol xs={12}>
                            {toggleColorForm ?
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={{
                                        size_id: '',
                                        color: '',
                                        color_code: '#000000',
                                        stock: '',
                                        mrp: '',
                                        hsn: '',
                                        gst: '',
                                        images: [],
                                        imagePreviews: [],
                                        video: '',
                                    }}
                                    validationSchema={colorSchema}
                                    onSubmit={handleColorSubmit}
                                >
                                    {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
                                        <CForm onSubmit={handleSubmit}>
                                            <CCard className='mt-4'>
                                                <CCardHeader>
                                                    <strong>PRODUCT COLOUR VARIANT  </strong>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow className=" align-items-center">
                                                        <CCol md={5}>
                                                            <CFormLabel htmlFor="size_id" className='fw-semibold'>SIZE<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormSelect
                                                                name="size_id"
                                                                value={values.size_id}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    fetchColors(e.target.value);
                                                                }}
                                                            >
                                                                <option value="">Select Size</option>
                                                                {Array.isArray(sizes.data) && sizes.data.map(size => (
                                                                    <option key={size.id} value={size.id}>{size.size}</option>
                                                                ))}
                                                            </CFormSelect>
                                                            {errors.size_id && touched.size_id && <div className="text-danger small" style={{ fontSize: '14px' }}>{errors.size_id}</div>}
                                                        </CCol>

                                                        <CCol md={5}>
                                                            <Dropdown
                                                                label="Colors"
                                                                name="color"
                                                                placeholder="color..."
                                                                options={standardColors}
                                                                value={values.color}
                                                                setFieldValue={setFieldValue}
                                                                error={errors.color}
                                                                touched={touched.color}
                                                                className="mb-0"
                                                            />

                                                        </CCol>

                                                        <CCol md={2}>
                                                            <CFormLabel htmlFor="color_code" className='fw-semibold'>COLOR PICKER<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormInput
                                                                style={{ width: "100%" }}
                                                                type="color"
                                                                name="color_code"
                                                                value={values.color_code}
                                                                onChange={(e) => setFieldValue("color_code", e.target.value)}
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol md={6} className='mt-4'>
                                                            <CFormLabel htmlFor="color_code" className='fw-semibold'>STOCK<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormInput
                                                                style={{ width: "83%" }}
                                                                type="number"
                                                                name="stock"
                                                                placeholder="Stock"
                                                                value={values.stock}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.stock && touched.stock && <div className="text-danger small" style={{ fontSize: '14px' }}>{errors.stock}</div>}
                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>

                                            <CCard className='mt-4'>
                                                <CCardHeader>
                                                    <strong>PRODUCT PRICING</strong>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow>
                                                        <CCol md={4}>
                                                            <CFormLabel htmlFor="mrp" className='fw-semibold'>PRODUCT MRP<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormInput
                                                                type="number"
                                                                name="mrp"
                                                                placeholder="MRP"
                                                                value={values.mrp}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.mrp && touched.mrp && <div className="text-danger small" style={{ fontSize: '14px' }}>{errors.mrp}</div>}
                                                        </CCol>

                                                        <CCol md={4}>
                                                            <CFormLabel htmlFor="hsn" className='fw-semibold'>HSN CODE<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormInput
                                                                type="text"
                                                                name="hsn"
                                                                placeholder="hsn"
                                                                value={values.hsn}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.hsn && touched.hsn && <div className="text-danger small" style={{ fontSize: '14px' }}>{errors.hsn}</div>}
                                                        </CCol>

                                                        <CCol md={4}>
                                                            <CFormLabel htmlFor="gst" className='fw-semibold'>GST<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormSelect
                                                                name="gst"
                                                                value={values.gst}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="">Select gst</option>
                                                                <option value="0">0%</option>
                                                                <option value="5">5%</option>
                                                                <option value="12">12%</option>
                                                                <option value="18">18%</option>
                                                                <option value="28">28%</option>

                                                            </CFormSelect>
                                                            {errors.gst && touched.gst && <div className="text-danger small" style={{ fontSize: '14px' }}>{errors.gst}</div>}
                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                            <CCard className='mt-4'>
                                                <CCardHeader>
                                                    <strong>
                                                        PRODUCT IMAGES
                                                    </strong>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow>
                                                        <CCol md={6}>
                                                            <CFormLabel htmlFor="images" className="fw-semibold">PRODUCT IMAGE<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormInput
                                                                type="file"
                                                                name="images"
                                                                multiple
                                                                ref={fileInputRef}
                                                                onChange={(e) => {
                                                                    const newFiles = Array.from(e.target.files);
                                                                    const existingFiles = values.images || [];

                                                                    const allFiles = [...existingFiles, ...newFiles];

                                                                    const allPreviews = [...(values.imagePreviews || []), ...newFiles.map(file => URL.createObjectURL(file))];

                                                                    setFieldValue("images", allFiles);
                                                                    setFieldValue("imagePreviews", allPreviews);

                                                                    const dataTransfer = new DataTransfer();

                                                                    allFiles.forEach(file => dataTransfer.items.add(file));

                                                                    if (fileInputRef.current) {
                                                                        fileInputRef.current.files = dataTransfer.files;
                                                                    }
                                                                }}
                                                            />
                                                            <p style={{ color: "gray", fontSize: "14px" }}>
                                                                Hold <b>Ctrl (Cmd on Mac)</b> while selecting files to upload multiple images.
                                                            </p>
                                                            {errors.images && touched.images && <div className="text-danger small">{errors.images}</div>}
                                                            <CRow>
                                                                {Array.isArray(values.imagePreviews) && values.imagePreviews.map((src, index) => {
                                                                    const isFile = typeof values.images[index] !== "string"; // check if it's a new File

                                                                    return (
                                                                        <CCol key={index} md={3} className="mb-2" style={{ position: "relative" }}>
                                                                            <img
                                                                                src={src}
                                                                                alt={`Preview ${index + 1}`}
                                                                                className="img-thumbnail"
                                                                                style={{ width: "100px", height: "100px", objectFit: "cover", padding: 0 }}
                                                                            />

                                                                            {isFile && (
                                                                                <CButton
                                                                                    type="button"
                                                                                    color="danger"
                                                                                    size="sm"
                                                                                    style={{
                                                                                        position: "absolute",
                                                                                        top: "5px",
                                                                                        right: "5px",
                                                                                        borderRadius: "50%",
                                                                                        padding: "0px 6px",
                                                                                        fontSize: "14px",
                                                                                        lineHeight: "18px",
                                                                                        color: "white"
                                                                                    }}
                                                                                    onClick={() => {
                                                                                        const updatedPreviews = values.imagePreviews.filter((_, i) => i !== index);
                                                                                        const updatedImages = values.images.filter((_, i) => i !== index);

                                                                                        setFieldValue("imagePreviews", updatedPreviews);
                                                                                        setFieldValue("images", updatedImages);

                                                                                        const dataTransfer = new DataTransfer();
                                                                                        updatedImages.forEach((file) => {
                                                                                            if (typeof file !== "string") dataTransfer.items.add(file);
                                                                                        });

                                                                                        if (fileInputRef.current) {
                                                                                            fileInputRef.current.files = dataTransfer.files;
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    ×
                                                                                </CButton>
                                                                            )}
                                                                        </CCol>
                                                                    );
                                                                })}
                                                            </CRow>
                                                        </CCol>
                                                        <CCol md={6}>
                                                            <CFormLabel htmlFor="video" className="fw-semibold">VIDEO</CFormLabel>
                                                            <CFormInput placeholder="Test" type="file" name="video" onChange={(e) => setFieldValue("video", e.target.files[0])} />
                                                            {errors.video && touched.video && <div className="text-danger small">{errors.video}</div>}
                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>

                                            <CRow className='mt-4'>
                                                <CCol>
                                                    <CButton type="submit" color="primary">Add Color</CButton>
                                                </CCol>
                                            </CRow>
                                        </CForm>
                                    )}
                                </Formik>
                                :
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={{
                                        size_id: colorUpdate?.size_id || "",
                                        color: colorUpdate?.color || "",
                                        color_code: colorUpdate?.color_code || "",
                                        stock: colorUpdate?.stock || "",
                                        mrp: colorUpdate?.mrp || "",
                                        hsn: colorUpdate?.hsn || "",
                                        gst: colorUpdate?.gst || "",
                                        images: Array.isArray(colorUpdate?.images) ? colorUpdate.images : [],
                                        video: colorUpdate?.video || null,
                                    }}
                                    validationSchema={colorSchemaForUpdate}
                                    onSubmit={handleColorUpdate}
                                >
                                    {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
                                        <CForm onSubmit={handleSubmit}>
                                            <CCard className='mt-4'>
                                                <CCardHeader>
                                                    <strong>PRODUCT COLOUR VARIANT</strong>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow className="mb-3 align-items-center">
                                                        <CCol md={5}>
                                                            <CFormLabel htmlFor="size_id">Size<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormSelect
                                                                name="size_id"
                                                                value={values.size_id}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    fetchColors(e.target.value);
                                                                }}
                                                            >
                                                                <option value="">Select Size</option>
                                                                {Array.isArray(sizes.data) && sizes.data.map(size => (
                                                                    <option key={size.id} value={size.id}>{size.size}</option>
                                                                ))}
                                                            </CFormSelect>
                                                            {errors.size_id && touched.size_id && <div className="text-danger small" style={{ fontSize: '14px' }}>{errors.size_id}</div>}
                                                        </CCol>

                                                        <CCol md={5}>
                                                            <Dropdown
                                                                label="Colors"
                                                                name="color"
                                                                placeholder="color..."
                                                                options={standardColors}
                                                                value={values.color}
                                                                setFieldValue={setFieldValue}
                                                                error={errors.color}
                                                                touched={touched.color}
                                                            />
                                                        </CCol>

                                                        <CCol md={2}>
                                                            <CFormLabel htmlFor="color_code" className='fw-semibold'>COLOR PICKER<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormInput
                                                                style={{ width: "100%" }}
                                                                type="color"
                                                                name="color_code"
                                                                value={values.color_code}
                                                                onChange={(e) => setFieldValue("color_code", e.target.value)}
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol md={6}>
                                                            <CFormLabel htmlFor="color_code" className='fw-semibold'>STOCK<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormInput
                                                                type="number"
                                                                name="stock"
                                                                placeholder="Stock"
                                                                value={values.stock}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.stock && touched.stock && <div className="text-danger small" style={{ fontSize: '14px' }}>{errors.stock}</div>}
                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                            <CCard className='mt-4'>
                                                <CCardHeader>
                                                    <strong>PRODUCT PRICING</strong>
                                                </CCardHeader>
                                                <CCardBody>
                                                    <CRow>
                                                        <CCol md={4}>
                                                            <CFormLabel htmlFor="mrp" className='fw-semibold'>PRODUCT MRP<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormInput
                                                                type="number"
                                                                name="mrp"
                                                                placeholder="MRP"
                                                                value={values.mrp}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.mrp && touched.mrp && <div className="text-danger small" style={{ fontSize: '14px' }}>{errors.mrp}</div>}
                                                        </CCol>

                                                        <CCol md={4}>
                                                            <CFormLabel htmlFor="hsn" className='fw-semibold'>HSN CODE<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormInput
                                                                type="text"
                                                                name="hsn"
                                                                placeholder="hsn"
                                                                value={values.hsn}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.hsn && touched.hsn && <div className="text-danger small" style={{ fontSize: '14px' }}>{errors.hsn}</div>}
                                                        </CCol>

                                                        <CCol md={4}>
                                                            <CFormLabel htmlFor="gst" className='fw-semibold'>GST<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormSelect
                                                                name="gst"
                                                                value={values.gst}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="">Select gst</option>
                                                                <option value="0">0%</option>
                                                                <option value="5">5%</option>
                                                                <option value="12">12%</option>
                                                                <option value="18">18%</option>
                                                                <option value="28">28%</option>

                                                            </CFormSelect>
                                                            {errors.gst && touched.gst && <div className="text-danger small" style={{ fontSize: '14px' }}>{errors.gst}</div>}
                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>

                                            <CCard className="mt-4">
                                                <CCardHeader className="fs-5">
                                                    <strong>PRODUCT IMAGES</strong>
                                                </CCardHeader>
                                                <CCardBody className="d-flex flex-column row-gap-4">
                                                    <CRow>
                                                        <CCol md={4}>
                                                            <CFormLabel className="fw-semibold">PRODUCT IMAGE<span className='text-danger'>*</span></CFormLabel>
                                                            <CFormInput
                                                                type="file"
                                                                name="images"
                                                                multiple
                                                                ref={fileInputRef}
                                                                onChange={(e) => {
                                                                    const newFiles = Array.from(e.target.files);
                                                                    if (newFiles.length === 0) return;

                                                                    const isFirstUpload = values.images?.some(img => typeof img === "string");

                                                                    let updatedImages = [];
                                                                    let updatedPreviews = [];

                                                                    if (isFirstUpload || !values.images || values.images.length === 0) {
                                                                        updatedImages = [...newFiles];
                                                                        updatedPreviews = newFiles.map((file) => URL.createObjectURL(file));
                                                                    } else {
                                                                        const existingFileObjects = values.images.filter(img => img instanceof File);
                                                                        updatedImages = [...existingFileObjects, ...newFiles];
                                                                        updatedPreviews = [
                                                                            ...preview.images,
                                                                            ...newFiles.map((file) => URL.createObjectURL(file)),
                                                                        ];
                                                                    }

                                                                    setFieldValue("images", updatedImages);
                                                                    setPreview((prev) => ({
                                                                        ...prev,
                                                                        images: updatedPreviews,
                                                                    }));
                                                                    setIsClose(true);

                                                                    const dataTransfer = new DataTransfer();
                                                                    updatedImages.forEach(file => {
                                                                        if (file instanceof File) dataTransfer.items.add(file);
                                                                    });

                                                                    if (fileInputRef.current) {
                                                                        fileInputRef.current.files = dataTransfer.files;
                                                                    }
                                                                }}
                                                            />
                                                            <p style={{ color: "gray", fontSize: "14px" }}>
                                                                Hold <b>Ctrl (Cmd on Mac)</b> while selecting files to upload multiple images.
                                                            </p>
                                                            {errors.images && touched.images && <div className="text-danger smalls">{errors.images}</div>}
                                                            <CRow className="mt-3">
                                                                {preview.images.map((src, index) => (
                                                                    <CCol key={index} md={3} className="mb-2" style={{ position: "relative" }}>
                                                                        <img
                                                                            src={src.startsWith("blob:") ? src : _url + src}
                                                                            alt={`Preview ${index + 1}`}
                                                                            className="img-thumbnail"
                                                                            style={{
                                                                                width: "100px",
                                                                                height: "100px",
                                                                                objectFit: "cover",
                                                                                padding: 0
                                                                            }}
                                                                        />

                                                                        {isClose && (
                                                                            <CButton
                                                                                type="button"
                                                                                color="danger"
                                                                                size="sm"
                                                                                style={{
                                                                                    position: "absolute",
                                                                                    top: "5px",
                                                                                    right: "5px",
                                                                                    borderRadius: "50%",
                                                                                    padding: "0px 6px",
                                                                                    fontSize: "14px",
                                                                                    lineHeight: "18px",
                                                                                    color: "white",
                                                                                }}
                                                                                onClick={() => {
                                                                                    const updatedImages = values.images.filter((_, i) => i !== index);
                                                                                    setFieldValue("images", updatedImages);
                                                                                    setPreview((prev) => ({
                                                                                        ...prev,
                                                                                        images: prev.images.filter((_, i) => i !== index),
                                                                                    }));

                                                                                    const dataTransfer = new DataTransfer();
                                                                                    updatedImages.forEach((file) => dataTransfer.items.add(file));
                                                                                    if (fileInputRef.current) {
                                                                                        fileInputRef.current.files = dataTransfer.files;
                                                                                    }
                                                                                }}
                                                                            >
                                                                                ×
                                                                            </CButton>
                                                                        )}
                                                                    </CCol>
                                                                ))}

                                                            </CRow>
                                                        </CCol>
                                                        <CCol md={4}>
                                                            <CFormLabel className="fw-semibold">VIDEO</CFormLabel>
                                                            <CFormInput
                                                                placeholder="Test"
                                                                type="file"
                                                                name="video"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        setFieldValue("video", file);
                                                                        setPreview((prev) => ({
                                                                            ...prev,
                                                                            video: URL.createObjectURL(file)
                                                                        }));
                                                                    }
                                                                }}
                                                            />
                                                            {errors.video && touched.video && <div className="text-danger smalls">{errors.video}</div>}
                                                            {preview.video && (
                                                                <div className="mt-2">
                                                                    <video
                                                                        src={preview.video.startsWith("blob:") ? preview.video : _url + preview.video}
                                                                        width={200}
                                                                        controls
                                                                        style={{ borderRadius: "5px" }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>

                                            <CRow className='mt-4'>
                                                <CCol>
                                                    <CButton type="submit" color="primary">Update Color</CButton>
                                                </CCol>
                                            </CRow>
                                        </CForm>
                                    )}
                                </Formik>}
                            {messages.colorMessage && <CAlert className='mt-4'>{messages.colorMessage}</CAlert>}
                            <ColorTable
                                colors={colors}
                                handleUpdate={colorHandler}
                                handleDelete={handleColorDelete}
                            />
                            <Modal
                                visible={openColorModal}
                                onClose={() => setOpenColorModal(false)}
                                onConfirm={handleConfirmColorDelete}
                                title="Confirm Delete"
                                message="Are you sure you want to delete this color?"
                            />
                        </CCol>
                    </CRow>
                </CTabPane>
                <CTabPane visible={activeTab === 1}>
                    <CRow className="justify-content-center">
                        <CCol md={4}>
                            <CCard className="shadow-lg p-3">
                                <CCardBody className="text-center">
                                    <div className="mb-3">
                                        <strong>Thumbnail Image</strong>
                                        <div className="border rounded shadow-sm p-2">
                                            <img
                                                src={_url + product.thumbnail_image}
                                                alt="Product Thumbnail"
                                                className="img-fluid rounded"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <strong>Product Images</strong>
                                        <div className="border rounded shadow-sm">
                                            <div className="container">
                                                {Array.from({ length: Math.ceil(5 / 2) }, (_, i) => (
                                                    <div key={i} className="row g-1 mb-1">
                                                        {[product?.image1, product?.image2, product?.image3, product?.image4, product?.image5, product?.image6]
                                                            .slice(i * 2, i * 2 + 2)
                                                            .map((imageurl, index) => (
                                                                imageurl && (
                                                                    <div key={index} className="col-6">
                                                                        <img
                                                                            src={_url + imageurl}
                                                                            alt="Product"
                                                                            className="img-fluid rounded"
                                                                        />
                                                                    </div>
                                                                )
                                                            ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {product.video && (
                                        <div>
                                            <strong>Product Video</strong>
                                            <div className="border rounded shadow-sm p-2">
                                                <video controls className="w-100 rounded" style={{ maxHeight: "250px" }}>
                                                    <source src={_url + product.video} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        </div>
                                    )}
                                </CCardBody>

                            </CCard>
                        </CCol>
                        <CCol md={6}>
                            <CCard className="shadow-lg p-4">
                                <CCardBody>
                                    <CCardTitle className="h3 fw-bold text-primary">{product.name}</CCardTitle>
                                    <CCardTitle className="text-muted">{product.slug}</CCardTitle>
                                    <CBadge color="info" className="mb-3">{product.subname}</CBadge>

                                    <CCardText>
                                        <strong>Description:</strong> {product.description}
                                    </CCardText>
                                    <CCardText>
                                        <strong>Return Policy:</strong> {product.return_policy}
                                    </CCardText>

                                    <CTable striped responsive className="mt-3">
                                        <CTableBody>
                                            <CTableRow>
                                                <CTableDataCell><strong>Price</strong></CTableDataCell>
                                                <CTableDataCell className="text-success fw-bold">${product.base_price}</CTableDataCell>
                                            </CTableRow>
                                            <CTableRow>
                                                <CTableDataCell><strong>Bestseller</strong></CTableDataCell>
                                                <CTableDataCell>{product.isbestseller ? "Yes" : "No"}</CTableDataCell>
                                            </CTableRow>
                                            <CTableRow>
                                                <CTableDataCell><strong>New Arrival</strong></CTableDataCell>
                                                <CTableDataCell>{product.new_arrivals ? "Yes" : "No"}</CTableDataCell>
                                            </CTableRow>
                                        </CTableBody>
                                    </CTable>

                                    <div className="mt-4">
                                        <strong>Sizes:</strong>
                                        <div className="d-flex flex-wrap">
                                            {Array.isArray(sizes?.data) && sizes.data.length > 0 ? (
                                                sizes.data.map((size) => (
                                                    <CButton
                                                        key={size.id}
                                                        color={selectedSize === size.id ? "primary" : "secondary"}
                                                        variant={selectedSize === size.id ? "" : "outline"}
                                                        className="me-2 mb-2"
                                                        onClick={() => setSelectedSize(size.id)}
                                                    >
                                                        {size.size}
                                                    </CButton>
                                                ))
                                            ) : (
                                                <CBadge color="warning">No Sizes Available</CBadge>
                                            )}
                                        </div>
                                    </div>

                                    {selectedSize && (
                                        <div className="mt-4">
                                            <strong>Available Colors:</strong>
                                            <div className="d-flex flex-wrap">
                                                {Array.isArray(sizes?.data) && sizes.data.length > 0 ? (
                                                    (() => {
                                                        const selectedSizeData = sizes.data.find((size) => size.id === selectedSize);
                                                        return selectedSizeData?.colors?.length > 0 ? (
                                                            selectedSizeData.colors.map((color) => (
                                                                <div
                                                                    key={color.id}
                                                                    className="me-2 mb-2 px-3 py-1 rounded shadow-sm"
                                                                    style={{
                                                                        backgroundColor: color.color_code,
                                                                        color: getContrastColor(color.color_code),
                                                                        border: "1px solid #ddd",
                                                                        opacity: color.out_of_stock ? 0.5 : 1,
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    {color.color} ({color.stock})
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <CBadge color="warning">No Colors Available</CBadge>
                                                        );
                                                    })()
                                                ) : (
                                                    <CBadge color="danger">No Sizes Available</CBadge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CTabPane>
            </CTabContent>
        </CContainer >
    );
};

export default AdminProductDetails;