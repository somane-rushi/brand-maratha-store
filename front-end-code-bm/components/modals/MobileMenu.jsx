// "use client";
// import React from "react";
// import Link from "next/link";
// import LanguageSelect from "../common/LanguageSelect";
// // import CurrencySelect from "../common/CurrencySelect";
// import { navItems } from "@/data/menu";
// import { usePathname } from "next/navigation";
// import { useContext } from "react";
// import { LanguageContext } from "@/context/LanguageContext";
// import { t } from "@/components/translate";

// export default function MobileMenu() {
//     const { language } = useContext(LanguageContext);
//     const pathname = usePathname();
//     // const isMenuActive = (menuItem) => {
//     //     let active = false;
//     //     if (menuItem.href?.includes("/")) {
//     //         if (menuItem.href?.split("/")[1] == pathname.split("/")[1]) {
//     //             active = true;
//     //         }
//     //     }
//     //     if (menuItem.links) {
//     //         menuItem.links?.forEach((elm2) => {
//     //             if (elm2.href?.includes("/")) {
//     //                 if (elm2.href?.split("/")[1] == pathname.split("/")[1]) {
//     //                     active = true;
//     //                 }
//     //             }
//     //             if (elm2.links) {
//     //                 elm2.links.forEach((elm3) => {
//     //                     if (elm3.href.split("/")[1] == pathname.split("/")[1]) {
//     //                         active = true;
//     //                     }
//     //                 });
//     //             }
//     //         });
//     //     }

//     //     return active;
//     // };

//     const isMenuActive = (menuItem) => {
//         let active = false;

//         const getSegment = (url) => {
//             if (typeof url !== "string") return "";
//             const segments = url.split("/").filter(Boolean);
//             return segments[0] || "";
//         };

//         const currentSegment = getSegment(pathname);

//         if (menuItem.href?.includes("/")) {
//             if (getSegment(menuItem.href) === currentSegment) {
//                 active = true;
//             }
//         }

//         if (menuItem.links) {
//             menuItem.links?.forEach((elm2) => {
//                 if (elm2.href?.includes("/")) {
//                     if (getSegment(elm2.href) === currentSegment) {
//                         active = true;
//                     }
//                 }

//                 if (elm2.links) {
//                     elm2.links.forEach((elm3) => {
//                         if (getSegment(elm3?.href) === currentSegment) {
//                             active = true;
//                         }
//                     });
//                 }
//             });
//         }

//         return active;
//     };

//     return (
//         <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
//             <span
//                 className="icon-close icon-close-popup"
//                 data-bs-dismiss="offcanvas"
//                 aria-label="Close"
//             />
//             <div className="mb-canvas-content">
//                 <div className="mb-body">
//                     <ul className="nav-ul-mb" id="wrapper-menu-navigation">
//                         <li className="nav-mb-item">
//                             <a href="/" className="mb-menu-link">
//                                 Home
//                             </a>

//                         </li>


//                         <li className="nav-mb-item">
//                             <a href="/" className="mb-menu-link">
//                                 Women
//                             </a>
//                              <span className="btn-open-sub" />
//                         </li>
//                         {navItems.map((item, i) => (
//                             <li key={i} className="nav-mb-item">
//                                 <a
//                                     href={`#${item.id}`}
//                                     className={`collapsed mb-menu-link current ${
//                                         isMenuActive(item) ? "activeMenu" : ""
//                                     }`}
//                                     data-bs-toggle="collapse"
//                                     aria-expanded="true"
//                                     aria-controls={item.id}
//                                 >
//                                     <span>{item.label}</span>
//                                     <span className="btn-open-sub" />
//                                 </a>
//                                 <div id={item.id} className="collapse">
//                                     <ul className="sub-nav-menu">
//                                         {item.links.map((subItem, i2) => (
//                                             <li key={i2}>
//                                                 {subItem.links ? (
//                                                     <>
//                                                         <a
//                                                             href={`#${subItem.id}`}
//                                                             className={`sub-nav-link collapsed  ${
//                                                                 isMenuActive(
//                                                                     subItem
//                                                                 )
//                                                                     ? "activeMenu"
//                                                                     : ""
//                                                             }`}
//                                                             data-bs-toggle="collapse"
//                                                             aria-expanded="true"
//                                                             aria-controls={
//                                                                 subItem.id
//                                                             }
//                                                         >
//                                                             <span>
//                                                                 {subItem.label}
//                                                             </span>
//                                                             <span className="btn-open-sub" />
//                                                         </a>
//                                                         <div
//                                                             id={subItem.id}
//                                                             className="collapse"
//                                                         >
//                                                             <ul className="sub-nav-menu sub-menu-level-2">
//                                                                 {subItem.links.map(
//                                                                     (
//                                                                         innerItem,
//                                                                         i3
//                                                                     ) => (
//                                                                         <li
//                                                                             key={
//                                                                                 i3
//                                                                             }
//                                                                         >
//                                                                             <Link
//                                                                                 href={
//                                                                                     innerItem.href
//                                                                                 }
//                                                                                 className={`sub-nav-link  ${
//                                                                                     isMenuActive(
//                                                                                         innerItem
//                                                                                     )
//                                                                                         ? "activeMenu"
//                                                                                         : ""
//                                                                                 }`}
//                                                                             >
//                                                                                 {
//                                                                                     innerItem.label
//                                                                                 }
//                                                                                 {innerItem.demoLabel && (
//                                                                                     <div className="demo-label">
//                                                                                         <span className="demo-new">
//                                                                                             New
//                                                                                         </span>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </Link>
//                                                                         </li>
//                                                                     )
//                                                                 )}
//                                                             </ul>
//                                                         </div>
//                                                     </>
//                                                 ) : (
//                                                     <Link
//                                                         href={subItem.href}
//                                                         className={`sub-nav-link ${
//                                                             isMenuActive(
//                                                                 subItem
//                                                             )
//                                                                 ? "activeMenu"
//                                                                 : ""
//                                                         }`}
//                                                     >
//                                                         {subItem.label}
//                                                         {subItem.demoLabel && (
//                                                             <div className="demo-label">
//                                                                 <span className="demo-new">
//                                                                     New
//                                                                 </span>
//                                                             </div>
//                                                         )}
//                                                     </Link>
//                                                 )}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </li>
//                         ))}
//                         <li className="nav-mb-item">
//                             <a href="/" className="mb-menu-link">
//                                 Men
//                             </a>
//                         </li>
//                         <li className="nav-mb-item">
//                             <a href="/" className="mb-menu-link">
//                                 Studio
//                             </a>
//                         </li>
//                         <li className="nav-mb-item">
//                             <a href="/maganzine" className="mb-menu-link">
//                                 Maganize
//                             </a>
//                         </li>
//                         <li className="nav-mb-item">
//                             <a href="" className="mb-menu-link">
//                                 Partner
//                             </a>
//                         </li>
//                     </ul>
//                     <div className="mb-other-content">
//                         <div className="d-flex group-icon">
//                             <Link href={`/wishlist`} className="site-nav-icon">
//                                 <i className="icon icon-heart" />
//                                 Wishlist
//                             </Link>
//                             <Link
//                                 href={`/home-search`}
//                                 className="site-nav-icon"
//                             >
//                                 <i className="icon icon-search" />
//                                 Search
//                             </Link>
//                         </div>
//                         <div className="mb-notice">
//                             <Link href={`/contact-us`} className="text-need">
//                                 Need help ?
//                             </Link>
//                         </div>
//                         <ul className="mb-info">
//                             <li>
//                                 <a href="https://maps.app.goo.gl/WwR6RruyCNgD6BsC8">
//                                     {" "}
//                                     {t("address-full", language)}
//                                 </a>
//                             </li>
//                             <li>
//                                 {t("email", language)}:{" "}
//                                 <a href="mailto:brandmarathaofficial@gmail.com">
//                                     brandmarathaofficial@gmail.com
//                                 </a>
//                             </li>
//                             <li>
//                                 {t("phone", language)}:{" "}
//                                 <a href="tel:02231645644">+91 2231645644 </a>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//                 <div className="mb-bottom">
//                     <Link href={`/login`} className="site-nav-icon">
//                         <i className="icon icon-account" />
//                         Login
//                     </Link>
//                     <div className="bottom-bar-language">
//                         <div className="tf-languages">
//                             <LanguageSelect
//                                 parentClassName={
//                                     "image-select center style-default type-languages"
//                                 }
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }




"use client";
import React from "react";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
// import CurrencySelect from "../common/CurrencySelect";
import { navItems } from "@/data/menu";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

export default function MobileMenu() {
    const { language } = useContext(LanguageContext);

    // const isMenuActive = (menuItem) => {
    //     let active = false;
    //     if (menuItem.href?.includes("/")) {
    //         if (menuItem.href?.split("/")[1] == pathname.split("/")[1]) {
    //             active = true;
    //         }
    //     }
    //     if (menuItem.links) {
    //         menuItem.links?.forEach((elm2) => {
    //             if (elm2.href?.includes("/")) {
    //                 if (elm2.href?.split("/")[1] == pathname.split("/")[1]) {
    //                     active = true;
    //                 }
    //             }
    //             if (elm2.links) {
    //                 elm2.links.forEach((elm3) => {
    //                     if (elm3.href.split("/")[1] == pathname.split("/")[1]) {
    //                         active = true;
    //                     }
    //                 });
    //             }
    //         });
    //     }

    //     return active;
    // };


    return (
        <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
            <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            />
            <div className="mb-canvas-content">
                <div className="mb-body">
                    <ul className="nav-ul-mb" id="wrapper-menu-navigation">
                        <li className="nav-mb-item">
                            <a href="/" className="mb-menu-link">
                                Home
                            </a>
                       </li>

                         <li className="nav-mb-item">
                            <a href="/" className="mb-menu-link">
                                Women
                            </a>
                            <span className="btn-open-sub" />
                        </li>

                        <li className="nav-mb-item">
                            <a href="/" className="mb-menu-link">
                                Men
                            </a>
                            <span className="btn-open-sub" />
                        </li>

                        <li className="nav-mb-item">
                            <a href="/" className="mb-menu-link">
                                Accessories
                            </a>
                            <span className="btn-open-sub" />
                        </li>

                        <li className="nav-mb-item">
                            <a href="/blog" className="mb-menu-link">
                                Blog
                            </a>

                        </li>
                        <li className="nav-mb-item">
                            <a href="/magazine" className="mb-menu-link">
                                Magazine
                            </a>

                        </li>

                    </ul>
                    <div className="mb-other-content">
                        <div className="d-flex group-icon">
                            <Link href={`/wishlist`} className="site-nav-icon">
                                <i className="icon icon-heart" />
                                Wishlist
                            </Link>

                            <Link
                                href={`/home-search`}
                                className="site-nav-icon"
                            >
                                <i className="icon icon-search" />
                                Search
                            </Link>
                        </div>
                        <div className="mb-notice">
                            <Link href={`/contact-us`} className="text-need">
                                Need help ?
                            </Link>
                        </div>
                        <ul className="mb-info">
                            <li>
                                <a href="https://maps.app.goo.gl/WwR6RruyCNgD6BsC8">
                                    {" "}
                                    {t("address-full", language)}
                                </a>
                            </li>
                            <li>
                                {t("email", language)}:{" "}
                                <a href="mailto:brandmarathaofficial@gmail.com">
                                    brandmarathaofficial@gmail.com
                                </a>
                            </li>
                            <li>
                                {t("phone", language)}:{" "}
                                <a href="tel:02231645644">+91 2231645644 </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mb-bottom">
                    <Link href={`/login`} className="site-nav-icon">
                        <i className="icon icon-account" />
                        Login
                    </Link>
                    <div className="bottom-bar-language">
                        <div className="tf-languages">
                            <LanguageSelect
                                parentClassName={
                                    "image-select center style-default type-languages"
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




