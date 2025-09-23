import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { AxiosError } from 'axios'
import axiosInstance from '../../../config/axios.config'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    console.log('call')
    e.preventDefault()
    setError('')

    if (!formData.email) {
      setError('Email is required')
      emailRef.current?.focus()
      return
    }

    if (!formData.password) {
      setError('Password is required')
      passwordRef.current?.focus()
      return
    }

    try {
      const response = await axiosInstance.post('/auth/login', formData)
      const { data, status } = response || {}

      if (status === 200) {
        localStorage.setItem('token', data?.token)
        window.dispatchEvent(new Event('tokenUpdated')) // 🔥 This triggers App.js to re-render
        navigate('/', { replace: true })
      }
      console.log(response)
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Something went wrong!')
      } else if (err instanceof Error) {
        setError(err.message || 'Something went wrong!')
      } else {
        setError('Something went wrong!')
      }
      passwordRef.current?.focus()
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    {/* Email */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        ref={emailRef}
                        type="text"
                        placeholder="Username"
                        name="email"
                        autoComplete="email"
                        onChange={handleChange}
                        value={formData.email}
                      />
                    </CInputGroup>

                    {/* Password */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        ref={passwordRef}
                        placeholder="Password"
                        autoComplete="current-password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                      />
                    </CInputGroup>

                    {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                    {/* Buttons */}
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
