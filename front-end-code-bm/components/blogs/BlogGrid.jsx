"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { newblogPosts } from "@/data/blogs";

export default function BlogGrid({ blogs }) {
    const [visibleBlogs, setVisibleBlogs] = useState(8);
    const [loading, setLoading] = useState(false);

    const handleLoad = () => {
        setLoading(true);

        setTimeout(() => {
            setVisibleBlogs((prev) => Math.min(prev + 8, blogs?.length));
            setLoading(false);
        }, 1000);
    };

    const allBlogsLoaded = visibleBlogs >= blogs?.length;

    return (
        <div className="blog-grid-main bs-blogGrid">
            <div className="container">
                <div className="row">
                    {Array.isArray(blogs) &&
                        blogs.slice(0, visibleBlogs).map((post, index) => (
                            <div
                                className="col-xl-3 col-md-4 col-12"
                                key={index}
                            >
                                <div className="blog-article-item">
                                    <div className="article-thumb">
                                        <Link href={`/blog-detail/${post.id}`}>
                                            <Image
                                                className="lazyload"
                                                data-src={post.thumbnail_image}
                                                alt="Thumbnail Image"
                                                src={post.thumbnail_image}
                                                width={310}
                                                height={275}
                                            />
                                        </Link>
                                        <div className="article-label">
                                            <Link
                                                href={`/blog-detail/${post.id}`}
                                                className="tf-btn btn-sm radius-3 btn-fill animate-hover-btn"
                                            >
                                                {post.label}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="article-content">
                                        <div className="article-title">
                                            <Link
                                                href={`/blog-detail/${post.id}`}
                                            >
                                                {post.title}
                                            </Link>
                                        </div>
                                        <div className="article-btn">
                                            <Link
                                                href={`/blog-detail/${post.id}`}
                                                className="tf-btn btn-line line-height-normal fw-6"
                                            >
                                                Read more
                                                <i className="icon icon-arrow1-top-left" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* "Load More" Button */}
                {!allBlogsLoaded && (
                    <div className="tf-pagination-wrap view-more-button text-center">
                        <button
                            className={`tf-btn-loading tf-loading-default style-2 btn-loadmore ${
                                loading ? "loading" : ""
                            }`}
                            onClick={handleLoad}
                            disabled={loading}
                        >
                            <span className="text">
                                {loading ? "Loading..." : "See All"}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
