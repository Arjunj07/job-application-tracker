import React, { useState, useMemo } from "react";
import {
  Users,
  User,
  Search,
  ChevronDown,
  Plus,
  Mail,
  Phone,
  Building2,
  MoreVertical,
  Edit,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import "./contacts.css";

const INITIAL_CONTACT_FORM = {
  id: null,
  name: "",
  company: "",
  role: "Recruiter",
  email: "",
  phone: "",
  lastContacted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
  notes: "",
};

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_CONTACT_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          c.name?.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.role?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [contacts, searchTerm]);

  const handleOpenAddModal = () => {
    setFormData({ ...INITIAL_CONTACT_FORM, id: Date.now() });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact, e) => {
    if (e) e.stopPropagation();
    setFormData({ ...contact });
    setFormErrors({});
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = "Contact name is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setContacts((prev) => {
      const exists = prev.some((c) => c.id === formData.id);
      if (exists) {
        return prev.map((c) => (c.id === formData.id ? { ...formData } : c));
      } else {
        return [{ ...formData }, ...prev];
      }
    });

    setIsModalOpen(false);
    setFormData(INITIAL_CONTACT_FORM);
  };

  const handleDeleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
    setActiveMenuId(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredContacts.map((c) => c.id));
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
    <div className="contacts-container">
      {/* Header */}
      <div className="contacts-top-heading">
        <h1 className="contacts-title">Contacts</h1>
      </div>

      {/* Top Quick Badges matching UI_REF.png */}
      <div className="contacts-top-chips">
        <div className="contact-chip-box">
          <div className="chip-avatar blue">C</div>
          <div className="chip-text-group">
            <span className="chip-name">Creware Technologies</span>
            <span className="chip-desc">Tavssony</span>
          </div>
        </div>

        <div className="contact-chip-box">
          <div className="chip-avatar dark">A</div>
          <div className="chip-text-group">
            <span className="chip-name">Acme</span>
            <span className="chip-desc">Developer</span>
          </div>
        </div>

        <div className="contact-chip-box">
          <div className="chip-avatar orange">E</div>
          <div className="chip-text-group">
            <span className="chip-name">Ecsticz Oeromsas</span>
            <span className="chip-desc">Boetsp</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="contacts-action-bar">
        <div className="contacts-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="add-contact-btn"
          onClick={handleOpenAddModal}
        >
          <Plus size={15} />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Contacts Table */}
      <div className="contacts-table-card">
        <div className="table-responsive">
          <table className="contacts-table">
            <thead>
              <tr>
                <th style={{ width: "36px" }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredContacts.length > 0 &&
                      selectedRowIds.length === filteredContacts.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Last Contacted</th>
                <th style={{ width: "60px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="contacts-empty-row">
                    <div className="empty-content">
                      <Users size={32} className="empty-icon" />
                      <p className="empty-title">No contacts added</p>
                      <p className="empty-subtitle">
                        Keep track of recruiters, hiring managers, and referral connections in one directory.
                      </p>
                      <button
                        type="button"
                        className="add-contact-btn"
                        onClick={handleOpenAddModal}
                      >
                        <Plus size={15} />
                        <span>Add Contact</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => {
                  const isSelected = selectedRowIds.includes(contact.id);
                  const isMenuOpen = activeMenuId === contact.id;

                  return (
                    <tr
                      key={contact.id}
                      className={`contact-row ${isSelected ? "selected-row" : ""}`}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(contact.id)}
                        />
                      </td>

                      {/* Name & Avatar */}
                      <td>
                        <div className="contact-name-cell">
                          <div className="contact-avatar-icon">
                            <User size={14} />
                          </div>
                          <div>
                            <span className="contact-name-text">{contact.name}</span>
                            {contact.role && (
                              <span className="contact-role-sub">{contact.role}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td>
                        <span className="meta-text">{contact.company || "—"}</span>
                      </td>

                      {/* Email */}
                      <td>
                        {contact.email ? (
                          <a
                            href={`mailto:${contact.email}`}
                            className="contact-email-link"
                          >
                            {contact.email}
                          </a>
                        ) : (
                          <span className="meta-text">—</span>
                        )}
                      </td>

                      {/* Phone */}
                      <td>
                        <span className="meta-text">{contact.phone || "—"}</span>
                      </td>

                      {/* Last Contacted */}
                      <td>
                        <span className="meta-text">{contact.lastContacted || "—"}</span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }}>
                        <div className="action-menu-wrap">
                          <button
                            type="button"
                            className="more-btn"
                            onClick={() =>
                              setActiveMenuId(isMenuOpen ? null : contact.id)
                            }
                          >
                            <MoreVertical size={16} />
                          </button>

                          {isMenuOpen && (
                            <div className="dropdown-menu">
                              <div
                                className="dropdown-item"
                                onClick={(e) => handleOpenEditModal(contact, e)}
                              >
                                <Edit size={13} />
                                <span>Edit</span>
                              </div>
                              <div
                                className="dropdown-item delete"
                                onClick={() => {
                                  setDeleteConfirmId(contact.id);
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
                {formData.id && contacts.some((c) => c.id === formData.id)
                  ? "Edit Contact"
                  : "Add Contact"}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="modal-form">
              <div className="modal-body">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Dawn Jenkins"
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

                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Google, Creware"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Role / Position</label>
                    <input
                      type="text"
                      placeholder="e.g. Talent Recruiter / Engineering Manager"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 802 856 8133"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. recruiter@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Referral notes, conversation points..."
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
                  Save Contact
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
            <h3 className="delete-title">Delete Contact?</h3>
            <p className="delete-desc">
              Are you sure you want to remove this contact from your tracker?
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
                onClick={() => handleDeleteContact(deleteConfirmId)}
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

export default Contacts;
