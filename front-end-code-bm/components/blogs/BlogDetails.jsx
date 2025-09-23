// import React from "react";

// export default function BlogDetails({ blog }) {
//     return (
//         <>
//             <div className="blog-detail bs-blog-details">
//                 <div className="blog-detail-main">
//                     <div
//                         className="desc typ-18"
//                         dangerouslySetInnerHTML={{ __html: blog.content }}
//                     />
//                 </div>
//             </div>
//         </>
//     );
// }

"use client";
import React, { useEffect } from "react";
import { handleBlogsViewsService } from "@/utlis/apiService";


export default function BlogDetails({ blog }) {
    useEffect(() => {
        if (!blog?.id) return;

        const viewedRaw = localStorage.getItem("viewedBlogs");
        let viewed = [];

        try {
            viewed = JSON.parse(viewedRaw) || [];
        } catch (e) {
            viewed = [];
        }

        if (!viewed.includes(blog.id)) {
            const updated = [...viewed, blog.id];
            localStorage.setItem("viewedBlogs", JSON.stringify(updated));

            handleBlogsViewsService(blog.id)
                .then((res) => console.log(res.data.message))
                .catch((err) => console.error("View tracking error", err));
        }
    }, [blog?.id]);

    return (
        <div className="blog-detail bs-blog-details">
            <div className="blog-detail-main">
                <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                <div className="bot">
                    <div className="d-flex align-items-center gap-20">
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
    );
}
