import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Cierra dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Inicial del nombre para el avatar
  const getInitial = () => {
    if (!user?.nombre_completo) return "U";
    return user.nombre_completo.charAt(0).toUpperCase();
  };

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
        {user && (
          <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}>
            Dashboard
          </Link>
        )}
      </div>

      {/* Derecha — desktop */}
      <div className="navbar-right">
        {loading ? (
          <div className="navbar-avatar-skeleton" />
        ) : user ? (
          // Avatar con dropdown
          <div className="navbar-avatar-wrapper" ref={dropdownRef}>
            <button
              className="navbar-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Mi cuenta"
            >
              {user.foto_perfil ? (
                <img src={user.foto_perfil} alt="Avatar" className="avatar-img" />
              ) : (
                <span className="avatar-initial">{getInitial()}</span>
              )}
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="navbar-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-name">
                    {user.nombre_completo?.split(" ").slice(0, 2).join(" ")}
                  </span>
                  <span className="dropdown-role">{user.rol ?? "comprador"}</span>
                </div>
                <div className="dropdown-divider" />
                <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  📊 Mi dashboard
                </Link>
                <Link to="/dashboard/perfil" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  👤 Mi perfil
                </Link>
                {(user.rol === "vendedor" || user.rol === "admin") && (
                  <Link to="/dashboard/productos" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    📦 Mis productos
                  </Link>
                )}
                {user.rol === "admin" && (
                  <Link to="/dashboard/admin" className="dropdown-item dropdown-admin" onClick={() => setDropdownOpen(false)}>
                    🛡️ Panel admin
                  </Link>
                )}
                <div className="dropdown-divider" />
                <button className="dropdown-item dropdown-logout" onClick={() => { logout(); setDropdownOpen(false); }}>
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
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
          {user && (
            <Link to="/dashboard" className="mobile-link" onClick={closeMenu}>Dashboard</Link>
          )}
          <div className="mobile-divider" />
          {user ? (
            <>
              <div className="mobile-user-info">
                <div className="mobile-avatar">{getInitial()}</div>
                <div>
                  <p className="mobile-username">{user.nombre_completo?.split(" ")[0]}</p>
                  <p className="mobile-role">{user.rol ?? "comprador"}</p>
                </div>
              </div>
              <Link to="/dashboard/perfil" className="mobile-link" onClick={closeMenu}>👤 Mi perfil</Link>
              <button className="mobile-link mobile-logout" onClick={() => { logout(); closeMenu(); }}>
                🚪 Cerrar sesión
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