import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import ShopDefault from "@/components/shop/ShopDefault";
import Subcollections from "@/components/shop/Subcollections";
import React from "react";

export const metadata = {
  title:
    "Product Collection Sub || Brand Maratha",
  description: "Brand Maratha",
};
export default function page() {
  return (
    <>
      <Topbar1 />
      <Header />
      <div className="tf-page-title marginTopHeader">
        <div className="container-full">
          <div className="heading text-center">New Arrival</div>
          <p className="text-center text-2 text_black-2 mt_5">
            Shop through our latest selection of Fashion
          </p>
        </div>
      </div>
      <Subcollections />
      <ShopDefault />
      <Footer1 />
    </>
  );
}
