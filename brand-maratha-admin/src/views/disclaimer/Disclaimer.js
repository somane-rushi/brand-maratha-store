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
    _disclaimer_get,
    _disclaimer_create,
    _disclaimer_update,
    _disclaimermarathi_get,
    _disclaimermarathi_create,
    _disclaimermarathi_update
} from "../../config/api.endpoints"
import Editor from '../../components/Editer';
import axiosInstance from "../../config/axios.config"
import { handleApiError } from '../../utils/errorHelper';


const Disclaimer = () => {
    const [policy, setPolicy] = useState("");
    const [language, setLanguage] = useState('english');
    const [viewPolicy, setViewPolicy] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState('');
    const [endpoint, setEndpoint] = useState(null);

    useEffect(() => {
        setEndpoint({
            getBanner: language === "english" ? _disclaimer_get : _disclaimermarathi_get,
            postBanner: language === "english" ? _disclaimer_create : _disclaimermarathi_create,
            putBanner: language === "english" ? _disclaimer_update : _disclaimermarathi_update,
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
            const existPolicy = await viewPolicyHandler();

            if (Array.isArray(existPolicy) && existPolicy.length > 0) {
                const policyId = existPolicy[0]?.id;

                response = await axiosInstance.put(`${endpoint.putBanner}/${policyId}`, { content: policy });
                setMessage("Record updated successfully!");
            } else {
                response = await axiosInstance.post(endpoint.postBanner, { content: policy });
                setMessage("Record created successfully!");
            }

            setViewPolicy(response.data[0]);
            setPolicy("");
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    const viewPolicyHandler = async () => {
        try {
            const response = await axiosInstance.get(endpoint.getBanner);

            if (response.status === 200) {
                setViewPolicy(response.data[0]);
                setPolicy(response.data[0]?.content || "");
                setMessage(response.data.length === 0 ? "Policy does not exist" : response?.data?.message);

                return response.data;
            };
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            return { error: errorMessage };
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
                                    setLanguage(e.target.value)
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

export default Disclaimer;

