"use client";
import { layouts } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import { useEffect, useState } from "react";
import SidebarFilter from "./SidebarFilter";
import Sorting from "./Sorting";
import { fetchAvailableFilters } from "@/utlis/apiService";

export default function FilterSidebar({ filterQueries }) {
    const [filterResponse, setFilterResponse] = useState({});
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [gridItems, setGridItems] = useState(3);
    const [finalSorted, setFinalSorted] = useState([]);

    useEffect(() => {
        async function fetchAll() {
            try {
                const filterRes = await fetchAvailableFilters(filterQueries);
                setFilterResponse(filterRes || {});
                console.log("filterRes", filterRes);
            } catch (err) {
                console.error("Error fetching products or filters:", err);
            }
        }

        fetchAll();
    }, [filterQueries]);

    return (
        <>
            <section className="flat-spacing-1">
                <div className="container">
                    <div className="tf-shop-control grid-3 align-items-center">
                        <div />
                        <ul className="tf-control-layout d-flex justify-content-center d-none">
                            {layouts.map((layout, index) => (
                                <li
                                    key={index}
                                    className={`tf-view-layout-switch ${
                                        layout.className
                                    } ${
                                        gridItems == layout.dataValueGrid
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setGridItems(layout.dataValueGrid)
                                    }
                                >
                                    <div className="item">
                                        <span
                                            className={`icon ${layout.iconClass}`}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Desktop View */}
                    <div className="tf-row-flex">
                        <SidebarFilter
                            queries={filterQueries}
                            filterQueries={filterResponse}
                            setFilteredProducts={setFilteredProducts}
                        />
                        <div className="tf-shop-content wrapper-control-shop">
                            <div className="bm-upper-section">
                                <div>
                                    {filteredProducts?.length} product's found
                                </div>
                                <div className="tf-control-sorting d-flex justify-content-end">
                                    <div
                                        className="tf-dropdown-sort"
                                        data-bs-toggle="dropdown"
                                    >
                                        <Sorting
                                            products={filteredProducts}
                                            setFinalSorted={setFinalSorted}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="meta-filter-shop" />
                            <ProductGrid
                                allproducts={finalSorted}
                                gridItems={gridItems}
                            />
                        </div>
                    </div>

                    {/* Mobile View Off-canvas Filter */}
                    <div className="btn-sidebar-mobile start-0">
                        <div className="tf-control-filter bg-white">
                            <a
                                href="#mobFilterShop"
                                data-bs-toggle="offcanvas"
                                aria-controls="offcanvasLeft"
                                className="tf-btn-filter"
                            >
                                <span className="icon icon-filter" />
                                <span className="text">Filter</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <div
                className="offcanvas offcanvas-start canvas-filter mobile-filter-list"
                id="mobFilterShop"
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
                        <div className="tf-shop-sidebar bm-typ-sidebar">
                            <SidebarFilter
                                queries={filterQueries}
                                filterQueries={filterResponse}
                                setFilteredProducts={setFilteredProducts}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
