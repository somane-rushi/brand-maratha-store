import { cilDelete, cilPen, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import React, { Fragment } from 'react'

const SizeTable = ({ sizes, handleUpdate, handleDelete }) => {
    return (
        <div className='mt-4'>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Sizes</strong> <small>List</small>
                        </CCardHeader>
                        <CCardBody>
                            {sizes?.data?.length > 0 ? <CTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">Index</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Size</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {sizes?.data?.map((item, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                    <CTableDataCell>{item?.size}</CTableDataCell>
                                                    <CTableDataCell>{item?.price_adjustment}</CTableDataCell>
                                                    <CTableDataCell className='d-flex gap-2'>
                                                        <CButton
                                                            color="success"
                                                            onClick={() => handleUpdate(item)}
                                                        >
                                                            <CIcon icon={cilPencil} />
                                                        </CButton>
                                                        <CButton
                                                            color="danger"
                                                            onClick={() => handleDelete(item?.id)}
                                                        >
                                                            <CIcon icon={cilTrash} />
                                                        </CButton>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            </Fragment>
                                        )
                                    })}
                                </CTableBody>
                            </CTable> :
                                <CCardHeader>
                                    <strong>No sizes found!</strong>
                                </CCardHeader>}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )
}

export default SizeTable;