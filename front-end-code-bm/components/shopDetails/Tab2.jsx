"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "next/navigation";

import { handleProductService, fetchSizesWithColors } from "@/utlis/apiService";

export default function Tab2() {
    const [activeTab, setActiveTab] = useState(-1);
    const [product, setProduct] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [sizes, setSizes] = useState([]);

    const { id } = useParams();
    useEffect(() => {
        if (product?.id) {
            fetchSizesWithColors(product.id).then(setSizes);
        }
    }, [product]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const result = await handleProductService(id);
                setProduct(result.data);
                console.log("result", result);
            } catch (err) {
                console.log(err);
                setIsError(true);
                setError(err?.response?.data?.message);
            } finally {
                setIsError(false);
                setIsLoading(false);
            }
        })();
    }, []);
    return (
        <section className="flat-spacing-10 bs-accordian">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="flat-accordion has-btns toggle-description-tab">
                            <div
                                className={`flat-toggle style-2 ${
                                    activeTab == 1 ? "active" : ""
                                }`}
                            >
                                <div
                                    onClick={() =>
                                        setActiveTab((pre) =>
                                            pre == 1 ? -1 : 1
                                        )
                                    }
                                    className={`toggle-title ${
                                        activeTab == 1 ? "active" : ""
                                    }`}
                                >
                                    Description
                                </div>
                                <div
                                    className={`toggle-content ${
                                        activeTab == 1 ? "active" : ""
                                    }`}
                                    style={{ display: "block" }}
                                >
                                    <div className="">
                                        {product.description}
                                        <div className="d-flex gap-4 ">
                                            {Array.isArray(product.fabrics) &&
                                                product.fabrics.map((dt) => (
                                                    <span>{dt}</span>
                                                ))}

                                            {Array.isArray(
                                                product.key_features
                                            ) &&
                                                product.key_features.map(
                                                    (dt) => <span>{dt}</span>
                                                )}
                                            {Array.isArray(product.patterns) &&
                                                product.patterns.map((dt) => (
                                                    <span>{dt}</span>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`flat-toggle style-2 ${
                                    activeTab == 2 ? "active" : ""
                                }`}
                            >
                                <div
                                    onClick={() =>
                                        setActiveTab((pre) =>
                                            pre == 2 ? -1 : 2
                                        )
                                    }
                                    className={`toggle-title ${
                                        activeTab == 2 ? "active" : ""
                                    }`}
                                >
                                    Additional Information
                                </div>
                                <div
                                    className={`toggle-content ${
                                        activeTab == 2 ? "active" : ""
                                    }`}
                                    style={{ display: "block" }}
                                >
                                    <table className="tf-pr-attrs">
                                        <thead>
                                            <tr>
                                                <th>Size</th>
                                                <th>Colors</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sizes.map((sizeObj) => (
                                                <tr key={sizeObj.id}>
                                                    <td>{sizeObj.size}</td>

                                                    <td>
                                                        {sizeObj.colors.length >
                                                        0 ? (
                                                            <ul className="flex flex-wrap gap-2">
                                                                {sizeObj.colors.map(
                                                                    (color) => (
                                                                        <li
                                                                            key={
                                                                                color.id
                                                                            }
                                                                            className="flex items-center gap-1"
                                                                        >
                                                                            <span
                                                                                className="inline-block w-4 h-4 rounded-full"
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        color.color_code,
                                                                                }}
                                                                            ></span>
                                                                            {
                                                                                color.color
                                                                            }
                                                                            {color.out_of_stock
                                                                                ? " (Out of stock)"
                                                                                : ""}
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <span>
                                                                No Colors
                                                                Available
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div
                                className={`flat-toggle style-2 ${
                                    activeTab == 3 ? "active" : ""
                                }`}
                            >
                                <div
                                    onClick={() =>
                                        setActiveTab((pre) =>
                                            pre == 3 ? -1 : 3
                                        )
                                    }
                                    className={`toggle-title ${
                                        activeTab == 3 ? "active" : ""
                                    }`}
                                >
                                    Return Policies
                                </div>
                                <div
                                    className={`toggle-content ${
                                        activeTab == 3 ? "active" : ""
                                    }`}
                                    style={{ display: "block" }}
                                >
                                    <div className="tf-page-privacy-policy">
                                        {product.return_policy}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
