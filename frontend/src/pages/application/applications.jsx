import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Filter,
  X,
  Check,
  Building2,
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign,
  Edit,
  Plus,
  MoreHorizontal,
  ArrowLeft,
  FileText,
  Clock,
  User,
  Mail,
  CheckCircle,
  Circle,
  Tag,
  Trash2,
} from "lucide-react";
import "./applications.css";

// Status configuration matching the colors in UI_REF.png
export const STATUS_CONFIG = {
  Interview: {
    label: "Interview",
    color: "var(--status-interview-text, #6d28d9)",
    bg: "var(--status-interview-bg, #f5f3ff)",
  },
  Screening: {
    label: "Screening",
    color: "var(--status-screening-text, #b45309)",
    bg: "var(--status-screening-bg, #fffbeb)",
  },
  Applied: {
    label: "Applied",
    color: "var(--status-applied-text, #1d4ed8)",
    bg: "var(--status-applied-bg, #eff6ff)",
  },
  Offer: {
    label: "Offer",
    color: "var(--status-offer-text, #047857)",
    bg: "var(--status-offer-bg, #ecfdf5)",
  },
  Rejected: {
    label: "Rejected",
    color: "var(--status-rejected-text, #be123c)",
    bg: "var(--status-rejected-bg, #fef2f2)",
  },
};

const STATUS_OPTIONS = ["All", "Interview", "Screening", "Applied", "Offer", "Rejected"];
const SOURCE_OPTIONS = ["All", "LinkedIn", "Indeed", "Company Website", "Referral", "Other"];
const DATE_OPTIONS = ["All", "Today", "Past 7 Days", "Past 30 Days", "Past 3 Months"];
const SORT_OPTIONS = ["Fast Sizing", "Most Recent", "Oldest First", "Company (A-Z)", "Position (A-Z)"];

const INITIAL_FORM = {
  id: null,
  company: "",
  position: "",
  status: "Applied",
  appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
  location: "",
  workMode: "Remote",
  salary: "",
  source: "LinkedIn",
  jobUrl: "",
  nextActivity: "Next Activity",
  jdSummary: "",
  skills: [],
  contactName: "",
  contactRole: "Recruiter",
  contactEmail: "",
  notes: "",
  timeline: [],
  documents: [],
};

// Generate company logo initial & background color
function getCompanyBadgeStyle(companyName = "") {
  const firstLetter = (companyName.trim()[0] || "C").toUpperCase();
  const colors = [
    { bg: "#0284c7", color: "#ffffff" }, // Blue (Creware style)
    { bg: "#0f172a", color: "#ffffff" }, // Dark Slate (Acme style)
    { bg: "#7c3aed", color: "#ffffff" }, // Purple
    { bg: "#059669", color: "#ffffff" }, // Emerald
    { bg: "#ea580c", color: "#ffffff" }, // Orange
  ];
  const charCode = firstLetter.charCodeAt(0);
  const selected = colors[charCode % colors.length];
  return { initial: firstLetter, bg: selected.bg, color: selected.color };
}

function Applications() {
  // Main data state - initialized empty without hardcoded dummy data
  const [applications, setApplications] = useState([]);

  // View state: 'list' (Applications Screen) | 'details' (Application Details Screen)
  const [currentView, setCurrentView] = useState("list");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("Overview");

  // Selection state for checkboxes
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  // Search and Filter states matching UI_REF.png
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [fastSizingFilter, setFastSizingFilter] = useState("Fast Sizing");

  // Filter Dropdown Open State
  const [openDropdown, setOpenDropdown] = useState(null); // 'status' | 'company' | 'source' | 'date' | 'sort' | null

  // Modal State for Adding/Editing Application
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});

  const filterBarRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Unique companies derived from data
  const uniqueCompanies = useMemo(() => {
    const list = Array.from(new Set(applications.map((a) => a.company).filter(Boolean)));
    return ["All", ...list];
  }, [applications]);

  // Filtered & Sorted applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchCompany = app.company?.toLowerCase().includes(q);
          const matchPosition = app.position?.toLowerCase().includes(q);
          const matchLocation = app.location?.toLowerCase().includes(q);
          const matchSource = app.source?.toLowerCase().includes(q);
          if (!matchCompany && !matchPosition && !matchLocation && !matchSource) {
            return false;
          }
        }
        if (statusFilter !== "All" && app.status !== statusFilter) return false;
        if (companyFilter !== "All" && app.company !== companyFilter) return false;
        if (sourceFilter !== "All" && app.source !== sourceFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (fastSizingFilter === "Company (A-Z)") {
          return (a.company || "").localeCompare(b.company || "");
        }
        if (fastSizingFilter === "Position (A-Z)") {
          return (a.position || "").localeCompare(b.position || "");
        }
        return 0;
      });
  }, [applications, searchTerm, statusFilter, companyFilter, sourceFilter, fastSizingFilter]);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredApplications.map((app) => app.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id, e) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Application Details Screen (UI_REF.png top right)
  const handleOpenDetails = (app) => {
    setSelectedApplication(app);
    setActiveDetailTab("Overview");
    setCurrentView("details");
  };

  const handleBackToList = () => {
    setCurrentView("list");
  };

  // Add / Edit Modal handlers
  const handleOpenAddModal = () => {
    setFormData({
      ...INITIAL_FORM,
      id: Date.now(),
      appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app, e) => {
    if (e) e.stopPropagation();
    setFormData({ ...app });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSaveApplication = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.company.trim()) errors.company = "Company is required";
    if (!formData.position.trim()) errors.position = "Position is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setApplications((prev) => {
      const exists = prev.some((a) => a.id === formData.id);
      if (exists) {
        return prev.map((a) => (a.id === formData.id ? { ...formData } : a));
      } else {
        return [{ ...formData }, ...prev];
      }
    });

    if (selectedApplication && selectedApplication.id === formData.id) {
      setSelectedApplication(formData);
    }

    setIsModalOpen(false);
    setFormData(INITIAL_FORM);
  };

  const handleDeleteApplication = (id, e) => {
    if (e) e.stopPropagation();
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setSelectedRowIds((prev) => prev.filter((item) => item !== id));
    if (selectedApplication && selectedApplication.id === id) {
      setCurrentView("list");
      setSelectedApplication(null);
    }
  };

  // =========================================================================
  // VIEW 1: APPLICATION DETAILS SCREEN (Matches UI_REF.png top right screen)
  // =========================================================================
  if (currentView === "details" && selectedApplication) {
    const app = selectedApplication;
    const badge = getCompanyBadgeStyle(app.company);
    const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;

    return (
      <div className="app-details-container">
        {/* Back Navigation Bar */}
        <div className="details-top-nav">
          <button
            type="button"
            className="back-btn"
            onClick={handleBackToList}
          >
            <ArrowLeft size={16} />
            <span>Back to Applications</span>
          </button>
        </div>

        {/* Header matching UI_REF.png */}
        <div className="details-header-card">
          <div className="details-header-left">
            <div
              className="details-company-logo"
              style={{ backgroundColor: badge.bg, color: badge.color }}
            >
              {badge.initial}
            </div>
            <div className="details-title-info">
              <h2 className="details-company-name">{app.company}</h2>
              <div className="details-position-row">
                <span className="details-position-text">{app.position}</span>
                <span
                  className="status-badge"
                  style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                >
                  {app.status}
                </span>
              </div>
            </div>
          </div>

          <div className="details-header-actions">
            <button
              type="button"
              className="action-btn-outline"
              onClick={(e) => handleOpenEditModal(app, e)}
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
            <button type="button" className="action-btn-outline">
              <span>Add Interview</span>
            </button>
            <button type="button" className="action-btn-primary">
              <span>Add Task</span>
            </button>
            <button type="button" className="action-btn-outline icon-only">
              <span>More</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs matching UI_REF.png */}
        <div className="details-tabs-bar">
          {["Overview", "Interviews", "Tasks", "Notes", "Documents", "Activity"].map(
            (tab) => (
              <button
                key={tab}
                type="button"
                className={`details-tab ${activeDetailTab === tab ? "active" : ""}`}
                onClick={() => setActiveDetailTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* 2-Column Content Layout matching UI_REF.png */}
        <div className="details-content-grid">
          {/* Left Column (Job Info & JD Summary) */}
          <div className="details-main-col">
            {/* Job Info Card */}
            <div className="ref-card">
              <div className="ref-card-header">
                <h3 className="ref-card-title">Job Info</h3>
                <span className="ref-card-sublink">Description</span>
              </div>

              <div className="job-info-list">
                <div className="job-info-row">
                  <span className="job-info-label">Position</span>
                  <span className="job-info-val">{app.position || "—"}</span>
                </div>
                <div className="job-info-row">
                  <span className="job-info-label">Company</span>
                  <span className="job-info-val">{app.company || "—"}</span>
                </div>
                <div className="job-info-row">
                  <span className="job-info-label">Location</span>
                  <span className="job-info-val">{app.location || "—"}</span>
                </div>
                <div className="job-info-row">
                  <span className="job-info-label">Work Mode</span>
                  <span className="job-info-val">{app.workMode || "Remote"}</span>
                </div>
                <div className="job-info-row">
                  <span className="job-info-label">Salary</span>
                  <span className="job-info-val">{app.salary || "—"}</span>
                </div>
                <div className="job-info-row">
                  <span className="job-info-label">URL</span>
                  <span className="job-info-val">
                    {app.jobUrl ? (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="job-url-link"
                      >
                        {app.jobUrl}
                      </a>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="job-info-row">
                  <span className="job-info-label">Source</span>
                  <span className="job-info-val">{app.source || "LinkedIn"}</span>
                </div>
                <div className="job-info-row">
                  <span className="job-info-label">Applied Date</span>
                  <span className="job-info-val">{app.appliedDate || "—"}</span>
                </div>
              </div>
            </div>

            {/* JD Summary Card */}
            <div className="ref-card">
              <h3 className="ref-card-title">JD Summary</h3>
              <p className="jd-summary-text">
                {app.jdSummary ||
                  "Job summary and key responsibilities recorded for this application. Add notes regarding tech stack requirements, compensation package, and interview preparation."}
              </p>
            </div>

            {/* Skills & Keywords tags */}
            {app.skills && app.skills.length > 0 && (
              <div className="ref-card">
                <h3 className="ref-card-title">Keywords & Skills</h3>
                <div className="skills-tags-wrap">
                  {app.skills.map((skill, i) => (
                    <span key={i} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Timeline, Recruiter, Submitted Docs) */}
          <div className="details-side-col">
            {/* Application Timeline Card */}
            <div className="ref-card">
              <h3 className="ref-card-title">Application Timeline</h3>
              <div className="timeline-list">
                <div className="timeline-item">
                  <span className="timeline-time">9:20 AM</span>
                  <div className="timeline-dot-wrap">
                    <span className="timeline-dot active"></span>
                    <span className="timeline-line"></span>
                  </div>
                  <span className="timeline-event">Interview</span>
                </div>

                <div className="timeline-item">
                  <span className="timeline-time">7:28 AM</span>
                  <div className="timeline-dot-wrap">
                    <span className="timeline-dot"></span>
                    <span className="timeline-line"></span>
                  </div>
                  <span className="timeline-event">Applied</span>
                </div>

                <div className="timeline-item">
                  <span className="timeline-time">10:00 AM</span>
                  <div className="timeline-dot-wrap">
                    <span className="timeline-dot"></span>
                    <span className="timeline-line"></span>
                  </div>
                  <span className="timeline-event">Interview</span>
                </div>

                <div className="timeline-item">
                  <span className="timeline-time">3:30 PM</span>
                  <div className="timeline-dot-wrap">
                    <span className="timeline-dot"></span>
                  </div>
                  <span className="timeline-event">Final Interview</span>
                </div>
              </div>
            </div>

            {/* Recruiter Card */}
            <div className="ref-card">
              <h3 className="ref-card-title">Recruiter</h3>
              <div className="recruiter-profile-row">
                <div className="recruiter-avatar">
                  <User size={18} />
                </div>
                <div className="recruiter-meta">
                  <span className="recruiter-name">{app.contactName || "Jane Doe"}</span>
                  <span className="recruiter-role">{app.contactRole || "Talent Recruiter"}</span>
                  {app.contactEmail && (
                    <span className="recruiter-email">{app.contactEmail}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Submitted Document Card */}
            <div className="ref-card">
              <h3 className="ref-card-title">Submitted</h3>
              <div className="submitted-doc-card">
                <FileText size={18} className="doc-icon" />
                <span className="doc-name">Resume_FullStack_2026.pdf</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: APPLICATIONS SCREEN (Matches UI_REF.png top middle screen)
  // =========================================================================
  return (
    <div className="applications-ref-container">
      {/* Title */}
      <div className="applications-top-heading">
        <h1 className="ref-page-title">Applications</h1>
      </div>

      {/* Filter Bar matching UI_REF.png */}
      <div className="ref-filter-bar" ref={filterBarRef}>
        {/* Search Input Box */}
        <div className="ref-search-box">
          <Search className="ref-search-icon" size={16} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters Badge Button */}
        <button
          type="button"
          className="ref-filter-btn ref-filters-label-btn"
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("All");
            setCompanyFilter("All");
            setSourceFilter("All");
            setDateFilter("All");
            setFastSizingFilter("Fast Sizing");
          }}
        >
          Filters
        </button>

        {/* Status Dropdown Box */}
        <div className="ref-dropdown-container">
          <button
            type="button"
            className="ref-filter-btn"
            onClick={() =>
              setOpenDropdown(openDropdown === "status" ? null : "status")
            }
          >
            <span>{statusFilter === "All" ? "Status" : statusFilter}</span>
            <ChevronDown size={14} className="chevron-icon" />
          </button>
          {openDropdown === "status" && (
            <div className="ref-dropdown-menu">
              {STATUS_OPTIONS.map((st) => (
                <div
                  key={st}
                  className={`ref-dropdown-item ${statusFilter === st ? "selected" : ""}`}
                  onClick={() => {
                    setStatusFilter(st);
                    setOpenDropdown(null);
                  }}
                >
                  <span>{st === "All" ? "All Statuses" : st}</span>
                  {statusFilter === st && <Check size={14} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Company Dropdown Box */}
        <div className="ref-dropdown-container">
          <button
            type="button"
            className="ref-filter-btn"
            onClick={() =>
              setOpenDropdown(openDropdown === "company" ? null : "company")
            }
          >
            <span>{companyFilter === "All" ? "Company" : companyFilter}</span>
            <ChevronDown size={14} className="chevron-icon" />
          </button>
          {openDropdown === "company" && (
            <div className="ref-dropdown-menu">
              {uniqueCompanies.map((comp) => (
                <div
                  key={comp}
                  className={`ref-dropdown-item ${companyFilter === comp ? "selected" : ""}`}
                  onClick={() => {
                    setCompanyFilter(comp);
                    setOpenDropdown(null);
                  }}
                >
                  <span>{comp === "All" ? "All Companies" : comp}</span>
                  {companyFilter === comp && <Check size={14} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Source Dropdown Box */}
        <div className="ref-dropdown-container">
          <button
            type="button"
            className="ref-filter-btn"
            onClick={() =>
              setOpenDropdown(openDropdown === "source" ? null : "source")
            }
          >
            <span>{sourceFilter === "All" ? "Source" : sourceFilter}</span>
            <ChevronDown size={14} className="chevron-icon" />
          </button>
          {openDropdown === "source" && (
            <div className="ref-dropdown-menu">
              {SOURCE_OPTIONS.map((src) => (
                <div
                  key={src}
                  className={`ref-dropdown-item ${sourceFilter === src ? "selected" : ""}`}
                  onClick={() => {
                    setSourceFilter(src);
                    setOpenDropdown(null);
                  }}
                >
                  <span>{src === "All" ? "All Sources" : src}</span>
                  {sourceFilter === src && <Check size={14} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Dropdown Box */}
        <div className="ref-dropdown-container">
          <button
            type="button"
            className="ref-filter-btn"
            onClick={() =>
              setOpenDropdown(openDropdown === "date" ? null : "date")
            }
          >
            <span>{dateFilter === "All" ? "Date" : dateFilter}</span>
            <ChevronDown size={14} className="chevron-icon" />
          </button>
          {openDropdown === "date" && (
            <div className="ref-dropdown-menu">
              {DATE_OPTIONS.map((d) => (
                <div
                  key={d}
                  className={`ref-dropdown-item ${dateFilter === d ? "selected" : ""}`}
                  onClick={() => {
                    setDateFilter(d);
                    setOpenDropdown(null);
                  }}
                >
                  <span>{d === "All" ? "All Dates" : d}</span>
                  {dateFilter === d && <Check size={14} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fast Sizing Dropdown Box */}
        <div className="ref-dropdown-container">
          <button
            type="button"
            className="ref-filter-btn"
            onClick={() =>
              setOpenDropdown(openDropdown === "sort" ? null : "sort")
            }
          >
            <span>{fastSizingFilter}</span>
            <ChevronDown size={14} className="chevron-icon" />
          </button>
          {openDropdown === "sort" && (
            <div className="ref-dropdown-menu right-aligned">
              {SORT_OPTIONS.map((sortOpt) => (
                <div
                  key={sortOpt}
                  className={`ref-dropdown-item ${fastSizingFilter === sortOpt ? "selected" : ""}`}
                  onClick={() => {
                    setFastSizingFilter(sortOpt);
                    setOpenDropdown(null);
                  }}
                >
                  <span>{sortOpt}</span>
                  {fastSizingFilter === sortOpt && <Check size={14} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Application Button */}
        <button
          type="button"
          className="ref-add-app-btn"
          onClick={handleOpenAddModal}
        >
          <Plus size={15} />
          <span>Add Application</span>
        </button>
      </div>

      {/* Applications Table Card matching UI_REF.png */}
      <div className="ref-table-card">
        <div className="table-responsive">
          <table className="ref-applications-table">
            <thead>
              <tr>
                <th style={{ width: "36px" }} className="ref-th-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      filteredApplications.length > 0 &&
                      selectedRowIds.length === filteredApplications.length
                    }
                    onChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </th>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Location</th>
                <th>Source</th>
                <th>Next Activity</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                /* Clean Empty State row */
                <tr>
                  <td colSpan="8" className="ref-table-empty">
                    <div className="empty-content">
                      <p className="empty-title">No applications yet</p>
                      <p className="empty-subtitle">
                        Click "+ Add Application" or connect your backend to view your applications list.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const badge = getCompanyBadgeStyle(app.company);
                  const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
                  const isSelected = selectedRowIds.includes(app.id);

                  return (
                    <tr
                      key={app.id}
                      className={`ref-table-row ${isSelected ? "selected-row" : ""}`}
                      onClick={() => handleOpenDetails(app)}
                    >
                      {/* Checkbox */}
                      <td className="ref-td-checkbox" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(app.id, e)}
                          aria-label={`Select ${app.company}`}
                        />
                      </td>

                      {/* Company with Square Icon + Name matching UI_REF.png */}
                      <td>
                        <div className="ref-company-cell">
                          <div
                            className="ref-company-avatar-box"
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                            }}
                          >
                            {badge.initial}
                          </div>
                          <span className="ref-company-text">{app.company}</span>
                        </div>
                      </td>

                      {/* Position */}
                      <td>
                        <span className="ref-position-text">{app.position}</span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className="ref-status-pill"
                          style={{
                            backgroundColor: statusCfg.bg,
                            color: statusCfg.color,
                          }}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Applied Date */}
                      <td>
                        <span className="ref-date-text">{app.appliedDate || "—"}</span>
                      </td>

                      {/* Location */}
                      <td>
                        <span className="ref-meta-text">{app.location || "Location"}</span>
                      </td>

                      {/* Source */}
                      <td>
                        <span className="ref-meta-text">{app.source || "LinkedIn"}</span>
                      </td>

                      {/* Next Activity */}
                      <td>
                        <span className="ref-activity-text">
                          {app.nextActivity || "Next Activity"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with pagination matching UI_REF.png */}
        <div className="ref-table-footer">
          <span className="ref-footer-count">
            {filteredApplications.length > 0
              ? `015 rows`
              : "0 rows"}
          </span>

          <div className="ref-pagination-controls">
            <button type="button" className="ref-page-nav-btn" disabled>
              <ChevronLeft size={14} />
            </button>
            <span className="ref-page-num active">1</span>
            <span className="ref-page-num">2</span>
            <span className="ref-page-num">3</span>
            <button type="button" className="ref-page-nav-btn">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Application Modal */}
      {isModalOpen && (
        <div className="ref-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="ref-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="ref-modal-header">
              <h3 className="ref-modal-title">
                {formData.id && applications.some((a) => a.id === formData.id)
                  ? "Edit Application"
                  : "Add Application"}
              </h3>
              <button
                type="button"
                className="ref-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveApplication} className="ref-modal-body">
              <div className="ref-form-grid">
                <div className="ref-form-field">
                  <label>Company *</label>
                  <input
                    type="text"
                    placeholder="e.g. Creware Technologies"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className={formErrors.company ? "error" : ""}
                  />
                </div>

                <div className="ref-form-field">
                  <label>Position *</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Engineer"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className={formErrors.position ? "error" : ""}
                  />
                </div>

                <div className="ref-form-field">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    {STATUS_OPTIONS.filter((s) => s !== "All").map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ref-form-field">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Linköping / Remote"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div className="ref-form-field">
                  <label>Source</label>
                  <input
                    type="text"
                    placeholder="e.g. LinkedIn, Indeed"
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                  />
                </div>

                <div className="ref-form-field">
                  <label>Salary</label>
                  <input
                    type="text"
                    placeholder="e.g. $120k - $140k"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                  />
                </div>

                <div className="ref-form-field full-width">
                  <label>Job Posting URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.jobUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, jobUrl: e.target.value })
                    }
                  />
                </div>

                <div className="ref-form-field full-width">
                  <label>JD Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Summary of responsibilities and requirements..."
                    value={formData.jdSummary}
                    onChange={(e) =>
                      setFormData({ ...formData, jdSummary: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="ref-modal-footer">
                <button
                  type="button"
                  className="ref-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ref-btn-submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;
