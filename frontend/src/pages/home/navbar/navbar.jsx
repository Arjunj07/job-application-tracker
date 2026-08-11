import { Bell, Lightbulb, Search } from "lucide-react";
import "./navbar.css";
import { useTheme } from "../../../context/ThemeContext";
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="navbar">
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input type="text" placeholder="Search..." />
      </div>
      <div className="nav-right">
        <Bell />
        <img
          className="profile-image"
          src="./propic.jpg"
          width={40}
          alt="profile-icon"
        />
        <p>name</p>
        <div
          onClick={toggleTheme}
          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
          title="Toggle light/dark theme"
        >
          <Lightbulb />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
