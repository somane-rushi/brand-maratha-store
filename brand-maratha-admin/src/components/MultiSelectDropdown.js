import { CFormLabel } from '@coreui/react';
import React, { useEffect, useRef, useState } from 'react';

const MultiSelectDropdown = ({ label, name, placeholder, options, values = [], setFieldValue, error, touched }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);
    const containerRef = useRef(null);

    const toggleValue = (id) => {
        const isSelected = values.includes(id);
        const newValues = isSelected
            ? values.filter((val) => val !== id)
            : [...values, id];
        setFieldValue(name, newValues);
    };

    const filteredOptions = Array.isArray(options)
        ? options.filter((option) => {
            const label = option.name || option.title || '';
            return label.toLowerCase().includes(search.toLowerCase());
        })
        : [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowDropdown(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="mb-3 position-relative" ref={containerRef}>
            <CFormLabel htmlFor={name} className="fw-semibold">
                {label.toUpperCase()} {name === 'catalogue_ids' && <span className="text-danger">*</span>}
            </CFormLabel>

            <div
                className="form-control position-relative"
                onClick={() => setShowDropdown((prev) => !prev)}
                style={{
                    cursor: 'pointer',
                    minHeight: '30px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '4px',
                    overflow: 'hidden',
                }}
            >
                {values.length === 0 && (
                    <span className="text-muted" style={{ opacity: 0.6 }}>
                        {placeholder || `${label}...`}
                    </span>
                )}
                {Array.isArray(values) &&
                    values.map((val, index) => {
                        const option = options.find((opt) => opt.id === val);
                        const labelText = option?.name || option?.title || val;
                        return (
                            <span
                                key={index}
                                className="badge bg-primary d-flex align-items-center"
                                style={{ marginBottom: '4px', marginRight: '4px' }}
                            >
                                {labelText}
                                <button
                                    type="button"
                                    className="btn-close btn-close-white ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleValue(val);
                                    }}
                                    style={{ fontSize: '0.6rem' }}
                                />
                            </span>
                        );
                    })}
                <input
                    type="text"
                    readOnly
                    style={{
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                        flex: '1 0 60px',
                        minWidth: '60px',
                        height: '20px',
                        padding: 0,
                        marginBottom: '4px',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                    }}
                />
            </div>

            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="position-absolute bg-white border mt-1 w-100 shadow-sm rounded"
                    style={{
                        zIndex: 1000,
                        maxHeight: '250px',
                        overflowY: 'auto',
                    }}
                >
                    <div className="p-2 border-bottom sticky-top bg-white">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="form-control form-control-sm"
                        />
                    </div>

                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => {
                            const labelText = option?.name || option?.title || '-';
                            const inputId = `${name}-${option.id}`;
                            return (
                                <div className="d-flex align-items-center px-3 py-2 border-bottom" key={option.id}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={inputId}
                                        value={option.id}
                                        checked={values.includes(option.id)}
                                        onChange={() => toggleValue(option.id)}
                                    />
                                    <label className="form-check-label ms-2" htmlFor={inputId}>
                                        {labelText}
                                    </label>
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-3 py-2 text-muted">No matching options</div>
                    )}
                </div>
            )}

            {error && touched && <div className="text-danger small mt-1">{error}</div>}
        </div>
    );
};

export default MultiSelectDropdown;
