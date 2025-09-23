import React from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from "@coreui/react";

const Modal = ({ visible, onClose, onConfirm, title, message }) => {
    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader>
                <CModalTitle>{title}</CModalTitle>
            </CModalHeader>
            <CModalBody>{message}</CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Cancel
                </CButton>
                <CButton color="danger" onClick={onConfirm}>
                    Ok
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default Modal;
