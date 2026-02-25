import React from "react";
import "./Navbar.css";
const Navbar = () => {
return (
<nav className="navbar">
<div className="navbar-logo">
MiLogo
</div>
<ul className="ndddddavbar-links">
<li><a href="#inicio">Inicio</a></li>
<li><a href="#servicio">Servicio</a></li>
<li><a href="#portafolio">Portafolio</a></li>
<li><a href="#contacto">Contacto</a></li>
<li>
<a href="#login" className="login-btn">
Login
</a>
</li>
</ul>
</nav>
);
};
export default Navbar;