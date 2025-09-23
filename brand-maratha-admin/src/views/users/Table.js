import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CPagination, CPaginationItem, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { Fragment, useState } from 'react'

const Table = ({ users }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const _users = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (
        <CRow className='mt-4'>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>colors</strong> <small>List</small>
                    </CCardHeader>
                    <CCardBody>
                        {_users?.length > 0 ?
                            <>
                                <CTable hover>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell scope="col">Index</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">E-Mail</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Register Date</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {_users?.map((item, index) => {
                                            return (
                                                <Fragment key={index}>
                                                    <CTableRow>
                                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                        <CTableDataCell>{item?.name}</CTableDataCell>
                                                        <CTableDataCell>{item?.email}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {new Date(item?.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                </Fragment>
                                            )
                                        })}
                                    </CTableBody>
                                </CTable>
                                <CPagination align="end" className="mt-3">
                                    <CPaginationItem
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
                                    >
                                        Previous
                                    </CPaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <CPaginationItem
                                            key={i + 1}
                                            active={i + 1 === currentPage}
                                            onClick={() => setCurrentPage(i + 1)}
                                            style={{ cursor: i + 1 === currentPage ? 'default' : 'pointer' }}
                                        >
                                            {i + 1}
                                        </CPaginationItem>
                                    ))}

                                    <CPaginationItem
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        style={{ cursor: currentPage === totalPages ? 'default' : 'pointer' }}
                                    >
                                        Next
                                    </CPaginationItem>
                                </CPagination>
                            </>
                            :
                            <CCardHeader>
                                <strong>No users found!</strong>
                            </CCardHeader>}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow >
    )
}

export default Table