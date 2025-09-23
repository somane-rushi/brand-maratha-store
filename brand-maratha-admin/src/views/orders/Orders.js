import React, { Fragment, useEffect, useState } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CSpinner,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CPagination,
    CPaginationItem,
    CBadge,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormSelect
} from '@coreui/react';
import { _allorders_get, _order_delete, _orderstatus_update } from '../../config/api.endpoints';
import axiosInstance from '../../config/axios.config';
import { useNavigate } from 'react-router-dom';
import Modal from '../base/modal/Modal';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilTrash } from '@coreui/icons';
import { handleApiError } from '../../utils/errorHelper';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError('');
        try {
            const { data } = await axiosInstance.get(_allorders_get);
            setOrders(data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenStatusModal = (order) => {
        setSelectedOrder(order);
        setSelectedStatus(order.status);
        setShowStatusModal(true);
    };

    const handleStatusUpdate = async () => {
        if (!selectedOrder) return;

        setIsUpdating(true);
        setError("");
        try {
            await axiosInstance.put(
                `${_orderstatus_update}/${selectedOrder.id}/status`,
                { status: selectedStatus }
            );
            setShowStatusModal(false);
            fetchOrders();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id = null, confirm = false) => {
        if (!confirm) {
            setDeleteId(id);
            setOpenModal(true);
            return;
        }
        try {
            await axiosInstance.delete(`${_order_delete}/${deleteId}`);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setOpenModal(false);
            setDeleteId(null);
            fetchOrders();
        }
    };


    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const displayedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (isLoading) return <CSpinner color="primary" />;
    if (error) return <CAlert color="danger">{error}</CAlert>;

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className='d-flex justify-content-between align-items-center'>
                        <div>
                            <strong>Orders</strong> <small>List</small>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        {displayedOrders?.length > 0 ? (
                            <>
                                <CTable hover>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell scope="col">Customer</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Order Id</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Courier</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Order Date</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {displayedOrders.map((item, index) => (
                                            <Fragment key={index}>
                                                <CTableRow>
                                                    <CTableDataCell>{item?.user_id}</CTableDataCell>
                                                    <CTableDataCell>{item?.id}</CTableDataCell>
                                                    <CTableDataCell>{item?.total_price}</CTableDataCell>
                                                    <CTableDataCell onClick={() => handleOpenStatusModal(item)} style={{ cursor: 'pointer' }}>
                                                        <CBadge
                                                            color={
                                                                item?.status?.toLowerCase() === 'pending' ? 'warning' :
                                                                    item?.status?.toLowerCase() === 'delivered' ? 'success' :
                                                                        item?.status?.toLowerCase() === 'cancelled' ? 'danger' : 'secondary'
                                                            }
                                                        >
                                                            {item?.status?.toUpperCase()}
                                                        </CBadge>
                                                    </CTableDataCell>
                                                    <CTableDataCell>{item?.courier}</CTableDataCell>
                                                    <CTableDataCell>
                                                        {new Date(item?.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </CTableDataCell>
                                                    <CTableDataCell className='d-flex gap-2'>
                                                        <CButton
                                                            color="warning"
                                                            onClick={() => navigate(`/order-details/${item.id}`)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width='18px' height='auto' fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginBottom: '3px' }}>
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        </CButton>

                                                        <CButton
                                                            color="danger"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <CIcon icon={cilTrash} />
                                                        </CButton>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            </Fragment>
                                        ))}
                                    </CTableBody>
                                </CTable>
                                <Modal
                                    visible={openModal}
                                    onClose={() => setOpenModal(false)}
                                    onConfirm={() => handleDelete(null, true)}
                                    title="Confirm Delete"
                                    message="Are you sure you want to delete this order?"
                                />

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
                        ) : (
                            <CCardHeader>
                                <strong>No orders found!</strong>
                            </CCardHeader>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
            <CModal visible={showStatusModal} onClose={() => setShowStatusModal(false)}>
                <CModalHeader>
                    <CModalTitle>Update Order Status</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </CFormSelect>

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowStatusModal(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={handleStatusUpdate} disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update'}
                    </CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default Orders;
