import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Custome<span className="logo-accent">.exe</span></span>
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>Inicio</Link>
        <Link to="/products" className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}>Productos</Link>
        <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}>Dashboard</Link>
      </div>

      <div className="navbar-right">
        <Link to="/register" className="btn-outline">Registrarse</Link>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;