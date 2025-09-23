"use client";

import { useState } from "react";
import { products1 } from "@/data/products";

import { layouts } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import SidebarFilter from "./SidebarFilter";
import { ProductCard } from "../shopCards/ProductCard";
import Pagination from "../common/Pagination";
import Sorting from "./Sorting";
// import FilterSliderMobile from "./FilterSliderMobile";

export default function FilterSliderMobile({
    //  gridItems = 4,
    allproducts = products1,
}) {
    const [gridItems, setGridItems] = useState(3);
    const [products, setProducts] = useState([]);
    const [finalSorted, setFinalSorted] = useState([]);
    return (
        <>
            <div
                className="offcanvas offcanvas-start canvas-filter mobile-filter-list"
                id="mobFilterShop1"
            >
                <div className="canvas-wrapper">
                    <header className="canvas-header">
                        <div className="filter-icon">
                            <span className="icon icon-filter" />
                            <span>Filter</span>
                        </div>
                        <span
                            className="icon-close icon-close-popup"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        />
                    </header>
                    <div className="canvas-body">
                        <div className="tf-shop-sidebar  bm-typ-sidebar">
                            <SidebarFilter
                                setProducts={setProducts}
                                // queries={{}}
                                // filterQueries={{}}
                                // setFilteredProducts={[]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
