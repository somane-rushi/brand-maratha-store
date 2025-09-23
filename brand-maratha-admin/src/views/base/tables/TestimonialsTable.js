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

    const handleUpdate = (data) => {
        formData(data);
        setActiveForm(true);
        setShowForm(true)
    }
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Testimonials</strong> <small>list</small>
                    </CCardHeader>
                    <CCardBody>
                        {item?.length > 0 ? <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Index</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Rating</CTableHeaderCell>
                                    <CTableHeaderCell scope="col" width={90}>Title</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                                    <CTableHeaderCell scope="col" v>User</CTableHeaderCell>
                                    <CTableHeaderCell scope="col" width={90}>Product</CTableHeaderCell>
                                    <CTableHeaderCell scope="col" width={120}>Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {item?.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <CTableRow>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{item?.rating}</CTableDataCell>
                                                <CTableDataCell width={120}>{item?.title ? item?.title : "-"}</CTableDataCell>
                                                <CTableDataCell>{item?.description ? item?.description : "-"}</CTableDataCell>
                                                <CTableDataCell width={90}>{item?.user ? item?.user : "-"}</CTableDataCell>
                                                <CTableDataCell width={90}>{item?.product_name ? item?.product_name : '-'}</CTableDataCell>
                                                <CTableDataCell width={120}>
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
                                <strong>No testimonials found!</strong>
                            </CCardHeader>}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Table;
