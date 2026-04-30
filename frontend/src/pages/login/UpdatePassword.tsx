import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import "../Auth.css";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenValido, setTokenValido] = useState(true);

  useEffect(() => {
    // Detecta si el link llegó con error (token expirado)
    const hash = window.location.hash;
    if (hash.includes("error=access_denied") || hash.includes("otp_expired")) {
      setTokenValido(false);
      setError("El enlace expiró o ya fue usado. Solicita uno nuevo.");
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!tokenValido) return;

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        if (error.message.includes("same password")) {
          setError("La nueva contraseña debe ser diferente a la anterior.");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/login?message=password_actualizada");
      }, 2000);

    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">⚡R<span>-Drop</span></Link>
          <h1>Nueva contraseña</h1>
          <p>Escribe tu nueva clave de acceso</p>
        </div>

        <div className="auth-form">
          {success && (
            <p className="auth-success">
              ¡Contraseña actualizada! Redirigiendo al login...
            </p>
          )}
          {error && <p className="auth-error">{error}</p>}

          {!tokenValido ? (
            // Si el token expiró, muestra botón para pedir nuevo enlace
            <p className="auth-switch" style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link to="/forgot-password" className="auth-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                Solicitar nuevo enlace
              </Link>
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading || success}
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className="auth-btn"
                disabled={loading || success}
              >
                {loading ? "Guardando..." : "Guardar contraseña"}
              </button>
            </form>
          )}
        </div>

        <p className="auth-switch">
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default UpdatePassword;