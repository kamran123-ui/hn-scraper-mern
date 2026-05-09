import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-icon">▲</span>
          <span className="brand-text">HN Stories</span>
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Links */}
        <div className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink to="/bookmarks" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Bookmarks
              </NavLink>
              <span className="nav-separator" />
              <span className="nav-user">👤 {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={closeMenu} className="btn-nav-register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
