import React, { useEffect, useMemo } from 'react';
import {
    CModal,
    CModalHeader,
    CModalBody,
} from '@coreui/react';

const ImagePreview = ({ visible, imageFile, onClose }) => {
    const imageURL = useMemo(() => {
        if (!imageFile) return null;
        return typeof imageFile === 'string'
            ? imageFile
            : URL.createObjectURL(imageFile);
    }, [imageFile]);

    return (
        <CModal visible={visible} size="lg" onClose={onClose} alignment="center">
            <CModalHeader closeButton>
                <strong>Image Preview</strong>
            </CModalHeader>
            <CModalBody
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxHeight: '70vh',
                    overflow: 'hidden',
                    padding: '1rem',
                }}
            >
                <img
                    src={imageURL}
                    alt="Preview"
                    style={{
                        maxWidth: '100%',
                        maxHeight: 'calc(70vh - 2rem)',
                        borderRadius: '8px',
                        objectFit: 'contain',
                    }}
                />
            </CModalBody>
        </CModal>
    );
};

export default ImagePreview;
