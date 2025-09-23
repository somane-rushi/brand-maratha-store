import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Brands2 from "@/components/othersPages/brands/Brands2";
import React from "react";

export const metadata = {
    title: "Brands 2 || Brand Maratha",
    description: "Brand Maratha",
};
export default function page() {
    return (
        <>
            <Header2 />
            <div className="tf-page-title style-2">
                <div className="container-full">
                    <div className="heading text-center">Brands v2</div>
                </div>
            </div>

            <Brands2 />
            <Footer1 />
        </>
    );
}

