import React, { useState, useMemo } from "react";
import {
  CheckSquare,
  Square,
  Plus,
  Calendar,
  Flag,
  Building2,
  Trash2,
  Edit,
  MoreVertical,
  Clock,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import "./tasks.css";

const PRIORITY_CONFIG = {
  High: { label: "High", color: "var(--status-rejected-text, #be123c)", bg: "var(--status-rejected-bg, #fef2f2)" },
  Medium: { label: "Medium", color: "var(--status-screening-text, #b45309)", bg: "var(--status-screening-bg, #fffbeb)" },
  Low: { label: "Low", color: "var(--status-applied-text, #1d4ed8)", bg: "var(--status-applied-bg, #eff6ff)" },
};

const INITIAL_TASK_FORM = {
  id: null,
  title: "",
  dueDate: new Date().toISOString().split("T")[0],
  priority: "Medium",
  associated: "",
  completed: false,
  notes: "",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("Today"); // 'Today' | 'Upcoming' | 'Completed' | 'All'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_TASK_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter tasks based on activeTab
  const filteredTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return tasks.filter((t) => {
      if (activeTab === "Today") {
        return !t.completed && (t.dueDate === todayStr || !t.dueDate);
      }
      if (activeTab === "Upcoming") {
        return !t.completed && t.dueDate && t.dueDate > todayStr;
      }
      if (activeTab === "Completed") {
        return t.completed;
      }
      return true; // 'All'
    });
  }, [tasks, activeTab]);

  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleOpenAddModal = () => {
    setFormData({
      ...INITIAL_TASK_FORM,
      id: Date.now(),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task, e) => {
    if (e) e.stopPropagation();
    setFormData({ ...task });
    setFormErrors({});
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.title.trim()) errors.title = "Task title is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setTasks((prev) => {
      const exists = prev.some((t) => t.id === formData.id);
      if (exists) {
        return prev.map((t) => (t.id === formData.id ? { ...formData } : t));
      } else {
        return [{ ...formData }, ...prev];
      }
    });

    setIsModalOpen(false);
    setFormData(INITIAL_TASK_FORM);
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirmId(null);
    setActiveMenuId(null);
  };

  return (
    <div className="tasks-container">
      {/* Header & Tabs matching UI_REF.png Tasks Screen */}
      <div className="tasks-header-row">
        <div className="tasks-header-left">
          <h1 className="tasks-title">Tasks</h1>
          <div className="tasks-tabs">
            {["Today", "Upcoming", "Completed", "All"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tasks-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="add-task-btn"
          onClick={handleOpenAddModal}
        >
          <Plus size={15} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Main Tasks Table / List matching UI_REF.png */}
      <div className="tasks-table-card">
        <div className="table-responsive">
          <table className="tasks-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}></th>
                <th>Task</th>
                <th>Due date</th>
                <th>Priority</th>
                <th>Associated</th>
                <th style={{ width: "60px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="tasks-empty-row">
                    <div className="tasks-empty-state">
                      <CheckSquare size={32} className="empty-icon" />
                      <p className="empty-title">
                        {activeTab === "Today"
                          ? "No tasks due today"
                          : activeTab === "Upcoming"
                          ? "No upcoming tasks"
                          : activeTab === "Completed"
                          ? "No completed tasks"
                          : "No tasks created yet"}
                      </p>
                      <p className="empty-subtitle">
                        Create follow-up reminders, interview preparation todos, and document submission tasks.
                      </p>
                      <button
                        type="button"
                        className="add-task-btn"
                        onClick={handleOpenAddModal}
                      >
                        <Plus size={15} />
                        <span>Add Task</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const prio = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;
                  const isMenuOpen = activeMenuId === task.id;

                  return (
                    <tr
                      key={task.id}
                      className={`task-row ${task.completed ? "task-completed-row" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="task-check-col">
                        <button
                          type="button"
                          className="task-checkbox-btn"
                          onClick={() => handleToggleComplete(task.id)}
                          aria-label="Toggle task"
                        >
                          {task.completed ? (
                            <CheckSquare size={18} className="checked-icon" />
                          ) : (
                            <Square size={18} className="unchecked-icon" />
                          )}
                        </button>
                      </td>

                      {/* Task Title */}
                      <td>
                        <span className={`task-title-text ${task.completed ? "completed" : ""}`}>
                          {task.title}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td>
                        <div className="task-meta-cell">
                          <Calendar size={13} className="meta-icon" />
                          <span>{task.dueDate || "No date"}</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td>
                        <span
                          className="task-priority-pill"
                          style={{ color: prio.color, backgroundColor: prio.bg }}
                        >
                          <span
                            className="prio-dot"
                            style={{ backgroundColor: prio.color }}
                          ></span>
                          {prio.label}
                        </span>
                      </td>

                      {/* Associated Company/Application */}
                      <td>
                        {task.associated ? (
                          <div className="task-associated-cell">
                            <Building2 size={13} />
                            <span>{task.associated}</span>
                          </div>
                        ) : (
                          <span className="placeholder-dash">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }}>
                        <div className="task-action-wrap">
                          <button
                            type="button"
                            className="task-action-btn"
                            onClick={() =>
                              setActiveMenuId(isMenuOpen ? null : task.id)
                            }
                          >
                            <MoreVertical size={16} />
                          </button>

                          {isMenuOpen && (
                            <div className="task-dropdown-menu">
                              <div
                                className="task-dropdown-item"
                                onClick={(e) => handleOpenEditModal(task, e)}
                              >
                                <Edit size={13} />
                                <span>Edit</span>
                              </div>
                              <div
                                className="task-dropdown-item delete"
                                onClick={() => {
                                  setDeleteConfirmId(task.id);
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

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="modal-header">
              <h3 className="modal-title">
                {formData.id && tasks.some((t) => t.id === formData.id)
                  ? "Edit Task"
                  : "Add New Task"}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="modal-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>Task Description *</label>
                  <input
                    type="text"
                    placeholder="e.g. Follow up with Acme recruiter"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={formErrors.title ? "error" : ""}
                  />
                  {formErrors.title && (
                    <span className="error-text">{formErrors.title}</span>
                  )}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Associated Company / Application</label>
                  <input
                    type="text"
                    placeholder="e.g. Creware Technologies, Google"
                    value={formData.associated}
                    onChange={(e) =>
                      setFormData({ ...formData, associated: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Additional details or instructions..."
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
                  Save Task
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
            <h3 className="delete-title">Delete Task?</h3>
            <p className="delete-desc">
              Are you sure you want to remove this task? This action cannot be undone.
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
                onClick={() => handleDeleteTask(deleteConfirmId)}
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

export default Tasks;
