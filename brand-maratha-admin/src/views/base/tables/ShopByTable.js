import React, { Fragment } from 'react'
import {
    CButton,
    CCardHeader,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPen } from '@coreui/icons'
import { _url } from '../../../config/api.endpoints'

const Table = (
    {
        products
    }
) => {
    return (
        <>
            {products?.length > 0 ? <CTable hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">Index</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Sub Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Thumbnail Image</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {products?.map((item, index) => {
                        return (
                            <Fragment key={index}>
                                <CTableRow>
                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                    <CTableDataCell>{item?.name}</CTableDataCell>
                                    <CTableDataCell>{item.subname}</CTableDataCell>
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
        </>
    )
}

export default Table;