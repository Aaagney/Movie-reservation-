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
