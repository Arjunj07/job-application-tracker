import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  Plus,
  MoreVertical,
  Video,
  Clock,
  User,
  MapPin,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
} from "lucide-react";
import "./interviews.css";

const STATUS_CONFIG = {
  Scheduled: {
    label: "Scheduled",
    color: "var(--status-offer-text, #047857)",
    bg: "var(--status-offer-bg, #ecfdf5)",
  },
  Completed: {
    label: "Completed",
    color: "var(--status-applied-text, #1d4ed8)",
    bg: "var(--status-applied-bg, #eff6ff)",
  },
  Rescheduled: {
    label: "Rescheduled",
    color: "var(--status-screening-text, #b45309)",
    bg: "var(--status-screening-bg, #fffbeb)",
  },
  Cancelled: {
    label: "Cancelled",
    color: "var(--status-rejected-text, #be123c)",
    bg: "var(--status-rejected-bg, #fef2f2)",
  },
};

const INITIAL_FORM = {
  id: null,
  company: "",
  position: "",
  round: "Technical Interview",
  type: "Google Meet",
  date: new Date().toISOString().split("T")[0],
  time: "10:30 AM",
  interviewer: "",
  meetingLink: "",
  status: "Scheduled",
  notes: "",
};

function Interviews() {
  // Main data state - initialized empty without hardcoded dummy data
  const [interviews, setInterviews] = useState([]);

  // Active filter tab: 'Upcoming' | 'Completed' | 'All'
  const [activeTab, setActiveTab] = useState("Upcoming");

  // Date/Calendar dropdown filter
  const [dateFilter, setDateFilter] = useState("Calendar");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Active action menu ID (3 dots)
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal State for Schedule/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const menuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
      if (!event.target.closest(".interview-card-menu-wrap")) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered interviews according to selected tab and date filter
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      if (activeTab === "Upcoming") {
        return item.status === "Scheduled" || item.status === "Rescheduled";
      }
      if (activeTab === "Completed") {
        return item.status === "Completed";
      }
      return true; // 'All'
    });
  }, [interviews, activeTab]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setFormData({
      ...INITIAL_FORM,
      id: Date.now(),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (interview, e) => {
    if (e) e.stopPropagation();
    setFormData({ ...interview });
    setFormErrors({});
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveInterview = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.company.trim()) errors.company = "Company is required";
    if (!formData.position.trim()) errors.position = "Position is required";
    if (!formData.date.trim()) errors.date = "Date is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setInterviews((prev) => {
      const exists = prev.some((item) => item.id === formData.id);
      if (exists) {
        return prev.map((item) => (item.id === formData.id ? { ...formData } : item));
      } else {
        return [{ ...formData }, ...prev];
      }
    });

    setIsModalOpen(false);
    setFormData(INITIAL_FORM);
  };

  const handleDeleteInterview = (id) => {
    setInterviews((prev) => prev.filter((item) => item.id !== id));
    setDeleteConfirmId(null);
    setActiveMenuId(null);
  };

  const handleToggleStatus = (id, newStatus, e) => {
    if (e) e.stopPropagation();
    setInterviews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setActiveMenuId(null);
  };

  return (
    <div className="interviews-container">
      {/* Top Header & Tabs Row matching UI_REF.png */}
      <div className="interviews-header-row">
        <div className="interviews-left-header">
          <h1 className="interviews-title">Interviews</h1>
          <div className="interviews-tabs">
            {["Upcoming", "Completed", "All"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`interviews-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="interviews-right-actions" ref={menuRef}>
          {/* Calendar Dropdown */}
          <div className="calendar-dropdown-wrap">
            <button
              type="button"
              className="calendar-btn"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <Calendar size={14} className="calendar-icon" />
              <span>{dateFilter}</span>
              <ChevronDown size={14} className="chevron-icon" />
            </button>

            {isCalendarOpen && (
              <div className="calendar-menu">
                {["Calendar", "This Week", "This Month", "All Dates"].map((opt) => (
                  <div
                    key={opt}
                    className={`calendar-menu-item ${dateFilter === opt ? "selected" : ""}`}
                    onClick={() => {
                      setDateFilter(opt);
                      setIsCalendarOpen(false);
                    }}
                  >
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule Interview Primary Button */}
          <button
            type="button"
            className="schedule-interview-btn"
            onClick={handleOpenAddModal}
          >
            <Plus size={15} />
            <span>Add Interview</span>
          </button>
        </div>
      </div>

      {/* Main Interview Cards Grid */}
      <div className="interviews-content-area">
        {filteredInterviews.length === 0 ? (
          /* Clean Empty State */
          <div className="interviews-empty-card">
            <div className="empty-icon-box">
              <Calendar size={32} />
            </div>
            <h3 className="empty-title">
              {activeTab === "Upcoming"
                ? "No upcoming interviews"
                : activeTab === "Completed"
                ? "No completed interviews"
                : "No interviews scheduled yet"}
            </h3>
            <p className="empty-subtitle">
              Schedule your upcoming technical rounds, screenings, and hiring manager calls to keep your calendar organized.
            </p>
            <button
              type="button"
              className="schedule-interview-btn"
              onClick={handleOpenAddModal}
            >
              <Plus size={15} />
              <span>Schedule Interview</span>
            </button>
          </div>
        ) : (
          <div className="interviews-grid">
            {filteredInterviews.map((item) => {
              const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.Scheduled;
              const isMenuOpen = activeMenuId === item.id;

              return (
                <div key={item.id} className="interview-card">
                  {/* Card Header: Company & Position + 3-dots Menu */}
                  <div className="interview-card-header">
                    <div className="interview-card-brand">
                      <h3 className="card-company-name">{item.company}</h3>
                      <p className="card-position-name">{item.position}</p>
                    </div>

                    <div className="interview-card-menu-wrap">
                      <button
                        type="button"
                        className="card-more-btn"
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : item.id)
                        }
                        title="Actions"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {isMenuOpen && (
                        <div className="card-menu-dropdown">
                          <div
                            className="card-menu-item"
                            onClick={(e) => handleOpenEditModal(item, e)}
                          >
                            <Edit size={13} />
                            <span>Edit</span>
                          </div>
                          {item.status !== "Completed" && (
                            <div
                              className="card-menu-item"
                              onClick={(e) =>
                                handleToggleStatus(item.id, "Completed", e)
                              }
                            >
                              <CheckCircle size={13} />
                              <span>Mark Completed</span>
                            </div>
                          )}
                          {item.status !== "Scheduled" && (
                            <div
                              className="card-menu-item"
                              onClick={(e) =>
                                handleToggleStatus(item.id, "Scheduled", e)
                              }
                            >
                              <Clock size={13} />
                              <span>Mark Scheduled</span>
                            </div>
                          )}
                          <div
                            className="card-menu-item delete"
                            onClick={() => {
                              setDeleteConfirmId(item.id);
                              setActiveMenuId(null);
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body matching UI_REF.png */}
                  <div className="interview-card-body">
                    {/* Interview Round */}
                    <div className="interview-field-row">
                      <span className="field-label">Interview round</span>
                      <span className="field-val highlight">{item.round || "Technical Interview"}</span>
                    </div>

                    {/* Interview Type */}
                    <div className="interview-field-row">
                      <span className="field-label">Interview type</span>
                      <span className="field-val">{item.type || "Google Meet"}</span>
                    </div>

                    {/* Date */}
                    <div className="interview-field-row">
                      <span className="field-label">Date</span>
                      <span className="field-val">{item.date || "—"}</span>
                    </div>

                    {/* Time */}
                    <div className="interview-field-row">
                      <span className="field-label">Time</span>
                      <span className="field-val">{item.time || "10:30 AM"}</span>
                    </div>

                    {/* Interviewer */}
                    <div className="interview-field-row">
                      <span className="field-label">Interviewer</span>
                      <span className="field-val">{item.interviewer || "—"}</span>
                    </div>

                    {/* Meeting Link */}
                    <div className="interview-field-row">
                      <span className="field-label">Meeting link</span>
                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="meeting-link-anchor"
                        >
                          <span>Meeting link</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="meeting-link-placeholder">Meeting link</span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="interview-status-row">
                      <span
                        className="interview-status-pill"
                        style={{
                          backgroundColor: statusCfg.bg,
                          color: statusCfg.color,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Schedule / Edit Interview */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="modal-header">
              <h3 className="modal-title">
                {formData.id && interviews.some((i) => i.id === formData.id)
                  ? "Edit Interview"
                  : "Schedule Interview"}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveInterview} className="modal-form">
              <div className="modal-body">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Company Name *</label>
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

                  <div className="form-group">
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
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Interview Round</label>
                    <input
                      type="text"
                      placeholder="e.g. Technical Interview"
                      value={formData.round}
                      onChange={(e) =>
                        setFormData({ ...formData, round: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Interview Type / Platform</label>
                    <input
                      type="text"
                      placeholder="e.g. Google Meet, Zoom, On-site"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className={formErrors.date ? "error" : ""}
                    />
                  </div>

                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 10:30 AM"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Interviewer Name / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe (Tech Lead)"
                      value={formData.interviewer}
                      onChange={(e) =>
                        setFormData({ ...formData, interviewer: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Rescheduled">Rescheduled</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Meeting Link / Location</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={formData.meetingLink}
                    onChange={(e) =>
                      setFormData({ ...formData, meetingLink: e.target.value })
                    }
                  />
                </div>

                <div className="form-group full-width">
                  <label>Preparation Notes & Agenda</label>
                  <textarea
                    rows={3}
                    placeholder="Topics to prepare, system design questions, recruiter notes..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div
            className="delete-modal-box"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
          >
            <div className="delete-icon">
              <AlertCircle size={26} />
            </div>
            <h3 className="delete-title">Delete Interview?</h3>
            <p className="delete-desc">
              Are you sure you want to remove this interview? This action cannot be undone.
            </p>
            <div className="delete-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => handleDeleteInterview(deleteConfirmId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interviews;
