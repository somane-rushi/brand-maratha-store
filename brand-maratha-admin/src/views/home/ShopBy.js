import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormInput,
    CFormSelect,
    CInputGroup,
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
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { _allproducts_get, _product_update, _shopby_get, _url } from '../../config/api.endpoints';
import axiosInstance from '../../config/axios.config';
import ShopBrands from './ShopBrands';

const ShopBy = () => {
    const [query, setQuery] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownRefs = useRef({});
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const options = [
        { id: 2, name: "New Arrival" },
        { id: 3, name: "Best Seller" }
    ];

    const fieldMap = {
        2: 'new_arrivals',
        3: 'isbestseller'
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        fetchProducts();
    }, [query]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts(products);
            return;
        }

        const lower = searchQuery.toLowerCase();

        const filtered = products.filter((p) =>
            p.name?.toLowerCase().includes(lower) ||
            p.brand_name?.toLowerCase().includes(lower) ||
            p.search_keyword?.toLowerCase().includes(lower)
        );

        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [searchQuery, products]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownOpen !== null && !dropdownRefs.current[dropdownOpen]?.contains(e.target)) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            let mergedProducts = [];

            if (!query || query === "All products") {
                const allRes = await axiosInstance.get(_allproducts_get);
                mergedProducts = allRes.data.data;
            } else {
                const filteredRes = await axiosInstance.get(_shopby_get, {
                    params: { filterType: query }
                });
                mergedProducts = filteredRes.data;
            }

            setProducts(mergedProducts);
            setFilteredProducts(mergedProducts);
            setCurrentPage(1);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (id, updates) => {
        setIsLoading(true);

        try {
            await axiosInstance.put(`${_product_update}/${id}`, updates, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await fetchProducts();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Update failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTagToggle = (productId, tagId) => {
        const product = displayedProducts.find(p => p.id === productId);
        const field = fieldMap[tagId];
        if (!product || !field) return;

        const newValue = product[field] ? 0 : 1;
        handleUpdate(productId, { [field]: newValue });
    };

    // const totalPages = Math.ceil(products.length / itemsPerPage);
    // const displayedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    if (error) return <CAlert color="danger">{error}</CAlert>;

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <div><strong>Product</strong> <small>List</small></div>
                        <div className='d-flex gap-2'>
                            <CInputGroup style={{ maxWidth: '250px' }}>
                                <CFormInput
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search input"
                                />
                                <CButton color="primary" onClick={() => setSearchQuery('')}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="26"
                                        height="26"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 
                                                .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 
                                                2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                        />
                                    </svg>

                                </CButton>
                            </CInputGroup>
                            <CFormSelect
                                value={query}
                                style={{ width: '150px' }}
                                onChange={(e) => setQuery(e.target.value)}
                            >
                                <option>All products</option>
                                <option value="new_arrivals">New Arrivals</option>
                                <option value="best_sellers">Best Sellers</option>
                            </CFormSelect>
                        </div>
                    </CCardHeader>

                    <CCardBody>
                        {displayedProducts.length > 0 ? (
                            <CTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">Sr. No.</CTableHeaderCell>
                                        <CTableHeaderCell>Name</CTableHeaderCell>
                                        <CTableHeaderCell>Brand</CTableHeaderCell>
                                        <CTableHeaderCell>Tags</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {displayedProducts.map((item, index) => {
                                        const selectedIds = new Set([
                                            ...(item.new_arrivals ? [2] : []),
                                            ...(item.isbestseller ? [3] : [])
                                        ]);

                                        return (
                                            <CTableRow key={item.id}>
                                                <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{item?.name || '-'}</CTableDataCell>
                                                <CTableDataCell>{item?.brand_name || '-'}</CTableDataCell>
                                                <CTableDataCell>
                                                    <div
                                                        ref={(el) => (dropdownRefs.current[item.id] = el)}
                                                        onClick={() => setDropdownOpen(dropdownOpen === item.id ? null : item.id)}
                                                        style={{
                                                            width: 242,
                                                            border: '1px solid #ccc',
                                                            borderRadius: 5,
                                                            padding: '4px 8px',
                                                            position: 'relative',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            flexWrap: 'nowrap',
                                                            alignItems: 'flex-start',
                                                            gap: 5,
                                                        }}
                                                        tabIndex={0}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                setDropdownOpen(dropdownOpen === item.id ? null : item.id);
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                gap: 5,
                                                                maxHeight: 60,
                                                                overflowY: 'auto',
                                                                flex: 1,
                                                            }}
                                                        >
                                                            {selectedIds.size === 0 ? (
                                                                <span style={{ color: "#999" }}>Select tags...</span>
                                                            ) : (
                                                                Array.from(selectedIds).map(tagId => {
                                                                    const tag = options.find(o => o.id === tagId);
                                                                    return tag && (
                                                                        <span
                                                                            key={tag.id}
                                                                            style={{
                                                                                backgroundColor: "#007bff",
                                                                                color: "white",
                                                                                padding: "2px 8px",
                                                                                borderRadius: 12,
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: 6,
                                                                                fontSize: 14,
                                                                                whiteSpace: 'nowrap',
                                                                            }}
                                                                        >
                                                                            {tag.name}
                                                                            <span
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleTagToggle(item.id, tag.id);
                                                                                }}
                                                                                style={{ cursor: 'pointer' }}
                                                                            >
                                                                                &times;
                                                                            </span>
                                                                        </span>
                                                                    )
                                                                })
                                                            )}
                                                        </div>

                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            style={{ marginLeft: 'auto', flexShrink: 0, marginTop: '5px' }}
                                                        >
                                                            <polyline
                                                                points="6 9 12 15 18 9"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            />
                                                        </svg>

                                                        {dropdownOpen === item.id && (
                                                            <div
                                                                style={{
                                                                    position: "absolute",
                                                                    top: "100%",
                                                                    left: 0,
                                                                    right: 0,
                                                                    border: "1px solid #ccc",
                                                                    borderRadius: 5,
                                                                    background: "#fff",
                                                                    zIndex: 9999,
                                                                    padding: 5,
                                                                    marginTop: 2,
                                                                    maxHeight: 150,
                                                                    overflowY: "auto",
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {options.map(option => (
                                                                    <label
                                                                        key={option.id}
                                                                        style={{
                                                                            display: "block",
                                                                            padding: "4px 8px",
                                                                            backgroundColor: selectedIds.has(option.id) ? "#e6f0ff" : "#fff",
                                                                            cursor: "pointer"
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedIds.has(option.id)}
                                                                            onChange={() => handleTagToggle(item.id, option.id)}
                                                                            style={{ marginRight: 8 }}
                                                                        />
                                                                        {option.name}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CTableDataCell>
                                            </CTableRow>
                                        );
                                    })}
                                </CTableBody>
                            </CTable>
                        ) : (
                            <div className="text-center py-4"><strong>No products found!</strong></div>
                        )}
                    </CCardBody>
                </CCard>

                <CPagination align="end" className="mt-3">
                    <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                        Previous
                    </CPaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <CPaginationItem
                            key={i}
                            active={i + 1 === currentPage}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </CPaginationItem>
                    ))}

                    <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                        Next
                    </CPaginationItem>
                </CPagination>

                <ShopBrands />
            </CCol>
        </CRow>
    );
};

export default ShopBy;