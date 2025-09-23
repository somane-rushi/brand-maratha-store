"use client";

import React, { createContext, useEffect, useContext, useState } from "react";
import { allProducts } from "@/data/products";
import {
    handleDeleteFromWishlistService,
    handleWishlistService,
} from "@/utlis/apiService";
import { openCartModal } from "@/utlis/openCartModal";

const DataContext = createContext();

export const useContextElement = () => {
    return useContext(DataContext);
};

export default function Context({ children }) {
    const [cartProducts, setCartProducts] = useState([]);
    const [wishList, setWishList] = useState([]);
    const [compareItem, setCompareItem] = useState([]);
    const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
    const [quickAddItem, setQuickAddItem] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const subtotal = cartProducts.reduce(
                (acc, product) => acc + product.quantity * product.price,
                0
            );
            setTotalPrice(subtotal);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCart = localStorage.getItem("cartList");
            if (storedCart) {
                try {
                    const parsed = JSON.parse(storedCart);
                    if (Array.isArray(parsed)) {
                        setCartProducts(parsed);
                    }
                } catch (e) {
                    console.error(
                        "Failed to parse cartList from localStorage:",
                        e
                    );
                }
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("cartList", JSON.stringify(cartProducts));
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedWishlist = JSON.parse(localStorage.getItem("wishlist"));
            if (storedWishlist?.length) setWishList(storedWishlist);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("wishlist", JSON.stringify(wishList));
        }
    }, [wishList]);

    const addProductToCart = (id, qty, size, color) => {
        console.log(
            "🛒 addProductToCart CALLED for ID:",
            id,
            "Qty:",
            qty,
            "Size:",
            size,
            "Color:",
            color
        );

        const found = allProducts.find((elm) => elm.id === id);
        if (!found) {
            console.warn("❌ Product not found for ID:", id);
            return;
        }

        const newItem = {
            ...found,
            quantity: qty || 1,
            size: size, // Include size
            color: color, // Include color
        };

        console.log("✅ New item to add:", newItem);
        const updatedCart = [...cartProducts, newItem];
        setCartProducts(updatedCart);

        console.log("📝 Updated cart written to localStorage:", updatedCart);
    };

    const addToWishlist = async (productId) => {
        if (typeof window !== "undefined") {
            const userId = localStorage.getItem("id");

            if (!wishList.includes(productId)) {
                try {
                    await handleWishlistService(userId, productId);
                    setWishList((prev) => [...prev, productId]);
                } catch (err) {
                    console.error("wishlist error", err);
                }
            } else {
                try {
                    await handleDeleteFromWishlistService(userId, productId);
                    setWishList((prev) =>
                        prev.filter((elm) => elm !== productId)
                    );
                } catch (err) {
                    console.error("wishlist error", err);
                }
            }
        }
    };

    const isAddedToCartProducts = (id, size, color) => {
        return cartProducts.some(
            (item) =>
                item.id === id && item.size === size && item.color === color
        );
    };

    const isAddedtoWishlist = (id) => {
        return wishList.includes(id);
    };

    const isAddedtoCompareItem = () => {
        return false;
    };
    const removeFromWishlist = async (productId) => {
        const userId = localStorage.getItem("id");

        try {
            await handleDeleteFromWishlistService(userId, productId);

            const updatedList = wishList.filter((id) => id !== productId);
            setWishList(updatedList);
            localStorage.setItem("wishlist", JSON.stringify(updatedList)); // ✅ Update localStorage
        } catch (err) {
            console.error("Failed to remove from wishlist", err);
        }
    };

    const contextValue = {
        cartProducts,
        setCartProducts,
        totalPrice,
        addProductToCart,
        wishList,
        addToWishlist,
        quickViewItem,
        setQuickViewItem,
        quickAddItem,
        setQuickAddItem,
        compareItem,
        setCompareItem,
        isAddedToCartProducts,
        isAddedtoWishlist,
        isAddedtoCompareItem,
        removeFromWishlist,
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
}
