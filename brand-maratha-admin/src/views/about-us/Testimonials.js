import React, { Fragment, useEffect, useRef, useState } from 'react'
import axiosInstance from '../../config/axios.config';
import {
  _aboutustestimonials_create,
  _aboutustestimonials_delete,
  _aboutustestimonials_get,
  _aboutustestimonials_update,
  _aboutustestimonialsmarathi_get,
  _aboutustestimonialsmarathi_create,
  _aboutustestimonialsmarathi_update,
  _aboutustestimonialsmarathi_delete,
  _allproducts_get,
  _userslist_get
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
import Table from '../base/tables/TestimonialsTable';
import { Formik } from 'formik';
import * as yup from "yup";
import { handleApiError } from '../../utils/errorHelper';

const Testimonials = () => {
  const [item, setItem] = useState([]);
  // const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [language, setLanguage] = useState('english');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeFrom, setActiveForm] = useState(false)
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [endpoint, setEndpoint] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({});

  const isFirstRender = useRef(true);

  const validationSchema = yup.object().shape({
    rating: yup.number()
      .typeError("Rating must be a number")
      .required("Rating is required")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),
    // title: yup.string()
    //   .required("Title is required")
    //   .test("no-whitespace", "Title cannot be empty or only spaces", (value) => value && value.trim().length > 0)
    //   .max(255, "Title must be at most 255 characters")
    //   .test("word-count", function (value) {
    //     if (!value) return this.createError({ message: "Title is required" });

    //     const wordCount = value.trim().split(/\s+/).length;

    //     if (wordCount > 5) {
    //       return this.createError({ message: `Title must not exceed 5 words. Currently, it has ${wordCount}.` });
    //     }
    //     return true;
    //   })
    //   .matches(language === 'english' ? /^[a-zA-Z0-9\s.,!?()-]+$/ : /^[\u0900-\u097F\s.,!?()\-\d]+$/, "Title contains invalid characters"),
    // description: yup.string()
    //   .required("Description is required")
    //   .test("no-whitespace", "Cannot be only spaces", (value) => value && value.trim().length > 0),
    // // .max(500, "Description must be at most 500 characters long"),
    // user: yup.string()
    //   .required("User ID is required")
    //   .matches(/^\d+$/, "User ID must be a number"),
    product_id: yup.string()
      .required("Product ID is required")
      .matches(/^\d+$/, "Product ID must be a number"),
  });

  useEffect(() => {
    const newEndpoint = {
      getTestimonialss: language === "english" ? _aboutustestimonials_get : _aboutustestimonialsmarathi_get,
      postTestimonials: language === "english" ? _aboutustestimonials_create : _aboutustestimonialsmarathi_create,
      putTestimonials: language === "english" ? _aboutustestimonials_update : _aboutustestimonialsmarathi_update,
      deleteTestimonials: language === "english" ? _aboutustestimonials_delete : _aboutustestimonialsmarathi_delete,
    };

    setEndpoint(newEndpoint);
  }, [language]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (endpoint) {
      fetchItem(endpoint);
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
    (async () => {
      setIsLoading(true);
      setError('');

      try {
        const { data } = await axiosInstance.get(_allproducts_get);
        setProducts(data.data)
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    })()
  }, []);

  const fetchItem = async (endpoint) => {
    setIsLoading(true);
    setError('');

    try {
      const { data } = await axiosInstance.get(endpoint.getTestimonialss);
      setItem(data);
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

    const prepared = {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    };

    const payload = Object.fromEntries(
      Object.entries(prepared).filter(([_, v]) => v !== '')
    );

    try {
      await axiosInstance.post(endpoint.postTestimonials, payload);

      setMessage('Testimonials created successfully!');
      fetchItem(endpoint);
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
      await axiosInstance.delete(`${endpoint.deleteTestimonials}/${deleteId}`)
      fetchItem(endpoint);
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

    // const payload = {
    //   ...values,
    //   title: values.title.trim(),
    //   description: values.description.trim(),
    // };
    const prepared = {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    };

    const payload = Object.fromEntries(
      Object.entries(prepared).filter(([_, v]) => v !== '')
    );

    try {
      await axiosInstance.put(`${endpoint.putTestimonials}/${updateFormData.id}`, payload);
      setMessage("Testimonials updated successfully!");
      fetchItem(endpoint);
      setUpdateFormData({});
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
              <strong> {!activeFrom ? "Add" : "Update"}</strong> <small>testimonials</small>
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
                <CButton as="input" type="button" color="primary" value={showForm !== true ? "Add" : "Close"} onClick={() => handleActiveForm()} />
              </CCol>
              {showForm ?
                !activeFrom ?
                  <Formik
                    initialValues={{
                      rating: '',
                      title: '',
                      description: '',
                      user: '',
                      location: '',
                      product_id: ''
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched }) => (
                      <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}>
                        <CCol md={6}>
                          <CFormLabel htmlFor="rating">Rating<span className='text-danger'>*</span></CFormLabel>
                          <CFormSelect
                            aria-label="Default select example"
                            name="rating"
                            value={values.rating}
                            onChange={handleChange}
                          >
                            <option value="">Choose</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </CFormSelect>
                          {errors.rating && touched.rating &&
                            <CFormFeedback className="text-danger small">{errors.rating}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="title">Title</CFormLabel>
                          <CFormInput
                            type="text"
                            name='title'
                            value={values.title}
                            onChange={handleChange}
                          />
                          {errors.title && touched.title &&
                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="user">User</CFormLabel>
                          <CFormInput
                            type="text"
                            name='user'
                            value={values.user}
                            onChange={handleChange}
                          />
                          {errors.user && touched.user &&
                            <CFormFeedback className="text-danger small">{errors.user}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="user">Location</CFormLabel>
                          <CFormInput
                            type="text"
                            name='location'
                            value={values.location}
                            onChange={handleChange}
                          />
                          {errors.location && touched.location &&
                            <CFormFeedback className="text-danger small">{errors.location}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="product_id">Product<span className='text-danger'>*</span></CFormLabel>
                          <CFormSelect
                            aria-label="Default select example"
                            name="product_id"
                            value={values.product_id}
                            onChange={handleChange}
                          >
                            <option value="">Choose</option>
                            {products.map((item, index) => (
                              <Fragment key={index}>
                                <option value={item.id}>{item.name}</option>
                              </Fragment>
                            ))}
                          </CFormSelect>
                          {errors.product_id && touched.product_id &&
                            <CFormFeedback className="text-danger small">{errors.product_id}</CFormFeedback>}
                        </CCol>
                        <CCol md={12}>
                          <CFormLabel htmlFor="description">Description</CFormLabel>
                          <CFormTextarea
                            type="text"
                            name='description'
                            value={values.description}
                            onChange={handleChange}
                          />
                          {errors.description && touched.description &&
                            <CFormFeedback className="text-danger small">{errors.description}</CFormFeedback>}
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
                  <Formik
                    initialValues={{
                      rating: updateFormData.rating || '',
                      title: updateFormData.title || '',
                      description: updateFormData.description || '',
                      user: updateFormData.user || '',
                      location: updateFormData.location || '',
                      product_id: updateFormData.product_id || ''
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleUpdate}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched }) => (
                      <CForm className="row g-3" onSubmit={handleSubmit}>
                        <CCol md={6}>
                          <CFormLabel htmlFor="rating">Rating<span className='text-danger'>*</span></CFormLabel>
                          <CFormSelect
                            aria-label="Default select example"
                            name="rating"
                            value={values.rating}
                            onChange={handleChange}
                          >
                            <option value="">Choose</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </CFormSelect>
                          {errors.rating && touched.rating &&
                            <CFormFeedback className="text-danger small">{errors.rating}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="title">Title</CFormLabel>
                          <CFormInput type="text" name='title' value={values.title} onChange={handleChange} />
                          {errors.title && touched.title &&
                            <CFormFeedback className="text-danger small">{errors.title}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="user">User</CFormLabel>
                          <CFormInput type="text" name='user' value={values.user} onChange={handleChange} />
                          {errors.user && touched.user &&
                            <CFormFeedback className="text-danger small">{errors.user}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="user">Location</CFormLabel>
                          <CFormInput type="text" name='location' value={values.location} onChange={handleChange} />
                          {errors.location && touched.location &&
                            <CFormFeedback className="text-danger small">{errors.location}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="product_id">Product<span className='text-danger'>*</span></CFormLabel>
                          <CFormSelect
                            aria-label="Default select example"
                            name="product_id"
                            value={values.product_id}
                            onChange={handleChange}
                          >
                            <option value="">Choose</option>
                            {products.map((item, index) => (
                              <Fragment key={index}>
                                <option value={item.id}>{item.name}</option>
                              </Fragment>
                            ))}
                          </CFormSelect>
                          {errors.product_id && touched.product_id &&
                            <CFormFeedback className="text-danger small">{errors.product_id}</CFormFeedback>}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="description">Description</CFormLabel>
                          <CFormTextarea type="text" name='description' value={values.description} onChange={handleChange} />
                          {errors.description && touched.description &&
                            <CFormFeedback className="text-danger small">{errors.description}</CFormFeedback>}
                        </CCol>
                        <CCol xs={12}>
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
            item={item}
            formData={setUpdateFormData}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            setActiveForm={setActiveForm} s
            setShowForm={setShowForm}
          />
        </CCol>
        <Modal
          visible={openModal}
          onClose={() => setOpenModal(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message="Are you sure you want to delete this testimonisls?"
        />
      </CRow>
    </>
  )
}

export default Testimonials;