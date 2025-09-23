import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config';
import {
  _aboutusourmission_create,
  _aboutusourmission_delete,
  _aboutusourmission_get,
  _aboutusourmission_update,
  _aboutusourmissionmarathi_get,
  _aboutusourmissionmarathi_create,
  _aboutusourmissionmarathi_update,
  _aboutusourmissionmarathi_delete,
  _url

} from '../../config/api.endpoints';
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CInputGroup, CInputGroupText, CRow, CSpinner } from '@coreui/react';
import * as yup from "yup";
import Modal from '../base/modal/Modal';
import Table from '../base/tables/OurMissionTable';
import { Formik } from 'formik';
import { handleApiError } from '../../utils/errorHelper';
import ImageCropper from '../../components/image-cropper/ImageCropper';
import ImagePreview from '../../components/image-cropper/ImagePreview';

const OurMission = () => {
  const [mission, setMission] = useState([]);
  const [language, setLanguage] = useState('english');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeFrom, setActiveForm] = useState(false)
  const [endpoint, setEndpoint] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateFormData, setUpdateFormData] = useState(null);
  const [preview, setPreview] = useState({ primary: "", secondary: "" });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFirstRender = useRef(true);
  const fileInputRef = useRef(null);

  const [originalImage, setOriginalImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [currentCroppingField, setCurrentCroppingField] = useState(null);

  const [showPrimaryPreview, setShowPrimaryPreview] = useState(false);
  const [showSecondaryPreview, setShowSecondaryPreview] = useState(false);

  const validationSchema = yup.object().shape({
    description: yup.string()
      .required("Description is required")
      .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
    // .max(500, "Description must be at most 500 characters long"),
    image_primary: yup.mixed()
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
    image_secondary: yup.mixed()
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
    image_primary: yup.mixed()
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
    image_secondary: yup.mixed()
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
    if (updateFormData) {
      setPreview({
        primary: updateFormData.image_primary || '',
        secondary: updateFormData.image_secondary || ''
      })
    }
  }, [updateFormData]);

  useEffect(() => {
    const newEndpoint = {
      getMission: language === "english" ? _aboutusourmission_get : _aboutusourmissionmarathi_get,
      postMission: language === "english" ? _aboutusourmission_create : _aboutusourmissionmarathi_create,
      putMission: language === "english" ? _aboutusourmission_update : _aboutusourmissionmarathi_update,
      deleteMission: language === "english" ? _aboutusourmission_delete : _aboutusourmissionmarathi_delete,
    };
    setEndpoint(newEndpoint);
  }, [language]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (endpoint) {
      fetchMission(endpoint);
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

  const fetchMission = async (endpoint) => {
    setIsLoading(true);
    setError('');

    try {
      const { data } = await axiosInstance.get(endpoint.getMission);
      setMission(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  async function handleSubmit(values, { resetForm }) {
    setIsLoading(true);
    setMessage('');
    setError('');

    const trims = {
      description: values.description.trim(),
    };

    const formData = new FormData();

    formData.append('description', trims.description)
    formData.append('image_primary', values.image_primary)
    formData.append('image_secondary', values.image_secondary)

    try {
      const { data } = await axiosInstance.post(endpoint.postMission, formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage('Record created successfully!');
      fetchMission(endpoint);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      };

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

    try {
      await axiosInstance.delete(`${endpoint.deleteMission}/${deleteId}`)
      fetchMission(endpoint);
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
    };

    const trims = {
      description: values.description.trim(),
    };

    const formData = new FormData();

    formData.append('description', trims.description);

    if (values.image_primary instanceof File) {
      formData.append('image_primary', values.image_primary);
    };

    if (values.image_secondary instanceof File) {
      formData.append('image_secondary', values.image_secondary);
    };

    try {
      await axiosInstance.put(`${endpoint.putMission}/${updateFormData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Record updated successfully!");
      fetchMission(endpoint);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      };

      setUpdateFormData({});
      setPreview('');
      resetForm();
      setShowForm(false);
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
              <strong> {!activeFrom ? "Add" : "Update"}</strong> <small>our mission</small>
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
                {!mission?.length > 0
                  ?
                  <CButton as="input" type="button" color="primary" value={showForm !== true ? "Add" : "Close"} onClick={() => handleActiveForm()} />
                  :
                  !activeFrom || showForm && <CButton as="input" type="button" color="primary" value="Close" onClick={() => handleActiveForm()} />
                }
              </CCol>
              {showForm ?
                !activeFrom ?
                  !mission?.length > 0 &&
                  <Formik
                    initialValues={{
                      description: '',
                      image_primary: null,
                      image_secondary: null,
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                      <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}
                      >
                        <CCol md={12}>
                          <CFormLabel htmlFor="description">Description<span className='text-danger'>*</span></CFormLabel>
                          <CFormTextarea type="text" name='description' value={values.description} onChange={handleChange} />
                          {errors.description && touched.description &&
                            <CFormFeedback className="text-danger small">{errors.description}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="image_primary">Primary Image<span className='text-danger'>*</span></CFormLabel>
                          <div className="d-flex align-items-center gap-2">
                            <CFormInput
                              type="file"
                              accept="image/*"
                              name="image_primary"
                              onChange={(e) => {
                                const file = e.target.files[0];

                                if (file) {
                                  setOriginalImage(file);
                                  setCurrentCroppingField("image_primary");
                                  setShowCropModal(true);
                                }
                              }}
                            />

                            {values.image_primary && (
                              <CButton
                                color="primary"
                                size="md"
                                type="button"
                                onClick={() => setShowPrimaryPreview(true)}
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
                              visible={showPrimaryPreview}
                              imageFile={values.image_primary}
                              onClose={() => setShowPrimaryPreview(false)}
                            />
                          </div>

                          {errors.image_primary && touched.image_primary &&
                            <CFormFeedback className="text-danger small">{errors.image_primary}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="image_secondary">Secondary Image<span className='text-danger'>*</span></CFormLabel>
                          <div className="d-flex align-items-center gap-2">
                            <CFormInput
                              type="file"
                              accept="image/*"
                              name="image_secondary"
                              onChange={(e) => {
                                const file = e.target.files[0];

                                if (file) {
                                  setOriginalImage(file);
                                  setCurrentCroppingField("image_secondary");
                                  setShowCropModal(true);
                                }
                              }}
                            />

                            {values.image_secondary && (
                              <CButton
                                color="primary"
                                size="md"
                                type="button"
                                onClick={() => setShowSecondaryPreview(true)}
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
                              visible={showSecondaryPreview}
                              imageFile={values.image_secondary}
                              onClose={() => setShowSecondaryPreview(false)}
                            />
                          </div>

                          {errors.image_secondary && touched.image_secondary &&
                            <CFormFeedback className="text-danger small">{errors.image_secondary}</CFormFeedback>}
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
                        description: updateFormData.description || '',
                        image_primary: updateFormData.image_primary || null,
                        image_secondary: updateFormData.image_secondary || null,
                      }}
                      enableReinitialize={true}
                      validationSchema={updateValidationSchema}
                      onSubmit={handleUpdate}
                    >
                      {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => (
                        <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}
                        >
                          <CCol md={12}>
                            <CFormLabel htmlFor="description">Description<span className='text-danger'>*</span></CFormLabel>
                            <CFormTextarea
                              type="text"
                              name='description'
                              value={values.description}
                              onChange={handleChange} />
                            {errors.description && touched.description &&
                              <CFormFeedback className="text-danger small">{errors.description}</CFormFeedback>}
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel htmlFor="image_primary">Primary Image<span className='text-danger'>*</span></CFormLabel>
                            <div className="d-flex align-items-center gap-2">
                              <CFormInput
                                type="file"
                                accept="image/*"
                                name="image_primary"
                                onChange={(e) => {
                                  const file = e.target.files[0];

                                  if (file) {
                                    setOriginalImage(file);
                                    setCurrentCroppingField("image_primary");
                                    setPreview((prev) => ({
                                      ...prev,
                                      primary: URL.createObjectURL(file)
                                    }));
                                    setShowCropModal(true);
                                  }
                                }}
                              />

                              {preview.primary && (
                                <CButton
                                  color="primary"
                                  size="md"
                                  type="button"
                                  onClick={() => setShowPrimaryPreview(true)}
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
                                visible={showPrimaryPreview}
                                imageFile={preview.primary.startsWith("blob:") ? preview.primary : _url + preview.primary}
                                onClose={() => setShowPrimaryPreview(false)}
                              />
                            </div>

                            {errors.image_primary && touched.image_primary &&
                              <CFormFeedback className="text-danger small">{errors.image_primary}</CFormFeedback>}
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel htmlFor="image_secondary">Secondary Image<span className='text-danger'>*</span></CFormLabel>
                            <div className="d-flex align-items-center gap-2">
                              <CFormInput
                                type="file"
                                accept="image/*"
                                name="image_secondary"
                                onChange={(e) => {
                                  const file = e.target.files[0];

                                  if (file) {
                                    setOriginalImage(file);
                                    setCurrentCroppingField("image_secondary");
                                    setPreview((prev) => ({
                                      ...prev,
                                      secondary: URL.createObjectURL(file)
                                    }));
                                    setShowCropModal(true);
                                  }
                                }}
                              />

                              {preview.secondary && (
                                <CButton
                                  color="primary"
                                  size="md"
                                  type="button"
                                  onClick={() => setShowSecondaryPreview(true)}
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
                                visible={showSecondaryPreview}
                                imageFile={preview.secondary.startsWith("blob:") ? preview.secondary : _url + preview.secondary}
                                onClose={() => setShowSecondaryPreview(false)}
                              />
                            </div>
                            {errors.image_secondary && touched.image_secondary &&
                              <CFormFeedback className="text-danger small">{errors.image_secondary}</CFormFeedback>}
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
            mission={mission}
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
          message="Are you sure you want to delete this our mission?"
        />
      </CRow>
    </>
  )
}

export default OurMission;