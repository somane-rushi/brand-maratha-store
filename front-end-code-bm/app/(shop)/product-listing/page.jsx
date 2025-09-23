"use client";
import React, { Suspense } from "react";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { capitalizeFirst } from "@/utlis/capitalizeFirst";

const toArray = (value) => {
    if (!value) return [];
    return Array.isArray(value)
        ? value.flatMap((v) => v.split(",").map((s) => s.trim()))
        : value.split(",").map((v) => v.trim());
};

export default function page({ searchParams }) {
    const filters = {
        catalogue: toArray(searchParams.catalogue),
        category: toArray(searchParams.category),
        subcategory: toArray(searchParams.subcategory),
        item: toArray(searchParams.item),
        brands: toArray(searchParams.brands),
        traditional: toArray(searchParams.traditional),
    };

    // const filters = {
    //     catalogue: searchParams.catalogue || "",
    //     category: searchParams.category || "",
    //     subcategory: searchParams.subcategory || "",
    //     item: searchParams.item || "",
    //     brands: searchParams.brands || "",
    // };
    return (
        <>
            <Topbar1 />
            <Header />
            <div className="bs-banner typ-position">
                <div className="container-full h-100">
                    <div className="row h-100">
                        <div className="col-12">
                            <div className="content-wrapper h-100">
                                <div className="heading">
                                    <span>
                                        {filters.catalogue
                                            ? `${capitalizeFirst(
                                                  filters.catalogue
                                              )} Wear`
                                            : capitalizeFirst(filters.category)}
                                    </span>
                                </div>
                                <p className="para max-width">
                                    Elevate your wardrobe with Brand Maratha’s
                                    beautiful range of women's wear.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Suspense fallback={<div>Loading filters...</div>}>
                <FilterSidebar filterQueries={filters} />
            </Suspense>
            <Footer1 />
        </>
    );
}

// "use client";
// import React, { Suspense, useEffect, useState } from "react";
// import Footer1 from "@/components/footers/Footer1";
// import Header from "@/components/headers/Header";
// import Topbar1 from "@/components/headers/Topbar1";
// import FilterSidebar from "@/components/shop/FilterSidebar";
// import { capitalizeFirst } from "@/utlis/capitalizeFirst";
// import { ProductCountContext } from "@/context/ProductCountContext";

// export default function Page({ searchParams }) {
//     const [productCount, setProductCount] = useState(0);

//     const filters = {
//         catalogue: searchParams.catalogue || "",
//         category: searchParams.category || "",
//         subcategory: searchParams.subcategory || "",
//         item: searchParams.item || "",
//     };

//     return (
//         <ProductCountContext.Provider value={{ productCount, setProductCount }}>
//             <Topbar1 />
//             <Header />

//             <div className="bs-banner typ-position">
//                 <div className="container-full h-100">
//                     <div className="row h-100">
//                         <div className="col-12">
//                             <div className="content-wrapper h-100">
//                                 <div className="heading">
//                                     <span>
//                                         {filters.catalogue
//                                             ? `${capitalizeFirst(
//                                                   filters.catalogue
//                                               )} Wear`
//                                             : capitalizeFirst(filters.category)}
//                                     </span>
//                                 </div>
//                                 <p className="para max-width">
//                                     Elevate your wardrobe with Brand Maratha’s
//                                     beautiful range of women's wear.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {productCount === 0 && (
//                 <div className="text-center py-4">No products found.</div>
//             )}

//             <Suspense fallback={<div>Loading filters...</div>}>
//                 <FilterSidebar filterQueries={filters} />
//             </Suspense>

//             <Footer1 />
//         </ProductCountContext.Provider>
//     );
// }
