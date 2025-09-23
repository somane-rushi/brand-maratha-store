import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import APP_URL from "@/utlis/config";

export const ProductCard = ({ product }) => {
    const { addToWishlist, isAddedtoWishlist } = useContextElement();

    return (
        <div className="product-list">
            <div className="card-product fl-item" key={product?.id}>
                <div className="card-product-wrapper">
                    <Link
                        href={`/product-detail/${product?.id}`}
                        className="product-img"
                    >
                        <Image
                            className="lazyload img-product"
                            data-src={`${APP_URL}/${
                                Array.isArray(product?.images)
                                    ? product?.images[0]
                                    : ""
                            }`}
                            src={`${APP_URL}/${
                                Array.isArray(product?.images)
                                    ? product?.images[0]
                                    : ""
                            }`}
                            alt={product?.name}
                            width={720}
                            height={1005}
                        />
                        <Image
                            className="lazyload img-hover"
                            data-src={`${APP_URL}/${
                                Array.isArray(product?.images)
                                    ? product?.images[1]
                                    : ""
                            }`}
                            src={`${APP_URL}/${
                                Array.isArray(product?.images)
                                    ? product?.images[1]
                                    : ""
                            }`}
                            alt="image-product"
                            width={720}
                            height={1005}
                        />
                    </Link>
                    <div className="list-product-btn typ-product-detailpage">
                        <a
                            onClick={() => addToWishlist(product?.id)}
                            className="box-icon wishlist btn-icon-action"
                        >
                            <span
                                className={`icon icon-heart ${
                                    isAddedtoWishlist(product?.id)
                                        ? "added"
                                        : ""
                                }`}
                            />
                        </a>
                    </div>
            
                </div>
                <div className="card-product-info">
                    <Link
                        href={`/product-detail/${product?.id}`}
                        className="title link"
                    >
                        {product?.name}
                    </Link>
                    <span className="price">
                        ₹{parseFloat(product?.final_mrp).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};
