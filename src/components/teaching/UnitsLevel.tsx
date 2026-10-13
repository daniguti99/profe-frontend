import type { TeachingUnit } from "../../components/layout/interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface UnitsLevelProps {
  units: TeachingUnit[];
  courseName: string;
  courseId: number;
  loading: boolean;
  error: string;
  onSelect: (unit: TeachingUnit) => void;
  onRetry: () => void;
}

export default function UnitsLevel({ units, courseName, courseId, loading, error, onSelect, onRetry }: UnitsLevelProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Botón "Crear unidad didáctica" - siempre visible si hay sesión autenticada
  // El courseId viene de la ruta y se pasa desde TeachingPanel
  // El courseName se muestra en el título de la sección
  const createUnitButton = isAuthenticated ? (
    <button
      key="create-unit"
      className="panel-card"
      style={{ marginBottom: "var(--space-8)", borderLeftColor: "#FF7A3C" }}
      onClick={() => navigate(`/teachingpanel/crear-unidad/${courseId}`)}
    >
      <span className="panel-card-kicker">Crear unidad didáctica</span>
    </button>
  ) : null;

  return (
    <section>
      <h2 className="panel-section-title">Unidades didácticas de {courseName}</h2>
      {createUnitButton}
      {loading && (
        <div className="panel-state">
          <p className="panel-state-text">Cargando unidades didácticas...</p>
        </div>
      )}
      {error && (
        <div className="panel-state panel-state-error">
          <p className="panel-state-text">{error}</p>
          <button className="panel-retry" onClick={onRetry}>
            Reintentar
          </button>
        </div>
      )}
      {!loading && !error && units.length === 0 && (
        <div className="panel-state">
          <p className="panel-state-text">
            No tienes unidades didácticas en este curso.
          </p>
        </div>
      )}
      {!loading && !error && units.length > 0 && (
        <div className="panel-grid">
          {units.map((unit) => (
            <button
              key={unit.id}
              className="panel-card"
              onClick={() => onSelect(unit)}
            >
              <span className="panel-card-kicker">Unidad didáctica</span>
              <span className="panel-card-title">{unit.title}</span>
              {unit.description && (
                <span className="panel-card-desc">{unit.description}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}