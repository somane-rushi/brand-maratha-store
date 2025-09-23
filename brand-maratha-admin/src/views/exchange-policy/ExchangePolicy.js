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
    _exchangepolicies_get,
    _exchangepolicies_create,
    _exchangepolicies_update,
    _exchangepoliciesmarathi_get,
    _exchangepoliciesmarathi_create,
    _exchangepoliciesmarathi_update,
} from "../../config/api.endpoints"
import Editor from '../../components/Editer';
import axiosInstance from "../../config/axios.config"
import { handleApiError } from '../../utils/errorHelper';


const ExchangePolicy = () => {
    const [policy, setPolicy] = useState("");
    const [language, setLanguage] = useState('english');
    const [viewPolicy, setViewPolicy] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState('');
    const [endpoint, setEndpoint] = useState(null);

    useEffect(() => {
        setEndpoint({
            getBanner: language === "english" ? _exchangepolicies_get : _exchangepoliciesmarathi_get,
            postBanner: language === "english" ? _exchangepolicies_create : _exchangepoliciesmarathi_create,
            putBanner: language === "english" ? _exchangepolicies_update : _exchangepoliciesmarathi_update,
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
                response = await axiosInstance.put(`${endpoint.putBanner}/${viewPolicy.id}`,
                    { content: policy });
                setMessage('Policy updated successfully');
            } else {
                response = await axiosInstance.post(endpoint.postBanner, { content: policy });
                setMessage(response?.data?.message);
            }

            setViewPolicy({ ...viewPolicy, content: policy, id: response.data?.id || viewPolicy?.id });
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    const viewPolicyHandler = async () => {
        try {
            const response = await axiosInstance.get(endpoint.getBanner);
            if (response.status === 200) {
                setViewPolicy(response.data);
                setPolicy(response.data?.content || "");
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

export default ExchangePolicy;

