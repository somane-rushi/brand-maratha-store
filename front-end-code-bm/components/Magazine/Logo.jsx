"use client";
import React from "react";
import Image from "next/image";
import { _url } from "@/utlis/apiService";

const Logo = ({ brands }) => {
    return (
        <>
            <section className="logo-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="bs-heading text-center">
                                <h2 className="hd mrgB40">
                                    Our Popular Brands
                                </h2>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="bs-client">
                                <div className="row  justify-content-center ">
                                    {brands.map((item, index) => (
                                        <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                            <div className="logoSec padTB0">
                                                <Image
                                                    className="lazyload logoImg img-fluid"
                                                    alt="image"
                                                    src={`${_url}/${item?.image}`}
                                                    width={145}
                                                    height={82}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {/* <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-2.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-3.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-4.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-5.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-6.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-1.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-2.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-6.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-4.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-5.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-6.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-1.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-7.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div>
                                    <div className=" col-md-4 col-lg-2 col-6  box-border custm-col-2">
                                        <div className="logoSec padTB0">
                                            <Image
                                                className="lazyload logoImg img-fluid"
                                                alt="image"
                                                src="/images/brand-maratha/magazine/logo-2.png"
                                                width={145}
                                                height={82}
                                            />
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Logo;
