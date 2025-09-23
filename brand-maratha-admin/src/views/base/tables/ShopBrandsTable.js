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
        item,
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
                        <strong>Brands</strong> <small>List</small>
                    </CCardHeader>
                    <CCardBody>
                        {item?.length > 0 ? (
                            <div style={{ width: '100%', overflowX: 'auto' }}>
                                <div style={{ minWidth: '1200px' }}>
                                    <CTable hover responsive="sm" className="mb-0">
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell scope="col">Sr. No.</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">E-Mail</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Vender Code</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">GST No.</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">CIN No.</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Contact No.</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {item.map((item, index) => (
                                                <CTableRow key={index}>
                                                    <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                                                    <CTableDataCell>{item?.name || "-"}</CTableDataCell>
                                                    <CTableDataCell>{item?.contact_email || "-"}</CTableDataCell>
                                                    <CTableDataCell>{item?.pickup_vendor_code || "-"}</CTableDataCell>
                                                    <CTableDataCell>{item?.gst || "-"}</CTableDataCell>
                                                    <CTableDataCell>{item?.cin || "-"}</CTableDataCell>
                                                    <CTableDataCell>{item?.contact_phone || "-"}</CTableDataCell>
                                                    <CTableDataCell>
                                                        <img src={_url + item.image} height="40px" width="auto" alt="brand-image" />
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <CButton type="button" color="success" onClick={() => handleUpdate(item)}>
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
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </div>
                        ) : (
                            <CCardHeader>
                                <strong>No Brand found!</strong>
                            </CCardHeader>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Table;