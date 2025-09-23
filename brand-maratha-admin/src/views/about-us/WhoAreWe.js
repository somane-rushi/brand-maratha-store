import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config';
import {
  _aboutuswhoarewe_create,
  _aboutuswhoarewe_delete,
  _aboutuswhoarewe_get,
  _aboutuswhoarewe_update,
  _aboutuswhoarewemarathi_get,
  _aboutuswhoarewemarathi_create,
  _aboutuswhoarewemarathi_update,
  _aboutuswhoarewemarathi_delete
} from '../../config/api.endpoints';
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol, CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner
} from '@coreui/react';
import Modal from '../base/modal/Modal';
import Table from '../base/tables/WhoAreWeTable';
import { Formik } from 'formik';
import * as yup from "yup";
import { handleApiError } from '../../utils/errorHelper';

const WhoAreWe = () => {
  const [whoarewe, setWhoAreWe] = useState([]);
  const [language, setLanguage] = useState('english');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeFrom, setActiveForm] = useState(false)
  const isFirstRender = useRef(true);
  const [endpoint, setEndpoint] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // const validationSchema = yup.object().shape({
  //   title: yup.string()
  //     .required("Title is required")
  //     .test("no-whitespace", "Title cannot be empty or only spaces", (value) => value && value.trim().length > 0)
  //     .max(255, "Title must be at most 255 characters")
  //     .test("word-count", function (value) {
  //       if (!value) return this.createError({ message: "Title is required" });

  //       const wordCount = value.trim().split(/\s+/).length;

  //       if (wordCount > 5) {
  //         return this.createError({ message: `Title must not exceed 5 words. Currently, it has ${wordCount}.` });
  //       }
  //       return true;
  //     })
  //     .matches(language === 'english' ? /^[a-zA-Z0-9\s.,!?()-]+$/ : /^[\u0900-\u097F\s.,!?()\-\d]+$/, "Title contains invalid characters"),
  //   subtitle: yup.string()
  //     .required("Subtitle is required")
  //     .test("no-whitespace", "Subtitle cannot be empty or only spaces", (value) => value && value.trim().length > 0)
  //     .max(255, "Subtitle must be at most 255 characters")
  //     .test("word-count", function (value) {
  //       if (!value) return this.createError({ message: "Subtitle is required" });

  //       const wordCount = value.trim().split(/\s+/).length;

  //       if (wordCount > 5) {
  //         return this.createError({ message: `Subtitle must not exceed 5 words. Currently, it has ${wordCount}.` });
  //       }
  //       return true;
  //     })
  //     .matches(language === 'english' ? /^[a-zA-Z0-9\s.,!?()-]+$/ : /^[\u0900-\u097F\s.,!?()\-\d]+$/, "Subtitle contains invalid characters"),
  // });

  const validationSchema = yup.object().shape({
    title: yup.string()
      .required("Title is required")
      .test("no-whitespace", "Title cannot be empty or only spaces", (value) => value && value.trim().length > 0)
      .max(255, "Title must be at most 255 characters"),

    subtitle: yup.string()
      .required("Description is required")
      .test("no-whitespace", "Description cannot be empty or only spaces", (value) => value && value.trim().length > 0)
      .max(255, "Description must be at most 255 characters")
  });


  useEffect(() => {
    const newEndpoint = {
      getWhoAreWe: language === "english" ? _aboutuswhoarewe_get : _aboutuswhoarewemarathi_get,
      postWhoAreWe: language === "english" ? _aboutuswhoarewe_create : _aboutuswhoarewemarathi_create,
      putWhoAreWe: language === "english" ? _aboutuswhoarewe_update : _aboutuswhoarewemarathi_update,
      deleteWhoAreWe: language === "english" ? _aboutuswhoarewe_delete : _aboutuswhoarewemarathi_delete,
    };

    setEndpoint(newEndpoint);
  }, [language]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (endpoint) {
      fetchWhoAreWe(endpoint);
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

  const fetchWhoAreWe = async (endpoint) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await axiosInstance.get(endpoint.getWhoAreWe);
      setWhoAreWe(result?.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  async function handleSubmit(values, { resetForm }) {
    setIsLoading(true);
    setError('')
    setMessage('');

    const payload = {
      ...values,
      title: values.title.trim(),
      subtitle: values.subtitle.trim(),
    };

    try {
      await axiosInstance.post(endpoint.postWhoAreWe, payload);
      setMessage('Record added successfully!');
      fetchWhoAreWe(endpoint);
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenModal(true);
  };

  async function handleConfirmDelete() {
    setIsLoading(true);
    setError('');

    try {
      await axiosInstance.delete(`${endpoint.deleteWhoAreWe}/${deleteId}`)
      fetchWhoAreWe(endpoint);
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

    const payload = {
      ...values,
      title: values.title.trim(),
      subtitle: values.subtitle.trim(),
    };

    try {
      await axiosInstance.put(`${endpoint.putWhoAreWe}/${updateFormData.id}`, payload);
      setMessage("Who are we updated successfully!");
      fetchWhoAreWe(endpoint);
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
              <strong> {!activeFrom ? "Add" : "Update"}</strong> <small>who are we</small>
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
                {!whoarewe?.length > 0
                  ?
                  <CButton as="input" type="button" color="primary" value={showForm !== true ? "Add" : "Close"} onClick={() => handleActiveForm()} />
                  :
                  !activeFrom || showForm && <CButton as="input" type="button" color="primary" value="Close" onClick={() => handleActiveForm()} />
                }
              </CCol>
              {showForm ?
                !activeFrom ?
                  !whoarewe?.length > 0 &&
                  <Formik
                    initialValues={{
                      title: "",
                      subtitle: "",
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched }) => (
                      <CForm
                        className="row g-3"
                        onSubmit={handleSubmit}
                      >
                        <CCol md={12}>
                          <CFormLabel htmlFor="title">Title<span className='text-danger'>*</span></CFormLabel>
                          <CFormInput type="text" name='title' value={values.title} onChange={handleChange} />
                          {errors.title && touched.title &&
                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                        </CCol>
                        <CCol md={12}>
                          <CFormLabel htmlFor="subtitle">Description<span className='text-danger'>*</span></CFormLabel>
                          <CFormTextarea type="text" name='subtitle' value={values.subtitle} onChange={handleChange} />
                          {errors.subtitle && touched.subtitle &&
                            <CFormFeedback className="text-danger small">{errors.subtitle}</CFormFeedback>}
                        </CCol>
                        <CCol md={12}>
                          <CButton color="primary" type="submit">
                            Submit
                          </CButton>
                        </CCol>
                      </CForm>
                    )}
                  </Formik>
                  :
                  <Formik
                    initialValues={{
                      title: updateFormData.title || "",
                      subtitle: updateFormData.subtitle || "",
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleUpdate}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched }) => (
                      <CForm
                        className="row g-3"
                        onSubmit={handleSubmit}
                      >
                        <CCol md={12}>
                          <CFormLabel htmlFor="title">Title<span className='text-danger'>*</span></CFormLabel>
                          <CFormInput type="text" name='title' value={values.title} onChange={handleChange} />
                          {errors.title && touched.title &&
                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                        </CCol>
                        <CCol md={12}>
                          <CFormLabel htmlFor="subtitle">Description<span className='text-danger'>*</span></CFormLabel>
                          <CFormTextarea type="text" name='subtitle' value={values.subtitle} onChange={handleChange} />
                          {errors.subtitle && touched.subtitle &&
                            <CFormFeedback className="text-danger small">{errors.subtitle}</CFormFeedback>}
                        </CCol>
                        <CCol md={12}>
                          <CButton color="primary" type="submit">
                            Update
                          </CButton>
                        </CCol>
                      </CForm>
                    )}
                  </Formik>
                :
                null
              }
            </CCardBody>
          </CCard>

          <div className='mt-4'>
            {message && <CAlert color="primary">{message}</CAlert>}
            {error && <CAlert color="danger">{error}</CAlert>}
          </div>
          <Table
            whoarewe={whoarewe}
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
          message="Are you sure you want to delete this who are we?"
        />
      </CRow>
    </>
  )
}

export default WhoAreWe;