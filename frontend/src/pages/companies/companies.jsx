import React, { useState, useMemo } from "react";
import {
  Building2,
  Search,
  ChevronDown,
  Plus,
  MapPin,
  Globe,
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Briefcase,
  X,
  AlertCircle,
} from "lucide-react";
import "./companies.css";

const INITIAL_COMPANY_FORM = {
  id: null,
  name: "",
  industry: "Technology / Software",
  location: "",
  website: "",
  activeApplicationsCount: 1,
  status: "Interview",
  lastActivity: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  notes: "",
};

function getCompanyBadgeStyle(companyName = "") {
  const firstLetter = (companyName.trim()[0] || "C").toUpperCase();
  const colors = [
    { bg: "#0284c7", color: "#ffffff" },
    { bg: "#0f172a", color: "#ffffff" },
    { bg: "#7c3aed", color: "#ffffff" },
    { bg: "#059669", color: "#ffffff" },
    { bg: "#ea580c", color: "#ffffff" },
  ];
  const charCode = firstLetter.charCodeAt(0);
  return { initial: firstLetter, ...colors[charCode % colors.length] };
}

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_COMPANY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          c.name?.toLowerCase().includes(q) ||
          c.industry?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [companies, searchTerm]);

  const handleOpenAddModal = () => {
    setFormData({ ...INITIAL_COMPANY_FORM, id: Date.now() });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (comp, e) => {
    if (e) e.stopPropagation();
    setFormData({ ...comp });
    setFormErrors({});
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = "Company name is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setCompanies((prev) => {
      const exists = prev.some((c) => c.id === formData.id);
      if (exists) {
        return prev.map((c) => (c.id === formData.id ? { ...formData } : c));
      } else {
        return [{ ...formData }, ...prev];
      }
    });

    setIsModalOpen(false);
    setFormData(INITIAL_COMPANY_FORM);
  };

  const handleDeleteCompany = (id) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
    setActiveMenuId(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredCompanies.map((c) => c.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="companies-container">
      {/* Header matching UI_REF.png */}
      <div className="companies-top-heading">
        <h1 className="companies-title">Companies & Contacts</h1>
      </div>

      {/* Top Quick Cards */}
      <div className="companies-summary-cards">
        <div className="summary-chip-card">
          <div className="chip-badge blue">C</div>
          <div className="chip-info">
            <span className="chip-title">Creware</span>
            <span className="chip-sub">11 Applications</span>
          </div>
        </div>
        <div className="summary-chip-card">
          <div className="chip-badge orange">A</div>
          <div className="chip-info">
            <span className="chip-title">Acme Technologies</span>
            <span className="chip-sub">3 Active Roles</span>
          </div>
        </div>
        <div className="summary-chip-card">
          <div className="chip-badge cyan">in</div>
          <div className="chip-info">
            <span className="chip-title">Last Activity</span>
            <span className="chip-sub">Jul 29, 2026</span>
          </div>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="companies-action-bar">
        <div className="companies-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search companies, industry, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="add-company-btn"
          onClick={handleOpenAddModal}
        >
          <Plus size={15} />
          <span>Add Company</span>
        </button>
      </div>

      {/* Companies Table matching UI_REF.png */}
      <div className="companies-table-card">
        <div className="table-responsive">
          <table className="companies-table">
            <thead>
              <tr>
                <th style={{ width: "36px" }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredCompanies.length > 0 &&
                      selectedRowIds.length === filteredCompanies.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Company</th>
                <th>Industry</th>
                <th>Location</th>
                <th>Status</th>
                <th>Active Apps</th>
                <th>Last Activity</th>
                <th style={{ width: "60px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="8" className="companies-empty-row">
                    <div className="empty-content">
                      <Building2 size={32} className="empty-icon" />
                      <p className="empty-title">No companies recorded</p>
                      <p className="empty-subtitle">
                        Add target organizations to track recruitment pipelines, company notes, and contacts.
                      </p>
                      <button
                        type="button"
                        className="add-company-btn"
                        onClick={handleOpenAddModal}
                      >
                        <Plus size={15} />
                        <span>Add Company</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((comp) => {
                  const badge = getCompanyBadgeStyle(comp.name);
                  const isSelected = selectedRowIds.includes(comp.id);
                  const isMenuOpen = activeMenuId === comp.id;

                  return (
                    <tr
                      key={comp.id}
                      className={`company-row ${isSelected ? "selected-row" : ""}`}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(comp.id)}
                        />
                      </td>

                      {/* Company Name & Icon */}
                      <td>
                        <div className="company-cell">
                          <div
                            className="company-avatar-box"
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                            }}
                          >
                            {badge.initial}
                          </div>
                          <span className="company-name-text">{comp.name}</span>
                        </div>
                      </td>

                      {/* Industry */}
                      <td>
                        <span className="meta-text">{comp.industry || "—"}</span>
                      </td>

                      {/* Location */}
                      <td>
                        <span className="meta-text">{comp.location || "—"}</span>
                      </td>

                      {/* Applications Status */}
                      <td>
                        <span className="status-pill-sub">
                          {comp.status || "Active"}
                        </span>
                      </td>

                      {/* Active Apps Count */}
                      <td>
                        <span className="count-badge">
                          {comp.activeApplicationsCount || 1}
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td>
                        <span className="meta-text">{comp.lastActivity || "—"}</span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }}>
                        <div className="action-menu-wrap">
                          <button
                            type="button"
                            className="more-btn"
                            onClick={() =>
                              setActiveMenuId(isMenuOpen ? null : comp.id)
                            }
                          >
                            <MoreVertical size={16} />
                          </button>

                          {isMenuOpen && (
                            <div className="dropdown-menu">
                              <div
                                className="dropdown-item"
                                onClick={(e) => handleOpenEditModal(comp, e)}
                              >
                                <Edit size={13} />
                                <span>Edit</span>
                              </div>
                              <div
                                className="dropdown-item delete"
                                onClick={() => {
                                  setDeleteConfirmId(comp.id);
                                  setActiveMenuId(null);
                                }}
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="modal-header">
              <h3 className="modal-title">
                {formData.id && companies.some((c) => c.id === formData.id)
                  ? "Edit Company"
                  : "Add Company"}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="modal-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Creware Technologies"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={formErrors.name ? "error" : ""}
                  />
                  {formErrors.name && (
                    <span className="error-text">{formErrors.name}</span>
                  )}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Industry</label>
                    <input
                      type="text"
                      placeholder="e.g. Software / Fintech"
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA / Remote"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Website URL</label>
                    <input
                      type="url"
                      placeholder="https://company.com"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Pipeline Stage</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="Interview">Interview</option>
                      <option value="Screening">Screening</option>
                      <option value="Applied">Applied</option>
                      <option value="Offer">Offer</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Company Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Company culture, interview tips, salary insights..."
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
                  Save Company
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
            <h3 className="delete-title">Delete Company?</h3>
            <p className="delete-desc">
              Are you sure you want to remove this company from your tracker?
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
                onClick={() => handleDeleteCompany(deleteConfirmId)}
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

export default Companies;
