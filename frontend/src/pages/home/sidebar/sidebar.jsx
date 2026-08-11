import { NavLink } from "react-router-dom";
import {
  PlusCircle,
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
import { useTheme } from "../../../context/ThemeContext";
import "./sidebar.css";

function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <section className="sidebar">
      <div className="sidebar-header">
        <p>Sidebar</p>
        <img src="/policewoman.png" height={25} width={25} />
      </div>
      <section className="sidebar-nav-section">
        <button className="add-application">
          <PlusCircle size={18} />
          <span>Add Application</span>
        </button>
        <ul className="dashboard-button">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/applications"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Briefcase size={18} /> Application
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/interviews"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Calendar size={18} /> Interviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <CheckSquare size={18} /> Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/companies"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Building2 size={18} /> Companies
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contacts"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Users size={18} /> Contacts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/documents"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Folder size={18} /> Documents
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <BarChart3 size={18} /> Analytics
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Settings size={18} /> Settings
            </NavLink>
          </li>
        </ul>
      </section>
    </section>
  );
}

export default Sidebar;

