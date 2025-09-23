import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { addToRecentlyViewed } from "@/utlis/recentlyViewedUtils";
import { fetchproductsbybrands, fetchallproducts } from "@/utlis/apiService";
import APP_URL from "@/utlis/config";

export const ProductCardo = ({ product }) => {
  const [products, setProducts] = useState([]);
  const [varr, setVarr] = useState(null); // Change initial state to null (not an array)
  const { addToWishlist, isAddedtoWishlist } = useContextElement();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await fetchallproducts();
      if (data.length > 0) {
        setVarr(data[0]); // Pick the first product (assuming data is an array)
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (varr && varr.brand_id) {
      const fetchFilteredProducts = async () => {
        console.log("Fetching products for brand_id:", varr.brand_id);
        const data = await fetchproductsbybrands(varr.brand_id);
        setProducts(data);
        console.log("PP", data)
      };
      fetchFilteredProducts();
    }
  }, [varr]);

  return (
    <div className="product-list">

      <div className="card-product fl-item" key={product?.id}>
        <div className="card-product-wrapper">
          <Link href={`/product-detail/${product?.id}`} onClick={() => addToRecentlyViewed(product)} className="product-img">
            <Image
              className="lazyload img-product"
              data-src={`${APP_URL}/${product?.thumbnail_image}`}
              src={`${APP_URL}/${product?.thumbnail_image}`}
              alt={product?.name}
              width={720}
              height={1005}
            />
            <Image
              className="lazyload img-hover"
              data-src={
                `${APP_URL}/${product?.thumbnail_image}`
              }
              src={`${APP_URL}/${product?.thumbnail_image}`}
              alt="image-product"
              width={720}
              height={1005}
            />
          </Link>
          <div className="list-product-btn typ-product-detailpage">
            <a
              onClick={() => addToWishlist(product?.slug)}
              className="box-icon wishlist btn-icon-action"
            >
              <span
                className={`icon icon-heart ${isAddedtoWishlist(product?.id) ? "added" : ""
                  }`}
              />
            </a>
          </div>
        </div>
        <div className="card-product-info">
          <Link href={`/product-detail/${product?.id}`} className="title link">
            {product?.name}
          </Link>
          <span className="price">₹{parseFloat(product?.base_price).toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
};
