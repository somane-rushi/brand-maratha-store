"use client";
import React from "react";

export default function BrandDetails({ content }) {
    return (
        <>
            <div className="blog-detail bs-blog-details">
                <div className="blog-detail-main">
                    <div
                        className="desc typ-18"
                        dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                    <div className="bot d-flex justify-content-between flex-wrap align-items-center">
                        <div className="d-flex align-items-center gap-20">
                            <p>Share:</p>
                            <ul className="tf-social-icon d-flex style-default">
                                <li>
                                    <a
                                        href="#"
                                        className="box-icon round social-facebook border-line-black"
                                    >
                                        <i className="icon fs-14 icon-fb" />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="box-icon round social-twiter border-line-black"
                                    >
                                        <i className="icon fs-12 icon-Icon-x" />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="box-icon round social-instagram border-line-black"
                                    >
                                        <i className="icon fs-14 icon-instagram" />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="box-icon round social-tiktok border-line-black"
                                    >
                                        <i className="icon fs-14 icon-tiktok" />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="box-icon round social-pinterest border-line-black"
                                    >
                                        <i className="icon fs-14 icon-pinterest-1" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
