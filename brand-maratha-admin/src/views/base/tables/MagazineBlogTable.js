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
import { useLocation, useNavigate } from 'react-router-dom'

const Table = ({ blogs }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Blogs</strong> <small>list</small>
                        </div>
                        <CButton
                            color="primary"
                            onClick={() =>
                                navigate(pathname === `/brand-details` ? `/brand-details/add` : `/base/blog/add`)
                            }
                        >
                            ADD BLOG
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        {blogs?.length > 0 ? (
                            <CTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">Index</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Subtitle</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Auther</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {blogs.map((item, index) => (
                                        <Fragment key={index}>
                                            <CTableRow>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{item?.title || '-'}</CTableDataCell>
                                                <CTableDataCell>{item?.subtitle || '-'}</CTableDataCell>
                                                <CTableDataCell>{item?.author || '-'}</CTableDataCell>
                                                <CTableDataCell>
                                                    {new Date(item.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    }) || '-'}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                        }}
                                                    >
                                                        <CButton
                                                            type="button"
                                                            color="success"
                                                            size="sm"
                                                            style={{ padding: '6px 10px' }}
                                                            onClick={() =>
                                                                navigate(
                                                                    pathname === `/brand-details`
                                                                        ? `/brand-details/${item.id}`
                                                                        : `/base/blog/${item.id}`
                                                                )
                                                            }
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18px"
                                                                height="auto"
                                                                fill="none"
                                                                stroke="black"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                viewBox="0 0 24 24"
                                                                style={{ marginBottom: '2px' }}
                                                            >
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        </CButton>
                                                    </div>
                                                </CTableDataCell>
                                            </CTableRow>
                                        </Fragment>
                                    ))}
                                </CTableBody>
                            </CTable>
                        ) : (
                            <CCardHeader>
                                <strong>No blogs found!</strong>
                            </CCardHeader>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Table;
