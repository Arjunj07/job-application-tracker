import React, { useState } from "react";
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Filter,
  Calendar,
  Layers,
  ArrowUpRight,
  Briefcase,
  Users,
  Award,
  Percent,
} from "lucide-react";
import "./analytics.css";

function Analytics() {
  const [timeRange, setTimeRange] = useState("Past 6 Months");

  // Metrics (computed or defaulted)
  const metrics = {
    totalApplications: 48,
    interviews: 8,
    offers: 2,
    responseRate: "21%",
  };

  const funnelStages = [
    { label: "Apps", count: 48, percent: "100%", conversion: "58%" },
    { label: "Responses", count: 17, percent: "35%", conversion: "47%" },
    { label: "Interviews", count: 8, percent: "17%", conversion: "37%" },
    { label: "Final Interviews", count: 3, percent: "6%", conversion: "66%" },
    { label: "Offers", count: 2, percent: "4%", conversion: "21%" },
  ];

  const sourceData = [
    { source: "LinkedIn", applied: 24, interview: 5, offer: 1, height: "85%" },
    { source: "Company Website", applied: 12, interview: 2, offer: 1, height: "55%" },
    { source: "Referral", applied: 6, interview: 4, offer: 0, height: "70%" },
    { source: "Indeed", applied: 6, interview: 1, offer: 0, height: "35%" },
  ];

  return (
    <div className="analytics-container">
      {/* Header matching UI_REF.png */}
      <div className="analytics-header-row">
        <div>
          <h1 className="analytics-title">Analytics</h1>
        </div>
      </div>

      {/* Top 4 Metrics Row */}
      <div className="analytics-metrics-grid">
        <div className="metric-card">
          <span className="metric-value">{metrics.totalApplications}</span>
          <span className="metric-label">Applications</span>
        </div>

        <div className="metric-card">
          <span className="metric-value">{metrics.interviews}</span>
          <span className="metric-label">Interviews</span>
        </div>

        <div className="metric-card">
          <span className="metric-value">{metrics.offers}</span>
          <span className="metric-label">Offers</span>
        </div>

        <div className="metric-card">
          <span className="metric-value">{metrics.responseRate}</span>
          <span className="metric-label">Response Rate</span>
        </div>
      </div>

      {/* 2x2 Charts Grid matching UI_REF.png */}
      <div className="analytics-charts-grid">
        {/* Top Left: Applications Over Time */}
        <div className="chart-card">
          <h3 className="chart-card-title">Applications Over Time</h3>
          <div className="line-chart-wrapper">
            <svg viewBox="0 0 500 160" className="analytics-svg-line">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border-color, #e2e8f0)" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border-color, #e2e8f0)" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="var(--border-color, #e2e8f0)" strokeDasharray="3 3" />

              {/* Smooth Area */}
              <path
                d="M 20 140 Q 70 120, 110 80 T 200 95 T 300 60 T 400 90 T 480 40 L 480 150 L 20 150 Z"
                fill="url(#lineGrad)"
              />

              {/* Line */}
              <path
                d="M 20 140 Q 70 120, 110 80 T 200 95 T 300 60 T 400 90 T 480 40"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
              />

              {/* Active Points */}
              <circle cx="110" cy="80" r="4" fill="#2563eb" />
              <circle cx="300" cy="60" r="4" fill="#2563eb" />
              <circle cx="480" cy="40" r="4" fill="#2563eb" />
            </svg>

            <div className="chart-x-axis">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>
        </div>

        {/* Top Right: Applications by Status (Donut) */}
        <div className="chart-card">
          <h3 className="chart-card-title">Applications by Status</h3>
          <div className="donut-chart-container">
            <div className="donut-visual">
              <svg viewBox="0 0 120 120" className="donut-svg">
                <circle cx="60" cy="60" r="45" stroke="#2563eb" strokeWidth="18" fill="none" strokeDasharray="140 280" strokeDashoffset="0" />
                <circle cx="60" cy="60" r="45" stroke="#7c3aed" strokeWidth="18" fill="none" strokeDasharray="70 280" strokeDashoffset="-140" />
                <circle cx="60" cy="60" r="45" stroke="#16a34a" strokeWidth="18" fill="none" strokeDasharray="30 280" strokeDashoffset="-210" />
                <circle cx="60" cy="60" r="45" stroke="#cbd5e1" strokeWidth="18" fill="none" strokeDasharray="40 280" strokeDashoffset="-240" />
              </svg>
            </div>

            <div className="donut-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#2563eb" }}></span>
                <span>Applications</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#7c3aed" }}></span>
                <span>Interview</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#16a34a" }}></span>
                <span>Offers</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#cbd5e1" }}></span>
                <span>Other</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left: Application Funnel */}
        <div className="chart-card">
          <h3 className="chart-card-title">Application Funnel</h3>
          <div className="funnel-container">
            {funnelStages.map((stage, idx) => (
              <div key={stage.label} className="funnel-row">
                <div className="funnel-label-col">
                  <span className="funnel-stage-name">{stage.label}</span>
                </div>
                <div className="funnel-bar-track">
                  <div
                    className="funnel-bar-fill"
                    style={{
                      width: `calc(100% - ${idx * 16}%)`,
                      backgroundColor: idx === 4 ? "#16a34a" : "#2563eb",
                    }}
                  >
                    <span className="funnel-count">{stage.count}</span>
                  </div>
                </div>
                <div className="funnel-rate-col">
                  <span className="funnel-rate-text">{stage.conversion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Right: Applications by Source */}
        <div className="chart-card">
          <h3 className="chart-card-title">Applications by Source</h3>
          <div className="source-bars-container">
            <div className="source-bars-area">
              {sourceData.map((item) => (
                <div key={item.source} className="source-bar-group">
                  <div className="source-bar-pair">
                    <div
                      className="source-bar applied-bar"
                      style={{ height: item.height }}
                      title={`${item.source} Applied: ${item.applied}`}
                    ></div>
                    <div
                      className="source-bar interview-bar"
                      style={{ height: `calc(${item.height} * 0.4)` }}
                      title={`${item.source} Interviewed: ${item.interview}`}
                    ></div>
                  </div>
                  <span className="source-bar-label">{item.source}</span>
                </div>
              ))}
            </div>

            <div className="source-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#2563eb" }}></span>
                <span>Applied</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#0284c7" }}></span>
                <span>Offer / Interview</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
