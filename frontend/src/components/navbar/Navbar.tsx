import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">R<span className="logo-accent">-Drop</span></span>
        </Link>
      </div>

      {/* Links — desktop */}
      <div className="navbar-center">
        <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
          Inicio
        </Link>
        <Link to="/products" className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}>
          Productos
        </Link>
        <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}>
          Dashboard
        </Link>
      </div>

      {/* Derecha — desktop */}
      <div className="navbar-right">
        {loading ? null : user ? (
          <>
            <Link to="/dashboard" className="navbar-username">
              👤 {user.nombre_completo?.split(" ")[0] ?? "Mi cuenta"}
            </Link>
            <button className="btn-primary btn-logout" onClick={logout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/register" className="btn-outline">Registrarse</Link>
            <Link to="/login" className="btn-primary">Login</Link>
          </>
        )}
      </div>

      {/* Hamburguesa — mobile */}
      <button className="navbar-hamburger" onClick={toggleMenu} aria-label="Menú">
        <span className={`ham-line ${menuOpen ? "open" : ""}`} />
        <span className={`ham-line ${menuOpen ? "open" : ""}`} />
        <span className={`ham-line ${menuOpen ? "open" : ""}`} />
      </button>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/" className="mobile-link" onClick={closeMenu}>Inicio</Link>
          <Link to="/products" className="mobile-link" onClick={closeMenu}>Productos</Link>
          <Link to="/dashboard" className="mobile-link" onClick={closeMenu}>Dashboard</Link>
          <div className="mobile-divider" />
          {user ? (
            <>
              <span className="mobile-username">
                👤 {user.nombre_completo?.split(" ")[0] ?? "Mi cuenta"}
              </span>
              <button className="mobile-link mobile-logout" onClick={() => { logout(); closeMenu(); }}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="mobile-link" onClick={closeMenu}>Registrarse</Link>
              <Link to="/login" className="mobile-link mobile-login" onClick={closeMenu}>Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;