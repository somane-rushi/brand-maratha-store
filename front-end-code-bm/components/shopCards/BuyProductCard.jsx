"use client";
import Image from "next/image";
import Link from "next/link";
export const BuyProductCard = ({ product }) => {

  return (
    <div className="card-product hover-none fl-item" key={product.id}>
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.id}`} className="product-img">
        {/* <Link href={`#`} className="product-img"> */}
          <Image
            className="lazyload img-product"
            data-src={product.imgSrc}
            src={product.imgSrc}
            alt="image-product"
            width={283}
            height={283}
          />
        </Link>
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.id}`} className="title link">
          {product.title}
        </Link>
        <span className="price">${product.price.toFixed(2)}</span>
      </div>
    </div>
  );
};
