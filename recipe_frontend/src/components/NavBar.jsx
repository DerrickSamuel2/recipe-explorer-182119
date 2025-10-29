import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function NavBar({ onToggleTheme, theme }) {
  /** Top navigation bar with brand and actions */
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <div className="brand">
          <div className="logo">R</div>
          <span className="title">Recipe Explorer</span>
        </div>
        <div className="nav-actions">
          <Link to="/recipes" className="btn" aria-current={location.pathname === '/recipes' ? 'page' : undefined}>Browse</Link>
          <Link to="/recipes/new" className="btn btn-secondary">Add Recipe</Link>
          <button className="btn btn-primary" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </nav>
  );
}
