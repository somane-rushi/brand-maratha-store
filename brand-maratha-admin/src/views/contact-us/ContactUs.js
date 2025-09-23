// import React, { useEffect, useState } from 'react'
// import axiosInstance from '../../config/axios.config';
// import {
//   _contactus_delete,
//   _contactus_get,
// } from '../../config/api.endpoints';
// import {
//   CAlert,
//   CCol, CRow,
//   CSpinner
// } from '@coreui/react';
// import Modal from '../base/modal/Modal';
// import Table from '../base/tables/ContactUsTable';
// import { handleApiError } from '../../utils/errorHelper';

// const ContactUs = () => {
//   const [item, setItem] = useState([]);
//   const [message, setMessage] = useState('');
//   const [openModal, setOpenModal] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     fetchItem();
//   }, []);

//   useEffect(() => {
//     if (message || error) {
//       const timer = setTimeout(() => {
//         setMessage('');
//         setError('');
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, [message, error]);

//   const fetchItem = async () => {
//     setIsLoading(true);
//     setError('');

//     try {
//       const { data } = await axiosInstance.get(_contactus_get);
//       setItem(data);
//     } catch (err) {
//       setError(handleApiError(err));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = (id) => {
//     setDeleteId(id);
//     setOpenModal(true);
//   };

//   async function handleConfirmDelete() {
//     setIsLoading(true);
//     setError('');

//     try {
//       await axiosInstance.delete(`${_contactus_delete}/${deleteId}`)
//       fetchItem();
//     } catch (err) {
//       setError(handleApiError(err));
//     } finally {
//       setOpenModal(false);
//       setDeleteId(null);
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
//   if (error) return <CAlert color="danger">{error}</CAlert>;
//   return (
//     <>
//       <CRow>
//         <CCol xs={12}>
//           <Table
//             item={item}
//             handleDelete={handleDelete}
//           />
//         </CCol>
//         <Modal
//           visible={openModal}
//           onClose={() => setOpenModal(false)}
//           onConfirm={handleConfirmDelete}
//           title="Confirm Delete"
//           message="Are you sure you want to delete this contact message?"
//         />
//       </CRow>
//     </>
//   )
// }

// export default ContactUs;

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/axios.config';
import {
  _contactus_bulkdelete,
  _contactus_delete,
  _contactus_get,
} from '../../config/api.endpoints';
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
} from '@coreui/react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Modal from '../base/modal/Modal';
import { handleApiError } from '../../utils/errorHelper';

const ContactUs = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get(_contactus_get);
      setMessages(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    try {
      await axiosInstance.delete(`${_contactus_delete}/${deleteId}`);
      fetchMessages();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setOpenModal(false);
      setDeleteId(null);
      setIsLoading(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) setBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setIsLoading(true);
    try {
      await axiosInstance.post(`${_contactus_bulkdelete}`, {
        ids: selectedIds,
      });
      setSelectedIds([]);
      fetchMessages();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setBulkDeleteModal(false);
      setIsLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const isSelected = (id) => selectedIds.includes(id);

  const handleSelectAll = () => {
    if (selectedIds.length === messages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(messages.map(msg => msg.id));
    }
  };

  const handleExportSelected = () => {
    const filtered = messages
      .filter(msg => selectedIds.includes(msg.id))
      .map((msg, i) => ({
        Index: i + 1,
        Name: msg.name,
        Email: msg.email,
        Message: msg.message,
      }));

    const sheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Contact Messages');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'contact_messages.xlsx');
  };

  if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                <strong>Contact Us</strong>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <CButton
                  color="success"
                  className="text-white fw-normal"
                  onClick={handleExportSelected}
                  disabled={selectedIds.length === 0}
                >
                  Export Selected
                </CButton>
                <CButton
                  color="danger"
                  className="text-white fw-normal"
                  onClick={handleBulkDelete}
                  disabled={selectedIds.length === 0}
                >
                  Bulk Delete
                </CButton>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            {messages.length > 0 ? (
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === messages.length}
                        onChange={handleSelectAll}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell width={100}>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell width={150}>Date & Time</CTableHeaderCell>
                    <CTableHeaderCell>Message</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {messages.map((msg) => (
                    <CTableRow key={msg.id}>
                      <CTableDataCell>
                        <input
                          type="checkbox"
                          checked={isSelected(msg.id)}
                          onChange={() => toggleSelect(msg.id)}
                        />
                      </CTableDataCell>
                      <CTableDataCell>{msg.name}</CTableDataCell>
                      <CTableDataCell>{msg.email}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(msg.created_at).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true
                        })}
                      </CTableDataCell>
                      <CTableDataCell>{msg.message}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(msg.id)}>
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <CAlert color="info">No messages found.</CAlert>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Single Delete Modal */}
      <Modal
        visible={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this contact message?"
      />

      {/* Bulk Delete Modal */}
      <Modal
        visible={bulkDeleteModal}
        onClose={() => setBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
        title="Confirm Bulk Delete"
        message={`Are you sure you want to delete ${selectedIds.length} selected contact message(s)?`}
      />
    </CRow>
  );
};

export default ContactUs;
