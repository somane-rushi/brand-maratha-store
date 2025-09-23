import React, { useState, useEffect, useRef } from 'react';

const TagInput = ({ label, name, placeholder, options = [], values = [], setFieldValue }) => {
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef(null);

    const selectedValues = Array.isArray(values) ? values : [];

    // const handleSelect = (value) => {
    //     if (!selectedValues.includes(value)) {
    //         setFieldValue(name, [...selectedValues, value]);
    //     }
    //     setSearch('');
    //     setShowDropdown(false);
    // };

    const handleSelect = (value) => {
        // Normalize value
        const newItems = value
            .split(',')
            .map((v) => v.trim())
            .filter((v) => v && !selectedValues.includes(v)); // avoid duplicates

        if (newItems.length > 0) {
            setFieldValue(name, [...selectedValues, ...newItems]);
        }

        setSearch('');
        setShowDropdown(false);
    };

    const handleRemove = (value) => {
        setFieldValue(name, selectedValues.filter((v) => v !== value));
    };

    const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options
        .filter((opt) =>
            opt.name.toLowerCase().includes(search.toLowerCase()) &&
            !selectedValues.includes(opt.name)
        );

    const isCustom = search.trim() !== '' &&
        !options.some((opt) => opt.name.toLowerCase() === search.toLowerCase()) &&
        !selectedValues.includes(search.trim());

    return (
        <div className="mb-3 position-relative" ref={containerRef}>
            <label className="form-label fw-semibold">{label.toLocaleUpperCase()}</label>

            <div className="form-control d-flex flex-wrap align-items-center" style={{ minHeight: '42px', cursor: 'text' }} onClick={() => setShowDropdown(true)}>
                {selectedValues.map((val, idx) => (
                    <span key={idx} className="badge bg-primary me-1 mb-1 d-flex align-items-center">
                        {val}
                        <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            style={{ fontSize: '0.6rem' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(val);
                            }}
                        />
                    </span>
                ))}
                <input
                    type="text"
                    value={search}
                    placeholder={placeholder}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowDropdown(true);
                    }}
                    style={{ flex: 1, border: 'none', outline: 'none', minWidth: '80px' }}
                />
            </div>

            {showDropdown && (filteredOptions.length > 0 || isCustom) && (
                <div className="position-absolute bg-white border mt-1 w-100 shadow-sm rounded zindex-dropdown" style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto' }}>
                    {filteredOptions.map((opt) => (
                        <div key={opt.id} className="px-3 py-2 border-bottom d-flex align-items-center">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`check-${opt.id}`}
                                // onChange={() => handleSelect(opt.name)}
                                onChange={() => handleSelect(opt.name)}
                            />
                            <label htmlFor={`check-${opt.id}`} className="form-check-label ms-2 mb-0">
                                {opt.name}
                            </label>
                        </div>
                    ))}
                    {/* {isCustom && (
                        <div className="px-3 py-2 d-flex align-items-center bg-light">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="custom-check"
                                onChange={() => handleSelect(search.trim())}
                            />
                            <label htmlFor="custom-check" className="form-check-label ms-2 mb-0">
                                "{search.trim()}"
                            </label>
                        </div>
                    )} */}
                    {isCustom && (
                        <div className="px-3 py-2 d-flex align-items-center bg-light">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="custom-check"
                                onChange={() => handleSelect(search.trim())} // Keep this
                            />
                            <label htmlFor="custom-check" className="form-check-label ms-2 mb-0">
                                "{search.trim()}"
                            </label>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TagInput;
