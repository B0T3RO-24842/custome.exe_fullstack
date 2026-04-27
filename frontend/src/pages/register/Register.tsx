import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../context/AuthContext";
import "../Auth.css";

const Register = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await signup(form.email, form.password, form.name);
      navigate("/login?message=revisa_tu_correo");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">⚡R<span>-Drop</span></Link>
          <h1>Crea tu cuenta</h1>
          <p>Empieza a comprar/vender hoy mismo</p>
        </div>

        <div className="auth-form">
          <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
            {loading ? "Cargando..." : "Continuar con Google"}
          </button>

          <div className="divider"><span>o regístrate con correo</span></div>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre completo</label>
              <input type="text" name="name" placeholder="Tu nombre" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" name="email" placeholder="tu@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contraseña</label>
                <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Confirmar</label>
                <input type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
            </button>
          </form>
        </div>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;