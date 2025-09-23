import { cilDelete, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
    CAlert,
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
} from "@coreui/react";
import React, { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosInstance from "../../config/axios.config";
import { _newsletter_bulkdelete, _newsletter_delete, _newsletter_get } from "../../config/api.endpoints";
import Modal from "../base/modal/Modal";
import { handleApiError } from "../../utils/errorHelper";

const NewsLetter = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [error, setError] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
    const [isBulkConfirming, setIsBulkConfirming] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    const fetchSubscriptions = useCallback(async () => {
        setIsLoading();
        setError('');

        try {
            const { data } = await axiosInstance.get(_newsletter_get);
            setSubscriptions(data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setOpenModal(true);
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setBulkDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;

        setIsLoading(true);
        setError('');

        try {
            const { data } = await axiosInstance.delete(`${_newsletter_delete}/${deleteId}`);
            fetchSubscriptions();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setOpenModal(false);
            setDeleteId(null);
            setIsLoading(false);
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const isSelected = (id) => selectedIds.includes(id);

    const handleSelectAll = () => {
        if (selectedIds.length === subscriptions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(subscriptions.map(item => item.id));
        }
    };

    const handleExportSelected = () => {
        if (selectedIds.length === 0) return;

        const filteredData = subscriptions
            .filter(item => selectedIds.includes(item.id))
            .map((item, index) => ({
                Index: index + 1,
                Email: item.email
            }));

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Emails");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "newsletter_mails.xlsx");
    };

    const confirmBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        setIsLoading(true);
        try {
            await axiosInstance.post(`${_newsletter_bulkdelete}`, {
                ids: selectedIds,
            });
            setSelectedIds([]);
            fetchSubscriptions();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setBulkDeleteModalOpen(false);
            setIsLoading(false);
        }
    };

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    {/* <CCardHeader>
                        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <strong>Mail</strong> <small>Subscriptions</small>
                            </div>
                            <CButton
                                color="success"
                                className={`fw-normal ${selectedIds.length === 0 ? 'text-black' : 'text-white'}`}
                                onClick={handleExportSelected}
                                disabled={selectedIds.length === 0}
                            >
                                Export Mail's
                            </CButton>

                            <CButton
                                color="danger"
                                className="ms-2 fw-normal text-white"
                                onClick={handleBulkDelete}
                                disabled={selectedIds.length === 0}
                            >
                                Delete Selected
                            </CButton>

                        </div>
                    </CCardHeader> */}
                    <CCardHeader>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <strong>Mail</strong> <small>Subscriptions</small>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <CButton
                                    color="success"
                                    className={`fw-normal text-white`}
                                    onClick={handleExportSelected}
                                    disabled={selectedIds.length === 0}
                                >
                                    Export Mail's
                                </CButton>

                                <CButton
                                    color="danger"
                                    className="fw-normal text-white"
                                    onClick={handleBulkDelete}
                                    disabled={selectedIds.length === 0}
                                >
                                    Bulk Delete
                                </CButton>
                            </div>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        {subscriptions.length > 0 ? (
                            <CTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.length === subscriptions.length}
                                                onChange={handleSelectAll}
                                            />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Index</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Mail</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {subscriptions.map((item, index) => (
                                        <CTableRow key={item.id}>
                                            <CTableDataCell>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected(item.id)}
                                                    onChange={() => toggleSelect(item.id)}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{item.email}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton type="button" color="danger" onClick={() => handleDeleteClick(item.id)}>
                                                    <CIcon icon={cilTrash} size="md" />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        ) : (
                            <CCardHeader>
                                <strong>No subscriptions found.</strong>
                            </CCardHeader>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
            {error && <CAlert>{error}</CAlert>}
            <Modal
                visible={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this newsletter?"
            />

            <Modal
                visible={bulkDeleteModalOpen}
                onClose={() => setBulkDeleteModalOpen(false)}
                onConfirm={confirmBulkDelete}
                loading={isBulkConfirming}
                title="Confirm Bulk Delete"
                message={`Are you sure you want to delete ${selectedIds.length} selected newsletter subscription(s)?`}
            />
        </CRow>
    );
};

export default NewsLetter;
