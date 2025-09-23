"use client";
import React, { useEffect, useState } from "react";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import Hero from "@/components/BrandDetails/Hero";
import BrandDetails from "@/components/BrandDetails/BrandDetails";
import PopularBlog from "@/components/blogs/PopularBlog";
import ProductGrid from "@/components/shop/ProductGrid";
import { useParams } from "next/navigation";
import {
    fetchBrandDetailsByID,
    handleFetchPopularBlogsService,
} from "@/utlis/apiService";

export default function page() {
    const { id } = useParams();
    const [blogDetails, setBlogDetails] = useState({});
    const [popularBlogs, setPopularBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        const getBrands = async () => {
            setIsLoading(true);

            try {
                const data = await fetchBrandDetailsByID(id);
                setBlogDetails(data);
            } catch (error) {
                console.log("Error fetching brands:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getBrands();
    }, [id]);

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

    if (isLoading) return null;

    return (
        <>
            <Topbar1 />
            <Header />
            <Hero banner={blogDetails} />
            <div className="blog-details-page pdT_100">
                <div className="container">
                    <div className="row custom-gap">
                        <div className="col-md-8">
                            <BrandDetails content={blogDetails} />
                        </div>
                        <div className="col-md-4">
                            <div className="bs-heading mb_40">
                                <h2 className="hd">Popular Brands</h2>{" "}
                            </div>
                            <PopularBlog blogs={popularBlogs} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="product-grid mb_72">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="bs-heading">
                                <h2 className="hd mrgB40">
                                    Explore Our Products
                                </h2>
                            </div>
                        </div>
                    </div>
                    <ProductGrid />
                </div>
            </div>
            {/* <RelatedBlogs /> */}
            <Footer1 />
        </>
    );
}
