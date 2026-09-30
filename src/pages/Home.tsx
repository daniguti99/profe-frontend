import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <section className="home-hero">
            <h1 className="home-title">Bienvenido a ProFE</h1>
            <p className="home-subtitle">
                Gestiona tus unidades didácticas y sesiones de Educación Física en un solo sitio.
            </p>

            {!isAuthenticated && (
                <div className="home-actions">
                    <Link to="/login" className="home-btn-secondary">
                        Iniciar sesión
                    </Link>
                    <Link to="/register" className="home-btn-primary">
                        Registrarse
                    </Link>
                </div>
            )}
        </section>
    );
}