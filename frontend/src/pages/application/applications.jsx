import React from "react";
import { Search, ChevronDown } from "lucide-react";
import "./applications.css";

function Applications() {
  return (
    <div className="applications-container">
      <div className="applications-header">
        <h1>Applications</h1>
      </div>

      <div className="top-div">
        {/* Search Input Box */}
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input type="text" placeholder="Search" />
        </div>

        {/* Filters Badge Button */}
        <button type="button" className="filter-btn filter-badge-btn">
          Filters
        </button>

        {/* Status Dropdown Box */}
        <button type="button" className="filter-btn">
          <span>Status</span>
          <ChevronDown size={14} className="chevron-icon" />
        </button>

        {/* Company Dropdown Box */}
        <button type="button" className="filter-btn">
          <span>Company</span>
          <ChevronDown size={14} className="chevron-icon" />
        </button>

        {/* Source Dropdown Box */}
        <button type="button" className="filter-btn">
          <span>Source</span>
          <ChevronDown size={14} className="chevron-icon" />
        </button>

        {/* Date Dropdown Box */}
        <button type="button" className="filter-btn">
          <span>Date</span>
          <ChevronDown size={14} className="chevron-icon" />
        </button>

        {/* Fast Sizing Dropdown Box */}
        <button type="button" className="filter-btn">
          <span>Fast Sizing</span>
          <ChevronDown size={14} className="chevron-icon" />
        </button>
      </div>
      
    </div>
  );
}

export default Applications;

