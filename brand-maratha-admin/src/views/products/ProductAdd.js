import React, { Fragment, useEffect, useRef, useState } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CRow,
    CFormSelect,
    CAlert,
    CSpinner,
    CFormTextarea,
    CFormCheck,
} from "@coreui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../config/axios.config";
import { _categories_get, _shopbrands_get, _product_create, _catalogue_get } from "../../config/api.endpoints";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../../utils/errorHelper";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import TagInput from "../../components/TagInput";
import Dropdown from "../../components/Dropdown";
import { countries, fit } from "../../utils/data";

const ProductAdd = () => {
    const navigate = useNavigate();
    const [catalogues, setCatalogues] = useState([]);
    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const productSchema = Yup.object().shape({
        catalogue_ids: Yup.array()
            .of(Yup.number().required("Invalid catalogue"))
            .min(1, "At least one catalogue must be selected")
            .required("Catalogue is required"),
        category_id: Yup.number()
            .required("Category is required"),
        subcategory_id: Yup.number()
            .required("Subcategory is required"),
        name: Yup.string()
            .required("Title is required")
            .test("no-whitespace", "Title cannot be empty or only spaces", (value) => value && value.trim().length > 0),
        slug: Yup.string()
            .required("Slug is required")
            .matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
            .max(255, "Slug must be at most 255 characters")
            .test("no-whitespace", "Slug cannot contain spaces", (value) => !/\s/.test(value)),
        description: Yup.string()
            .required("Description is required")
            .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
        return_policy: Yup.string()
            .required("Return policy is required")
            .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
        subname: Yup.string()
            .required("Subname is required")
            .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
        brand_id: Yup.number()
            .required("Brand is required"),
        search_keyword: Yup.string()
            .required("Search keywords is required")
            .max(255, "Search keywords must be at most 255 characters"),
        collection_ids: Yup.array()
            .optional()
            .nullable(),
        traditional_categories: Yup.string()
            .required("Traditional category is required")
            .test(
                "not-empty",
                "Traditional category cannot be empty or only spaces",
                (value) => !!value && value.trim().length > 0
            ),
        country_origin: Yup.string()
            .required("Country of origin is required"),
        length: Yup.number()
            .typeError('Length must be a number')
            .required('Length is required'),

        breadth: Yup.number()
            .typeError('Breadth must be a number')
            .required('Breadth is required'),

        height: Yup.number()
            .typeError('Height must be a number')
            .required('Height is required'),

        weight: Yup.number()
            .typeError('Weight must be a number')
            .required('Weight is required'),
        thumbnail_image: Yup.mixed()
            .required("Thumbnail image is required")
            .test("fileType", "Only JPG, JPEG, and PNG formats are allowed", (file) =>
                file && ["image/jpg", "image/jpeg", "image/png"].includes(file.type)
            )
            .test("fileSize", "File size must be less than 5MB", function (value) {
                if (!value || typeof value !== "object") return true;

                if (value.size > 12 * 1024 * 1024) {
                    return this.createError({ message: "File exceeds 12MB limit" });
                }
                return true;
            }),
        size_chart: Yup.mixed()
            .required("Size chart image is required")
            .test("fileType", "Only JPG, JPEG, and PNG formats are allowed", (file) =>
                file && ["image/jpg", "image/jpeg", "image/png"].includes(file.type)
            )
            .test("fileSize", "File size must be less than 5MB", function (value) {
                if (!value || typeof value !== "object") return true;

                if (value.size > 12 * 1024 * 1024) {
                    return this.createError({ message: "File exceeds 12MB limit" });
                }
                return true;
            }),
    });

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const [catalogueRes, brandsRes, categoriesRes] = await Promise.all([
                    axiosInstance.get(_catalogue_get),
                    axiosInstance.get(_shopbrands_get),
                    axiosInstance.get(_categories_get)
                ]);

                const { data } = catalogueRes || [];

                setCatalogues(data);
                setBrands(brandsRes.data);
                setCollections(categoriesRes.data);
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);


    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (values, { resetForm }) => {
        console.log("values", values);

        setIsLoading(true);
        setError("");

        const formData = new FormData();

        Object.keys(values).forEach((key) => {
            const value = values[key];

            if (Array.isArray(value)) {
                value.forEach((v) => {
                    formData.append(`${key}[]`, v);
                });
            } else {
                const trimmedValue = typeof value === "string" ? value.trim() : value;
                formData.append(key, trimmedValue);
            }
        });

        if (values.images?.length) {
            values.images.forEach((file, index) => {
                formData.append(`image${index + 1}`, file);
            });
        }

        try {
            const { status } = await axiosInstance.post(_product_create, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (status === 201) {
                navigate("/products-list");
                // resetForm();
            }
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    if (error) return <CAlert color="danger">{error}</CAlert>;
    return (
        <>
            <CCard>
                 <CCardHeader className="d-flex align-items-center gap-3">
                    <CButton
                        color="secondary"
                        variant="outline"
                        className="d-flex align-items-center gap-2"
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

                    <strong className="fs-5">NEW PRODUCT LISTING</strong>
                </CCardHeader>
                <CCardBody>
                    <Formik
                        initialValues={{
                            catalogue_ids: [],
                            category_id: '',
                            subcategory_id: '',
                            item_id: '',
                            name: '',
                            slug: '',
                            fit: '',
                            description: '',
                            return_policy: '',
                            length: '',
                            breadth: '',
                            height: '',
                            weight: '',
                            subname: '',
                            brand_id: '',
                            collection_ids: [],
                            thumbnail_image: '',
                            fabric: [],
                            stretchable: '',
                            key_feature: [],
                            in_the_box: '',
                            search_keyword: '',
                            size_chart: '',
                            care_guide: '',
                            pattern: [],
                            print_type: '',
                            country_origin: '',
                            manufacturing_details: '',
                            traditional_categories: ''
                        }}
                        validationSchema={productSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue, setTouched, handleChange, handleSubmit, errors, touched }) => {
                            const [category, setCategory] = useState([]);
                            const [subCategory, setSubCategory] = useState([]);
                            const [item, setItem] = useState([]);

                            useEffect(() => {
                                const selectedCatalogues = catalogues.filter(c =>
                                    values.catalogue_ids?.includes(c.id)
                                );

                                const categories = [
                                    ...new Map(
                                        selectedCatalogues.flatMap(c => c.categories || []).map(cat => [cat.id, cat])
                                    ).values()
                                ];

                                setCategory(categories);
                                setSubCategory([]);
                                setItem([]);
                                setFieldValue("category_id", null);
                                setFieldValue("subcategory_id", null);
                                setFieldValue("item_id", null);
                                setTouched({
                                    category_id: false,
                                    subcategory_id: false,
                                    item_id: false,
                                });
                            }, [values.catalogue_ids]);

                            useEffect(() => {
                                const selectedCat = category.find(c => c.id === values.category_id);

                                const subcats = [
                                    ...new Map((selectedCat?.subcategories || []).map(sub => [sub.id, sub])).values()
                                ];

                                setSubCategory(subcats);
                                setItem([]);
                                setFieldValue("subcategory_id", null);
                                setFieldValue("item_id", null);
                                setTouched({
                                    subcategory_id: false,
                                    item_id: false,
                                });
                            }, [values.category_id]);

                            useEffect(() => {
                                const selectedSub = subCategory.find(s => s.id === values.subcategory_id);
                                const items = selectedSub?.items || [];

                                setItem(items);
                                setFieldValue("item_id", null);
                                setTouched({ item_id: false });
                            }, [values.subcategory_id]);

                            return (
                                <>
                                    <CForm onSubmit={handleSubmit}>
                                        <CCard>
                                            <CCardHeader className="fs-5">
                                                <strong>PRODUCT IDENTITY</strong>
                                            </CCardHeader>
                                            <CCardBody className="d-flex flex-column row-gap-2">
                                                <CRow>
                                                    <CCol md={4}>
                                                        <MultiSelectDropdown
                                                            label="Catalogues"
                                                            name="catalogue_ids"
                                                            placeholder="Select Catalogue"
                                                            options={catalogues}
                                                            values={values.catalogue_ids}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.catalogue_ids}
                                                            touched={touched.catalogue_ids}
                                                        />
                                                    </CCol>
                                                    <CCol md={4}>
                                                        <Dropdown
                                                            label="Category"
                                                            name="category_id"
                                                            placeholder="fit..."
                                                            options={category}
                                                            value={values.category_id}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.category_id}
                                                            touched={touched.category_id}
                                                            disabled={category.length === 0}
                                                        />
                                                    </CCol>

                                                    <CCol md={4}>
                                                        <Dropdown
                                                            label="Subcategory"
                                                            name="subcategory_id"
                                                            placeholder="fit..."
                                                            options={subCategory}
                                                            value={values.subcategory_id}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.subcategory_id}
                                                            touched={touched.subcategory_id}
                                                            disabled={subCategory.length === 0}
                                                        />
                                                    </CCol>
                                                </CRow>
                                                <CRow>
                                                    <CCol md={4}>
                                                        <Dropdown
                                                            label="Item"
                                                            name="item_id"
                                                            placeholder="fit..."
                                                            options={item}
                                                            value={values.item_id}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.item_id}
                                                            touched={touched.item_id}
                                                            disabled={item.length === 0}
                                                        />
                                                    </CCol>
                                                    <CCol md={4}>
                                                        <Dropdown
                                                            label="Brand"
                                                            name="brand_id"
                                                            placeholder="brands..."
                                                            options={brands}
                                                            value={values.brand_id}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.brand_id}
                                                            touched={touched.brand_id}
                                                        />
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
                                                        <CFormLabel htmlFor="thumbnail_image" className="fw-semibold">THUMBNAIL IMAGE<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormInput placeholder="Test"
                                                            type="file"
                                                            name="thumbnail_image"
                                                            onChange={(e) => setFieldValue("thumbnail_image", e.target.files[0])}
                                                        />
                                                        {errors.thumbnail_image && touched.thumbnail_image && (
                                                            <div className="text-danger small">{errors.thumbnail_image}</div>
                                                        )}
                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        <CCard className="mt-4">
                                            <CCardHeader className="fs-5">
                                                <strong>PRODUCT SPECIFICATION</strong>
                                            </CCardHeader>
                                            <CCardBody className="d-flex flex-column row-gap-4">
                                                <CRow>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="name" className="fw-semibold">NAME<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormInput
                                                            placeholder="Product Name"
                                                            type="text"
                                                            name="name"
                                                            value={values.name}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.name && touched.name && <div className="text-danger small">{errors.name}</div>}
                                                    </CCol>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="subname" className="fw-semibold">SUBNAME<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormInput
                                                            placeholder="Sub Name"
                                                            type="text"
                                                            name="subname"
                                                            value={values.subname}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.subname && touched.subname && <div className="text-danger small">{errors.subname}</div>}
                                                    </CCol>
                                                </CRow>

                                                <CRow>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="slug" className="fw-semibold">SLUG<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormInput
                                                            placeholder="Product Slug"
                                                            type="text"
                                                            name="slug"
                                                            value={values.slug}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.slug && touched.slug && <div className="text-danger small">{errors.slug}</div>}
                                                    </CCol>
                                                    <CCol md={3}>
                                                        <Dropdown
                                                            label="Size fit"
                                                            name="fit"
                                                            placeholder="fit..."
                                                            options={fit}
                                                            value={values.fit}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.fit}
                                                            touched={touched.fit}
                                                        />
                                                    </CCol>
                                                    <CCol xs={3}>
                                                        <TagInput
                                                            label="Fabric"
                                                            placeholder="Type to search..."
                                                            name='fabric'
                                                            values={values.fabric}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.fabric}
                                                            touched={touched.fabric}
                                                        />
                                                    </CCol>
                                                </CRow>
                                                <CRow>
                                                    <CCol xs={6}>
                                                        <TagInput
                                                            label="Pattern"
                                                            placeholder="Type to search..."
                                                            name='pattern'
                                                            values={values.pattern}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.pattern}
                                                            touched={touched.pattern}
                                                        />
                                                    </CCol>

                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="print_type" className="fw-semibold">PRINT TYPE</CFormLabel>
                                                        <CFormInput
                                                            placeholder="Print Type"
                                                            type="text"
                                                            name="print_type"
                                                            value={values.print_type}
                                                            onChange={handleChange} />
                                                        {errors.print_type && touched.print_type && <div className="text-danger small">{errors.print_type}</div>}
                                                    </CCol>
                                                </CRow >

                                                <CRow>
                                                    <CCol md={6}>
                                                        <CFormLabel
                                                            htmlFor="stretchable"
                                                            className="fw-semibold"
                                                        >
                                                            STRETCHABLE
                                                        </CFormLabel>
                                                        <CFormSelect
                                                            name="stretchable"
                                                            value={values.stretchable}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Stretchable</option>
                                                            <option value="yes">Yes</option>
                                                            <option value="no">No</option>

                                                        </CFormSelect>
                                                        {errors.stretchable && touched.stretchable && <div className="text-danger small">{errors.stretchable}</div>}
                                                    </CCol>
                                                    <CCol xs={6}>
                                                        <TagInput
                                                            label="Key Features"
                                                            placeholder="Type to search..."
                                                            name='key_feature'
                                                            values={values.key_feature}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.key_feature}
                                                            touched={touched.key_feature}
                                                        />
                                                    </CCol>
                                                </CRow>
                                                <CRow>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="size_chart" className="fw-semibold">SIZE CHART<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormInput
                                                            type="file"
                                                            name="size_chart"
                                                            onChange={(e) => setFieldValue("size_chart", e.target.files[0])}
                                                        />
                                                        {errors.size_chart && touched.size_chart && <div className="text-danger small">{errors.size_chart}</div>}
                                                    </CCol>

                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="in_the_box" className="fw-semibold">IN THE BOX</CFormLabel>
                                                        <CFormInput
                                                            placeholder="In the box"
                                                            type="text"
                                                            name="in_the_box"
                                                            value={values.in_the_box}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.in_the_box && touched.in_the_box && <div className="text-danger small">{errors.in_the_box}</div>}
                                                    </CCol>
                                                </CRow>

                                                <CRow>
                                                    <CCol xs={6}>
                                                        <CFormLabel htmlFor="search_keyword" className="fw-semibold">SEARCH KEYWORDS<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormTextarea
                                                            placeholder="Search Keyword"
                                                            type="text"
                                                            name="search_keyword"
                                                            value={values.search_keyword}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.search_keyword && touched.search_keyword && <div className="text-danger small">{errors.search_keyword}</div>}
                                                    </CCol>

                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="care_guide" className="fw-semibold">CARE GUIDE</CFormLabel>
                                                        <CFormTextarea
                                                            placeholder="Care Guide"
                                                            type="text"
                                                            name="care_guide"
                                                            value={values.care_guide}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.care_guide && touched.care_guide && <div className="text-danger small">{errors.care_guide}</div>}
                                                    </CCol>
                                                </CRow>

                                                <CRow>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="description" className="fw-semibold">DESCRIPTION<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormTextarea
                                                            placeholder="Description"
                                                            type="text"
                                                            name="description"
                                                            value={values.description}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.description && touched.description && <div className="text-danger small">{errors.description}</div>}
                                                    </CCol>

                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="return_policy" className="fw-semibold">RETURN POLICY<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormTextarea
                                                            placeholder="Policy"
                                                            type="text"
                                                            name="return_policy"
                                                            value={values.return_policy}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.return_policy && touched.return_policy && (
                                                            <div className="text-danger small">{errors.return_policy}</div>
                                                        )}
                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        <CCard className="mt-4">
                                            <CCardHeader className="fs-5">
                                                <strong>PACKAGE DETAILS</strong>
                                            </CCardHeader>
                                            <CCardBody className="d-flex flex-column row-gap-4">
                                                <CRow>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="length" className="fw-semibold">LENGTH (CM)
                                                            <span className='text-danger'>*</span></CFormLabel>
                                                        <CFormInput
                                                            placeholder="Length"
                                                            type="number"
                                                            name="length"
                                                            value={values.length}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.length && touched.length && <div className="text-danger small">{errors.length}</div>}
                                                    </CCol>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="breadth" className="fw-semibold">BREADTH (CM)
                                                            <span className='text-danger'>*</span>
                                                        </CFormLabel>
                                                        <CFormInput
                                                            placeholder="Breadth"
                                                            type="number"
                                                            name="breadth"
                                                            value={values.breadth}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.breadth && touched.breadth && (
                                                            <div className="text-danger small">{errors.breadth}</div>
                                                        )}
                                                    </CCol>
                                                </CRow>
                                                <CRow>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="height" className="fw-semibold">HEIGHT (CM)<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormInput
                                                            placeholder="Height"
                                                            type="number"
                                                            name="height"
                                                            value={values.height}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.height && touched.height && (
                                                            <div className="text-danger small">{errors.height}</div>
                                                        )}
                                                    </CCol>

                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="weight" className="fw-semibold">WEIGHT (KG)<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormInput
                                                            placeholder="Weight"
                                                            name="weight"
                                                            type="number"
                                                            value={values.weight}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.weight && touched.weight && (
                                                            <div className="text-danger small">{errors.weight}</div>
                                                        )}
                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        <CCard className="mt-4">
                                            <CCardHeader className="fs-5">
                                                <strong>MANUFACTURING DETAILS</strong>
                                            </CCardHeader>
                                            <CCardBody>
                                                <CRow>
                                                    <CCol md={6}>
                                                        <Dropdown
                                                            label="Country of Origin"
                                                            name="country_origin"
                                                            placeholder="country..."
                                                            options={countries}
                                                            value={values.country_origin}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.country_origin}
                                                            touched={touched.country_origin}
                                                        />
                                                    </CCol>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="manufacturing_details" className="fw-semibold">MANUFACTURER DETAILS</CFormLabel>
                                                        <CFormTextarea
                                                            placeholder="Manufacturer Details"
                                                            type="text"
                                                            name="manufacturing_details"
                                                            value={values.manufacturing_details}
                                                            onChange={handleChange}
                                                        />
                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        <CCard className="mt-4">
                                            <CCardHeader className="fs-5">
                                                <strong>PRODUCT INTEGRATION</strong>
                                            </CCardHeader>
                                            <CCardBody>
                                                <CRow className="mt-3">
                                                    <CCol md={4}>
                                                        <MultiSelectDropdown
                                                            label="Collections"
                                                            name="collection_ids"
                                                            placeholder="Select Collections"
                                                            options={collections.map(c => ({ id: c.id, name: c.title }))}
                                                            values={values.collection_ids}
                                                            setFieldValue={setFieldValue}
                                                            error={errors.collection_ids}
                                                            touched={touched.collection_ids}
                                                        />

                                                    </CCol>
                                                    <CCol md={6}>
                                                        <CFormLabel htmlFor="traditional_categories" className="fw-semibold">TRADITIONAL CATEGORIES<span className='text-danger'>*</span></CFormLabel>
                                                        <CFormSelect
                                                            name="traditional_categories"
                                                            value={values.traditional_categories}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Category</option>
                                                            <option value="tam">Traditional Marathi (TAM)</option>
                                                            <option value="lam">Look a like Marathi (LAM)</option>
                                                            <option value="rim">Re-Imagined Marathi (RIM)</option>
                                                        </CFormSelect>
                                                        {errors.traditional_categories && touched.traditional_categories && <div className="text-danger small">{errors.traditional_categories}</div>}
                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        <CButton color="success" type="submit" className="mt-3">
                                            Add Product
                                        </CButton>
                                    </CForm>
                                </>
                            )
                        }}
                    </Formik>
                    {error && <CAlert color="danger">{error}</CAlert>}
                </CCardBody >
            </CCard >
        </>
    );
};

export default ProductAdd;
