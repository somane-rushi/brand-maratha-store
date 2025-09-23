"use client";
import React from "react";
import Image from "next/image";
import { _url, _url_without_upload_path } from "@/utlis/apiService";

const Hero = ({ banner }) => {
    return (
        <>
            <section
                className="bs-banner typ-bd"
                style={{
                    backgroundImage: `url(${_url_without_upload_path}/${banner?.banner_image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="container h-100">
                    <div className="col-md-12 h-100">
                        <div className="content-wrapper h-100">
                            <div className="img-section mb_24">
                                <Image
                                    className="lazyload w-100"
                                    alt="image"
                                    src={`${_url}/${banner?.brand_image}`}
                                    width={224}
                                    height={224}
                                />
                            </div>
                            <p className="para mb_0 typ-18 max-600">
                                {banner?.subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;
