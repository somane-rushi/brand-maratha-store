import React, { useEffect, useRef, useState } from "react";
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
} from "@coreui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../config/axios.config";
import { _categories_get, _shopbrands_get, _product_create, _product_update, _products_get, _url, _catalogue_get } from "../../config/api.endpoints";
import { useNavigate, useParams } from "react-router-dom";
import { handleApiError } from "../../utils/errorHelper";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import TagInput from "../../components/TagInput";
import { countries, fit } from "../../utils/data";
import Dropdown from "../../components/Dropdown";

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [catalogue, setCatalogue] = useState({});
    const [product, setProduct] = useState({});
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState({
        thumbnail: '',
    })

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
            .required("Product name is required")
            .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
        slug: Yup.string()
            .required("Slug is required")
            .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
        description: Yup.string()
            .required("Description is required")
            .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
        return_policy: Yup.string()
            .required("Return policy is required")
            .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
        subname: Yup.string()
            .required("Subname is required")
            .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
        brand_id: Yup.string()
            .required("Brand is required"),
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
        collection_ids: Yup.array()
            .of(Yup.number().required("Invalid collection"))
            .optional()
            .nullable(),
        thumbnail_image: Yup.mixed()
            .nullable()
            .test("fileType", "Only JPG, JPEG, and PNG formats are allowed", (value) => {
                if (!value || typeof value === "string") return true;
                return value instanceof File && ["image/jpg", "image/jpeg", "image/png"].includes(value.type);
            })
            .test("fileSize", "File size must be less than 5MB", function (value) {
                if (!value || typeof value !== "object") return true;

                if (value.size > 5 * 1024 * 1024) {
                    return this.createError({ message: "File exceeds 5MB limit" });
                }
                return true;
            }),
        traditional_categories: Yup.string()
            .required("Traditional category is required")
            .test(
                "not-empty",
                "Traditional category cannot be empty or only spaces",
                (value) => !!value && value.trim().length > 0
            )
    });

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const [catalogueRes, productRes, brandsRes, categoriesRes] = await Promise.all([
                    axiosInstance.get(_catalogue_get),
                    axiosInstance.get(`${_products_get}/${id}`),
                    axiosInstance.get(_shopbrands_get),
                    axiosInstance.get(_categories_get)
                ]);

                const { data } = catalogueRes || [];

                const {
                    thumbnail_image,
                } = productRes.data;

                if (
                    thumbnail_image
                ) {
                    setPreview({
                        thumbnail: thumbnail_image,
                    })
                }

                setCatalogue(data);
                setProduct(productRes.data);
                setBrands(brandsRes.data);
                setCategories(categoriesRes.data);
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

    const handleUpdate = async (values, { resetForm }) => {
        setIsLoading(true);
        setError("");

        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                const value = values[key];

                const isString = typeof value === "string";
                const isArray = Array.isArray(value);

                if (
                    value === undefined || value === null ||
                    (isArray && value.length === 0)
                ) {
                    return;
                }

                if (isArray) {
                    value.forEach((item) => {
                        if (
                            (typeof item === "string" && item.trim() !== "") ||
                            typeof item === "number"
                        ) {
                            formData.append(`${key}[]`, typeof item === "string" ? item.trim() : item);
                        }
                    });
                } else {
                    formData.append(key, isString ? value.trim() : value);
                }
            });

            const response = await axiosInstance.put(`${_product_update}/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                resetForm();
                navigate(`/products-list`);
            }

            setPreview({
                thumbnail: '',
            });

            // setIsClose(false);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    if (error) return <CAlert color="danger">{error}</CAlert>;

    return (
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

                <strong className="fs-5">UPDATE PRODUCT LISTING</strong>
            </CCardHeader>
            <CCardBody>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        catalogue_ids: product?.catalogue_ids || [],
                        category_id: product?.category_id ? Number(product.category_id) : null,
                        subcategory_id: product?.subcategory_id ? Number(product.subcategory_id) : null,
                        item_id: product?.item_id ? Number(product.item_id) : null,
                        name: product?.name || '',
                        slug: product?.slug || '',
                        description: product?.description || '',
                        return_policy: product?.return_policy || '',
                        subname: product?.subname || '',
                        brand_id: product?.brand_id || '',
                        collection_ids: product?.collection_ids || [],
                        images: Array.isArray(product?.images) ? product.images : [],
                        thumbnail_image: product?.thumbnail_image || null,
                        video: product?.video || null,
                        fit: product?.fit || '',
                        length: product?.length || '',
                        breadth: product?.breadth || '',
                        height: product?.height || '',
                        weight: product?.weight || '',
                        fabric: product?.fabrics || [],
                        stretchable: product?.stretchable || '',
                        key_feature: product?.key_features || [],
                        in_the_box: product?.in_the_box || '',
                        search_keyword: product?.search_keyword || '',
                        size_chart: product?.size_chart || null,
                        care_guide: product?.care_guide || '',
                        pattern: product?.patterns || [],
                        print_type: product?.print_type || '',
                        country_origin: product?.country_origin || '',
                        manufacturing_details: product?.manufacturing_details || '',
                        traditional_categories: product?.traditional_categories || ''
                    }}
                    validationSchema={productSchema}
                    onSubmit={handleUpdate}
                >
                    {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => {
                        const [category, setCategory] = useState([]);
                        const [subCategory, setSubCategory] = useState([]);
                        const [item, setItem] = useState([]);

                        useEffect(() => {
                            const selectedCatalogues = (Array.isArray(catalogue) ? catalogue : []).filter(c =>
                                values.catalogue_ids?.includes(c.id)
                            );

                            const categories = [
                                ...new Map(
                                    selectedCatalogues.flatMap(c => c.categories || []).map(cat => [cat.id, cat])
                                ).values()
                            ];

                            setCategory(categories);
                        }, [values.catalogue_ids]);

                        useEffect(() => {
                            if (!values.category_id || !category.length) return;

                            const selectedCat = category.find(c => c.id === values.category_id);
                            const subcats = [
                                ...new Map((selectedCat?.subcategories || []).map(sub => [sub.id, sub])).values()
                            ];

                            setSubCategory(subcats);
                        }, [category, values.category_id]);


                        useEffect(() => {
                            if (!values.category_id || !category.length) return;

                            const selectedCat = category.find(c => c.id === values.category_id);
                            const subcats = [
                                ...new Map((selectedCat?.subcategories || []).map(sub => [sub.id, sub])).values()
                            ];

                            setSubCategory(subcats);
                        }, [category, values.category_id]);

                        useEffect(() => {
                            if (!values.subcategory_id || !subCategory.length) return;

                            const selectedSub = subCategory.find(s => s.id === values.subcategory_id);
                            const rawItems = selectedSub?.items || [];

                            const cleanedItems = rawItems.map(item => {
                                if (typeof item === 'object') return item;
                                return { id: item, name: String(item) };
                            });

                            setItem(cleanedItems);

                            if (values.item_id && !cleanedItems.find(i => i.id === values.item_id)) {
                                setFieldValue("item_id", null);
                            }
                        }, [subCategory, values.subcategory_id]);

                        return (
                            <CForm onSubmit={handleSubmit} className="mt-3">
                                <CCard>
                                    <CCardHeader className="fs-5">
                                        <strong>PRODUCT IDENTITY</strong>
                                    </CCardHeader>
                                    <CCardBody className="d-flex flex-column row-gap-2">
                                        <CRow>
                                            <CCol md={4}>
                                                <MultiSelectDropdown
                                                    label="Select Catalogue"
                                                    name="catalogue_ids"
                                                    placeholder="Select Catalogue"
                                                    options={catalogue}
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
                                                    disabled={category.length === 0 || !values.catalogue_ids?.length}
                                                />
                                            </CCol>

                                            <CCol md={4}>
                                                <Dropdown
                                                    label="Sub Category"
                                                    name="subcategory_id"
                                                    placeholder="fit..."
                                                    options={subCategory}
                                                    value={values.subcategory_id}
                                                    setFieldValue={setFieldValue}
                                                    error={errors.subcategory_id}
                                                    touched={touched.subcategory_id}
                                                    disabled={
                                                        subCategory.length === 0 || !values.category_id
                                                    }
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
                                                    disabled={item.length === 0 || !values.subcategory_id}
                                                />
                                            </CCol>

                                            <CCol md={6}>
                                                <CFormLabel className="fw-semibold">BRAND<span className='text-danger'>*</span></CFormLabel>
                                                <CFormSelect
                                                    name="brand_id"
                                                    value={values.brand_id}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Brand</option>
                                                    {Array.isArray(brands) && brands.length > 0 ? (
                                                        brands.map((brand) => (
                                                            <option key={brand.id} value={brand.id}>
                                                                {brand.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No brands available</option>
                                                    )}
                                                </CFormSelect>
                                                {errors.brand_id && touched.brand_id && <div className="text-danger smalls">{errors.brand_id}</div>}
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
                                                <CFormLabel className="fw-semibold">THUMBNAIL IMAGE<span className='text-danger'>*</span></CFormLabel>
                                                <CFormInput placeholder="Test"
                                                    type="file"
                                                    name="thumbnail_image"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setFieldValue("thumbnail_image", file);
                                                            setPreview((prev) => ({
                                                                ...prev,
                                                                thumbnail: URL.createObjectURL(file)
                                                            }));
                                                        }
                                                    }}
                                                />
                                                {errors.thumbnail_image && touched.thumbnail_image && (
                                                    <div className="text-danger smalls">{errors.thumbnail_image}</div>
                                                )}
                                                {preview.thumbnail && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={preview.thumbnail.startsWith("blob:") ? preview.thumbnail : _url + preview.thumbnail}
                                                            alt="Preview"
                                                            width={100}
                                                            style={{ borderRadius: "5px" }}
                                                        />
                                                    </div>
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
                                                <CFormLabel className="fw-semibold">NAME<span className='text-danger'>*</span></CFormLabel>
                                                <CFormInput
                                                    placeholder="Product Name"
                                                    type="text"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                />
                                                {errors.name && touched.name && <div className="text-danger smalls">{errors.name}</div>}
                                            </CCol>

                                            <CCol md={6}>
                                                <CFormLabel className="fw-semibold">SUBNAME<span className='text-danger'>*</span></CFormLabel>
                                                <CFormInput
                                                    placeholder="Sub Name"
                                                    type="text"
                                                    name="subname"
                                                    value={values.subname}
                                                    onChange={handleChange}
                                                />
                                                {errors.subname && touched.subname && <div className="text-danger smalls">{errors.subname}</div>}
                                            </CCol>
                                        </CRow>

                                        <CRow>
                                            <CCol md={6}>
                                                <CFormLabel className="fw-semibold">SLUG<span className='text-danger'>*</span></CFormLabel>
                                                <CFormInput
                                                    placeholder="Product Slug"
                                                    type="text"
                                                    name="slug"
                                                    value={values.slug}
                                                    onChange={handleChange}
                                                />
                                                {errors.slug && touched.slug && <div className="text-danger smalls">{errors.slug}</div>}
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
                                                    onChange={handleChange}
                                                />
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
                                                    <option value=''>Select Stretchable</option>
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
                                                    onChange={handleChange} />
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
                                                <CFormLabel className="fw-semibold">DESCRIPTION<span className='text-danger'>*</span></CFormLabel>
                                                <CFormTextarea
                                                    placeholder="Description"
                                                    type="text"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                />
                                                {errors.description && touched.description && <div className="text-danger smalls">{errors.description}</div>}
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel className="fw-semibold">RETURN POLICY<span className='text-danger'>*</span></CFormLabel>
                                                <CFormTextarea
                                                    placeholder="Policy"
                                                    type="text"
                                                    name="return_policy"
                                                    value={values.return_policy}
                                                    onChange={handleChange}
                                                />
                                                {errors.return_policy && touched.return_policy && (
                                                    <div className="text-danger smalls">{errors.return_policy}</div>
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
                                        <CRow>
                                            <CCol md={4}>
                                                <MultiSelectDropdown
                                                    label="Select Collection"
                                                    name="collection_ids"
                                                    placeholder="Select Collection"
                                                    options={categories || []}
                                                    values={values.collection_ids}
                                                    setFieldValue={setFieldValue}
                                                    error={errors.collection_ids}
                                                    touched={touched.collection_ids}
                                                />
                                            </CCol>

                                            <CCol xs={6}>
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
                                    Update
                                </CButton>
                            </CForm>
                        )
                    }}
                </Formik>
                {error && <CAlert>{error}</CAlert>}
            </CCardBody>
        </CCard>
    );
};

export default UpdateProduct;
