"use client";

import React from "react";
import { useState } from "react";
import { ProductCard } from "../shopCards/ProductCard";

export default function ProductGrid({ allproducts, gridItems = 9 }) {
    const [visibleProduct, setVisibleProduct] = useState(9);
    const [loading, setLoding] = useState(false);

    const handelLoad = () => {
        setLoding(true);

        setTimeout(() => {
            setVisibleProduct((prev) => Math.min(prev + 9, allproducts?.length));
            setLoding(false);
        }, 1000);
    };

    const allProductLoaded = visibleProduct >= allproducts?.length;
    return (
        <>
            <div
                className="grid-layout wrapper-shop"
                data-grid={`grid-${gridItems}`}
            >
                {Array.isArray(allproducts) &&
                    allproducts.map((product) => (
                        <ProductCard product={product} />
                    ))}
            </div>
            {!allProductLoaded && (
                <div className="tf-pagination-wrap view-more-button text-center">
                    <button
                        className={`tf-btn-loading tf-loading-default style-2 btn-loadmore ${
                            loading ? loading : ""
                        }`}
                        onClick={handelLoad}
                        disabled={loading}
                    >
                        <span className="text">
                            {loading ? "loading..." : "See All"}
                        </span>
                    </button>
                </div>
            )}
        </>
    );
}
