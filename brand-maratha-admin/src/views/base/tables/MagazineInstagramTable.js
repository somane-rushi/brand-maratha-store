import React, { useState, Fragment } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalBody,
    CModalHeader
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPen, cilMediaPlay, cilTrash } from '@coreui/icons'
import { _url_aboutusBanner_img } from '../../../config/api.endpoints'

const Table = ({
    banners,
    formData,
    handleDelete,
    setActiveForm,
    setShowForm
}) => {
    const [videoModal, setVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState('');

    const handleUpdate = (item) => {
        formData(item);
        setActiveForm(true);
        setShowForm(true);
    }

    const openVideoModal = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setVideoModal(true);
    }

    const closeVideoModal = () => {
        setVideoModal(false);
        setSelectedVideo('');
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Banner</strong> <small>List</small>
                    </CCardHeader>
                    <CCardBody>
                        {banners?.length > 0 ? (
                            <CTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">Index</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Video</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {banners?.map((item, index) => (
                                        <Fragment key={index}>
                                            <CTableRow>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>
                                                    {item.video ? (
                                                        <CButton
                                                            color="primary"
                                                            size="sm"
                                                            onClick={() => openVideoModal(item.video)}
                                                        >
                                                            <CIcon icon={cilMediaPlay} size="sm" /> Play Video
                                                        </CButton>
                                                    ) : (
                                                        "No Video Available"
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CButton
                                                        type="button"
                                                        color="success"
                                                        onClick={() => handleUpdate(item)}
                                                    >
                                                        <CIcon icon={cilPen} size="md" />
                                                    </CButton>
                                                    <CButton
                                                        style={{ marginLeft: '10px' }}
                                                        type="button"
                                                        color="danger"
                                                        onClick={() => handleDelete(item?.id)}
                                                    >
                                                        <CIcon icon={cilTrash} size="md" />
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        </Fragment>
                                    ))}
                                </CTableBody>
                            </CTable>
                        ) : (
                            <CCardHeader>
                                <strong>No banner found!</strong>
                            </CCardHeader>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>

            <CModal visible={videoModal} onClose={closeVideoModal} size="lg">
                <CModalHeader closeButton>Video Preview</CModalHeader>
                <CModalBody className="d-flex justify-content-center">
                    {selectedVideo ? (
                        /youtu\.?be|youtube\.com/.test(selectedVideo) ? (
                            <iframe
                                width="100%"
                                height="400"
                                src={
                                    selectedVideo.includes("youtube.com/watch")
                                        ? selectedVideo.replace("watch?v=", "embed/").split("&")[0]
                                        : selectedVideo.includes("youtu.be/")
                                            ? `https://www.youtube.com/embed/${selectedVideo.split("youtu.be/")[1].split("?")[0]}`
                                            : ""
                                }
                                title="YouTube Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video width="100%" height="400" controls autoPlay>
                                <source
                                    src={
                                        selectedVideo.startsWith("http")
                                            ? selectedVideo
                                            : `${process.env.REACT_APP_BASE_URL || ""}/${selectedVideo}`
                                    }
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>
                        )
                    ) : (
                        <p>No Video Available</p>
                    )}
                </CModalBody>
            </CModal>
        </CRow>
    )
}

export default Table;
