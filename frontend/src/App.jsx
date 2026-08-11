import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import Dashboard from "./pages/dashboard/dashboard";
import Layout from "./components/layout";
import Applications from "./pages/application/applications";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/interviews" element={<Dashboard />} />
          <Route path="/tasks" element={<Dashboard />} />
          <Route path="/companies" element={<Dashboard />} />
          <Route path="/contacts" element={<Dashboard />} />
          <Route path="/documents" element={<Dashboard />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
