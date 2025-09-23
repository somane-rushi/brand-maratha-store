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
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { _url } from '../../../config/api.endpoints'

const Table = (
    {
        item,
        handleDelete,
    }
) => {
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Brands</strong> <small>List</small>
                    </CCardHeader>
                    <CCardBody>
                        {item?.length > 0 ? <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Index</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {item?.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <CTableRow>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{item.name ? item.name : '-'}</CTableDataCell>
                                                <CTableDataCell><img src={_url + item.image} height="40px" width="auto" /></CTableDataCell>
                                                <CTableDataCell>
                                                    <CButton
                                                        style={{ marginLeft: '10px' }}
                                                        type="button"
                                                        color="danger"
                                                        onClick={() => handleDelete(item?.id)}
                                                    >
                                                        <CIcon icon={cilTrash} size="md" />
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        </Fragment>
                                    )
                                })}
                            </CTableBody>
                        </CTable> :
                            <CCardHeader>
                                <strong>No brands found!</strong>
                            </CCardHeader>}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Table;