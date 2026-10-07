import type { Session } from "../../components/layout/interfaces/interfaces";

interface SessionsLevelProps {
  sessions: Session[];
  unitTitle: string;
  loading: boolean;
  error: string;
  onSelect: (session: Session, opener: HTMLElement) => void;
  onRetry: () => void;
}

export default function SessionsLevel({ sessions, unitTitle, loading, error, onSelect, onRetry }: SessionsLevelProps) {
  return (
    <section>
      <h2 className="panel-section-title">Sesiones de {unitTitle}</h2>
      {loading && (
        <div className="panel-state">
          <p className="panel-state-text">Cargando sesiones...</p>
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
      {!loading && !error && sessions.length === 0 && (
        <div className="panel-state">
          <p className="panel-state-text">
            Esta unidad didáctica no tiene sesiones.
          </p>
        </div>
      )}
      {!loading && !error && sessions.length > 0 && (
        <div className="panel-table-wrapper">
          <table className="panel-table">
            <thead>
              <tr>
                <th>Título</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>
                    <button
                      className="panel-table-link"
                      onClick={(e) => onSelect(session, e.currentTarget)}
                    >
                      {session.title || "(sin título)"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
