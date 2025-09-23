import { cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import React, { Fragment } from 'react'

const ColorTable = ({ colors, handleUpdate, handleDelete }) => {
    return (
        <CRow className='mt-4'>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>colors</strong> <small>List</small>
                    </CCardHeader>
                    <CCardBody>
                        {colors?.data?.length > 0 ? <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Sr.No</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Color Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Color</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Size</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Inventory</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {colors?.data?.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <CTableRow>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{item?.color}</CTableDataCell>
                                                <CTableDataCell>
                                                    <div
                                                        style={{
                                                            backgroundColor: item?.color_code,
                                                            borderRadius: '50px',
                                                            width: '30px',
                                                            height: '30px',
                                                            border: '1px solid'
                                                        }}
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell>{item?.size}</CTableDataCell>
                                                <CTableDataCell>{item?.final_mrp}</CTableDataCell>
                                                <CTableDataCell>{item?.stock}</CTableDataCell>
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
                                <strong>No colors found!</strong>
                            </CCardHeader>}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default ColorTable;