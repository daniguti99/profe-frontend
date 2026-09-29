import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../styles/navBar.css";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const closeMenu = () => setIsOpen(false);

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    <span className="navbar-brand-mark">P</span>
                    <span className="navbar-brand-text">ProFE</span>
                </Link>

                <button
                    className="navbar-toggle"
                    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span className={isOpen ? "navbar-toggle-bar navbar-toggle-bar-1-open" : "navbar-toggle-bar"} />
                    <span className={isOpen ? "navbar-toggle-bar navbar-toggle-bar-2-open" : "navbar-toggle-bar"} />
                    <span className={isOpen ? "navbar-toggle-bar navbar-toggle-bar-3-open" : "navbar-toggle-bar"} />
                </button>

                <nav className={isOpen ? "navbar-links navbar-links-open" : "navbar-links"}>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive ? "navbar-link navbar-link-active" : "navbar-link"
                        }
                        onClick={closeMenu}
                    >
                        Inicio
                    </NavLink>
                    <NavLink
                        to="/teachingpanel"
                        className={({ isActive }) =>
                            isActive ? "navbar-link navbar-link-active" : "navbar-link"
                        }
                        onClick={closeMenu}
                    >
                        Panel docente
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            isActive ? "navbar-link navbar-link-active" : "navbar-link"
                        }
                        onClick={closeMenu}
                    >
                        Perfil
                    </NavLink>
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            isActive ? "navbar-link navbar-link-active" : "navbar-link"
                        }
                        onClick={closeMenu}
                    >
                        Iniciar sesión
                    </NavLink>
                    <NavLink to="/register" className="navbar-cta" onClick={closeMenu}>
                        Registrarse
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}