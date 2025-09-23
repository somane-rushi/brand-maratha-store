import React, { Fragment } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { _url } from '../../../config/api.endpoints'

const Table = (
    {
        products
    }
) => {
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Instagram</strong> <small>products</small>
                    </CCardHeader>
                    <CCardBody>
                        {products?.length > 0 ? <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Index</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {products?.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <CTableRow>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{item.name}</CTableDataCell>
                                                <CTableDataCell>
                                                    {new Date(item.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </CTableDataCell>

                                                <CTableDataCell><img src={_url + item.thumbnail_image} height="40px" width="auto" /></CTableDataCell>
                                            </CTableRow>
                                        </Fragment>
                                    )
                                })}
                            </CTableBody>
                        </CTable> :
                            <CCardHeader>
                                <strong>No products found!</strong>
                            </CCardHeader>}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Table;