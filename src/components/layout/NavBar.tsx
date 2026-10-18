import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import "../../styles/navBar.css";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    // URL de la foto que ha fallado al cargar; se compara con la actual para
    // volver a la inicial sin necesidad de un efecto que resetee el estado
    const [fotoFallida, setFotoFallida] = useState<string | null>(null);
    const { isAuthenticated, user, logout } = useAuth();
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
                    <img src="./src/assets/logo.svg" alt="Logo ProFE" />
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
                                to="/explorer"
                                className={({ isActive }) =>
                                    isActive ? "navbar-link navbar-link-active" : "navbar-link"
                                }
                                onClick={closeMenu}
                            >
                                Explorar
                            </NavLink>
                            <div className="navbar-account">
                                {user?.photo && fotoFallida !== user.photo ? (
                                    <img
                                        className="navbar-avatar"
                                        src={user.photo}
                                        alt={`Foto de perfil de ${user.username}`}
                                        onError={() => setFotoFallida(user.photo)}
                                    />
                                ) : (
                                    <span
                                        className="navbar-avatar navbar-avatar-inicial"
                                        title={user?.username}
                                        aria-hidden="true"
                                    >
                                        {user?.photo ? user.username.charAt(0).toUpperCase() : user?.username.charAt(0).toUpperCase()}
                                    </span>
                                )}

                                <button className="navbar-logout" onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </div>
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