"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import {
    fetchColorsByProductId,
    fetchSizesByProductId,
    fetchFinalPrice,
    fetchSizesWithColors,
    addToCart,
    fetchratings,
    fetchColorById,
} from "@/utlis/apiService";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import CountdownComponent from "../common/Countdown";
// import {
//     colors,
//     paymentImages,
//     sizeOptions,
// } from "@/data/singleProductOptions";
// import StickyItem from "./StickyItem";
// import Quantity from "./Quantity";

import Slider1ZoomOuter from "./sliders/Slider1ZoomOuter";
// import { allProducts } from "@/data/products";
import { useContextElement } from "@/context/Context";
// import { openCartModal } from "@/utlis/openCartModal";
import Tab2 from "./Tab2";

export default function DetailsOuterZoom({ product, isLoading }) {
    const { id } = useParams();
    // const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [currentColor, setCurrentColor] = useState(null);
    const [varient, setVarient] = useState([]);
    const [currentSize, setCurrentSize] = useState(null);
    // const [finalPrice, setFinalPrice] = useState("");
    // const [isAddToCartEnabled, setIsAddToCartEnabled] = useState(false);
    // const [isCartDisabled, setIsCartDisabled] = useState(true);
    // const [cartUpdated, setCartUpdated] = useState(false);
    // const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState([]);
    // const [isDuplicateVariant, setIsDuplicateVariant] = useState(false);

    // useEffect(() => {
    //   if (product?.id) {
    //     fetchColorsByProductId(product.id).then((data) => {
    //       console.log("Fetched Colors:", data);
    //       if (data.success) {
    //         setColors(data.data);
    //         setCurrentColor(data.data[0] || null);
    //       }
    //     });

    //     fetchSizesByProductId(product.id).then((data) => {
    //       console.log("Fetched Sizes:", data);
    //       if (data.success) {
    //         setSizes(data.data);
    //         setCurrentSize(data.data[0] || null);
    //       }
    //     });
    //   }
    // }, [product]);

    useEffect(() => {
        if (product?.id) {
            fetchSizesWithColors(product.id).then(setSizes);
        }
    }, [product]);

    const handleColor = async (color) => {
        setCurrentColor(color);

        try {
            const { data } = await fetchColorById(color.id);

            const imageArray = [
                data.image1,
                data.image2,
                data.image3,
                data.image4,
                data.image5,
            ].filter(Boolean);

            setVarient({
                ...data,
                images: imageArray,
            });
        } catch (error) {
            console.error("Failed to fetch color details:", error);
            setVarient([]);
        }
    };

    useEffect(() => {
        const getratings = async () => {
            const data = await fetchratings(id);
            setRating(data);
        };

        getratings();
    }, []);

    // const handleColorSelect = async (color) => {
    //   if (color.stock === 0) return; // Prevent selecting out-of-stock colors
    //   setCurrentColor(color);
    //   if (currentSize) {
    //     await updateFinalPrice(currentSize.id, color.id);
    //   }
    //   checkAddToCart(currentSize, color);
    // };

    // const handleSizeSelect = async (size) => {
    //   if (size.stock === 0) return; // Prevent selecting out-of-stock sizes
    //   setCurrentSize(size);
    //   if (currentColor) {
    //     await updateFinalPrice(size.id, currentColor.id);
    //   }
    //   checkAddToCart(size, currentColor);
    // };

    // useEffect(() => {
    //     if (currentSize && currentColor && finalPrice !== null) {
    //         fetchFinalPrice(product.id, currentSize.id, currentColor.id).then(
    //             (price) => setFinalPrice(price)
    //         );
    //         setIsAddToCartEnabled(true);
    //     } else {
    //         setIsAddToCartEnabled(false);
    //     }
    // }, [currentSize, currentColor, product, finalPrice]);

    // useEffect(() => {
    //     console.log("Final Price", finalPrice);
    // }, [finalPrice]);

    // const updateFinalPrice = async (sizeId, colorId) => {
    //     if (!sizeId || !colorId) return;

    //     try {
    //         const price = await fetchFinalPrice(product.id, sizeId, colorId);
    //         if (price) {
    //             setFinalPrice(price);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching final price:", error);
    //     }
    // };

    // const checkAddToCart = (size, color) => {
    //     if (size && color && size.stock > 0 && color.stock > 0) {
    //         setIsAddToCartEnabled(true);
    //     } else {
    //         setIsAddToCartEnabled(false);
    //     }
    // };

    const handleAddToCart = async (price) => {
        try {
            const userId = localStorage.getItem("id");

            if (!userId) {
                window.location.href = "/login";
                return;
            }

            const payload = {
                userId: Number(userId),
                productId: product.id,
                quantity: 1,
                size: currentSize.size,
                color: currentColor.color,
                price: Number(price),
            };

            const { success } = await addToCart(payload);

            console.log("Add to cart res: ", success);

            if (success === true) {
                addProductToCart(
                    product.id,
                    1,
                    currentSize?.size,
                    currentColor?.color
                );
                toast.success("Product added to cart successfully!");
                // setCartUpdated(true);
            }
        } catch (error) {
            toast.error(
                error?.message ||
                    "Failed to add product to cart. Please try again."
            );
        }
    };

    useEffect(() => {
        if (!currentSize && sizes.length > 0) {
            const sizeWithInStockColor = sizes.find(
                (s) => s.colors && s.colors.some((c) => c.stock > 0)
            );

            if (sizeWithInStockColor) {
                setCurrentSize(sizeWithInStockColor);
            }
        }
    }, [sizes, currentSize]);

    useEffect(() => {
        if (
            currentSize &&
            currentSize.colors &&
            currentSize.colors.length > 0 &&
            !currentColor
        ) {
            const inStockColor = currentSize.colors.find((c) => c.stock > 0);
            if (inStockColor) {
                setCurrentColor(inStockColor);
                handleColor(inStockColor);
            }
        }
    }, [currentSize, currentColor]);

    useEffect(() => {
        async function fetchProductOptions() {
            try {
                const sizesResponse = await api.get(
                    `/products/${product.id}/sizes`
                );
                setSizes(sizesResponse.data);

                // const colorsResponse = await api.get(
                //     `/products/${product.id}/colors`
                // );
                // setColors(colorsResponse.data);
            } catch (error) {
                console.error("Error fetching sizes and colors:", error);
            }
        }

        fetchProductOptions();
    }, [product.id]);

    // if (isLoading) return <span>Loading...</span>;

    const {
        addProductToCart,
        isAddedToCartProducts,
        // addToCompareItem,
        // isAddedtoCompareItem,
        addToWishlist,
        isAddedtoWishlist,
    } = useContextElement();

    if (isLoading) return <span>{isLoading}</span>;
    return (
        <section
            className="flat-spacing-4 pt_0 bs-productDetails"
            style={{ maxWidth: "100vw", overflow: "clip" }}
        >
            <ToastContainer position="top-right" autoClose={3000} />
            <div
                className="tf-main-product section-image-zoom"
                style={{ maxWidth: "100vw", overflow: "clip" }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="tf-product-media-wrap sticky-top">
                                <div className="thumbs-slider">
                                    <Slider1ZoomOuter
                                        varientImages={varient.images}
                                        productId={product.id}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="tf-product-info-wrap position-relative">
                                <div className="tf-zoom-main" />
                                <div className="tf-product-info-list other-image-zoom">
                                    <div className="tf-product-info-title">
                                        <div className="name-section">
                                            <h5 className="productTitle">
                                                {product?.name}
                                            </h5>
                                            <p className="productSubtitle">
                                                {product?.subname}
                                            </p>
                                        </div>
                                        <div className="like-item">
                                            <a
                                                onClick={() =>
                                                    addToWishlist(product.id)
                                                }
                                                className="tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action"
                                            >
                                                <span
                                                    className={`icon icon-heart ${
                                                        isAddedtoWishlist(
                                                            product.id
                                                        ) && "added"
                                                    }`}
                                                    style={{
                                                        color: isAddedtoWishlist(
                                                            product.id
                                                        )
                                                            ? "red"
                                                            : "",
                                                    }}
                                                />
                                                <span className="icon icon-delete" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="price-section">
                                        <div className="flex-item">
                                            <div className="price-group">
                                                <div className="tf-product-info-price">
                                                    <div className="price-on-sale">
                                                        Rs. {varient.final_mrp}
                                                    </div>
                                                </div>
                                                <div className="noterMrp">
                                                    <p className="d-block">
                                                        MRP Inclusive of taxes
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="custom-rating">
                                                <div className="rating">
                                                    <i className="icon-start" />
                                                    <span>
                                                        {Number(
                                                            rating.average_rating
                                                        ).toFixed(1)}{" "}
                                                        <span>
                                                            (
                                                            {
                                                                rating.total_reviews
                                                            }
                                                            )
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="short-description">
                                            {product.description}
                                        </p>
                                    </div>
                                    <div className="variant-picker-item">
                                        <div className="variant-picker-label find-size">
                                            <div>
                                                Size:
                                                <span className="fw-6 variant-picker-label-value">
                                                    {currentSize
                                                        ? currentSize.size
                                                        : "No size selected"}
                                                </span>
                                            </div>
                                            <a
                                                href="#find_size"
                                                data-bs-toggle="modal"
                                                className="find-size "
                                            >
                                                Find your size
                                            </a>
                                        </div>

                                        <form className="variant-picker-values">
                                            {sizes.length > 0 ? (
                                                sizes.map((size) => {
                                                    return (
                                                        <React.Fragment
                                                            key={size.id}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="size"
                                                                id={`size-${size.id}`}
                                                                readOnly
                                                                checked={
                                                                    currentSize?.id ===
                                                                    size.id
                                                                }
                                                                disabled={
                                                                    size.stock <=
                                                                    0
                                                                }
                                                            />
                                                            <label
                                                                onClick={() => {
                                                                    setCurrentSize(
                                                                        size
                                                                    );
                                                                    setCurrentColor(
                                                                        null
                                                                    );
                                                                }}
                                                                className={`style-text ${
                                                                    size.stock <=
                                                                    0
                                                                        ? "disabled"
                                                                        : ""
                                                                }`}
                                                                htmlFor={`size-${size.id}`}
                                                            >
                                                                <p>
                                                                    {size.size}{" "}
                                                                    {size.stock <=
                                                                        0 &&
                                                                        "(Out of Stock)"}
                                                                </p>
                                                            </label>
                                                        </React.Fragment>
                                                    );
                                                })
                                            ) : (
                                                <p>No sizes available</p>
                                            )}
                                        </form>
                                    </div>
                                    <div className="variant-picker-item">
                                        <div className="variant-picker-label">
                                            Color:
                                            <span className="fw-6 variant-picker-label-value">
                                                {currentColor
                                                    ? currentColor.color
                                                    : "No color selected"}
                                            </span>
                                        </div>
                                        <form className="variant-picker-values">
                                            {currentSize ? (
                                                currentSize.colors.length >
                                                0 ? (
                                                    currentSize.colors.map(
                                                        (color) => (
                                                            <React.Fragment
                                                                key={color.id}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="color"
                                                                    id={`color-${color.id}`}
                                                                    readOnly
                                                                    checked={
                                                                        currentColor?.id ===
                                                                        color.id
                                                                    }
                                                                    disabled={
                                                                        color.stock <=
                                                                        0
                                                                    }
                                                                />
                                                                <label
                                                                    onClick={() =>
                                                                        color.stock >
                                                                            0 &&
                                                                        handleColor(
                                                                            color
                                                                        )
                                                                    }
                                                                    className={`hover-tooltip radius-60 ${
                                                                        color.stock <=
                                                                        0
                                                                            ? "disabled"
                                                                            : ""
                                                                    }`}
                                                                    htmlFor={`color-${color.id}`}
                                                                    style={{
                                                                        cursor:
                                                                            color.stock >
                                                                            0
                                                                                ? "pointer"
                                                                                : "not-allowed",
                                                                        opacity:
                                                                            color.stock >
                                                                            0
                                                                                ? 1
                                                                                : 0.5,
                                                                    }}
                                                                >
                                                                    <span
                                                                        className="btn-checkbox"
                                                                        style={{
                                                                            backgroundColor:
                                                                                color.color_code,
                                                                        }}
                                                                    />
                                                                    <span className="tooltip">
                                                                        {
                                                                            color.color
                                                                        }{" "}
                                                                        {color.stock <=
                                                                        0
                                                                            ? "(Out of Stock)"
                                                                            : ""}
                                                                    </span>
                                                                </label>
                                                            </React.Fragment>
                                                        )
                                                    )
                                                ) : (
                                                    <p>
                                                        No colors available for
                                                        this size
                                                    </p>
                                                )
                                            ) : (
                                                <p>Select a size first</p>
                                            )}
                                        </form>
                                    </div>
                                    <div className="tf-product-info-buy-button">
                                        <form
                                            onSubmit={(e) => e.preventDefault()}
                                        >
                                            <div className="w-100">
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleAddToCart(
                                                            varient.final_mrp
                                                        );
                                                    }}
                                                    className={`tf-btn justify-content-center fw-5 fs-16 flex-grow-1 animate-hover-btn btns-full border-radius-0`}
                                                >
                                                    <span>
                                                        {isAddedToCartProducts(
                                                            product.id,
                                                            currentSize?.size,
                                                            currentColor?.color
                                                        )
                                                            ? "Already Added"
                                                            : "Add to cart"}
                                                    </span>
                                                    {varient.final_mrp}
                                                </a>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="tf-product-info-extra-link">
                                        <a
                                            href="#delivery_return"
                                            data-bs-toggle="modal"
                                            className="tf-product-extra-icon"
                                        >
                                            <div className="icon">
                                                <Image
                                                    alt="image"
                                                    src="/images/brand-maratha/icon/tempo.svg"
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                            <div className="text">
                                                Delivery &amp; Return
                                            </div>
                                        </a>
                                        <a
                                            href="#ask_question"
                                            data-bs-toggle="modal"
                                            className="tf-product-extra-icon"
                                        >
                                            <div className="icon">
                                                <Image
                                                    alt="image"
                                                    src="/images/brand-maratha/icon/question-circle.svg"
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                            <div className="text">
                                                Ask a question
                                            </div>
                                        </a>
                                        <a
                                            href="#share_social"
                                            data-bs-toggle="modal"
                                            className="tf-product-extra-icon"
                                        >
                                            <div className="icon">
                                                <Image
                                                    alt="image"
                                                    src="/images/brand-maratha/icon/share.svg"
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                            <div className="text">Share</div>
                                        </a>
                                    </div>
                                    <div className="tf-product-info-delivery-return">
                                        <div className="row">
                                            <div className="col-xl-6 col-12">
                                                <div className="tf-product-delivery">
                                                    <div className="icon">
                                                        <Image
                                                            alt="image"
                                                            src="/images/brand-maratha/icon/return.svg"
                                                            width={32}
                                                            height={32}
                                                        />
                                                    </div>
                                                    <p>
                                                        Return within{" "}
                                                        <span className="fw-6">
                                                            {" "}
                                                            30 days{" "}
                                                        </span>
                                                        of purchase. Duties &
                                                        taxes are
                                                        non-refundable.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-12">
                                                <div className="tf-product-delivery mb-0">
                                                    <div className="icon">
                                                        <Image
                                                            alt="image"
                                                            src="/images/brand-maratha/icon/delivery.svg"
                                                            width={32}
                                                            height={32}
                                                        />
                                                    </div>
                                                    <p className="max-150">
                                                        <span className="fw-7">
                                                            2-7 days
                                                        </span>{" "}
                                                        delivery within India
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Tab2 />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>{" "}
        </section>
    );
}
