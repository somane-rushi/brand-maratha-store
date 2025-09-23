import React, { useEffect, useState } from 'react'
import Table from '../base/tables/MagazineBlogTable'
import axiosInstance from '../../config/axios.config';
import { _branddetails_get } from '../../config/api.endpoints';
import { CAlert, CSpinner } from '@coreui/react';
import { handleApiError } from '../../utils/errorHelper';

const BrandDetails = () => {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError('');

            try {
                const result = await axiosInstance.get(_branddetails_get);
                setBlogs(result.data);
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setIsLoading(false);
            }
        })();
    }, [])

    if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
    if (error) return <CAlert color='danger'>{error}</CAlert>
    return (
        <>
            <Table
                blogs={blogs}
            />
        </>
    )
}

export default BrandDetails;