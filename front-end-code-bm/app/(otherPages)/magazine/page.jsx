// "use client";
// import Footer1 from "@/components/footers/Footer1";
// import Header from "@/components/headers/Header";
// import React, { useEffect, useState } from "react";
// import Topbar1 from "@/components/headers/Topbar1";
// import Hero from "@/components/Magazine/Hero";
// import VideoSection from "@/components/Magazine/VideoSection";
// import Logo from "@/components/Magazine/Logo";
// import Products from "@/components/Magazine/Products";
// import BlogGrid from "@/components/Magazine/BlogGrid";
// import {
//     fetchBrands,
//     handleBlogsService,
//     handleMagazineBannerService,
//     handleMagazineService,
//     handleVideoMagazineService,
// } from "@/utlis/apiService";

// const metadata = {
//     title: "Magazine || Brand Maratha ",
//     description: "Brand Maratha",
// };

// export default function page() {
//     const [magazine, setMagazine] = useState([]);
//     const [error, setError] = useState("");
//     const [isLoading, setIsLoading] = useState(false);

//     const [brands, setBrands] = useState([]);
//     const [brandError, setBrandError] = useState("");
//     const [brandIsLoading, setBrandIsLoading] = useState(false);

//     const [videoMagazine, setVideoMagazine] = useState([]);
//     const [videoMagazineError, setVideoMagazineError] = useState("");
//     const [videoMagazineIsLoading, setVideoMagazineIsLoading] = useState(false);

//     const [banner, setBanner] = useState([]);
//     const [bannerError, setBannerError] = useState("");
//     const [bannerIsLoading, setBannerIsLoading] = useState(false);

//     const [blogs, setBlogs] = useState([]);
//     const [blogIsLoading, setBlogIsLoading] = useState(false);

//     useEffect(() => {
//         (async () => {
//             setIsLoading(true);

//             try {
//                 const result = await handleMagazineService();
//                 setMagazine(result?.data);
//             } catch (err) {
//                 setError(
//                     err?.response?.data?.message || "Something went wrong!"
//                 );
//             } finally {
//                 setIsLoading(false);
//             }
//         })();
//     }, []);

//     useEffect(() => {
//         setBrandIsLoading(true);

//         (async () => {
//             try {
//                 const data = await fetchBrands();
//                 setBrands(data);
//             } catch (err) {
//                 setBrandError(
//                     err?.response?.data?.message || "Something went wrong!"
//                 );
//             } finally {
//                 setBrandIsLoading(false);
//             }
//         })();
//     }, []);

//     useEffect(() => {
//         setVideoMagazineIsLoading(true);

//         (async () => {
//             try {
//                 const result = await handleVideoMagazineService();
//                 setVideoMagazine(result);
//             } catch (err) {
//                 setVideoMagazineError(
//                     err?.response?.data?.message || "Something went wrong!"
//                 );
//             } finally {
//                 setVideoMagazineIsLoading(false);
//             }
//         })();
//     }, []);

//     useEffect(() => {
//         (async () => {
//             try {
//                 const result = await handleMagazineBannerService();
//                 setBanner(result.data[0]);
//             } catch (err) {
//                 console.log("Magazine Banner error", err);
//                 setBannerError(
//                     err?.response?.data?.message || "Something went wrong!"
//                 );
//             } finally {
//                 setBannerIsLoading(false);
//             }
//         })();
//     }, []);

//     useEffect(() => {
//         (async () => {
//             setBlogIsLoading(true);
//             try {
//                 const _blogs = await handleBlogsService();
//                 setBlogs(_blogs.data);
//             } catch (err) {
//                 console.log(err);
//             } finally {
//                 setBlogIsLoading(false);
//             }
//         })();
//     }, []);

//     if (
//         isLoading ||
//         brandIsLoading ||
//         videoMagazineIsLoading ||
//         bannerIsLoading ||
//         blogIsLoading ||
//         !videoMagazine.data
//     )
//         return <div>Loading</div>;

//     return (
//         <>
//             <Topbar1 />
//             <Header />
//             <Hero banner={banner} />
//             <VideoSection
//                 videoMagazine={videoMagazine.data}
//                 blogs={blogs?.slice(0, 4)}
//             />
//             <Products magazine={magazine} />
//             <Logo brands={brands} />
//             <BlogGrid blogs={blogs} />
//             <Footer1 />
//         </>
//     );
// }

"use client";

import React, { useEffect, useState } from "react";
import Topbar1 from "@/components/headers/Topbar1";
import Header from "@/components/headers/Header";
import Hero from "@/components/Magazine/Hero";
import VideoSection from "@/components/Magazine/VideoSection";
import Logo from "@/components/Magazine/Logo";
import Products from "@/components/Magazine/Products";
import BlogGrid from "@/components/Magazine/BlogGrid";
import Footer1 from "@/components/footers/Footer1";

import {
    fetchBrands,
    handleMagazineBlogsService,
    handleMagazineBannerService,
    handleMagazineService,
    handleVideoMagazineService,
    handleInstagramVideoService,
} from "@/utlis/apiService";
import { toast } from "react-toastify";

export default function page() {
    const [magazine, setMagazine] = useState([]);
    const [brands, setBrands] = useState([]);
    const [videoMagazine, setVideoMagazine] = useState([]);
    const [instagramReels, setInstagramReels] = useState([]);
    const [banner, setBanner] = useState({});
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [
                    magazineRes,
                    brandRes,
                    videoRes,
                    instagramRes,
                    bannerRes,
                    blogRes,
                ] = await Promise.all([
                    handleMagazineService().catch((err) => {
                        toast.error(
                            err?.response?.data?.message ||
                                "Failed to fetch magazine!"
                        );
                        return { data: [] };
                    }),
                    fetchBrands().catch((err) => {
                        toast.error(
                            err?.response?.data?.message ||
                                "Failed to fetch brands!"
                        );
                        return [];
                    }),
                    handleVideoMagazineService().catch((err) => {
                        toast.error(
                            err?.response?.data?.message ||
                                "Failed to fetch videos!"
                        );
                        return { data: [] };
                    }),
                    handleInstagramVideoService().catch((err) => {
                        toast.error(
                            err?.response?.data?.message ||
                                "Failed to fetch Instagram reels!"
                        );
                        return [];
                    }),
                    handleMagazineBannerService().catch((err) => {
                        toast.error(
                            err?.response?.data?.message ||
                                "Failed to fetch banner!"
                        );
                        return { data: [] };
                    }),
                    handleMagazineBlogsService().catch((err) => {
                        toast.error(
                            err?.response?.data?.message ||
                                "Failed to fetch blogs!"
                        );
                        return { data: [] };
                    }),
                ]);

                setMagazine(magazineRes?.data || []);
                setBrands(brandRes || []);
                setVideoMagazine(videoRes || []);
                setInstagramReels(instagramRes || []);
                setBanner(bannerRes?.data?.[0] || {});
                setBlogs(blogRes?.data || []);
            } catch (err) {
                toast.error("Something went wrong during data fetch!");
                console.error("Unexpected error in magazine page:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading || !videoMagazine?.data) return <div>Loading</div>;
    // if (errors) return console.log(errors);

    return (
        <>
            <Topbar1 />
            <Header />
            <Hero banner={banner} />
            <VideoSection
                data={{
                    videoBanner: videoMagazine.data,
                    instagramReels,
                    blogs,
                }}
            />
            <Products magazine={magazine} />
            <Logo brands={brands} />
            <BlogGrid blogs={blogs} />
            <Footer1 />
        </>
    );
}
