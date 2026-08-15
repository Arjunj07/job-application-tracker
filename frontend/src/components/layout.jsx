import { Outlet } from "react-router-dom";
import Sidebar from "../pages/home/sidebar/sidebar";
import Navbar from "../pages/home/navbar/navbar";

function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
      <Sidebar />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, backgroundColor: "var(--bg-color)" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "24px", backgroundColor: "var(--bg-color)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
