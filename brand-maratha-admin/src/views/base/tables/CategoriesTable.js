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
        data,
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
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Collection</strong> <small>List</small>
                    </CCardHeader>
                    <CCardBody>
                        {data?.length > 0 ? <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Index</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Sub Title</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {data?.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <CTableRow>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{item?.title ? item?.title : "-"}</CTableDataCell>
                                                <CTableDataCell>{item?.subtitle ? item?.subtitle : "-"}</CTableDataCell>
                                                <CTableDataCell><img src={_url + item.image} height="40px" width="auto" /></CTableDataCell>
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
                                <strong>No collections found!</strong>
                            </CCardHeader>}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Table;