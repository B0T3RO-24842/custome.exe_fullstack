import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../context/AuthContext";
import "../Auth.css";

const Login = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const message = searchParams.get("message");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form.email, form.password);
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
          <h1>Bienvenido de vuelta</h1>
          <p>Ingresa a tu cuenta para continuar</p>
        </div>

        <div className="auth-form">
          {message === "revisa_tu_correo" && (
            <p className="auth-success">
              ¡Cuenta creada! Revisa tu correo para confirmar y luego inicia sesión.
            </p>
          )}
            {message === "password_actualizada" && (
              <p className="auth-success">
                ¡Contraseña actualizada! Ya puedes iniciar sesión con tu nueva clave.
            </p>
          )}

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" name="email" placeholder="tu@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-footer">
              <Link to="/forgot-password" className="forgot-link">¿Olvidaste tu contraseña?</Link>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <div className="auth-divider"><span>o continúa con</span></div>

        <div className="social-buttons">
          <button className="social-btn" onClick={handleGoogleLogin} disabled={loading}>
            🌐 Google
          </button>
        </div>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;