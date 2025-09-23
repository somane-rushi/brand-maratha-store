import React, { useRef, useState, useEffect } from 'react';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { CModal, CModalHeader, CModalBody, CButton } from '@coreui/react';

const ImageCropper = ({ show, onClose, imageFile, onCropDone }) => {
    const cropperRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [imageSize, setImageSize] = useState(null);

    useEffect(() => {
        if (imageFile) {
            const url = typeof imageFile === 'string' ? imageFile : URL.createObjectURL(imageFile);
            setImageURL(url);

            return () => {
                if (typeof imageFile !== 'string') URL.revokeObjectURL(url);
            };
        }
    }, [imageFile]);

    const handleCropChange = () => {
        const cropper = cropperRef.current;
        if (cropper) {
            const canvas = cropper.getCanvas();
            if (canvas) {
                setImageSize({ width: canvas.width, height: canvas.height });
            }
        }
    };

    const handleCrop = () => {
        const cropper = cropperRef.current;

        if (cropper && isReady) {
            const canvas = cropper.getCanvas();

            if (canvas) {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
                        onCropDone(file);
                        onClose();
                    } else {
                        console.error('Failed to generate blob.');
                    }
                }, 'image/jpeg');
            } else {
                console.warn('Canvas is not ready yet.');
            }
        }
    };

    return (
        <CModal visible={show} onClose={onClose} size="lg">
            <CModalHeader>
                <strong>Crop Image</strong>
                {imageSize && (
                    <span className="ms-3 text-muted small">
                        ({imageSize.width} × {imageSize.height}px)
                    </span>
                )}
            </CModalHeader>
            <CModalBody>
                {imageURL && (
                    <div style={{ width: '100%', height: 400, overflow: 'hidden' }}>
                        <Cropper
                            ref={cropperRef}
                            src={imageURL}
                            onChange={handleCropChange}
                            onReady={() => setIsReady(true)}
                            stencilProps={{ movable: true, resizable: true }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                )}
                <div className="d-flex justify-content-end mt-3">
                    <CButton color="primary" onClick={handleCrop}>
                        Crop & Save
                    </CButton>
                </div>
            </CModalBody>
        </CModal>
    );
};

export default ImageCropper;
