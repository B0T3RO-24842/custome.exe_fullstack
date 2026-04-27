import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">⚡ Custome<span>.exe</span></span>
          <p>Tu agente de compras en China.<br />Simple, rápido y confiable.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Páginas</h4>
            <Link to="/">Inicio</Link>
            <Link to="/products">Productos</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div className="footer-col">
            <h4>Cuenta</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Custome.exe — Todos los derechos reservados</span>
      </div>
    </footer>
  );
};

export default Footer;