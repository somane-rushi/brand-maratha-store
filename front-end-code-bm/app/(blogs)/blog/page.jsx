"use client";
import BlogGrid from "@/components/blogs/BlogGrid";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import React, { useEffect, useState } from "react";
import Topbar1 from "@/components/headers/Topbar1";
import Hero from "@/components/blogs/Hero";
import RecentBlog from "@/components/blogs/RecentBlog";
import PopularBlog from "@/components/blogs/PopularBlog";
import {
    handleBlogsService,
    handleFetchPopularBlogsService,
} from "@/utlis/apiService";

// export default function page() {
//     const [query, setQuery] = useState(``);
//     const [blogs, setBlogs] = useState([]);
//     const [popularBlogs, setPopularBlogs] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         (async () => {
//             setIsLoading(true);
//             try {
//                 const allBlogsRes = await handleBlogsService();
//                 setBlogs(allBlogsRes.data);
//             } catch (err) {
//                 console.log(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         })();
//     }, []);

//     useEffect(() => {
//         (async () => {
//             setIsLoading(true);
//             try {
//                 const popularBlogsRes = await handleFetchPopularBlogsService();
//                 setPopularBlogs(popularBlogsRes.data);
//             } catch (err) {
//                 console.log(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         })();
//     }, []);

//     const filteredBlogs = query
//         ? blogs.filter(
//               (blog) =>
//                   blog.title.toLowerCase().includes(query.toLowerCase()) ||
//                   blog.label.toLowerCase().includes(query.toLowerCase())
//           )
//         : blogs;

//     const sortedBlogs = [...filteredBlogs].filter((blog) => blog.date);
//     const sliderBlogs = sortedBlogs.slice(0, 3);
//     const recentBlogs = sortedBlogs.slice(3, 12);

//     if (isLoading) return <div>Loading...</div>;
//     return (
//         <>
//             <Topbar1 query={query} setQuery={setQuery} />
//             <Header />
//             <Hero blogs={sliderBlogs} />
//             <section className="bs-blog-list flat-spacing-36">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-md-8">
//                             <div className="bs-heading mb_40">
//                                 <h2 className="hd">Recent Blogs</h2>
//                             </div>
//                             <RecentBlog blogs={recentBlogs} />
//                         </div>
//                         <div className="col-md-4">
//                             <div className="bs-heading mb_40">
//                                 <h2 className="hd">Popular Blogs</h2>
//                             </div>
//                             <PopularBlog blogs={popularBlogs} />
//                         </div>
//                     </div>
//                     <div className="row">
//                         <div className="col-md-12">
//                             <div className="tf-pagination-wrap typ-40 view-more-button text-center">
//                                 <button className="tf-btn-loading tf-loading-default style-2 btn-loadmore">
//                                     <span className="text">See All</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <BlogGrid blogs={blogs} />
//             <Footer1 />
//         </>
//     );
// }

export default function Page() {
    const [query, setQuery] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [popularBlogs, setPopularBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleRecentCount, setVisibleRecentCount] = useState(3);
    const [visiblePopularCount, setVisiblePopularCount] = useState(2);

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

    const filteredBlogs = query
        ? blogs.filter(
              (blog) =>
                  blog.title.toLowerCase().includes(query.toLowerCase()) ||
                  blog.label.toLowerCase().includes(query.toLowerCase())
          )
        : blogs;

    const sortedBlogs = [...filteredBlogs].filter((blog) => blog.date);
    const sliderBlogs = sortedBlogs.slice(0, 3);
    const recentBlogs = sortedBlogs.slice(3);

    const handleSeeMore = () => {
        if (visibleRecentCount < recentBlogs.length)
            setVisibleRecentCount((prev) => prev + 1);
        if (visiblePopularCount < popularBlogs.length)
            setVisiblePopularCount((prev) => prev + 1);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <Topbar1 query={query} setQuery={setQuery} />
            <Header />
            <Hero blogs={sliderBlogs} />

            <section className="bs-blog-list flat-spacing-36">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="bs-heading mb_40">
                                <h2 className="hd">Recent Blogs</h2>
                            </div>
                            <RecentBlog
                                blogs={recentBlogs}
                                visibleCount={visibleRecentCount}
                            />
                        </div>
                        <div className="col-md-4">
                            <div className="bs-heading mb_40">
                                <h2 className="hd">Popular Blogs</h2>
                            </div>
                            <PopularBlog
                                blogs={popularBlogs}
                                visibleCount={visiblePopularCount}
                            />
                        </div>
                    </div>

                    {(visibleRecentCount < recentBlogs.length ||
                        visiblePopularCount < popularBlogs.length) && (
                        <div className="row">
                            <div className="col-md-12">
                                <div className="tf-pagination-wrap typ-40 view-more-button text-center mt-4">
                                    <button
                                        className="tf-btn-loading tf-loading-default style-2 btn-loadmore"
                                        onClick={handleSeeMore}
                                    >
                                        <span className="text">See More</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <BlogGrid blogs={blogs} />
            <Footer1 />
        </>
    );
}
