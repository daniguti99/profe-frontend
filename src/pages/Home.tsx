import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomeSummaryRequest, type HomeSummary } from "../services/homeservice";
import "../styles/home.css";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError("");

    getHomeSummaryRequest()
      .then(setSummary)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

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

      {isAuthenticated && (
        <div className="home-dashboard">
          <h2 className="home-dashboard-title">Tu resumen</h2>

          {loading && (
            <div className="home-state">
              <p className="home-state-text">Cargando tu resumen...</p>
            </div>
          )}

          {error && (
            <div className="home-state home-state-error">
              <p className="home-state-text">{error}</p>
            </div>
          )}

          {!loading && !error && summary && (
            <>
              <div className="home-stats-grid">
                <div className="home-stat-card">
                  <span className="home-stat-value">{summary.totalUnits}</span>
                  <span className="home-stat-label">Unidades didácticas</span>
                </div>
                <div className="home-stat-card">
                  <span className="home-stat-value">{summary.totalSessions}</span>
                  <span className="home-stat-label">Sesiones</span>
                </div>
                <div className="home-stat-card">
                  <span className="home-stat-value">{summary.coursesWithUnits}</span>
                  <span className="home-stat-label">Cursos con unidades</span>
                </div>
                <div className="home-stat-card">
                  <span className="home-stat-value">{summary.cyclesWithUnits}</span>
                  <span className="home-stat-label">Ciclos cubiertos</span>
                </div>
                <div className="home-stat-card">
                  <span className="home-stat-value">{summary.sessionsPerUnit}</span>
                  <span className="home-stat-label">Sesiones por unidad</span>
                </div>
                <div className="home-stat-card">
                  <span className="home-stat-value">
                    {summary.totalCycles > 0
                      ? Math.round((summary.cyclesWithUnits / summary.totalCycles) * 100)
                      : 0}%
                  </span>
                  <span className="home-stat-label">Ciclos cubiertos</span>
                </div>
              </div>

              <div className="home-actions">
                <Link to="/teachingpanel" className="home-btn-primary">
                  Ir al panel docente
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
