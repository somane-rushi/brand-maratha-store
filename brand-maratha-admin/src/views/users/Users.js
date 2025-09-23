import React, { useEffect, useState } from 'react'
import Table from './Table'
import { _userslist_get } from '../../config/api.endpoints';
import { CSpinner } from '@coreui/react';
import axiosInstance from '../../config/axios.config';
import { handleApiError } from '../../utils/errorHelper';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        setIsLoading(true);
        setError(``);

        (async () => {
            try {
                const { data } = await axiosInstance.get(_userslist_get);
                setUsers(data);
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) return <CSpinner color="primary" />;
    if (error) return <CAlert color="danger">{error}</CAlert>;
    return (
        <>
            <Table users={users} />
        </>
    )
}

export default Users