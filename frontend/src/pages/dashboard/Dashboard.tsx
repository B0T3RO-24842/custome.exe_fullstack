import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const getInitial = () => {
    if (!user?.nombre_completo) return "U";
    return user.nombre_completo.charAt(0).toUpperCase();
  };

  const orders = [
    { id: "#00123", product: "Nike Air Max 90", status: "En tránsito", date: "2026-03-08", price: "$89.00" },
    { id: "#00122", product: "Camiseta Vintage", status: "Entregado", date: "2026-03-01", price: "$22.00" },
    { id: "#00121", product: "Auriculares BT Pro", status: "Inspeccionando", date: "2026-02-25", price: "$45.00" },
  ];

  const statusColor: Record<string, string> = {
    "En tránsito": "#3b82f6",
    "Entregado": "#22c55e",
    "Inspeccionando": "#f59e0b",
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-info">
          <div className="avatar">{getInitial()}</div>
          <div>
            <div className="user-name">
              {user?.nombre_completo?.split(" ").slice(0, 2).join(" ") ?? "Usuario"}
            </div>
            <div className="user-email">{user?.email ?? ""}</div>
            <div className="user-rol">{user?.rol ?? "comprador"}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="sidebar-link active">📊 Dashboard</a>
          <a href="#" className="sidebar-link">📦 Mis pedidos</a>
          <a href="#" className="sidebar-link">⭐ Favoritos</a>
          <a href="#" className="sidebar-link">💬 Mensajes</a>
          {(user?.rol === "vendedor" || user?.rol === "admin") && (
            <a href="#" className="sidebar-link">🏪 Mis prendas</a>
          )}
          {user?.rol === "admin" && (
            <a href="#" className="sidebar-link sidebar-link-admin">🛡️ Panel admin</a>
          )}
          <a href="#" className="sidebar-link">⚙️ Configuración</a>
          <button className="sidebar-link sidebar-logout" onClick={logout}>
            🚪 Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1>Hola, {user?.nombre_completo?.split(" ")[0] ?? "Usuario"}</h1>
            <p className="dash-subtitle">Bienvenido a tu panel de R-Drop</p>
          </div>
          <Link to="/products" className="new-order-btn">+ Explorar prendas</Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Ofertas activas</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Compras realizadas</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Favoritos</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Fiabilidad</div>
            <div className="stat-value">{user?.puntos_fiabilidad ?? 0}</div>
          </div>
        </div>

        {/* Solicitud vendedor si es comprador */}
        {user?.rol === "comprador" && (
          <div className="vendor-cta">
            <div className="vendor-cta-text">
              <h3>¿Quieres vender en R-Drop?</h3>
              <p>Solicita ser vendedor verificado y empieza a publicar tus prendas.</p>
            </div>
            <a href="#" className="vendor-cta-btn">Solicitar ahora</a>
          </div>
        )}

        {/* Orders Table */}
        <div className="orders-section">
          <h2>Actividad reciente</h2>
          <div className="orders-table">
            <div className="table-header">
              <span>ID</span>
              <span>Producto</span>
              <span>Estado</span>
              <span>Fecha</span>
              <span>Precio</span>
            </div>
            {orders.map((o) => (
              <div className="table-row" key={o.id}>
                <span className="order-id">{o.id}</span>
                <span className="order-product">{o.product}</span>
                <span className="order-status" style={{ color: statusColor[o.status] }}>
                  ● {o.status}
                </span>
                <span className="order-date">{o.date}</span>
                <span className="order-price">{o.price}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;