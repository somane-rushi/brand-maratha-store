"use client";
import { useEffect, useState } from "react";
import Slider from "rc-slider";
import { fetchFilteredProducts } from "@/utlis/apiService";
// import { ProductCountContext } from "@/context/ProductCountContext";

export default function SidebarFilter({
    queries,
    filterQueries,
    setFilteredProducts,
}) {
    // const { setProductCount } = useContext(ProductCountContext);
    const [filters, setFilters] = useState({
        genders: [],
        categories: [],
        subcategories: [],
        items: [],
        brands: [],
        colors: [],
        price_range: { min: 0, max: 1000 },
    });

    const [checkedFilters, setCheckedFilters] = useState({
        genders: [],
        categories: [],
        subcategories: [],
        items: [],
        brands: [],
        colors: [],
    });

    const [price, setPrice] = useState([0, 1000]);

    const [openSections, setOpenSections] = useState({
        gender: true,
        category: true,
        brand: true,
        color: true,
        price: true,
    });

    const toggleSection = (key) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const normalizeArray = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) {
            return value.flatMap((v) =>
                v.split(",").map((s) => s.trim().toLowerCase())
            );
        }
        return value.split(",").map((v) => v.trim().toLowerCase());
    };

    useEffect(() => {
        if (filterQueries) {
            setFilters({
                genders: filterQueries.catalogues || [],
                categories: filterQueries.categories || [],
                subcategories: filterQueries.subcategories || [],
                items: filterQueries.items || [],
                brands: filterQueries.brands || [],
                colors: filterQueries.colors || [],
                price_range: filterQueries.price_range || { min: 0, max: 1000 },
            });

            setPrice([
                filterQueries.price_range?.min || 0,
                filterQueries.price_range?.max || 1000,
            ]);
        }

        if (queries) {
            setCheckedFilters({
                genders: normalizeArray(queries.catalogue),
                categories: normalizeArray(queries.category),
                subcategories: normalizeArray(queries.subcategory),
                items: normalizeArray(queries.item),
                brands: normalizeArray(queries.brands),
                colors: normalizeArray(queries.colors),
                traditional: normalizeArray(queries.traditional),
            });
        }
    }, [filterQueries, queries]);

    const toggleValue = (type, value) => {
        const lowerVal = value.toLowerCase();
        setCheckedFilters((prev) => {
            const updated = prev[type].includes(lowerVal)
                ? prev[type].filter((v) => v !== lowerVal)
                : [...prev[type], lowerVal];
            return { ...prev, [type]: updated };
        });
    };

    const buildFilterObject = () => {
        const uniqueCategories = checkedFilters.categories.filter(
            (val) =>
                !checkedFilters.subcategories.includes(val) &&
                !checkedFilters.items.includes(val)
        );
        const uniqueSubcategories = checkedFilters.subcategories.filter(
            (val) => !checkedFilters.items.includes(val)
        );

        return {
            catalogue: checkedFilters.genders,
            category: uniqueCategories,
            subcategory: uniqueSubcategories,
            item: checkedFilters.items,
            brands: checkedFilters.brands,
            colors: checkedFilters.colors,
            minPrice: price[0],
            maxPrice: price[1],
            traditional: checkedFilters.traditional,
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            const filters = buildFilterObject();
            const data = await fetchFilteredProducts(filters);

            if (typeof setFilteredProducts === "function") {
                setFilteredProducts(data || []);
                // setProductCount?.(data?.length || 0);
            }
        };

        fetchData();
    }, [checkedFilters, price]);

    const clearFilters = () => {
        setCheckedFilters({
            genders: [],
            categories: [],
            subcategories: [],
            items: [],
            brands: [],
            colors: [],
            traditional: [],
        });
        setPrice([
            filters.price_range.min || 0,
            filters.price_range.max || 1000,
        ]);
    };

    const renderFilterList = (title, list, key) => (
        <div className="widget-facet">
            <div
                className="facet-title filter-element d-flex justify-between cursor-pointer"
                onClick={() => toggleSection(key)}
            >
                <span>{title}</span>
                <span>{openSections[key] ? "▲" : "▼"}</span>
            </div>
            {openSections[key] && (
                <ul className="tf-filter-group">
                    {list.map((item) => (
                        <li key={item}>
                            <input
                                type="checkbox"
                                checked={checkedFilters[key]
                                    .map((v) => v.toLowerCase())
                                    .includes(item.toLowerCase())}
                                onChange={() => toggleValue(key, item)}
                            />
                            <label>{item}</label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    const renderCategoryList = () => {
        const displayCategories = [
            ...(filters.categories || []).map((val) => ({
                value: val,
                type: "categories",
            })),
            ...(filters.subcategories || []).map((val) => ({
                value: val,
                type: "subcategories",
            })),
            ...(filters.items || []).map((val) => ({
                value: val,
                type: "items",
            })),
        ];

        return (
            <div className="widget-facet">
                <div
                    className="facet-title filter-element d-flex justify-between cursor-pointer"
                    onClick={() => toggleSection("category")}
                >
                    <span>Category</span>
                    <span>{openSections.category ? "▲" : "▼"}</span>
                </div>
                {openSections.category && (
                    <ul className="tf-filter-group">
                        {displayCategories.map(({ value, type }) => (
                            <li key={`${type}-${value}`}>
                                <input
                                    type="checkbox"
                                    checked={checkedFilters[type]
                                        .map((v) => v.toLowerCase())
                                        .includes(value.toLowerCase())}
                                    onChange={() => toggleValue(type, value)}
                                />
                                <label>{value}</label>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <div className="tf-shop-sidebar wrap-sidebar-mobile bm-typ-sidebar">
            <div className="bm-filter-text">Filter by</div>

            {renderFilterList("Gender", filters.genders, "genders")}
            {renderCategoryList()}
            {renderFilterList("Brand", filters.brands, "brands")}
            {renderFilterList("Color", filters.colors, "colors")}

            <div className="widget-facet wrap-price">
                <div
                    className="facet-title filter-element d-flex justify-between cursor-pointer"
                    onClick={() => toggleSection("price")}
                >
                    <span>Price</span>
                    <span>{openSections.price ? "▲" : "▼"}</span>
                </div>
                {openSections.price && (
                    <div className="widget-price filter-price">
                        <Slider
                            range
                            min={filters.price_range.min}
                            max={filters.price_range.max}
                            value={price}
                            onChange={setPrice}
                        />
                        <div className="box-title-price">
                            <span className="title-price">Price:</span>
                            <div className="caption-price">
                                <span>Rs {price[0]}</span> -{" "}
                                <span>Rs {price[1]}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button className="tf-btn btn-fill mt-3" onClick={clearFilters}>
                Clear Filters
            </button>
        </div>
    );
}
