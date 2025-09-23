import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config'
import { _brands_create, _brands_delete, _brands_get } from '../../config/api.endpoints'
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
  CRow,
  CSpinner,
} from '@coreui/react'
import Modal from '../base/modal/Modal'
import Table from '../base/tables/BrandsTable'
import * as yup from 'yup'
import { Formik } from 'formik'
import { handleApiError } from '../../utils/errorHelper'
import ImageCropper from '../../components/image-cropper/ImageCropper';
import ImagePreview from '../../components/image-cropper/ImagePreview';

const Brands = () => {
  const [item, setItem] = useState([])
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

  const formSchema = yup.object().shape({
    // name: yup.string()
    //   .required("Title is required")
    //   .test("no-whitespace", "Title cannot be empty or only spaces", (value) => value && value.trim().length > 0)
    //   .max(255, "Title must be at most 255 characters")
    //   .test("word-count", function (value) {
    //     if (!value) return this.createError({ message: "Title is required" });

    //     const wordCount = value.trim().split(/\s+/).length

    //     if (wordCount > 5) {
    //       return this.createError({
    //         message: `Title must not exceed 5 words. Currently, it has ${wordCount}.`,
    //       })
    //     }
    //     return true
    //   })
    //   .matches(/^[a-zA-Z0-9\s.,!?()-]+$/, 'Title contains invalid characters'),
    // email: yup
    //   .string()
    //   .required('Email is required')
    //   .test('no-whitespace', 'Cannot be only spaces', (value) => value && value.trim().length > 0)
    //   .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Invalid email format')
    //   .email('Invalid email format'),
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

  async function handleSubmit(values, { resetForm }) {
    setIsLoading(true)
    setMessage('')
    setError('')

    const formData = new FormData()
    const trimmedName = values.name?.trim();

    if (trimmedName) {
      formData.append('name', trimmedName);
    }

    if (values.image instanceof File) {
      formData.append('image', values.image);
    };

    try {
      const { data } = await axiosInstance.post(_brands_create, formData, {
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

  const handleDelete = (id) => {
    setDeleteId(id)
    setOpenModal(true)
  }

  async function handleConfirmDelete() {
    setIsLoading(true)
    setError('')

    try {
      await axiosInstance.delete(`${_brands_delete}/${deleteId}`)
      fetchItem()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setOpenModal(false)
      setDeleteId(null)
      setIsLoading(false)
    }
  }

  if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add</strong> <small>Brands</small>
            </CCardHeader>
            <CCardBody className="row g-3">
              <CCol xs={12} md={6}>
                <CButton
                  as="input"
                  type="button"
                  color="primary"
                  value={showForm !== true ? 'Add' : 'Close'}
                  onClick={() => setShowForm(!showForm)}
                />
              </CCol>
              {showForm && (
                <Formik
                  initialValues={{
                    name: '',
                    image: null,
                  }}
                  validationSchema={formSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                    <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}>
                      <CCol md={6}>
                        <CFormLabel htmlFor="name">
                          Title
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
              )}
            </CCardBody >
          </CCard >
          <div className="mt-4">
            {message && <CAlert color="primary">{message}</CAlert>}
            {error && <CAlert color="danger">{error}</CAlert>}
          </div>
          <Table item={item} handleDelete={handleDelete} />
        </CCol >
        <Modal
          visible={openModal}
          onClose={() => setOpenModal(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message="Are you sure you want to delete this brands?"
        />
      </CRow >
    </>
  )
}

export default Brands;
