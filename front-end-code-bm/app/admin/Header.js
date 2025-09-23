import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
    return (
        <>
            <nav className="navbar navbar-light bg-light sticky-top shadow">
                <div className="container d-flex justify-content-between align-items-center">
                    {/* Logo */}
                    <a className="navbar-brand" href="/">
                        <Image
                            alt="logo"
                            className="logo"
                            src="/images/brand-maratha/logo/logo.png"
                            width={90}
                            height={18}
                        />
                    </a>

                    {/* Login Button */}
                    {/* <a 
                        className="tf-btn w-20 radius-3 btn-fill animate-hover-btn justify-content-center" 
                        href="admin/login"
                    >
                        Login
                    </a> */}
                    <Link href="/admin/login" className="tf-btn w-20 radius-3 btn-fill animate-hover-btn justify-content-center" >
                        Login
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default Header;
