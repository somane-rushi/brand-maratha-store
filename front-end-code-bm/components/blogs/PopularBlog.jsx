"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { _url_without_upload_path } from "@/utlis/apiService";

const PopularBlog = ({ blogs, visibleCount }) => {
    const visibleBlogs = blogs.slice(0, visibleCount);

    return (
        <section className="bs-popular-blog">
            <div className="list-blog">
                {Array.isArray(visibleBlogs) &&
                    visibleBlogs.map((brand, index) => {
                        return (
                            <div key={index} className="col-md-12">
                                <div className="blog-article-item1">
                                    <div className="article-thumb1">
                                        <div className="tab">
                                            <Link
                                                href={`/blog-detail/${brand.id}`}
                                            >
                                                <Image
                                                    className="lazyload"
                                                    src={`${_url_without_upload_path}/${brand.thumbnail_image}`}
                                                    alt="image"
                                                    width={360}
                                                    height={227}
                                                />
                                            </Link>
                                            <div className="article-label">
                                                <Link
                                                    href={`/blog-detail/${brand.id}`}
                                                    className="tf-btn btn-sm radius-3 btn-fill animate-hover-btn"
                                                >
                                                    {brand?.label}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="article-content">
                                        <div className="card-body">
                                            <div className="article-title">
                                                <Link
                                                    href={`/blog-detail/${brand.id}`}
                                                >
                                                    {brand.title}
                                                </Link>
                                            </div>
                                            <div className="desc popular-desc">
                                                {brand.thumbnail_content}
                                            </div>
                                        </div>
                                        <div className="article-btn">
                                            <Link
                                                href={`/blog-detail/${brand.id}`}
                                                className="tf-btn btn-line line-height-normal fw-6"
                                            >
                                                View Brand
                                                <i className="icon icon-arrow1-top-left" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </section>
    );
};

export default PopularBlog;
