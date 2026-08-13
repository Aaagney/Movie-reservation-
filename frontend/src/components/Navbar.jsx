<<<<<<< HEAD
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
=======
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    logout();
    navigate("/films");
  }

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-vault-border">
      <div className="flex items-center gap-10">
        <span className="font-serif text-xl tracking-wide text-vault-gold">
          CINÉ<span className="text-white">VAULT</span>
        </span>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/films" className="text-vault-gold hover:text-white transition-colors">
            Films
          </Link>
          {user && (
            <Link to="/my-bookings" className="text-vault-muted hover:text-white transition-colors">
              My Bookings
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-vault-muted hover:text-white transition-colors">
              Admin
            </Link>
          )}
        </div>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
            <p className="text-xs text-vault-muted leading-tight capitalize">{user.role}</p>
          </div>
          {user.role === "admin" && (
            <span className="text-xs font-semibold tracking-wide px-2 py-1 border border-vault-gold text-vault-gold rounded">
              ADMIN
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="text-sm text-vault-muted hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/auth")}
          className="bg-vault-gold hover:bg-vault-goldDark text-black font-semibold text-sm px-5 py-2.5 rounded-md transition-colors"
        >
          Sign In
        </button>
      )}
    </nav>
  );
}
>>>>>>> origin/main
