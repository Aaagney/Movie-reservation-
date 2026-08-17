<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReportsAuditLogs from './pages/ReportsAuditLogs';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
        <Navbar />
        
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Reports & Audit Logs is the default and only module */}
            <Route path="/" element={<ReportsAuditLogs />} />
            
            {/* Redirect any other path to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
=======
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import FilmsPage from "./pages/FilmsPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/films" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/films" element={<FilmsPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-vault-bg text-white flex items-center justify-center">
              My Bookings — handled by the Booking Management module.
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/films" replace />} />
    </Routes>
  );
}
>>>>>>> origin/main
