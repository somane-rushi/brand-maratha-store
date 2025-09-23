import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config';
import {
  _aboutusourjourney_create,
  _aboutusourjourney_delete,
  _aboutusourjourney_get,
  _aboutusourjourney_update,
  _aboutusourjourneymarathi_get,
  _aboutusourjourneymarathi_create,
  _aboutusourjourneymarathi_update,
  _aboutusourjourneymarathi_delete,
  _url

} from '../../config/api.endpoints';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CInputGroup, CInputGroupText, CRow, CSpinner } from '@coreui/react';
import Modal from '../base/modal/Modal';
import Table from '../base/tables/OurJourneyTable';
import { Formik } from 'formik';
import * as yup from "yup";
import { handleApiError } from '../../utils/errorHelper';
import ImageCropper from '../../components/image-cropper/ImageCropper';
import ImagePreview from '../../components/image-cropper/ImagePreview';

const OurJourney = () => {
  const [journey, setJourney] = useState([]);
  const [language, setLanguage] = useState('english');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeFrom, setActiveForm] = useState(false)
  const [endpoint, setEndpoint] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isFirstRender = useRef(true);
  const fileInputRef = useRef(null);

  const [originalImage, setOriginalImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const validationSchema = yup.object().shape({
    description: yup.string()
      .required("Description is required")
      .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
    // .max(500, "Description must be at most 500 characters long"),
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
    description: yup.string()
      .required("Description is required")
      .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
    // .max(500, "Description must be at most 500 characters long"),
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
    const newEndpoint = {
      getJourney: language === "english" ? _aboutusourjourney_get : _aboutusourjourneymarathi_get,
      postJourney: language === "english" ? _aboutusourjourney_create : _aboutusourjourneymarathi_create,
      putJourney: language === "english" ? _aboutusourjourney_update : _aboutusourjourneymarathi_update,
      deleteJourney: language === "english" ? _aboutusourjourney_delete : _aboutusourjourneymarathi_delete,
    };

    setEndpoint(newEndpoint);
  }, [language]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (endpoint) {
      fetchJourney(endpoint);
    }
  }, [endpoint]);

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
    setPreview(updateFormData.image || "");
  }, [updateFormData.image]);

  const fetchJourney = async (endpoint) => {
    setIsLoading(true);

    try {
      const { data } = await axiosInstance.get(endpoint.getJourney);
      setJourney(data);
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
      description: values.description.trim(),
    };

    const formData = new FormData();

    formData.append('description', trims.description)
    formData.append('image', values.image)

    try {
      const { data } = await axiosInstance.post(endpoint.postJourney, formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage('Record created successfull!');
      fetchJourney(endpoint);
      setShowForm(false);
      resetForm();
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
      await axiosInstance.delete(`${endpoint.deleteJourney}/${deleteId}`)
      fetchJourney(endpoint);
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
    setError('');
    setMessage('');


    if (updateFormData.id === null) {
      setMessage("Please select a banner first.");
      return;
    };

    const trims = {
      description: values.description.trim(),
    };

    const formData = new FormData();

    formData.append('description', trims.description);

    if (values.image instanceof File) {
      formData.append('image', values.image);
    };

    try {
      await axiosInstance.put(`${endpoint.putJourney}/${updateFormData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Journey updated successfully!");
      fetchJourney(endpoint);
      setPreview('');
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

  if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong> {!activeFrom ? "Add" : "Update"}</strong> <small>our journey</small>
            </CCardHeader>
            <CCardBody className='row g-3'>
              <CCol xs={12} md={4} lg={2}>
                <CFormSelect
                  aria-label="Default select example"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={showForm}
                >
                  <option value="english">English</option>
                  <option value="marathi">मराठी</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12} md={6}>
                {!journey?.length > 0
                  ?
                  <CButton as="input" type="button" color="primary" value={showForm !== true ? "Add" : "Close"} onClick={() => handleActiveForm()} />
                  :
                  !activeFrom || showForm && <CButton as="input" type="button" color="primary" value="Close" onClick={() => handleActiveForm()} />
                }
              </CCol>
              {showForm ?
                !activeFrom ?
                  !journey?.length > 0 &&
                  <Formik
                    initialValues={{
                      description: "",
                      image: null,
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                      <CForm
                        className="row g-3 needs-validation"
                        onSubmit={handleSubmit}
                      >
                        <CCol md={12}>
                          <CFormLabel htmlFor="description">Description<span className='text-danger'>*</span></CFormLabel>
                          <CFormTextarea type="text" name='description' value={values.description} onChange={handleChange} />
                          {errors.description && touched.description &&
                            <CFormFeedback className="text-danger small">{errors.description}</CFormFeedback>}
                        </CCol>
                        <CCol md={12}>
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

                  :
                  <>
                    <Formik
                      initialValues={{
                        description: updateFormData.description || "",
                        image: null,
                      }}
                      enableReinitialize={true}
                      validationSchema={updateValidationSchema}
                      onSubmit={handleUpdate}
                    >
                      {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                        <CForm
                          className="row g-3"
                          onSubmit={handleSubmit}
                        >
                          <CCol md={12}>
                            <CFormLabel htmlFor="description">Description<span className='text-danger'>*</span></CFormLabel>
                            <CFormTextarea type="text" name='description' value={values.description} onChange={handleChange} />
                            {errors.description && touched.description &&
                              <CFormFeedback className="text-danger small">{errors.description}</CFormFeedback>}
                          </CCol>
                          <CCol md={12}>
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
                                imageFile={preview?.startsWith("blob:") ? preview : _url + preview}
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
                  </> : null
              }
            </CCardBody>
          </CCard>
          <div className='mt-4'>
            {message && <CAlert color="primary">{message}</CAlert>}
            {error && <CAlert color="danger">{error}</CAlert>}
          </div>
          <Table
            journey={journey}
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
          message="Are you sure you want to delete this our journey?"
        />
      </CRow>
    </>
  )
}

export default OurJourney;