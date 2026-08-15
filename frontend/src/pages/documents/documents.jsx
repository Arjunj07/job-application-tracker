import React, { useState, useMemo } from "react";
import {
  FileText,
  Upload,
  Plus,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Eye,
  FileCode,
  FileCheck,
  X,
  AlertCircle,
} from "lucide-react";
import "./documents.css";

const INITIAL_DOC_FORM = {
  id: null,
  name: "",
  category: "Resumes", // 'Resumes' | 'Cover Letters' | 'Other'
  associated: "General Application",
  fileSize: "142 KB",
  uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
};

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState("Resumes"); // 'Resumes' | 'Cover Letters' | 'Other'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_DOC_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => doc.category === activeTab);
  }, [documents, activeTab]);

  const handleOpenAddModal = () => {
    setFormData({
      ...INITIAL_DOC_FORM,
      id: Date.now(),
      category: activeTab,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSaveDocument = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = "Document name is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setDocuments((prev) => {
      const exists = prev.some((d) => d.id === formData.id);
      if (exists) {
        return prev.map((d) => (d.id === formData.id ? { ...formData } : d));
      } else {
        return [{ ...formData }, ...prev];
      }
    });

    setIsModalOpen(false);
    setFormData(INITIAL_DOC_FORM);
  };

  const handleDeleteDocument = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirmId(null);
    setActiveMenuId(null);
  };

  return (
    <div className="documents-container">
      {/* Header & Tabs matching UI_REF.png */}
      <div className="documents-header-row">
        <div>
          <h1 className="documents-title">Documents</h1>
          <p className="documents-subtitle">Add submission documents</p>
        </div>

        <button
          type="button"
          className="upload-doc-btn"
          onClick={handleOpenAddModal}
        >
          <Upload size={15} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Tabs matching UI_REF.png */}
      <div className="documents-tabs-bar">
        {["Resumes", "Cover Letters", "Other"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`documents-tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Documents List / Cards */}
      <div className="documents-content-area">
        {filteredDocs.length === 0 ? (
          <div className="documents-empty-card">
            <div className="empty-icon-box">
              <FileText size={32} className="doc-empty-icon" />
            </div>
            <h3 className="empty-title">No {activeTab.toLowerCase()} uploaded</h3>
            <p className="empty-subtitle">
              Upload tailored resume variations, cover letters, and portfolio PDFs to easily attach to applications.
            </p>
            <button
              type="button"
              className="upload-doc-btn"
              onClick={handleOpenAddModal}
            >
              <Plus size={15} />
              <span>Add Document</span>
            </button>
          </div>
        ) : (
          <div className="documents-stack">
            {filteredDocs.map((doc) => {
              const isMenuOpen = activeMenuId === doc.id;

              return (
                <div key={doc.id} className="doc-item-card">
                  <div className="doc-item-left">
                    <div className="doc-icon-badge">
                      <FileText size={20} />
                    </div>
                    <div className="doc-item-info">
                      <h4 className="doc-filename">{doc.name}</h4>
                      <span className="doc-item-meta">
                        {doc.associated || "Applications"} • {doc.fileSize || "PDF"} • {doc.uploadDate}
                      </span>
                    </div>
                  </div>

                  <div className="doc-item-actions">
                    <div className="doc-menu-wrap">
                      <button
                        type="button"
                        className="doc-more-btn"
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : doc.id)
                        }
                      >
                        <MoreVertical size={16} />
                      </button>

                      {isMenuOpen && (
                        <div className="doc-dropdown-menu">
                          <div
                            className="doc-dropdown-item delete"
                            onClick={() => {
                              setDeleteConfirmId(doc.id);
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
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload / Add Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="modal-header">
              <h3 className="modal-title">Upload Document</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="modal-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>Document Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Resume_FullStack_2026.pdf"
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
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="Resumes">Resumes</option>
                      <option value="Cover Letters">Cover Letters</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Target Application / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Frontend Engineer, Google"
                      value={formData.associated}
                      onChange={(e) =>
                        setFormData({ ...formData, associated: e.target.value })
                      }
                    />
                  </div>
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
                  Save Document
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
            <h3 className="delete-title">Delete Document?</h3>
            <p className="delete-desc">
              Are you sure you want to remove this document from your files?
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
                onClick={() => handleDeleteDocument(deleteConfirmId)}
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

export default Documents;
