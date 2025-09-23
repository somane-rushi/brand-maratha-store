"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { _url_without_upload_path } from "@/utlis/apiService";

const RecentBlog = ({ blogs, visibleCount }) => {
    const visibleBlogs = blogs.slice(0, visibleCount);

    return (
        <>
            <div className="bs-blog-list list-blog">
                {Array.isArray(visibleBlogs) &&
                    visibleBlogs?.map((article, index) => (
                        <div
                            key={index}
                            className="blog-article-item style-row"
                        >
                            <div className="article-thumb">
                                <Link
                                    href={`/blog-detail/${article.id}`}
                                    className="blog-img-section"
                                >
                                    <Image
                                        className="lazyload"
                                        data-src={article.thumbnail_image}
                                        alt="Thumbnail image"
                                        src={article.thumbnail_image}
                                        width={310}
                                        height={275}
                                    />
                                </Link>
                                <div className="article-label">
                                    <Link
                                        href={`/blog-detail/${article.id}`}
                                        className="tf-btn btn-sm radius-3 btn-fill animate-hover-btn"
                                    >
                                        {article?.label}
                                    </Link>
                                </div>
                            </div>
                            <div className="article-content">
                                <div className="card-body">
                                    <div className="article-title">
                                        <Link
                                            href={`/blog-detail/${article.id}`}
                                        >
                                            {article.title}
                                        </Link>
                                    </div>
                                    <div className="desc">
                                        {article.thumbnail_content}
                                    </div>
                                </div>
                                <div className="article-btn">
                                    <Link
                                        href={`/blog-detail/${article.id}`}
                                        className="tf-btn btn-line line-height-normal fw-6"
                                    >
                                        Read more
                                        <i className="icon icon-arrow1-top-left" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default RecentBlog;
