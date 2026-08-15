import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Plus,
  LayoutDashboard,
  Briefcase,
  Calendar,
  CheckSquare,
  Building2,
  Users,
  Folder,
  BarChart3,
  Settings,
} from "lucide-react";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="app-sidebar">
      {/* Brand Logo Header matching UI_REF.png */}
      <div className="sidebar-brand-header">
        <div className="brand-logo-icon">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              fill="#2563eb"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="brand-title">App</span>
      </div>

      {/* Add Application Primary Button */}
      <div className="sidebar-action-wrap">
        <button
          type="button"
          className="sidebar-add-btn"
          onClick={() => navigate("/applications")}
        >
          <Plus size={16} />
          <span>Add Application</span>
        </button>
      </div>

      {/* Navigation List matching UI_REF.png */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <LayoutDashboard size={18} className="nav-icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/applications"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Briefcase size={18} className="nav-icon" />
              <span>Applications</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/interviews"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Calendar size={18} className="nav-icon" />
              <span>Interviews</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <CheckSquare size={18} className="nav-icon" />
              <span>Tasks</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/companies"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Building2 size={18} className="nav-icon" />
              <span>Companies</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contacts"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Users size={18} className="nav-icon" />
              <span>Contacts</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/documents"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Folder size={18} className="nav-icon" />
              <span>Documents</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <BarChart3 size={18} className="nav-icon" />
              <span>Analytics</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Settings size={18} className="nav-icon" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
