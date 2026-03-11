import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const categories = [
    { icon: "👟", name: "Sneakers" },
    { icon: "👗", name: "Ropa" },
    { icon: "💻", name: "Electrónica" },
    { icon: "🎒", name: "Accesorios" },
    { icon: "🏠", name: "Hogar" },
    { icon: "🎮", name: "Gaming" },
  ];

  const features = [
    { icon: "🔍", title: "Busca en China", desc: "Accede a Taobao, 1688, Weidian y más desde un solo lugar." },
    { icon: "📦", title: "Nosotros compramos", desc: "Te compramos el producto y lo enviamos a nuestro almacén." },
    { icon: "✈️", title: "Envío a tu puerta", desc: "Consolidamos tus pedidos y los enviamos donde estés." },
  ];

  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <span className="hero-badge">🛒 Agente de compras #1</span>
          <h1 className="hero-title">
            Compra en China<br />
            <span className="hero-accent">sin complicaciones</span>
          </h1>
          <p className="hero-sub">
            Accede a millones de productos de Taobao, 1688 y más.<br />
            Nosotros compramos, inspeccionamos y te enviamos todo.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="hero-btn-primary">Explorar productos</Link>
            <Link to="/register" className="hero-btn-secondary">Crear cuenta gratis</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Usuarios</span></div>
          <div className="stat-divider" />
          <div className="stat"><span className="stat-num">1M+</span><span className="stat-label">Productos</span></div>
          <div className="stat-divider" />
          <div className="stat"><span className="stat-num">98%</span><span className="stat-label">Satisfacción</span></div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <h2 className="section-title">Categorías populares</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link to="/products" key={cat.name} className="category-card">
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-dark">
        <h2 className="section-title">¿Cómo funciona?</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-step">0{i + 1}</div>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>¿Listo para empezar?</h2>
        <p>Crea tu cuenta gratis y haz tu primer pedido hoy.</p>
        <Link to="/register" className="hero-btn-primary">Comenzar ahora →</Link>
      </section>
    </main>
  );
};

export default Home;