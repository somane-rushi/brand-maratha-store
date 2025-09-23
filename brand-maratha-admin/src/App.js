import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import ProtectedRoute from './ProtectedRoute'
// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const [token, setToken] = React.useState(localStorage.getItem('token'))
  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem('token'))
    }

    // Listen for storage changes (in case multiple tabs)
    window.addEventListener('storage', checkToken)

    // Also manually trigger on login via custom event
    window.addEventListener('tokenUpdated', checkToken)

    return () => {
      window.removeEventListener('storage', checkToken)
      window.removeEventListener('tokenUpdated', checkToken)
    }
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  //const token = localStorage.getItem('token')
  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" replace />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />

          {/* Catch-All Route */}
          <Route path="*" element={token ? <DefaultLayout /> : <Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
