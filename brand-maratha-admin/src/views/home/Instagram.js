import React, { useEffect, useRef, useState } from 'react'
import {
    CAlert,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormInput,
    CPagination,
    CPaginationItem,
    CRow,
    CSpinner,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CInputGroup,
    CButton,
} from '@coreui/react'
import { _allproducts_get, _product_update } from '../../config/api.endpoints'
import axiosInstance from '../../config/axios.config'

const Instagram = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [dropdownOpen, setDropdownOpen] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const dropdownRefs = useRef({})
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 10

    const tagOptions = [{ id: 1, name: "Instagram", field: "instagram" }]

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 3000)
            return () => clearTimeout(timer)
        }
    }, [error])

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownOpen !== null && !dropdownRefs.current[dropdownOpen]?.contains(e.target)) {
                setDropdownOpen(null)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [dropdownOpen])

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts(products)
            return
        }

        const lower = searchQuery.toLowerCase()
        const filtered = products.filter((p) =>
            p.name?.toLowerCase().includes(lower) ||
            p.brand_name?.toLowerCase().includes(lower)
        )

        setFilteredProducts(filtered)
        setCurrentPage(1)
    }, [searchQuery, products])

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const res = await axiosInstance.get(_allproducts_get)
            setProducts(res.data.data)
            setFilteredProducts(res.data.data)
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = async (id, updates) => {
        setIsLoading(true)
        try {
            await axiosInstance.put(`${_product_update}/${id}`, updates, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            await fetchProducts()
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Update failed")
        } finally {
            setIsLoading(false)
        }
    }

    const handleTagToggle = (productId, tagId) => {
        const product = displayedProducts.find((p) => p.id === productId)
        const tag = tagOptions.find((t) => t.id === tagId)
        if (!product || !tag) return

        const newValue = product[tag.field] ? 0 : 1
        handleUpdate(productId, { [tag.field]: newValue })
    }

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />
    if (error) return <CAlert color="danger">{error}</CAlert>

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <div><strong>Product</strong> <small>List</small></div>
                        <CInputGroup style={{ maxWidth: '250px' }}>
                            <CFormInput
                                placeholder="Search name or brand"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <CButton color="primary" onClick={() => setSearchQuery("")}>
                                &times;
                            </CButton>
                        </CInputGroup>
                    </CCardHeader>

                    <CCardBody>
                        {displayedProducts.length > 0 ? (
                            <CTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">Sr. no.</CTableHeaderCell>
                                        <CTableHeaderCell>Name</CTableHeaderCell>
                                        <CTableHeaderCell>Brand</CTableHeaderCell>
                                        <CTableHeaderCell>Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {displayedProducts.map((item, index) => (
                                        <CTableRow key={item.id}>
                                            <CTableHeaderCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{item?.name || '-'}</CTableDataCell>
                                            <CTableDataCell>{item?.brand_name || '-'}</CTableDataCell>
                                            <CTableDataCell>
                                                <div
                                                    style={{
                                                        width: 134,
                                                        border: '1px solid #ccc',
                                                        borderRadius: 5,
                                                        padding: '4px 8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 5,
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={item.instagram ? true : false}
                                                        onChange={() => handleTagToggle(item.id, tagOptions[0].id)}
                                                        style={{ marginRight: 8 }}
                                                    />
                                                    <span style={{ fontSize: 14 }}>Instagram</span>
                                                </div>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        ) : (
                            <div className="text-center py-4"><strong>No products found!</strong></div>
                        )}
                    </CCardBody>
                </CCard>

                <CPagination align="end" className="mt-3">
                    <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                        Previous
                    </CPaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <CPaginationItem key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </CPaginationItem>
                    ))}
                    <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                        Next
                    </CPaginationItem>
                </CPagination>
            </CCol>
        </CRow>
    )
}

export default Instagram;
