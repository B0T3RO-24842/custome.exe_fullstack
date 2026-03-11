import { useState } from "react";
import "./Products.css";

const PRODUCTS = [
  { id: 1, name: "Nike Air Max 90 Retro", price: "$89.00", original: "$145.00", category: "Sneakers", rating: 4.8, reviews: 234, emoji: "👟" },
  { id: 2, name: "Camiseta Oversized Vintage", price: "$18.00", original: "$35.00", category: "Ropa", rating: 4.5, reviews: 89, emoji: "👕" },
  { id: 3, name: "Auriculares BT Pro X", price: "$45.00", original: "$89.00", category: "Electrónica", rating: 4.7, reviews: 412, emoji: "🎧" },
  { id: 4, name: "Mochila Urban Cargo", price: "$32.00", original: "$60.00", category: "Accesorios", rating: 4.6, reviews: 178, emoji: "🎒" },
  { id: 5, name: "Smartwatch Series 8 Clone", price: "$55.00", original: "$120.00", category: "Electrónica", rating: 4.3, reviews: 320, emoji: "⌚" },
  { id: 6, name: "Pantalón Cargo Tactical", price: "$28.00", original: "$55.00", category: "Ropa", rating: 4.4, reviews: 95, emoji: "👖" },
  { id: 7, name: "Sudadera Streetwear", price: "$24.00", original: "$48.00", category: "Ropa", rating: 4.6, reviews: 143, emoji: "🧥" },
  { id: 8, name: "Figura Coleccionable Anime", price: "$15.00", original: "$30.00", category: "Accesorios", rating: 4.9, reviews: 567, emoji: "🎎" },
];

const CATEGORIES = ["Todos", "Sneakers", "Ropa", "Electrónica", "Accesorios"];

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = category === "Todos" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="products-page">
      {/* Search bar */}
      <div className="products-hero">
        <h1>Explora productos</h1>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Busca en Taobao, 1688, Weidian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="products-body">
        {/* Filters */}
        <aside className="filters">
          <h3>Categorías</h3>
          <div className="filter-list">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`filter-btn ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div className="products-grid">
          {filtered.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-img">{p.emoji}</div>
              <div className="product-info">
                <span className="product-category">{p.category}</span>
                <h3 className="product-name">{p.name}</h3>
                <div className="product-rating">
                  ⭐ {p.rating} <span>({p.reviews})</span>
                </div>
                <div className="product-prices">
                  <span className="price-current">{p.price}</span>
                  <span className="price-original">{p.original}</span>
                </div>
                <button className="add-cart-btn">Agregar al carrito</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="no-results">No se encontraron productos 😅</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;