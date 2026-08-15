import React, { useState } from "react";
import {
  User,
  Bell,
  Sliders,
  Shield,
  ChevronDown,
  ChevronUp,
  Check,
  Moon,
  Sun,
  Lock,
  Mail,
  Smartphone,
  Save,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./settings.css";

function Settings() {
  const { theme, toggleTheme } = useTheme();

  // Accordion section open/close states
  const [openSections, setOpenSections] = useState({
    account: true,
    notifications: true,
    preferences: false,
    security: false,
  });

  // Notification Toggles matching UI_REF.png
  const [notifications, setNotifications] = useState({
    interview: true,
    followUp: true,
    taskReminders: true,
    emails: false,
  });

  // Profile info
  const [profile, setProfile] = useState({
    name: "Jane D.",
    email: "setlicity@crealissia.com",
    role: "Senior Frontend Engineer",
    location: "San Francisco, CA",
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    currency: "USD ($)",
    defaultWorkModel: "Remote",
    autoArchiveWeeks: "4",
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-top-heading">
        <h1 className="settings-title">Settings</h1>
      </div>

      {/* Profile Card matching UI_REF.png */}
      <div className="settings-profile-card">
        <div className="profile-left">
          <div className="profile-avatar-circle">
            <User size={24} />
          </div>
          <div className="profile-info-block">
            <h3 className="profile-name">{profile.name}</h3>
            <span className="profile-email">{profile.email}</span>
          </div>
        </div>
      </div>

      {/* Accordion Sections matching UI_REF.png */}
      <div className="settings-sections-stack">
        {/* 1. Account Section */}
        <div className="settings-card">
          <div
            className="settings-card-header"
            onClick={() => toggleSection("account")}
          >
            <div className="section-title-wrap">
              <User size={16} className="section-icon" />
              <span className="section-title">Account</span>
            </div>
            {openSections.account ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {openSections.account && (
            <div className="settings-card-body">
              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label>Target Role Title</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label>Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Notifications Section (Matches UI_REF.png toggles) */}
        <div className="settings-card">
          <div
            className="settings-card-header"
            onClick={() => toggleSection("notifications")}
          >
            <div className="section-title-wrap">
              <Bell size={16} className="section-icon" />
              <span className="section-title">Notifications</span>
            </div>
            {openSections.notifications ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {openSections.notifications && (
            <div className="settings-card-body">
              <div className="toggles-list">
                {/* Interview */}
                <div className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Interview</span>
                    <span className="toggle-sub">Receive reminders before scheduled rounds</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.interview}
                      onChange={() => handleToggleNotification("interview")}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Follow-up */}
                <div className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Follow-up</span>
                    <span className="toggle-sub">Suggestions to follow up on pending applications</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.followUp}
                      onChange={() => handleToggleNotification("followUp")}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Task reminders */}
                <div className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Task reminders</span>
                    <span className="toggle-sub">Alerts for upcoming task deadlines</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.taskReminders}
                      onChange={() => handleToggleNotification("taskReminders")}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Emails */}
                <div className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Emails</span>
                    <span className="toggle-sub">Daily summary digest via email</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.emails}
                      onChange={() => handleToggleNotification("emails")}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Application Preferences Section */}
        <div className="settings-card">
          <div
            className="settings-card-header"
            onClick={() => toggleSection("preferences")}
          >
            <div className="section-title-wrap">
              <Sliders size={16} className="section-icon" />
              <span className="section-title">Application Preferences</span>
            </div>
            {openSections.preferences ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {openSections.preferences && (
            <div className="settings-card-body">
              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Default Currency</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) =>
                      setPreferences({ ...preferences, currency: e.target.value })
                    }
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="INR (₹)">INR (₹)</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label>Preferred Work Model</label>
                  <select
                    value={preferences.defaultWorkModel}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        defaultWorkModel: e.target.value,
                      })
                    }
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Security Section */}
        <div className="settings-card">
          <div
            className="settings-card-header"
            onClick={() => toggleSection("security")}
          >
            <div className="section-title-wrap">
              <Shield size={16} className="section-icon" />
              <span className="section-title">Security</span>
            </div>
            {openSections.security ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {openSections.security && (
            <div className="settings-card-body">
              <div className="security-block">
                <p className="security-desc">
                  Protect your job application data with enhanced authentication and session management.
                </p>
                <div className="security-actions-row">
                  <button type="button" className="btn-outline-sec">
                    Change Password
                  </button>
                  <button type="button" className="btn-outline-sec">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
