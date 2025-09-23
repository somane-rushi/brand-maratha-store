import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CSpinner,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CPagination,
    CPaginationItem,
    CInputGroup,
    CFormInput,
    CContainer,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CAlert
} from '@coreui/react'
import { _allproducts_get, _product_delete, _url } from '../../config/api.endpoints'
import axiosInstance from '../../config/axios.config'
import { useNavigate } from 'react-router-dom'
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';
import Modal from '../base/modal/Modal'


const ProductTable = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(0);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [query, setQuery] = useState('')
    const [deleteId, setDeleteId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const itemsPerPage = 10;
    const productRes = useMemo(() => products?.data || [], [products]);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setIsLoading(true);
        setError("");
        try {
            const { data } = await axiosInstance.get(_allproducts_get);
            setProducts(data);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Something went wrong"
            )
        } finally {
            setIsLoading(false);
        }
    };

    const getCatalogueLabel = (catalogues = []) => {
        const names = catalogues.map(c => c.name?.toLowerCase());

        if (names.includes("men") && names.includes("women")) {
            return "Unisex";
        }

        if (catalogues.length === 1) {
            return catalogues[0].name;
        }

        if (catalogues.length > 1) {
            return "Multiple";
        }

        return "";
    };

    const handleDelete = async (id = null, confirm = false) => {
        if (!confirm) {
            setDeleteId(id);
            setOpenModal(true);
            return;
        }
        try {
            await axiosInstance.delete(`${_product_delete}/${deleteId}`);
            fetchProducts();
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err.message ||
                "Something went wrong!"
            );
        } finally {
            setOpenModal(false);
            setDeleteId(null);
        }
    };

    const searchProducts = useCallback((productsRes, searchQuery) => {
        return productsRes.filter((product) => {
            const query = searchQuery.toLowerCase();

            const nameMatch = product.name?.toLowerCase().includes(query);
            const brandMatch = product.brand_name?.toLowerCase().includes(query);
            const priceMatch = product.base_price?.toString().includes(query);

            const sizeColorMatch = product.sizes?.some((sizeObj) => {
                const sizeMatch = sizeObj.size?.toLowerCase().includes(query);

                const colorMatch = sizeObj.colors?.some((colorObj) => {
                    const colorNameMatch = colorObj.color?.toLowerCase().includes(query);
                    const skuMatch = colorObj.skunumber?.toLowerCase().includes(query);
                    const inventoryMatch = colorObj.inventory?.toString().includes(query);

                    return colorNameMatch || skuMatch || inventoryMatch;
                });

                return sizeMatch || colorMatch;
            });

            const collectionMatch = product.collections?.some((collection) => {
                const nameMatch = collection.name?.toLowerCase().includes(query);
                const idMatch = collection.id?.toString() === query; // exact match for ID
                return nameMatch || idMatch;
            });

            return nameMatch || brandMatch || priceMatch || sizeColorMatch || collectionMatch;
        });
    });

    const getTabFilteredList = useCallback(() => {
        if (!productRes?.length) return [];

        switch (activeTab) {
            case 1:
                return productRes.filter(product =>
                    product.sizes?.some(size =>
                        size.colors?.some(color => color.inventory < 3)
                    )
                );

            // case 2:
            //     const requiredKeys = [
            //         'video',
            //         'fit',
            //         'stretchable',
            //         'print_type',
            //         'in_the_box',
            //         'care_guide',
            //         'manufacturing_details',
            //     ];

            //     return productRes.filter(product => {
            //         // 1. Required dropdown fields are empty
            //         const hasMissingRequiredFields = requiredKeys.some(key => {
            //             const value = product[key];
            //             return (
            //                 value === null ||
            //                 value === undefined ||
            //                 (typeof value === 'string' && value.trim() === '')
            //             );
            //         });

            //         // 2. Check if fabrics, patterns, key_features arrays are empty
            //         const isFabricEmpty = !Array.isArray(product.fabrics) || product.fabrics.length === 0;
            //         const isPatternEmpty = !Array.isArray(product.patterns) || product.patterns.length === 0;
            //         const isKeyFeatureEmpty = !Array.isArray(product.key_features) || product.key_features.length === 0;

            //         // 3. Sizes must exist, and each size must have at least one color
            //         const hasSizeWithColors = Array.isArray(product.sizes) &&
            //             product.sizes.length > 0 &&
            //             product.sizes.every(size =>
            //                 Array.isArray(size.colors) && size.colors.length > 0
            //             );

            //         const isSizeOrColorMissing = !hasSizeWithColors;

            //         return (
            //             hasMissingRequiredFields ||
            //             isFabricEmpty ||
            //             isPatternEmpty ||
            //             isKeyFeatureEmpty ||
            //             isSizeOrColorMissing
            //         );
            //     });

            case 2:
                return productRes.filter(product => {
                    const isSizeArrayEmpty = !Array.isArray(product.sizes) || product.sizes.length === 0;
                    return isSizeArrayEmpty;
                });

            default:
                return productRes;
        }
    });

    const baseList = useMemo(() => getTabFilteredList(), [activeTab, productRes]);

    useEffect(() => {
        const searchTerm = query.trim().toLowerCase();

        const result = searchTerm
            ? searchProducts(baseList, searchTerm)
            : baseList;

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [query, baseList]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const displayedProductsWithVariants = (displayedProducts || []).map(product => {
        const sizes = Array.isArray(product.sizes) && product.sizes.length > 0
            ? product.sizes.map(size => ({
                ...size,
                colors: Array.isArray(size.colors) && size.colors.length > 0
                    ? size.colors
                    : [{ color: '-', inventory: null, skunumber: '-', final_mrp: '-' }],
            }))
            : [{
                size: '-',
                colors: [{ color: '-', inventory: null, skunumber: '-', final_mrp: '-' }],
            }];

        return { ...product, sizes };
    });

    console.log('Product Variants:', displayedProductsWithVariants);

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    if (error) return <CAlert color="danger">{error}</CAlert>;
    return (
        <CContainer>
            <CCard>
                <CCardHeader className='d-flex justify-content-between align-items-center'>
                    <CNav variant="tabs">
                        <CNavItem>
                            <CNavLink
                                active={activeTab === 0}
                                onClick={() => {
                                    setActiveTab(0);
                                    setQuery('');
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <span className='fw-bold' style={{ fontSize: '14px' }}>CATALOGUE</span>
                            </CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink
                                active={activeTab === 1}
                                onClick={() => {
                                    setActiveTab(1);
                                    setQuery('');
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <span className='fw-bold' style={{ fontSize: '14px' }}>LOW INVENTORY</span>
                            </CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink
                                active={activeTab === 2}
                                onClick={() => {
                                    setActiveTab(2);
                                    setQuery('');
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <span className='fw-bold' style={{ fontSize: '14px' }}>INCOMPLETE</span>
                            </CNavLink>
                        </CNavItem>
                    </CNav>

                    <div className='d-flex gap-2'>
                        <CInputGroup style={{ maxWidth: '250px' }}>
                            <CFormInput
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                aria-label="Search input"
                            />
                            <CButton color="primary" onClick={() => setQuery('')}>
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
                        <CButton
                            className='fw-bold'
                            onClick={() => navigate(`/product/add`)}
                            color='primary'
                        >
                            ADD
                        </CButton>
                    </div>
                </CCardHeader>
                <CTabContent className="mt-3">
                    <CTabPane
                        visible={true}
                    >
                        <CCardBody>
                            {displayedProducts?.length > 0 ?
                                <>
                                    <div style={{ overflowX: 'auto', width: '100%' }}>
                                        <CTable hover style={{ tableLayout: 'fixed', width: '120rem', textAlign: 'center' }}>
                                            <CTableHead>
                                                <CTableRow style={{ textAlign: 'center' }}>
                                                    <CTableHeaderCell scope="col" rowSpan={2} className="text-center align-middle">
                                                        Sr. No.
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col" rowSpan={2} className="text-center align-middle">
                                                        Thumbnail
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col" rowSpan={2} className="text-center align-middle w-25">
                                                        Product Name
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col" rowSpan={2} width className="text-center align-middle">
                                                        Vertical
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col" rowSpan={2} className="text-center align-middle">
                                                        Brand
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col" colSpan={5} className="text-center align-middle">
                                                        Variants
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col" rowSpan={2} className="text-center align-middle">
                                                        Gender
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col" rowSpan={2} className="text-center align-middle">
                                                        Action
                                                    </CTableHeaderCell>
                                                </CTableRow>

                                                <CTableRow style={{ fontSize: '14px' }}>
                                                    <CTableHeaderCell>Size</CTableHeaderCell>
                                                    <CTableHeaderCell>Color</CTableHeaderCell>
                                                    <CTableHeaderCell>SKU ID.</CTableHeaderCell>
                                                    <CTableHeaderCell>Inventory</CTableHeaderCell>
                                                    <CTableHeaderCell>MRP</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {displayedProductsWithVariants.map((item, index) => {
                                                    const groupedVariants = item.sizes?.map(size => ({
                                                        size: size.size,
                                                        rowSpan: size.colors?.length || 1,
                                                        colors: size.colors?.length ? size.colors : [{ color: '-', inventory: null, final_mrp: null }],
                                                    })) || [];

                                                    const maxVariants = groupedVariants.reduce((total, sizeGroup) => total + sizeGroup.rowSpan, 0);

                                                    let variantRowIndex = 0;

                                                    return (
                                                        <Fragment key={index}>
                                                            {groupedVariants.map((sizeGroup, sizeIndex) =>
                                                                sizeGroup.colors.map((colorEntry, colorIndex) => {
                                                                    const isFirstRow = variantRowIndex === 0;
                                                                    const isFirstColorForSize = colorIndex === 0;

                                                                    const variant = {
                                                                        size: sizeGroup.size,
                                                                        color: colorEntry.color,
                                                                        skunumber: colorEntry.skunumber,
                                                                        inventory: colorEntry.inventory,
                                                                        final_mrp: colorEntry.final_mrp
                                                                    };

                                                                    const row = (
                                                                        <CTableRow key={`${index}-${variantRowIndex++}`}>
                                                                            {isFirstRow && (
                                                                                <>
                                                                                    <CTableDataCell rowSpan={maxVariants} className="text-center align-middle">
                                                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                                                    </CTableDataCell>
                                                                                    <CTableDataCell rowSpan={maxVariants} className="text-center align-middle">
                                                                                        <img src={_url + item.thumbnail_image} width="60" alt="thumbnail" />
                                                                                    </CTableDataCell>
                                                                                    <CTableDataCell rowSpan={maxVariants} className="text-center align-middle">{item?.name || '-'}</CTableDataCell>
                                                                                    <CTableDataCell rowSpan={maxVariants} className="text-center align-middle">{item?.category?.name || '-'}</CTableDataCell>
                                                                                    <CTableDataCell rowSpan={maxVariants} className="text-center align-middle">{item?.brand_name || '-'}</CTableDataCell>
                                                                                </>
                                                                            )}

                                                                            {isFirstColorForSize && (
                                                                                <CTableDataCell rowSpan={sizeGroup.rowSpan} className="text-center align-middle">
                                                                                    {variant.size || '-'}
                                                                                </CTableDataCell>
                                                                            )}
                                                                            <CTableDataCell className="text-center align-middle">{variant.color || '-'}</CTableDataCell>
                                                                            <CTableDataCell className="text-center align-middle">{variant.skunumber || '-'}</CTableDataCell>
                                                                            <CTableDataCell className="text-center align-middle">{variant.inventory || '-'}</CTableDataCell>
                                                                            <CTableDataCell className="text-center align-middle">{variant.final_mrp || '-'}</CTableDataCell>

                                                                            {isFirstRow && (
                                                                                <>
                                                                                    <CTableDataCell rowSpan={maxVariants} className="text-center align-middle">{getCatalogueLabel(item.catalogues) || '-'}</CTableDataCell>
                                                                                    <CTableDataCell rowSpan={maxVariants} className="text-center align-middle">
                                                                                        <div className="d-flex gap-2">
                                                                                            <CButton color="warning" onClick={() => navigate(`/product-details/${item.id}`)}>
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width='18px' height='auto' fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginBottom: '3px' }}>
                                                                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                                                    <circle cx="12" cy="12" r="3" />
                                                                                                </svg>
                                                                                            </CButton>
                                                                                            <CButton color="success" onClick={() => navigate(`/product/update/${item.id}`)}>
                                                                                                <CIcon icon={cilPencil} />
                                                                                            </CButton>
                                                                                            <CButton color="danger" onClick={() => handleDelete(item.id)}>
                                                                                                <CIcon icon={cilTrash} />
                                                                                            </CButton>
                                                                                        </div>
                                                                                    </CTableDataCell>
                                                                                </>
                                                                            )}
                                                                        </CTableRow>
                                                                    );

                                                                    return row;
                                                                })
                                                            )}
                                                        </Fragment>
                                                    );
                                                })}
                                            </CTableBody>
                                        </CTable>
                                    </div>

                                    <Modal
                                        visible={openModal}
                                        onClose={() => setOpenModal(false)}
                                        onConfirm={() => handleDelete(null, true)}
                                        title="Confirm Delete"
                                        message="Are you sure you want to delete this product?"
                                    />

                                    <CPagination align="end" className="mt-3">
                                        <CPaginationItem
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            style={{ cursor: currentPage === 1 ? "default" : "pointer" }}
                                        >
                                            Previous
                                        </CPaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <CPaginationItem
                                                key={i + 1}
                                                active={i + 1 === currentPage}
                                                onClick={() => setCurrentPage(i + 1)}
                                                style={{ cursor: i + 1 === currentPage ? "default" : "pointer" }}
                                            >
                                                {i + 1}
                                            </CPaginationItem>
                                        ))}

                                        <CPaginationItem
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            style={{ cursor: currentPage === totalPages ? "default" : "pointer" }}
                                        >
                                            Next
                                        </CPaginationItem>
                                    </CPagination>

                                </>
                                :
                                <CCardHeader className='d-flex justify-content-center'>
                                    <strong>Products not found!</strong>
                                </CCardHeader>}
                        </CCardBody>
                    </CTabPane>
                </CTabContent >
            </CCard>
        </CContainer >
    )
}

export default ProductTable;