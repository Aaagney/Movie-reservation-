import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const adminName = 'Morgan Adeyemi';
  
  const getInitials = (fullName) => {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-white">CINÉ</span>
        <span className="logo-gold">VAULT</span>
      </Link>

      <div className="nav-links">
        <span className="nav-link active" style={{ fontWeight: 700, cursor: 'default' }}>
          Reports & Audit Logs
        </span>
      </div>

      <div className="nav-right">
        <div className="user-profile">
          <div className="avatar-container">
            <span className="nav-link active" style={{ fontWeight: 600, cursor: 'default' }}>
              {adminName.split(' ')[0]}
            </span>
            <span className="role-subtitle">
              Administrator
            </span>
          </div>
          <span className="avatar-initials">{getInitials(adminName)}</span>
          <span className="admin-badge">ADMIN</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
