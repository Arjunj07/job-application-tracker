import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import Dashboard from "./pages/dashboard/dashboard";
import Layout from "./components/layout";
import Applications from "./pages/application/applications";
import Interviews from "./pages/interviews/interviews";
import Tasks from "./pages/tasks/tasks";
import Companies from "./pages/companies/companies";
import Contacts from "./pages/contacts/contacts";
import Documents from "./pages/documents/documents";
import Analytics from "./pages/analytics/analytics";
import Settings from "./pages/settings/settings";

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
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
