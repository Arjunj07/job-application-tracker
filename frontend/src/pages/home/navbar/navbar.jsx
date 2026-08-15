import React, { useState } from "react";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import "./navbar.css";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <header className="app-navbar">
      {/* Search Box matching UI_REF.png */}
      <div className="navbar-search-box">
        <Search size={16} className="nav-search-icon" />
        <input
          type="text"
          placeholder="Search"
          aria-label="Global search"
        />
      </div>

      {/* Right User & Controls Section matching UI_REF.png */}
      <div className="navbar-right-section">
        {/* Notification Bell with Badge */}
        <button
          type="button"
          className="nav-icon-btn"
          title="Notifications"
          onClick={() => setHasNotifications(false)}
        >
          <Bell size={18} />
          {hasNotifications && <span className="nav-notif-dot"></span>}
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="nav-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile Avatar & Name matching UI_REF.png */}
        <div className="navbar-profile-wrap">
          <div className="nav-profile-avatar">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
              alt="Jane D."
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.innerText = "JD";
              }}
            />
          </div>
          <span className="nav-profile-name">Jane D.</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
