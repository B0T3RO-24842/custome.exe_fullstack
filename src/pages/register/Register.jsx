import { useState } from "react";
import { Link } from "react-router-dom";
import "../Auth.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">⚡ Custome<span>.exe</span></Link>
          <h1>Crea tu cuenta</h1>
          <p>Empieza a comprar en China hoy mismo</p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input type="text" name="name" placeholder="Tu nombre" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" name="email" placeholder="tu@email.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Confirmar</label>
              <input type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={handleChange} />
            </div>
          </div>
          <button className="auth-btn">Crear cuenta gratis</button>
        </div>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;