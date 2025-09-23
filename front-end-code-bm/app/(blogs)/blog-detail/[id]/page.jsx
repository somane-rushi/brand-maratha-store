"use client";
import React, { useEffect, useState } from "react";
import BlogDetails from "@/components/blogs/BlogDetails";
import PopularBlog from "@/components/blogs/PopularBlog";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import {
    handleBlogsByIdService,
    handleBlogsService,
    handleFetchPopularBlogsService,
} from "@/utlis/apiService";
import Link from "next/link";
import { toast } from "react-toastify";

export default function page({ params }) {
    const [blog, setBlog] = useState({});
    const [popularBlogs, setPopularBlogs] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    if (!params) return;

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const { data } = await handleBlogsByIdService(params.id);
                setBlog(data);
            } catch (err) {
                toast.error(
                    err?.respose?.data?.message ||
                        err?.respose?.data?.error ||
                        err?.message
                );
            } finally {
                setIsLoading(false);
            }
        })();
    }, [params.id]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const allBlogsRes = await handleBlogsService();
                setBlogs(allBlogsRes.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const popularBlogsRes = await handleFetchPopularBlogsService();
                setPopularBlogs(popularBlogsRes.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    return (
        <>
            <Topbar1 />
            <Header />
            <div className="blog-details-page marginTopHeader">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="blog-detail-text">
                                <div className="blog-detail-main-heading">
                                    <div className="title">{blog.title}</div>
                                    <ul className="breadcrumbs d-flex gap-10 mb-3">
                                        <li>
                                            <Link href="/">Home </Link>
                                        </li>
                                        <li>
                                            <i className="icon-arrow-right" />
                                        </li>
                                        <li>
                                            <Link href="/blog">Blog</Link>
                                        </li>
                                        <li>
                                            <i className="icon-arrow-right" />
                                        </li>
                                        <li>{blog?.title || "Loading..."}</li>
                                    </ul>
                                    <div className="meta">
                                        by <span>{blog.author}</span> on{" "}
                                        <span>
                                            {blog.date &&
                                                new Date(
                                                    blog.date
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row custom-gap">
                        <div className="col-md-8">
                            <BlogDetails blog={blog} />
                        </div>
                        <div className="col-md-4 blog-line">
                            <div className="bs-heading mb_40">
                                <h2 className="hd">Popular Blogs</h2>
                            </div>
                            <PopularBlog blogs={popularBlogs} />
                        </div>
                    </div>
                </div>
            </div>

            <RelatedBlogs blogs={blogs} />
            <Footer1 />
        </>
    );
}
