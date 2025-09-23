"use client";
import { sortingOptions } from "@/data/shop";
import React, { useEffect, useState } from "react";

export default function Sorting({ products, setFinalSorted }) {
    const [selectedOptions, setSelectedOptions] = useState(sortingOptions[0]);

    useEffect(() => {
        if (selectedOptions.text == "Default") {
            setFinalSorted([...products]);
        } else if (selectedOptions.text == "Alphabetically, A-Z") {
            setFinalSorted(
                [...products].sort(
                    (a, b) => a.name?.localeCompare(b.name ?? "") || 0
                )
            );
        } else if (selectedOptions.text == "Alphabetically, Z-A") {
            setFinalSorted(
                [...products].sort(
                    (a, b) => b.name?.localeCompare(a.name ?? "") || 0
                )
            );
        } else if (selectedOptions.text == "Price, low to high") {
            setFinalSorted(
                [...products].sort(
                    (a, b) => parseFloat(a.final_mrp) - parseFloat(b.final_mrp)
                )
            );
        } else if (selectedOptions.text == "Price, high to low") {
            setFinalSorted(
                [...products].sort(
                    (a, b) => parseFloat(b.final_mrp) - parseFloat(a.final_mrp)
                )
            );
        }
    }, [products, selectedOptions]);

    return (
        <>
            {" "}
            <div className="btn-select">
                <span className="text-sort-value">{selectedOptions.text}</span>
                <span className="icon icon-arrow-down" />
            </div>
            <div className="dropdown-menu">
                {sortingOptions.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedOptions(item)}
                        className={`select-item ${
                            item == selectedOptions ? "active" : ""
                        }`}
                    >
                        <span className="text-value-item">{item.text}</span>
                    </div>
                ))}
            </div>
        </>
    );
}
