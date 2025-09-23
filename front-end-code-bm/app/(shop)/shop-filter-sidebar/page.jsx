import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import FilterSidebar from "@/components/shop/FilterSidebar";
import React, { Suspense } from "react";

export const metadata = {
    title: "Shop Filter Sidebar || Brand Maratha",
    description: "Brand Maratha",
};
export default function page() {
    return (
        <>
            <Header2 />
            <div className="tf-page-title">
                <div className="container-full">
                    <div className="heading text-center">New Arrival</div>
                    <p className="text-center text-2 text_black-2 mt_5">
                        Shop through our latest selection of Fashion
                    </p>
                </div>
            </div>
            <Suspense fallback={<div>Loading filters...</div>}>
                <FilterSidebar />
            </Suspense>
            <Footer1 />
        </>
    );
}
