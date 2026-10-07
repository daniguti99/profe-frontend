import type { TeachingUnit } from "../../components/layout/interfaces/interfaces";

interface UnitsLevelProps {
  units: TeachingUnit[];
  courseName: string;
  loading: boolean;
  error: string;
  onSelect: (unit: TeachingUnit) => void;
  onRetry: () => void;
}

export default function UnitsLevel({ units, courseName, loading, error, onSelect, onRetry }: UnitsLevelProps) {
  return (
    <section>
      <h2 className="panel-section-title">Unidades didácticas de {courseName}</h2>
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
