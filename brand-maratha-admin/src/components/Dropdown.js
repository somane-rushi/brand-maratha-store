import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
    label,
    name,
    value,
    options,
    setFieldValue,
    error,
    touched,
    disabled
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    const safeOptions = Array.isArray(options) ? options : [];
    const isObjectOptions = safeOptions.length > 0 && typeof safeOptions[0] === 'object';

    const handleSelect = (option) => {
        const selectedValue = isObjectOptions ? option.id : option;
        setFieldValue(name, selectedValue);
        setShowDropdown(false);
        setSearchTerm('');
    };

    console.log("disabled", disabled);

    const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = safeOptions.filter((item) => {
        const text = isObjectOptions ? item.name : item;
        return String(text).toLowerCase().includes(searchTerm.toLowerCase());
    });

    const displayLabel = () => {
        if (!value) return 'Select...';
        if (isObjectOptions) {
            const matched = safeOptions.find(opt => opt.id === value);
            return matched ? matched.name : 'Select...';
        }
        return value;
    };

    return (
        <div className=" position-relative" ref={containerRef}>
            <label className="form-label fw-semibold">
                {label.toUpperCase()}
                {
                    (
                        name === 'country_origin' ||
                        name === 'size' ||
                        name === 'category_id' ||
                        name === 'subcategory_id' ||
                        name === 'collection_id' ||
                        name === 'brand_id'
                    ) && <span className='text-danger'>*</span>
                }
            </label>

            <div
                className="form-control d-flex justify-content-between align-items-center"
                style={{
                    cursor: 'pointer',
                    pointerEvents: disabled ? 'none' : 'auto',
                    backgroundColor: disabled ? '#e9ecef' : '#fff',
                    color: disabled ? '#6c757d' : '#212529'
                }}
                onClick={() => {
                    if (!disabled) setShowDropdown(prev => !prev);
                }}
            >
                <span>{displayLabel()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

            {showDropdown && (
                <div className="position-absolute bg-white border mt-1 w-100 shadow-sm rounded"
                    style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto' }}>
                    <div className="p-2 border-bottom">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type to search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    {filteredOptions.map((item, index) => (
                        <div
                            key={index}
                            className="px-3 py-2 hover-bg-light"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSelect(item)}
                        >
                            {isObjectOptions ? item.name : item}
                        </div>
                    ))}
                    {/* {filteredOptions.map((item, index) => {
                        console.log("Item", item);
                        return (
                            <div
                                key={index}
                                className="px-3 py-2 hover-bg-light"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSelect(item)}
                            >
                                {isObjectOptions ? item.title : item}
                            </div>
                        )
                    })} */}
                </div>
            )}

            {error && touched && <div className="text-danger small mt-1">{error}</div>}
        </div>
    );
};

export default Dropdown;
