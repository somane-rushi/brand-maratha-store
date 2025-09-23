import React, { useEffect, useState } from 'react'
import Table from '../base/tables/BlogsTable'
import axiosInstance from '../../config/axios.config';
import { _blogs_get, _magazineblogs_create, _magazineblogs_delete, _magazineblogs_get } from '../../config/api.endpoints';
import { CAlert, CSpinner } from '@coreui/react';
import { handleApiError } from '../../utils/errorHelper';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [magazineBlogIds, setMagazineBlogIds] = useState(new Set());
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [blogRes, magazineRes] = await Promise.all([
        axiosInstance.get(_blogs_get),
        axiosInstance.get(_magazineblogs_get),
      ]);

      setBlogs(blogRes.data);
      const ids = new Set(magazineRes.data.map(blog => blog.blog_id || blog.id));
      setMagazineBlogIds(ids);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMagazine = async (blogId) => {
    try {
      if (magazineBlogIds.has(blogId)) {
        await axiosInstance.delete(`${_magazineblogs_delete}/${blogId}`);

        setMagazineBlogIds(prev => {
          const updated = new Set(prev);
          updated.delete(blogId);
          return updated;
        });
      } else {
        if (magazineBlogIds.size >= 4) {
          setError('Only 4 blogs can be added to the magazine.');
          return;
        }

        await axiosInstance.post(`${_magazineblogs_create}/${blogId}`);
        setMagazineBlogIds(prev => new Set(prev).add(blogId));
      }
    } catch (err) {
      setError("Failed to update magazine state");
    }
  };

  return (
    <>
      {isLoading && (
        <CSpinner color="primary" className="d-block mx-auto my-5" />
      )}
      {error && (
        <CAlert color="danger" className="mx-3">{error}</CAlert>
      )}
      {!isLoading && (
        <Table
          blogs={blogs}
          magazineBlogIds={magazineBlogIds}
          handleToggleMagazine={handleToggleMagazine}
        />
      )}
    </>
  );
};

export default Blog;
