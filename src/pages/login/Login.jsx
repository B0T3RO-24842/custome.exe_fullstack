import { useState } from "react";
import { Link } from "react-router-dom";
import "../Auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">⚡ Custome<span>.exe</span></Link>
          <h1>Bienvenido de vuelta</h1>
          <p>Ingresa a tu cuenta para continuar</p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-footer">
            <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>
          <button className="auth-btn">Iniciar sesión</button>
        </div>

        <div className="auth-divider"><span>o continúa con</span></div>

        <div className="social-buttons">
          <button className="social-btn">🌐 Google</button>
          <button className="social-btn">📘 Facebook</button>
        </div>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;