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
import { cilDelete, cilPen, cilTrash } from '@coreui/icons'
import { _url } from '../../../config/api.endpoints'

const Table = (
    {
        whoarewe,
        formData,
        handleDelete,
        setActiveForm,
        setShowForm
    }
) => {

    const handleUpdate = (item) => {
        formData(item);
        setActiveForm(true);
        setShowForm(true)
    }
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Who are we</strong> <small>List</small>
                    </CCardHeader>
                    <CCardBody>
                        {whoarewe?.length > 0 ? <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {whoarewe?.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <CTableRow>
                                                <CTableDataCell>{item?.title}</CTableDataCell>
                                                <CTableDataCell>{item?.subtitle}</CTableDataCell>
                                                <CTableDataCell width={150}>
                                                    <CButton
                                                        type="button"
                                                        color="success"
                                                        onClick={() => handleUpdate(item)}
                                                    >
                                                        <CIcon icon={cilPen} size="md" />
                                                    </CButton>
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
                                <strong>No who are we found!</strong>
                            </CCardHeader>}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Table;
