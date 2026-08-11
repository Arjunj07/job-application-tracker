import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, SlidersHorizontal, X, Check } from "lucide-react";
import "./FilterBar.css";

const FILTER_CONFIG = [
  {
    key: "status",
    label: "Status",
    options: [
      "All Statuses",
      "Saved",
      "Applied",
      "Screening",
      "Assessment",
      "Interview",
      "Final Interview",
      "Offer",
      "Rejected",
    ],
  },
  {
    key: "company",
    label: "Company",
    options: [
      "All Companies",
      "Google",
      "Microsoft",
      "Amazon",
      "Meta",
      "Apple",
      "Netflix",
      "Stripe",
    ],
  },
  {
    key: "source",
    label: "Source",
    options: [
      "All Sources",
      "LinkedIn",
      "Indeed",
      "Company Website",
      "Referral",
      "Glassdoor",
    ],
  },
  {
    key: "date",
    label: "Date",
    options: [
      "All Dates",
      "Today",
      "Past 7 Days",
      "Past 30 Days",
      "Past 3 Months",
    ],
  },
  {
    key: "sort",
    label: "Fast Sizing",
    options: [
      "Fast Sizing",
      "Most Recent",
      "Oldest First",
      "Company (A-Z)",
      "Status",
    ],
  },
];

function FilterBar({ onFilterChange, onSearchChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    status: "",
    company: "",
    source: "",
    date: "",
    sort: "",
  });

  const barRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleSelectOption = (key, option) => {
    const isAll =
      option.startsWith("All ") ||
      option === "All Statuses" ||
      option === "All Companies" ||
      option === "All Sources" ||
      option === "All Dates" ||
      option === "Fast Sizing";
    const newVal = isAll ? "" : option;

    const updated = {
      ...selectedFilters,
      [key]: newVal,
    };
    setSelectedFilters(updated);
    setOpenDropdown(null);
    if (onFilterChange) onFilterChange(updated);
  };

  const clearAllFilters = () => {
    const reset = {
      status: "",
      company: "",
      source: "",
      date: "",
      sort: "",
    };
    setSelectedFilters(reset);
    setSearchTerm("");
    if (onFilterChange) onFilterChange(reset);
    if (onSearchChange) onSearchChange("");
  };

  const activeCount = Object.values(selectedFilters).filter(Boolean).length;

  return (
    <div className="filter-bar-container" ref={barRef}>
      {/* Search Input Box */}
      <div className="filter-search-box">
        <Search className="filter-search-icon" size={16} />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="filter-search-input"
        />
        {searchTerm && (
          <button
            type="button"
            className="filter-search-clear"
            onClick={() => {
              setSearchTerm("");
              if (onSearchChange) onSearchChange("");
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters Label / Button */}
      <button
        type="button"
        className={`filter-badge-btn ${activeCount > 0 ? "has-active" : ""}`}
        onClick={activeCount > 0 ? clearAllFilters : undefined}
        title={activeCount > 0 ? "Click to reset filters" : "Filters"}
      >
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="active-badge-count">{activeCount}</span>
        )}
      </button>

      {/* Filter Dropdowns */}
      <div className="filter-dropdowns-group">
        {FILTER_CONFIG.map((filter) => {
          const isOpen = openDropdown === filter.key;
          const selectedValue = selectedFilters[filter.key];
          const displayLabel = selectedValue || filter.label;

          return (
            <div key={filter.key} className="filter-dropdown-wrapper">
              <button
                type="button"
                className={`filter-dropdown-btn ${
                  selectedValue ? "is-selected" : ""
                } ${isOpen ? "is-open" : ""}`}
                onClick={() => setOpenDropdown(isOpen ? null : filter.key)}
              >
                <span className="filter-btn-text">{displayLabel}</span>
                <ChevronDown
                  size={14}
                  className={`filter-chevron ${isOpen ? "rotate" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="filter-dropdown-menu">
                  <div className="filter-dropdown-header">
                    <span>{filter.label}</span>
                    {selectedValue && (
                      <button
                        type="button"
                        className="filter-clear-single"
                        onClick={() =>
                          handleSelectOption(filter.key, `All ${filter.label}`)
                        }
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <ul className="filter-options-list">
                    {filter.options.map((option) => {
                      const isSelected =
                        selectedValue === option ||
                        (!selectedValue &&
                          (option.startsWith("All ") ||
                            option === "All Statuses" ||
                            option === "All Companies" ||
                            option === "All Sources" ||
                            option === "All Dates" ||
                            option === "Fast Sizing"));
                      return (
                        <li
                          key={option}
                          className={`filter-option-item ${
                            isSelected ? "selected" : ""
                          }`}
                          onClick={() => handleSelectOption(filter.key, option)}
                        >
                          <span>{option}</span>
                          {isSelected && (
                            <Check size={14} className="check-icon" />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;
