"use client";

import Footer1 from "@/components/footers/Footer1";
import Topbar1 from "@/components/headers/Topbar1";
import Header from "@/components/headers/Header";
import WriteReview from "@/components/shopDetails/WriteReview";
import Products from "@/components/shopDetails/Products";
import RecentProducts from "@/components/shopDetails/RecentProducts";
import OtherProductsSameBrand from "@/components/shopDetails/OtherProductsSameBrand";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import { allProducts } from "@/data/products";
import ProductSinglePrevNext from "@/components/common/ProductSinglePrevNext";
import BuyItNow from "@/components/shopDetails/BuyItNow";
import { handleProductService } from "@/utlis/apiService";
import { useParams } from "next/navigation";

export default function page() {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const result = await handleProductService(id);
                setProduct(result.data);
                console.log("result", result);
            } catch (err) {
                console.log(err);
                setIsError(true);
                setError(err?.response?.data?.message);
            } finally {
                setIsError(false);
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <Topbar1 />
            <Header />
            <div className="tf-breadcrumb marginTopHeader">
                <div className="container">
                    <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
                        <div className="tf-breadcrumb-list"></div>
                        <ProductSinglePrevNext currentId={product?.id} />
                    </div>
                </div>
            </div>
            <DetailsOuterZoom product={product} isLoading={isLoading} />
            <WriteReview />
            {/* <ShopDetailsTab /> */}
            {/* <BuyItNow /> */}
            {/* <Products /> */}  
            <OtherProductsSameBrand />
            <RecentProducts />
            <Footer1 />
        </>
    );
}
