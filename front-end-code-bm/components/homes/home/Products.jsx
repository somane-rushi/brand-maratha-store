"use client";
import { ProductCard } from "@/components/shopCards/ProductCard";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import {
    fetchBestSellers,
    fetchNewArrivals,
    fetchShopByBrands,
} from "@/utlis/apiService";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";
import { BrandCard } from "@/components/shopCards/BrandCard";

export default function Products() {
    const tabs = ["Brands", "New arrivals", "Best Sellers"];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(4);
    const [brands, setBrands] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);

                const [brandData, newArrivalsData, bestSellersData] =
                    await Promise.all([
                        fetchShopByBrands(),
                        fetchNewArrivals(),
                        fetchBestSellers(),
                    ]);

                setBrands(brandData);
                setNewArrivals(newArrivalsData);
                setBestSellers(bestSellersData);
            } catch (error) {
                console.error("Error fetching product data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, [activeTab]);

    const filtered = useMemo(() => {
        switch (activeTab) {
            case "New arrivals":
                return newArrivals;
            case "Best Sellers":
                return bestSellers;
            default:
                return brands;
        }
    }, [activeTab, newArrivals, bestSellers, brands]);

    return (
        <section className="flat-spacing-31">
            <div className="container">
                <div className="bs-heading text-center">
                    <h2 className="hd">{t("shop_by", language)}</h2>
                </div>

                <div className="flat-animate-tab">
                    <ul className="widget-tab-3 d-flex justify-content-center wow fadeInUp">
                        {tabs.map((tab, index) => (
                            <li
                                onClick={() => setActiveTab(tab)}
                                className="nav-tab-item"
                                role="presentation"
                                key={index}
                            >
                                <a
                                    className={
                                        activeTab === tab ? "active" : ""
                                    }
                                >
                                    {tab}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane active show">
                            <div className="grid-layout" data-grid="grid-4">
                                {(activeTab === "Brands"
                                    ? brands.slice(0, visibleCount)
                                    : filtered.slice(0, visibleCount)
                                ).map((item, i) =>
                                    activeTab === "Brands" ? (
                                        <BrandCard
                                            brand={item}
                                            key={item?.id || i}
                                        />
                                    ) : (
                                        <ProductCard
                                            product={item}
                                            key={item?.id || i}
                                        />
                                    )
                                )}
                            </div>

                            {visibleCount < filtered.length && (
                                <div className="tf-pagination-wrap view-more-button text-center">
                                    <button
                                        className={`tf-btn-loading tf-loading-default style-2 btn-loadmore ${
                                            loading ? "loading" : ""
                                        }`}
                                        onClick={() =>
                                            setVisibleCount((prev) => prev + 4)
                                        }
                                    >
                                        <span className="text">
                                            {t("load_more", language)}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                </div>
            </div>
        </section>
    );
}
