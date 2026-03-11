import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const orders = [
    { id: "#00123", product: "Nike Air Max 90", status: "En tránsito", date: "2026-03-08", price: "$89.00" },
    { id: "#00122", product: "Camiseta Vintage", status: "Entregado", date: "2026-03-01", price: "$22.00" },
    { id: "#00121", product: "Auriculares BT Pro", status: "Inspeccionando", date: "2026-02-25", price: "$45.00" },
  ];

  const statusColor = {
    "En tránsito": "#3b82f6",
    "Entregado": "#22c55e",
    "Inspeccionando": "#f59e0b",
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-info">
          <div className="avatar">👤</div>
          <div>
            <div className="user-name">Mi Usuario</div>
            <div className="user-email">usuario@email.com</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="sidebar-link active">📊 Dashboard</a>
          <a href="#" className="sidebar-link">📦 Mis pedidos</a>
          <a href="#" className="sidebar-link">🏪 Almacén</a>
          <a href="#" className="sidebar-link">💰 Balance</a>
          <a href="#" className="sidebar-link">⭐ Favoritos</a>
          <a href="#" className="sidebar-link">⚙️ Configuración</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-header">
          <h1>Dashboard</h1>
          <Link to="/products" className="new-order-btn">+ Nuevo pedido</Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Pedidos totales</div>
            <div className="stat-value">12</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">En tránsito</div>
            <div className="stat-value">3</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Balance</div>
            <div className="stat-value">$0.00</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Puntos</div>
            <div className="stat-value">150</div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-section">
          <h2>Pedidos recientes</h2>
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
                <span className="order-status" style={{ color: statusColor[o.status] }}>● {o.status}</span>
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