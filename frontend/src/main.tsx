import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Sin extensión .js o .ts
import "./index.css";

// El '!' le asegura a TS que el elemento existe
const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);