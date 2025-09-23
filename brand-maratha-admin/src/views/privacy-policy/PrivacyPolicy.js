import React, { useEffect, useState } from 'react'
import {
    CAlert,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormSelect,
    CRow,
} from '@coreui/react'
import {
    _privacypolicies_create,
    _privacypolicies_get,
    _privacypolicies_update,
    _privacypoliciesmarathi_get,
    _privacypoliciesmarathi_create,
    _privacypoliciesmarathi_update
} from "../../config/api.endpoints"
import Editor from '../../components/Editer';
import axiosInstance from "../../config/axios.config"
import { handleApiError } from '../../utils/errorHelper';

const PrivacyPolicy = () => {
    const [policy, setPolicy] = useState("");
    const [language, setLanguage] = useState('english');
    const [viewPolicy, setViewPolicy] = useState(null);
    const [message, setMessage] = useState("");
    const [endpoint, setEndpoint] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setEndpoint({
            getBanner: language === "english" ? _privacypolicies_get : _privacypoliciesmarathi_get,
            postBanner: language === "english" ? _privacypolicies_create : _privacypoliciesmarathi_create,
            putBanner: language === "english" ? _privacypolicies_update : _privacypoliciesmarathi_update,
        });
    }, [language]);

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const handlePolicy = async () => {
        try {
            let response;
            if (viewPolicy?.id) {
                response = await axiosInstance.put(endpoint.putBanner,
                    { description: policy }, { params: { id: viewPolicy.id } });
            } else {
                response = await axiosInstance.post(endpoint.postBanner, { description: policy });
            }

            setMessage(response.data?.message);
            setViewPolicy({ ...viewPolicy, description: policy, id: response.data?.id || viewPolicy?.id });
        } catch (err) {
            setError(handleApiError(err))
        }
    };

    const viewPolicyHandler = async () => {
        try {
            const response = await axiosInstance.get(endpoint.getBanner);
            if (response.status === 200) {
                setViewPolicy(response.data);
                setPolicy(response.data?.description || "");
                setMessage(response.data.message);
            }
        } catch (err) {
            setError(handleApiError(err))
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Editer</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CCol xs={12} md={4} lg={2} className='mb-4'>
                            <CFormSelect
                                xs={4}
                                aria-label="Default select example"
                                defaultValue="english"
                                onChange={(e) => {
                                    setLanguage(e.target.value);
                                    setPolicy("");
                                    setViewPolicy(null);
                                }}
                            >
                                <option value="english">English</option>
                                <option value="marathi">मराठी</option>
                            </CFormSelect>
                        </CCol>

                        <div className='mt-4'>
                            {message && <CAlert color='success'>{message}</CAlert>}
                            {error && <CAlert color='danger'>{error}</CAlert>}
                        </div>

                        <Editor
                            policy={policy}
                            handlePolicy={handlePolicy}
                            viewPolicyHandler={viewPolicyHandler}
                            viewPolicy={viewPolicy}
                            message={message}
                            setPolicy={setPolicy}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default PrivacyPolicy;

