import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Reviews from "./pages/Reviews";
import OrgDetails from "./pages/OrgDetails";
import Categories from "./pages/Categories";
import AdminLayout from "./layouts/AdminLayout";
import FinancialAuditLogs from "./pages/FinancialAuditLogs";

function App() {
  const [token, setToken] = useState(localStorage.getItem("platform_token"));

  // Effect to sync token state if changed elsewhere (optional but good)
  useEffect(() => {
    const handleStorage = () =>
      setToken(localStorage.getItem("platform_token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogin = () => {
    setToken(localStorage.getItem("platform_token"));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />
          }
        />
        {/* Protected Routes */}
        <Route element={token ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:id" element={<OrgDetails />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/audit-logs" element={<FinancialAuditLogs />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
