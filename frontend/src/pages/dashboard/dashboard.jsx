import React, { useState, useMemo } from "react";
import "./dashboard.css";
import StatsGrid from "./components/StatsGrid";
import PipelineGrid from "./pipelineGrid";
import FilterBar from "../../components/FilterBar";
import { Building2, ExternalLink, Calendar, MapPin } from "lucide-react";

const SAMPLE_APPLICATIONS = [
  {
    id: 1,
    company: "Google",
    role: "Senior Frontend Engineer",
    status: "Interview",
    source: "LinkedIn",
    location: "Mountain View, CA (Hybrid)",
    date: "Aug 5, 2026",
    statusBg: "rgba(139, 92, 246, 0.12)",
    statusColor: "#7c3aed",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Full Stack Engineer",
    status: "Screening",
    source: "Referral",
    location: "Redmond, WA (Remote)",
    date: "Aug 4, 2026",
    statusBg: "rgba(59, 130, 246, 0.12)",
    statusColor: "#2563eb",
  },
  {
    id: 3,
    company: "Amazon",
    role: "Software Dev Engineer II",
    status: "Applied",
    source: "Company Website",
    location: "Seattle, WA (On-site)",
    date: "Aug 2, 2026",
    statusBg: "rgba(234, 179, 8, 0.12)",
    statusColor: "#ca8a04",
  },
  {
    id: 4,
    company: "Meta",
    role: "Product Infrastructure Engineer",
    status: "Offer",
    source: "LinkedIn",
    location: "Menlo Park, CA (Hybrid)",
    date: "Jul 29, 2026",
    statusBg: "rgba(34, 197, 94, 0.12)",
    statusColor: "#16a34a",
  },
  {
    id: 5,
    company: "Stripe",
    role: "Frontend Engineer - Payments",
    status: "Assessment",
    source: "Indeed",
    location: "San Francisco, CA (Remote)",
    date: "Jul 26, 2026",
    statusBg: "rgba(6, 182, 212, 0.12)",
    statusColor: "#0891b2",
  },
];

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    company: "",
    source: "",
    date: "",
    sort: "",
  });

  const filteredApplications = useMemo(() => {
    return SAMPLE_APPLICATIONS.filter((app) => {
      // Search term filter
      if (
        searchTerm &&
        !app.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !app.role.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !app.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      // Status filter
      if (filters.status && app.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
      // Company filter
      if (filters.company && app.company.toLowerCase() !== filters.company.toLowerCase()) {
        return false;
      }
      // Source filter
      if (filters.source && app.source.toLowerCase() !== filters.source.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [searchTerm, filters]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-row">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>

      {/* Filter and Search Bar matching reference image */}
      <div className="dashboard-filter-section">
        <FilterBar
          onSearchChange={(query) => setSearchTerm(query)}
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />
      </div>

      <StatsGrid />

      <PipelineGrid />

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-left-col">
          {/* Applications Over Time Card */}
          <div className="dashboard-card">
            <h3 className="card-title">Applications Over Time</h3>
            <div className="chart-placeholder">
              <div className="bar" style={{ height: "45%" }}><span>May</span></div>
              <div className="bar" style={{ height: "65%" }}><span>Jun</span></div>
              <div className="bar" style={{ height: "85%" }}><span>Jul</span></div>
              <div className="bar active-bar" style={{ height: "95%" }}><span>Aug</span></div>
            </div>
          </div>

          {/* Bottom Row: Upcoming Interviews & Upcoming Tasks */}
          <div className="dashboard-bottom-row">
            {/* Upcoming Interviews Card */}
            <div className="dashboard-card">
              <h3 className="card-title">Upcoming Interviews</h3>
              <div className="interview-list">
                <div className="interview-item">
                  <div className="interview-company-dot" style={{ backgroundColor: "#7c3aed" }}></div>
                  <div className="interview-details">
                    <h4>Google • Technical Round 2</h4>
                    <p>Tomorrow at 10:00 AM • Google Meet</p>
                  </div>
                </div>
                <div className="interview-item">
                  <div className="interview-company-dot" style={{ backgroundColor: "#2563eb" }}></div>
                  <div className="interview-details">
                    <h4>Microsoft • Hiring Manager</h4>
                    <p>Friday at 2:30 PM • Teams</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Tasks Card */}
            <div className="dashboard-card">
              <h3 className="card-title">Upcoming Tasks</h3>
              <div className="task-list">
                <div className="task-item">
                  <input type="checkbox" id="task1" />
                  <label htmlFor="task1">Submit take-home project for Stripe</label>
                </div>
                <div className="task-item">
                  <input type="checkbox" id="task2" />
                  <label htmlFor="task2">Follow up with Meta recruiter</label>
                </div>
                <div className="task-item">
                  <input type="checkbox" id="task3" />
                  <label htmlFor="task3">Review system design notes</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Applications */}
        <div className="dashboard-right-col">
          <div className="dashboard-card full-height">
            <div className="card-header-flex">
              <h3 className="card-title">Recent Applications</h3>
              <span className="count-tag">{filteredApplications.length} found</span>
            </div>

            <div className="applications-feed">
              {filteredApplications.length === 0 ? (
                <div className="empty-results">
                  <p>No applications match your search or filter criteria.</p>
                </div>
              ) : (
                filteredApplications.map((app) => (
                  <div key={app.id} className="app-feed-card">
                    <div className="app-feed-top">
                      <div className="app-company-info">
                        <div className="company-logo-avatar">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <h4 className="app-role-title">{app.role}</h4>
                          <span className="app-company-name">{app.company}</span>
                        </div>
                      </div>
                      <span
                        className="status-pill"
                        style={{
                          backgroundColor: app.statusBg,
                          color: app.statusColor,
                        }}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="app-feed-meta">
                      <span className="meta-item">
                        <MapPin size={12} /> {app.location}
                      </span>
                      <span className="meta-item">
                        <Calendar size={12} /> {app.date}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
