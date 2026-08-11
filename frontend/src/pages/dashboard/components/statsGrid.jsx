import {
  Briefcase,
  Clock,
  Calendar,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

function StatsGrid() {
  const stats = [
    {
      title: "Total Applications",
      value: 0,
      icon: Briefcase,
      color: "#3b82f6",
    },
    { title: "Active Applications", value: 0, icon: Clock, color: "#eab308" },
    { title: "Interviews", value: 0, icon: Calendar, color: "#8b5cf6" },
    { title: "Offers", value: 0, icon: CheckCircle, color: "#22c55e" },
  ];
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="stat-card">
            <div className="stat-info">
              <p className="stat-title">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
            <div className="stat-icon-wrapper" style={{ color: stat.color }}>
              <IconComponent size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default StatsGrid;
