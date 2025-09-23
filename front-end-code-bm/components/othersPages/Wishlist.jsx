"use client";
import { allProducts } from "@/data/products";
import { useContextElement } from "@/context/Context";
import { useEffect, useState } from "react";
import { ProductCardWishlist } from "../shopCards/ProductCardWishlist";

import Link from "next/link";
import {
    handleEmptyWishlistService,
    handleWishlistByUserService,
} from "@/utlis/apiService";

export default function Wishlist() {
    const [wishListItems, setWishListItems] = useState([]);
    const [message, setMessage] = useState("");
    const { wishList, removeFromWishlist } = useContextElement();
    const userId =
        typeof window !== "undefined" ? localStorage.getItem("id") : "";
    const { emptyWishlist } = useContextElement();

    useEffect(() => {
  async function fetchWishlistItems() {
    if (!wishList || wishList.length === 0) {
      setWishListItems([]);
      return;
    }

    try {
      const result = await handleWishlistByUserService(userId);
      setWishListItems(result.data); // assumes this returns product objects
    } catch (err) {
      console.error("Failed to fetch wishlist items:", err);
    }
  }

  fetchWishlistItems();
}, [wishList]);
const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    // onRemove?.(productId); // Notify parent to remove from list
  };

    async function handleEmptyWishlist() {
        try {
            const result = await handleEmptyWishlistService(userId);
            setMessage(result?.data?.message);
            handleRemove();
            handleWishlist(userId);
        } catch (err) {
            setMessage(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message
            );
        } finally {
            setTimeout(() => {
                setMessage("");
            }, 2000);
        }
    }

    return (
        <section className="flat-spacing-36 bs-wishlist">
            <div className="container">
                {/* <div className="wishList-links">
                    {message && <span>{message}</span>}
                    <button
                        onClick={handleEmptyWishlist}
                        className="tf-btn btn-line line-height-normal fw-6 removeLink"
                    >
                        Remove All
                    </button>
                </div> */}
            </div>
            <div className="container">
                <div className="grid-layout wrapper-shop" data-grid="grid-4">
                    {wishListItems.map((elm, i) => (
                        <ProductCardWishlist key={i} product={elm} onRemove={(id) => removeFromWishlist(id)}/>
                    ))}
                </div>
                {!wishListItems.length && (
                    <>
                        <div
                            className="row align-items-center w-100"
                            style={{ rowGap: "20px" }}
                        >
                            <div className="col-lg-3 col-md-6 fs-18">
                                Your wishlist is empty
                            </div>
                            <div className="col-lg-3  col-md-6">
                                <Link
                                    href={`/shop-default`}
                                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                                >
                                    Explore Products!
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

