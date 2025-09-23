"use client";

import React, { useEffect, useRef, useState, useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";

const languageOptions = [
    { id: "en", label: "English" },
    { id: "mr", label: "मराठी" },
];

export default function LanguageSelect({
    parentClassName = "image-select center style-default type-languages",
    topStart = false,
}) {
    const { language, setLanguage } = useContext(LanguageContext);
    const [isDDOpen, setIsDDOpen] = useState(false);
    const languageSelect = useRef();

    const selected = languageOptions.find((opt) => opt.id === language) || languageOptions[0];

    const handleLanguageChange = (langId) => {
        setLanguage(langId); // Updates the language in context and triggers re-renders
        localStorage.setItem("language", langId);
        setIsDDOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                languageSelect.current &&
                !languageSelect.current.contains(event.target)
            ) {
                setIsDDOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div
            className={`dropdown bootstrap-select ${parentClassName} dropup`}
            ref={languageSelect}
        >
            <button
                type="button"
                tabIndex={-1}
                onClick={() => setIsDDOpen((prev) => !prev)}
                className={`btn dropdown-toggle btn-light ${isDDOpen ? "show" : ""}`}
                aria-haspopup="listbox"
                aria-expanded={isDDOpen ? "true" : "false"}
            >
                <div className="filter-option">
                    <div className="filter-option-inner-inner">
                        {/* Display the selected language */}
                        {t(selected.label, language)}
                    </div>
                </div>
            </button>

            <div
                className={`dropdown-menu ${isDDOpen ? "show" : ""}`}
                style={{
                    maxHeight: "200px",
                    overflow: "hidden",
                    minHeight: 100,
                    position: "absolute",
                    inset: "auto auto 0px 0px",
                    margin: 0,
                    transform: `translate(0px, ${topStart ? 22 : -20}px)`,
                }}
                role="listbox"
            >
                <div className="inner show" style={{ overflowY: "auto" }}>
                    <ul className="dropdown-menu inner show">
                        {languageOptions.map((lang) => (
                            <li
                                key={lang.id}
                                onClick={() => handleLanguageChange(lang.id)}
                                className={selected.id === lang.id ? "active" : ""}
                                role="option"
                                aria-selected={selected.id === lang.id}
                            >
                                <a className="dropdown-item">
                                    <span className="text">{lang.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
