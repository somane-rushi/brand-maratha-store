import React from "react";
import Image from "next/image";
import Link from "next/link";
import { _url } from "@/utlis/apiService";

export const BrandCard = ({ brand }) => {
    return (
        <div className="product-list brand-card">
            <div className="card-product fl-item">
                <div className="card-product-wrapper">
                    <Link
                        href={`product-listing?brands=${brand?.name}`}
                        className="product-img"
                    >
                        <Image
                            className="img-product"
                            src={
                                `${_url}/${brand?.image}` ||
                                "/default-brand.png"
                            }
                            alt={brand?.name}
                            width={720}
                            height={1005}
                        />
                    </Link>
                </div>
                <div className="card-product-info">
                    <Link
                        href={`product-listing?brands=${brand?.name}`}
                        className="title link"
                    >
                        {brand?.name}
                    </Link>
                </div>
            </div>
        </div>
    );
};
