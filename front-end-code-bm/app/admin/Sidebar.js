import Link from "next/link";
import React from "react";

const Sidebar = () => {
    return (
        <div
            // className="d-flex flex-column p-3 bg-dark text-white position-sticky top-0 vh-100"
            className="sticky-sidebar bg-dark"
            style={{ width: "15%" }}
        >
            {/* <h2 className="mb-4">Admin Panel</h2> */}
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <Link href="/admin/banner" className="nav-link text-white">
                        Banner
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link href="/admin/about" className="nav-link text-white">
                        About
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link href="/admin/settings" className="nav-link text-white">
                        Products
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link href="/admin/blog" className="nav-link text-white">
                        Blogs
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link href="/admin/magazine" className="nav-link text-white">
                        Magazine
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link href="/admin/contact" className="nav-link text-white">
                        Contact
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link href="/admin/disclaimer" className="nav-link text-white">
                        Disclaimer
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link href="/admin/settings" className="nav-link text-white">
                        Exchange Policy
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link href="/admin/privacy-policy" className="nav-link text-white">
                        Privacy Policy
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link href="/admin/exchange-policy" className="nav-link text-white">
                        Exchange Policy
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link href="/admin/terms-condition" className="nav-link text-white">
                        Terms and Condition
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link href="/admin/brand-detail" className="nav-link text-white">
                        Brand Detail
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
