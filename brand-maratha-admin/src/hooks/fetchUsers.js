import { useState, useEffect } from "react";
import axiosInstance from "../config/axios.config";

const useFetchUsers = (url) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(url);
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [url]);

    return { users, loading, error, refetch: fetchUsers };
};

export default useFetchUsers;
