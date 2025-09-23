"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import APP_URL from "@/utlis/config";
import {
    handleEmptyWishlistService,
    handleWishlistByUserService,
} from "@/utlis/apiService";
import CountdownComponent from "../common/Countdown";
export const ProductCardWishlist = ({ product , onRemove }) => {
  const [currentImage, setCurrentImage] = useState(product.thumbnail_image);
  const { setQuickViewItem } = useContextElement();
  const { removeFromWishlist } = useContextElement();
  
  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    onRemove?.(productId);
  };
  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();

  return (
    <div className="card-product fl-item" key={product.product_id}>
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.product_id}`} className="product-img">
          <Image
            className="lazyload img-product"
            data-src={product.thumbnail_image}
            src={`${APP_URL}/${currentImage}`}
            alt="image-product"
            width={720}
            height={1005}
          />
          <Image
            className="lazyload img-hover"
            data-src={
             `${APP_URL}/${product.thumbnail_image}`
            }
            src={`${APP_URL}/${product.thumbnail_image}`}
            alt="image-product"
            width={720}
            height={1005}
          />
        </Link>
        <div className="list-product-btn type-wishlist">
          <a
            onClick={() => handleRemove(product.product_id)}
            className="box-icon bg_white wishlist"
          >
            <span className="tooltip">Remove Wishlist</span>
            <span className="icon icon-heart-full" />
          </a>
        </div>

        
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.product_id}`} className="title link">
          {product.title}
        </Link>
        <span className="price">Rs {product?.base_price}</span>
        
      </div>
    </div>
  );
};
