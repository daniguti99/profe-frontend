import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import "../../styles/navBar.css";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const closeMenu = () => setIsOpen(false);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "¿Cerrar sesión?",
            text: "¿Estás seguro de que quieres salir de tu cuenta?",
            icon: "question",
            background: "#16233A",
            color: "#F6F5F1",
            confirmButtonColor: "#FF7A3C",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonColor: "#3A4A5F",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            logout();
            closeMenu();
            navigate("/");
        }
    };

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

                    {isAuthenticated ? (
                        <>
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
                            <button className="navbar-logout" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}