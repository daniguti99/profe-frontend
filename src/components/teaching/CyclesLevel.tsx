import type { Cycle } from "../../components/layout/interfaces/interfaces";

interface CyclesLevelProps {
  cycles: Cycle[];
  loading: boolean;
  error: string;
  onSelect: (cycle: Cycle) => void;
  onRetry: () => void;
}

export default function CyclesLevel({ cycles, loading, error, onSelect, onRetry }: CyclesLevelProps) {
  return (
    <section>
      <h2 className="panel-section-title">Ciclos disponibles</h2>
      {loading && (
        <div className="panel-state">
          <p className="panel-state-text">Cargando ciclos...</p>
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
      {!loading && !error && cycles.length === 0 && (
        <div className="panel-state">
          <p className="panel-state-text">No hay ciclos disponibles.</p>
        </div>
      )}
      {!loading && !error && cycles.length > 0 && (
        <div className="panel-grid">
          {cycles.map((cycle) => (
            <button
              key={cycle.id}
              className="panel-card"
              onClick={() => onSelect(cycle)}
            >
              <span className="panel-card-kicker">Ciclo</span>
              <span className="panel-card-title">{cycle.name}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
