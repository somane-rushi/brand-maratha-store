"use client";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import APP_BASE_URL from "@/utlis/apiService";
import axios from "axios";
import FilterSidebar from "@/components/shop/FilterSidebar";
import APP_URL from "@/utlis/config";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

const ProductListing = () => {
    const [price, setPrice] = useState([10, 20]);
    const handlePrice = (value) => {
        setPrice(value);
    };
    const [filters, setFilters] = useState({
        categories: [],
        brands: [],
        colors: [],
        sizes: [],
        priceRange: { minPrice: "", maxPrice: "" },
    });

    const [selectedFilters, setSelectedFilters] = useState({
        categories: "",
        brands: "",
        colors: "",
        sizes: "",
        minPrice: "",
        maxPrice: "",
    });

    const [products, setProducts] = useState([]);
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    // Fetch filters on mount
    useEffect(() => {
        axios
            .get(`${APP_BASE_URL}/products/filters`)
            .then((response) => {
                if (response.data.success) {
                    setFilters(response.data.filters);
                }
            })
            .catch((error) => console.error("Error fetching filters:", error));
    }, []);

    useEffect(() => {
        if (query) {
            axios
                .get(`${APP_BASE_URL}/products/search?query=${query}`)
                .then((response) => {
                    if (response.data.success) {
                        setProducts(response.data.products);
                    }
                })
                .catch((error) =>
                    console.error("Error fetching search results:", error)
                );
        }
    }, [query]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSelectedFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Fetch filtered products
    const fetchFilteredProducts = () => {
        const queryParams = new URLSearchParams();

        if (selectedFilters.categories)
            queryParams.append("category", selectedFilters.categories);
        if (selectedFilters.brands)
            queryParams.append("brand", selectedFilters.brands);
        if (selectedFilters.colors)
            queryParams.append("color", selectedFilters.colors);
        if (selectedFilters.sizes)
            queryParams.append("sizes", selectedFilters.sizes);
        if (selectedFilters.minPrice)
            queryParams.append("minPrice", selectedFilters.minPrice);
        if (selectedFilters.maxPrice)
            queryParams.append("maxPrice", selectedFilters.maxPrice);

        const apiUrl = `${APP_BASE_URL}/products/filter?${queryParams.toString()}`;

        axios
            .get(apiUrl)
            .then((response) => {
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            })
            .catch((error) => console.error("Error fetching products:", error));
    };

    return (
        <>
            <Topbar1 />
            <Header />
            <section>
                <div className="bs-banner typ-position">
                    <div className="container-full h-100">
                        <div className="row h-100">
                            <div className="col-12">
                                <div className="content-wrapper h-100">
                                    <div className="heading">Women's Wear</div>
                                    <p className="para max-width">
                                        Elevate your wardrobe with Brand
                                        Maratha’s beautiful range of women's
                                        wear.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="flat-spacing-1 custom-product-list">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {/* <h2 className="title">Product Listing</h2> */}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            {/* Filters Section */}
                            <div className="filters">
                                <h4>Filters</h4>

                                {/* <div className="select-area">                               
                                        <select name="categories" onChange={handleFilterChange}>
                                            <option value="">Select Category</option>
                                            {filters.categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="select-area">                             
                                        <select name="brands" onChange={handleFilterChange}>
                                            <option value="">Select Brand</option>
                                            {filters.brands.map((brand) => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                        </div>

                                    <div className="select-area">                               
                                        <select name="colors" onChange={handleFilterChange}>
                                            <option value="">Select Color</option>
                                            {filters.colors.map((color) => (
                                                <option key={color.name} value={color.name}>
                                                    {color.name}
                                                </option>
                                            ))}
                                        </select>
                                        </div>

                                    <div className="select-area">                               
                                        <select name="sizes" onChange={handleFilterChange}>
                                            <option value="">Select Size</option>
                                            {filters.sizes.map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                        </div>
                                    
                                        <div className="price-range">
                                            <input
                                                className="priceRange"
                                                type="number"
                                                name="minPrice"
                                                placeholder="Min Price"
                                                onChange={handleFilterChange}
                                            />
                                            <input
                                                className="priceRange"
                                                type="number"
                                                name="maxPrice"
                                                placeholder="Max Price"
                                                onChange={handleFilterChange}
                                            />
                                        </div> */}

                                <div class="widget-facet wd-categories">
                                    <div
                                        class="facet-title"
                                        data-bs-target="#categories"
                                        data-bs-toggle="collapse"
                                        aria-expanded="true"
                                        aria-controls="categories"
                                    >
                                        <span>Product categories</span>
                                        <span class="icon icon-arrow-up"></span>
                                    </div>
                                    <div id="categories" class="collapse show">
                                        <ul class="list-categoris current-scrollbar mb_36">
                                            <li class="cate-item">
                                                <a href="/shop-default">
                                                    <span>Fashion</span>
                                                </a>
                                            </li>
                                            <li class="cate-item">
                                                <a href="/shop-men">
                                                    <span>Men</span>
                                                </a>
                                            </li>
                                            <li class="cate-item">
                                                <a href="/shop-women">
                                                    <span>Women</span>
                                                </a>
                                            </li>
                                            <li class="cate-item">
                                                <a href="/shop-default">
                                                    <span>Denim</span>
                                                </a>
                                            </li>
                                            <li class="cate-item">
                                                <a href="/shop-default">
                                                    <span>Dress</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <form
                                    action="#"
                                    id="facet-filter-form"
                                    class="facet-filter-form"
                                >
                                    <div class="widget-facet">
                                        <div
                                            class="facet-title"
                                            data-bs-target="#availability"
                                            data-bs-toggle="collapse"
                                            aria-expanded="true"
                                            aria-controls="availability"
                                        >
                                            <span>Availability</span>
                                            <span class="icon icon-arrow-up"></span>
                                        </div>
                                        <div
                                            id="availability"
                                            class="collapse show"
                                        >
                                            <ul class="tf-filter-group current-scrollbar mb_36">
                                                <li class="list-item d-flex gap-12 align-items-center">
                                                    <input
                                                        class="tf-check"
                                                        type="checkbox"
                                                        name="stock"
                                                    />
                                                    <label class="label">
                                                        <span>Available</span>
                                                        &nbsp;
                                                        <span>(9)</span>
                                                    </label>
                                                </li>
                                                <li class="list-item d-flex gap-12 align-items-center">
                                                    <input
                                                        class="tf-check"
                                                        type="checkbox"
                                                        name="stock"
                                                    />
                                                    <label class="label">
                                                        <span>
                                                            Out of Stock
                                                        </span>
                                                        &nbsp;
                                                        <span>(3)</span>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="widget-facet wrap-price custom-border">
                                        <div
                                            class="facet-title"
                                            data-bs-target="#price"
                                            data-bs-toggle="collapse"
                                            aria-expanded="true"
                                            aria-controls="price"
                                        >
                                            <span>Price</span>
                                            <span class="icon icon-arrow-up"></span>
                                        </div>
                                        <div id="price" class="collapse show">
                                            <div className="widget-price filter-price">
                                                <Slider
                                                    formatLabel={() => ``}
                                                    range
                                                    max={22}
                                                    min={5}
                                                    defaultValue={price}
                                                    onChange={(value) =>
                                                        handlePrice(value)
                                                    }
                                                    id="slider"
                                                />
                                                <div className="box-title-price">
                                                    <span className="title-price">
                                                        Price :
                                                    </span>
                                                    <div className="caption-price">
                                                        <div>
                                                            <span>$</span>
                                                            <span className="min-price">
                                                                {Array.isArray(
                                                                    price
                                                                )
                                                                    ? price[0]
                                                                    : ""}
                                                            </span>
                                                        </div>
                                                        <span>-</span>
                                                        <div>
                                                            <span>$</span>
                                                            <span className="max-price">
                                                                {Array.isArray(
                                                                    price
                                                                )
                                                                    ? price[1]
                                                                    : ""}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                <div class="widget-facet">
                                    <div
                                        class="facet-title"
                                        data-bs-target="#size"
                                        data-bs-toggle="collapse"
                                        aria-expanded="true"
                                        aria-controls="size"
                                    >
                                        <span>Size</span>
                                        <span class="icon icon-arrow-up"></span>
                                    </div>
                                    <div id="size" class="collapse show">
                                        <ul class="tf-filter-group current-scrollbar mb_36">
                                            <li class="list-item d-flex gap-12 align-items-center">
                                                <input
                                                    class="tf-check tf-check-size"
                                                    readonly=""
                                                    type="radio"
                                                />
                                                <label class="label">
                                                    <span>S</span>&nbsp;
                                                    <span>(9)</span>
                                                </label>
                                            </li>
                                            <li class="list-item d-flex gap-12 align-items-center">
                                                <input
                                                    class="tf-check tf-check-size"
                                                    readonly=""
                                                    type="radio"
                                                />
                                                <label class="label">
                                                    <span>M</span>&nbsp;
                                                    <span>(11)</span>
                                                </label>
                                            </li>
                                            <li class="list-item d-flex gap-12 align-items-center">
                                                <input
                                                    class="tf-check tf-check-size"
                                                    readonly=""
                                                    type="radio"
                                                />
                                                <label class="label">
                                                    <span>L</span>&nbsp;
                                                    <span>(11)</span>
                                                </label>
                                            </li>
                                            <li class="list-item d-flex gap-12 align-items-center">
                                                <input
                                                    class="tf-check tf-check-size"
                                                    readonly=""
                                                    type="radio"
                                                />
                                                <label class="label">
                                                    <span>XL</span>&nbsp;
                                                    <span>(7)</span>
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <button
                                    onClick={fetchFilteredProducts}
                                    className="tf-btn style-2 btn-fill rounded animate-hover-btn"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                        <div className="col-md-9">
                            {/* Products Section */}
                            <div className="products tf-shop-content wrapper-control-shop">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="card-product fl-item"
                                        >
                                            <a className="product-img">
                                                <img
                                                    className="lazyload img-product"
                                                    src={
                                                        `${APP_URL}/${product?.thumbnail_image}` ||
                                                        null
                                                    }
                                                    alt="product-image"
                                                />
                                            </a>
                                            <div class="card-product-info">
                                                <a
                                                    class="title link"
                                                    href={product.id}
                                                >
                                                    {product.name}
                                                </a>
                                                <span class="price">
                                                    Price: ₹{product.base_price}
                                                </span>
                                            </div>
                                            {/* <h3>{product.name}</h3>
                                    <p>Price: ₹{product.base_price}</p> */}
                                        </div>
                                    ))
                                ) : (
                                    <p>No products found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer1 />
        </>
    );
};

export default ProductListing;
