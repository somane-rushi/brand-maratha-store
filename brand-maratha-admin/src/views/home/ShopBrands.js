import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config'
import { _productbybrands_get, _shopbrands_create, _shopbrands_delete, _shopbrands_get, _shopbrands_update, _url } from '../../config/api.endpoints'
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
  CInputGroup,
  CRow,
  CSpinner,
} from '@coreui/react'
import Modal from '../base/modal/Modal'
import * as yup from 'yup'
import { Formik } from 'formik'
import { handleApiError } from '../../utils/errorHelper'
import ImageCropper from '../../components/image-cropper/ImageCropper';
import ImagePreview from '../../components/image-cropper/ImagePreview';
import Table from '../base/tables/ShopBrandsTable'

const formSchema = yup.object().shape({
  name: yup.string()
    .required("Title is required")
    .test("no-whitespace", "Title cannot be empty or only spaces", (value) => value && value.trim().length > 0)
    .max(255, "Title must be at most 255 characters")
    .test("word-count", function (value) {
      if (!value) return this.createError({ message: "Title is required" });

      const wordCount = value.trim().split(/\s+/).length

      if (wordCount > 5) {
        return this.createError({
          message: `Title must not exceed 5 words. Currently, it has ${wordCount}.`,
        })
      }
      return true
    })
    .matches(/^[a-zA-Z0-9\s.,!?()-]+$/, 'Title contains invalid characters'),

  remarks: yup
    .string()
    .optional(),

  pickup_address: yup
    .string()
    .required('Pickup address is required')
    .test('no-whitespace', 'Cannot be only spaces', (value) => value && value.trim().length > 0),

  pickup_city: yup
    .string()
    .required('Pickup city is required')
    .test('no-whitespace', 'Cannot be only spaces', (value) => value && value.trim().length > 0),

  pickup_state: yup
    .string()
    .required('Pickup state is required')
    .test('no-whitespace', 'Cannot be only spaces', (value) => value && value.trim().length > 0),

  pickup_pincode: yup
    .string()
    .required('Pickup pincode is required')
    .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),

  contact_phone: yup
    .string()
    .required('Contact phone is required')
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),

  contact_email: yup
    .string()
    .required('Contact email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Invalid email format')
    .email('Invalid email format'),

  image: yup
    .mixed()
    .nullable()
    .test('fileRequired', 'Image is required', function (value) {
      const { existing_image } = this.parent

      if (!existing_image && !value) {
        return this.createError({ message: 'Image is required' })
      }

      return true
    })
    .test('fileType', 'Only JPG, PNG, and WebP files are allowed', (value) => {
      if (!value || typeof value !== 'object') return true
      return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type)
    })
    .test('fileSize', 'File size must be less than 5MB', function (value) {
      if (!value || typeof value !== 'object') return true
      if (value.size > 5 * 1024 * 1024) {
        return this.createError({ message: 'File exceeds 5MB limit' })
      }
      return true
    }),
})

const formSchemaUpdate = yup.object().shape({
  name: yup
    .string()
    .required("Title is required")
    .test("no-whitespace", "Title cannot be empty or only spaces", (value) => value && value.trim().length > 0)
    .max(255, "Title must be at most 255 characters")
    .test("word-count", function (value) {
      if (!value) return this.createError({ message: "Title is required" });

      const wordCount = value.trim().split(/\s+/).length;

      if (wordCount > 5) {
        return this.createError({
          message: `Title must not exceed 5 words. Currently, it has ${wordCount}.`,
        });
      }
      return true;
    })
    .matches(/^[a-zA-Z0-9\s.,!?()-]+$/, "Title contains invalid characters"),

  pickup_address: yup
    .string()
    .required("Pickup address is required")
    .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),

  pickup_city: yup
    .string()
    .required("Pickup city is required")
    .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),

  pickup_state: yup
    .string()
    .required("Pickup state is required")
    .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),

  pickup_pincode: yup
    .string()
    .required("Pickup pincode is required")
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),

  contact_phone: yup
    .string()
    .required("Contact phone is required")
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),

  contact_email: yup
    .string()
    .required("Contact email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid email format")
    .email("Invalid email format"),

  remarks: yup
    .string()
    .optional(),

  image: yup.mixed()
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

const ShopByBrands = () => {
  const [brands, setBrands] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  const [originalImage, setOriginalImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [activeFrom, setActiveForm] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({});
  const [preview, setPreview] = useState(null);

  const [modalTitle, setModalTitle] = useState('Confirm Deletion')
  const [modalMessage, setModalMessage] = useState('Are you sure you want to delete this brands?')

  useEffect(() => {
    fetchItem()
  }, [])

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('')
        setError('')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [message, error])

  useEffect(() => {
    setPreview(updateFormData.image || "");
  }, [updateFormData.image]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBrands(brands);
      return;
    }

    const lower = searchQuery.toLowerCase();

    const filtered = brands.filter((b) =>
      b.name?.toLowerCase().includes(lower) ||
      b.contact_email?.toLowerCase().includes(lower) ||
      b.pickup_vendor_code?.toLowerCase().includes(lower) ||
      b.gst?.toLowerCase().includes(lower) ||
      b.cin?.toLowerCase().includes(lower) ||
      b.contact_phone?.toLowerCase().includes(lower)
    );

    setFilteredBrands(filtered);
  }, [searchQuery, brands]);

  const fetchItem = async () => {
    setIsLoading(true)

    try {
      const { data } = await axiosInstance.get(_shopbrands_get)
      setBrands(data)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(values, { resetForm }) {
    setIsLoading(true)
    setMessage('')
    setError('')

    const trims = {
      name: values.name.trim(),
      remarks: values.remarks.trim(),
      pickup_address: values.pickup_address.trim(),
      pickup_city: values.pickup_city.trim(),
      pickup_state: values.pickup_state.trim(),
      pickup_pincode: values.pickup_pincode.trim(),
      contact_phone: values.contact_phone.trim(),
      contact_email: values.contact_email.trim(),
      gst: values.gst.trim(),
      cin: values.cin.trim(),
    }

    const formData = new FormData()

    formData.append('name', trims.name)
    formData.append('remarks', trims.remarks)
    formData.append('image', values.image)
    formData.append('pickup_address', trims.pickup_address || '')
    formData.append('pickup_city', trims.pickup_city || '')
    formData.append('pickup_state', trims.pickup_state || '')
    formData.append('pickup_pincode', trims.pickup_pincode || '')
    formData.append('contact_phone', trims.contact_phone || '')
    formData.append('contact_email', trims.contact_email || '')
    formData.append('gst', trims.gst || '')
    formData.append('cin', trims.cin || '')

    try {
      const { data } = await axiosInstance.post(_shopbrands_create, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setMessage(data?.message)
      fetchItem()

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setShowForm(false)
      resetForm()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      console.log('Form submission completed')
      setIsLoading(false)
    }
  }

  async function handleUpdate(values, { resetForm }) {
    setError('');
    setMessage('');
    setIsLoading(true);

    const trims = {
      name: values.name.trim(),
      remarks: values.remarks.trim(),
      pickup_address: values.pickup_address.trim(),
      pickup_city: values.pickup_city.trim(),
      pickup_state: values.pickup_state.trim(),
      pickup_pincode: values.pickup_pincode.trim(),
      contact_phone: values.contact_phone.trim(),
      contact_email: values.contact_email.trim(),
      gst: values.gst.trim(),
      cin: values.cin.trim(),
    };

    if (updateFormData.id === null) {
      setMessage("Please select first banner.")
      return;
    };

    const formData = new FormData();

    formData.append('name', trims.name);
    formData.append('remarks', trims.remarks);
    formData.append('pickup_address', trims.pickup_address);
    formData.append('pickup_city', trims.pickup_city);
    formData.append('pickup_state', trims.pickup_state);
    formData.append('pickup_pincode', trims.pickup_pincode);
    formData.append('contact_phone', trims.contact_phone);
    formData.append('contact_email', trims.contact_email);
    formData.append('gst', trims.gst);
    formData.append('cin', trims.cin);
    formData.append('image', values.image);

    try {
      await axiosInstance.put(`${_shopbrands_update}/${updateFormData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Brand updated successfully!");
      fetchItem();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      };
      resetForm();
      setUpdateFormData({});
      setPreview('');
      setShowForm(false);
      setActiveForm(!activeFrom);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id) => {
    try {
      const { data } = await axiosInstance.get(`${_productbybrands_get}/${id}`);
      const result = data?.data || [];

      const hasProducts = result.length > 0;

      setModalTitle(hasProducts ? 'Shift Products First' : 'Confirm Deletion');
      setModalMessage(
        hasProducts
          ? 'Please shift all products to another collection before deleting this one.'
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

    setIsLoading(true)
    setError('')

    try {
      await axiosInstance.delete(`${_shopbrands_delete}/${deleteId}`)
      fetchItem()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setOpenModal(false)
      setDeleteId(null)
      setIsLoading(false)
    }
  }

  const handleActiveForm = () => {
    setShowForm(!showForm);
    setActiveForm(false)
  };

  if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong> {!activeFrom ? "Add" : "Update"}</strong> <small>Brands</small>
                </div>

                <div className='d-flex gap-2'>
                  <CInputGroup style={{ maxWidth: '250px' }}>
                    <CFormInput
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search input"
                    />
                    <CButton color="primary" onClick={() => setSearchQuery('')}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 
                                .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 
                                2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                        />
                      </svg>

                    </CButton>
                  </CInputGroup>
                  <CButton
                    as="input"
                    type="button"
                    color="primary"
                    value={showForm ? "Close" : "Add"}
                    onClick={handleActiveForm}
                  />
                </div>
              </div>
            </CCardHeader>
            {showForm ?
              !activeFrom ?
                <CCardBody className="row g-3">
                  <Formik
                    initialValues={{
                      name: '',
                      remarks: '',
                      image: null,
                      pickup_address: '',
                      pickup_city: '',
                      pickup_state: '',
                      pickup_pincode: '',
                      contact_phone: '',
                      contact_email: '',
                      gst: '',
                      cin: '',
                    }}
                    validationSchema={formSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                      <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}>
                        <CCol md={6}>
                          <CFormLabel htmlFor="name">
                            Brand<span className="text-danger">*</span>
                          </CFormLabel>
                          <CFormInput
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                          />
                          {errors.name && touched.name && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.name}
                            </CFormFeedback>
                          )}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="contact_email">Contact E-Mail<span className="text-danger">*</span></CFormLabel>
                          <CFormInput
                            type="text"
                            name="contact_email"
                            value={values.contact_email}
                            onChange={handleChange}
                          />
                          {errors.contact_email && touched.contact_email && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.contact_email}
                            </CFormFeedback>
                          )}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                          <CFormInput
                            type="text"
                            name="remarks"
                            value={values.remarks}
                            onChange={handleChange}
                          />
                          {errors.remarks && touched.remarks && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.remarks}
                            </CFormFeedback>
                          )}
                        </CCol>

                        <CCol md={6}>
                          <CFormLabel htmlFor="pickup_address">Pickup Address<span className="text-danger">*</span></CFormLabel>
                          <CFormInput
                            type="text"
                            name="pickup_address"
                            value={values.pickup_address}
                            onChange={handleChange}
                          />
                          {errors.pickup_address && touched.pickup_address && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.pickup_address}
                            </CFormFeedback>
                          )}
                        </CCol>

                        <CCol md={4}>
                          <CFormLabel htmlFor="pickup_city">Pickup City<span className="text-danger">*</span></CFormLabel>
                          <CFormInput
                            type="text"
                            name="pickup_city"
                            value={values.pickup_city}
                            onChange={handleChange}
                          />
                          {errors.pickup_city && touched.pickup_city && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.pickup_city}
                            </CFormFeedback>
                          )}
                        </CCol>

                        <CCol md={4}>
                          <CFormLabel htmlFor="pickup_state">Pickup State<span className="text-danger">*</span></CFormLabel>
                          <CFormInput
                            type="text"
                            name="pickup_state"
                            value={values.pickup_state}
                            onChange={handleChange}
                          />
                          {errors.pickup_state && touched.pickup_state && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.pickup_state}
                            </CFormFeedback>
                          )}
                        </CCol>

                        <CCol md={4}>
                          <CFormLabel htmlFor="pickup_pincode">Pickup Pincode<span className="text-danger">*</span></CFormLabel>
                          <CFormInput
                            type="text"
                            name="pickup_pincode"
                            value={values.pickup_pincode}
                            onChange={handleChange}
                          />
                          {errors.pickup_pincode && touched.pickup_pincode && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.pickup_pincode}
                            </CFormFeedback>
                          )}
                        </CCol>

                        <CCol md={4}>
                          <CFormLabel htmlFor="contact_phone">Contact Phone<span className="text-danger">*</span></CFormLabel>
                          <CFormInput
                            type="text"
                            name="contact_phone"
                            value={values.contact_phone}
                            onChange={handleChange}
                          />
                          {errors.contact_phone && touched.contact_phone && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.contact_phone}
                            </CFormFeedback>
                          )}
                        </CCol>

                        <CCol md={4}>
                          <CFormLabel htmlFor="gst">GST No.</CFormLabel>
                          <CFormInput
                            type="text"
                            name="gst"
                            value={values.gst}
                            onChange={handleChange}
                          />
                          {errors.gst && touched.gst && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.gst}
                            </CFormFeedback>
                          )}
                        </CCol>

                        <CCol md={4}>
                          <CFormLabel htmlFor="contact_phone"> CIN No.</CFormLabel>
                          <CFormInput
                            type="text"
                            name="cin"
                            value={values.cin}
                            onChange={handleChange}
                          />
                          {errors.cin && touched.cin && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.cin}
                            </CFormFeedback>
                          )}
                        </CCol>

                        <CCol md={6}>
                          <CFormLabel htmlFor="image">
                            Image<span className="text-danger">*</span>
                          </CFormLabel>
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

                          {errors.image && touched.image && (
                            <CFormFeedback className="text-danger smalls">
                              {errors.image}
                            </CFormFeedback>
                          )}
                        </CCol>

                        <CCol xs={12}>
                          <CButton color="primary" type="submit">
                            Submit
                          </CButton>
                        </CCol>
                        {message && <CAlert color="primary mt-4">{message}</CAlert>}
                      </CForm>
                    )}
                  </Formik>
                </CCardBody >
                :
                <>
                  <CCardBody className="row g-3">
                    <Formik
                      initialValues={{
                        name: updateFormData.name || '',
                        image: null,
                        pickup_address: updateFormData.pickup_address || '',
                        pickup_city: updateFormData.pickup_city || '',
                        pickup_state: updateFormData.pickup_state || '',
                        pickup_pincode: updateFormData.pickup_pincode || '',
                        contact_phone: updateFormData.contact_phone || '',
                        contact_email: updateFormData.contact_email || '',
                        remarks: updateFormData.remarks || '',
                        gst: updateFormData.gst || '',
                        cin: updateFormData.cin || '',
                      }}
                      enableReinitialize={true}
                      validationSchema={formSchemaUpdate}
                      onSubmit={handleUpdate}
                    >
                      {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                        <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}>
                          <CCol md={6}>
                            <CFormLabel htmlFor="name">
                              Brand<span className="text-danger">*</span>
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                            />
                            {errors.name && touched.name && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.name}
                              </CFormFeedback>
                            )}
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel htmlFor="contact_email">Contact E-Mail<span className="text-danger">*</span></CFormLabel>
                            <CFormInput
                              type="text"
                              name="contact_email"
                              value={values.contact_email}
                              onChange={handleChange}
                            />
                            {errors.contact_email && touched.contact_email && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.contact_email}
                              </CFormFeedback>
                            )}
                          </CCol>

                          <CCol md={6}>
                            <CFormLabel htmlFor="remarks">
                              Remarks
                            </CFormLabel>
                            <CFormInput
                              type="text"
                              name="remarks"
                              value={values.remarks}
                              onChange={handleChange}
                            />
                            {errors.remarks && touched.remarks && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.remarks}
                              </CFormFeedback>
                            )}
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel htmlFor="pickup_address">Pickup Address<span className="text-danger">*</span></CFormLabel>
                            <CFormInput
                              type="text"
                              name="pickup_address"
                              value={values.pickup_address}
                              onChange={handleChange}
                            />
                            {errors.pickup_address && touched.pickup_address && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.pickup_address}
                              </CFormFeedback>
                            )}
                          </CCol>

                          <CCol md={4}>
                            <CFormLabel htmlFor="pickup_city">Pickup City<span className="text-danger">*</span></CFormLabel>
                            <CFormInput
                              type="text"
                              name="pickup_city"
                              value={values.pickup_city}
                              onChange={handleChange}
                            />
                            {errors.pickup_city && touched.pickup_city && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.pickup_city}
                              </CFormFeedback>
                            )}
                          </CCol>

                          <CCol md={4}>
                            <CFormLabel htmlFor="pickup_state">Pickup State<span className="text-danger">*</span></CFormLabel>
                            <CFormInput
                              type="text"
                              name="pickup_state"
                              value={values.pickup_state}
                              onChange={handleChange}
                            />
                            {errors.pickup_state && touched.pickup_state && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.pickup_state}
                              </CFormFeedback>
                            )}
                          </CCol>

                          <CCol md={4}>
                            <CFormLabel htmlFor="pickup_pincode">Pickup Pincode<span className="text-danger">*</span></CFormLabel>
                            <CFormInput
                              type="text"
                              name="pickup_pincode"
                              value={values.pickup_pincode}
                              onChange={handleChange}
                            />
                            {errors.pickup_pincode && touched.pickup_pincode && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.pickup_pincode}
                              </CFormFeedback>
                            )}
                          </CCol>

                          <CCol md={4}>
                            <CFormLabel htmlFor="contact_phone">Contact Phone<span className="text-danger">*</span></CFormLabel>
                            <CFormInput
                              type="text"
                              name="contact_phone"
                              value={values.contact_phone}
                              onChange={handleChange}
                            />
                            {errors.contact_phone && touched.contact_phone && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.contact_phone}
                              </CFormFeedback>
                            )}
                          </CCol>

                          <CCol md={4}>
                            <CFormLabel htmlFor="gst">GST No.</CFormLabel>
                            <CFormInput
                              type="text"
                              name="gst"
                              value={values.gst}
                              onChange={handleChange}
                            />
                            {errors.gst && touched.gst && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.gst}
                              </CFormFeedback>
                            )}
                          </CCol>

                          <CCol md={4}>
                            <CFormLabel htmlFor="cin">CIN No.</CFormLabel>
                            <CFormInput
                              type="text"
                              name="cin"
                              value={values.cin}
                              onChange={handleChange}
                            />
                            {errors.cin && touched.cin && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.cin}
                              </CFormFeedback>
                            )}
                          </CCol>

                          <CCol md={8}>
                            <CFormLabel htmlFor="image">
                              Image<span className="text-danger">*</span>
                            </CFormLabel>
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

                            {errors.image && touched.image && (
                              <CFormFeedback className="text-danger smalls">
                                {errors.image}
                              </CFormFeedback>
                            )}
                          </CCol>

                          <CCol xs={12}>
                            <CButton color="primary" type="submit">
                              Submit
                            </CButton>
                          </CCol>
                          {message && <CAlert color="primary mt-4">{message}</CAlert>}
                        </CForm>
                      )}
                    </Formik>
                  </CCardBody >
                </>
              :
              null
            }
          </CCard >
          <div className="mt-4">
            {message && <CAlert color="primary">{message}</CAlert>}
            {error && <CAlert color="danger">{error}</CAlert>}
          </div>
          <Table
            item={filteredBrands}
            formData={setUpdateFormData}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            setActiveForm={setActiveForm}
            setShowForm={setShowForm}
          />
        </CCol >
        <Modal
          visible={openModal}
          onClose={() => setOpenModal(false)}
          onConfirm={handleConfirmDelete}
          title={modalTitle}
          message={modalMessage}
        />
      </CRow >
    </>
  )
}

export default ShopByBrands;
