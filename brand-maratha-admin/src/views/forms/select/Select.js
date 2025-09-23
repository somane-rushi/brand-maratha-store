import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CFormSelect, CRow } from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'

const Select = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Select</strong> <small>Default</small>
          </CCardHeader>
          <CCardBody>
            {/* <DocsExample href="forms/select"> */}
              <CFormSelect aria-label="Default select example">
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </CFormSelect>
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Select
