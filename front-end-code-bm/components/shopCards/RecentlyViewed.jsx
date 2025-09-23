import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import APP_URL from "@/utlis/config";
import { useContextElement } from "@/context/Context";
import { addToRecentlyViewed } from "@/utlis/recentlyViewedUtils";

const RecentlyViewed = ({ product }) => {
  const [recentProducts, setRecentProducts] = useState([]);
  const { addToWishlist, isAddedtoWishlist } = useContextElement();

  // Fetch recently viewed products from localStorage on component mount
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentProducts(storedProducts);
  }, []);

  return (
    <div className="recently-viewed">


      <div className="product-list">
        <div className="card-product fl-item" key={product.id}>
          <div className="card-product-wrapper">
            <Link href={`/product-detail/${product.id}`} onClick={() => addToRecentlyViewed(product)} className="product-img">
              <Image
                className="lazyload img-product"
                src={`${APP_URL}/${product.thumbnail}`}
                alt={product.name}
                width={720}
                height={1005}

              />
              <Image
                className="lazyload img-hover"
                data-src={
                  `${APP_URL}/${product?.thumbnail}`
                }
                src={`${APP_URL}/${product?.thumbnail}`}
                alt="image-product"
                width={720}
                height={1005}
              />
            </Link>
            <div className="list-product-btn typ-product-detailpage">
              <a
                onClick={() => addToWishlist(product.slug)}
                className="box-icon wishlist btn-icon-action"
              >
                <span
                  className={`icon icon-heart ${isAddedtoWishlist(product.id) ? "added" : ""}`}
                />
              </a>
            </div>
          </div>
          <div className="card-product-info">
            <Link href={`/product-detail/${product.id}`} className="title link">
              {product.name}
            </Link>
            <span className="price">₹{parseFloat(product.base_price || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RecentlyViewed;
