import type { Session } from "../../components/layout/interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { deleteSessionRequest } from "../../services/teachingservice";

interface SessionsLevelProps {
  sessions: Session[];
  unitId: number;
  unitTitle: string;
  loading: boolean;
  error: string;
  onSelect: (session: Session, opener: HTMLElement) => void;
  onRetry: () => void;
  onDeleted: (sessionId: number) => void;
  onEdit: (session: Session) => void;
}

export default function SessionsLevel({ sessions, unitId, unitTitle, loading, error, onSelect, onRetry, onDeleted, onEdit }: SessionsLevelProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const createSessionButton = isAuthenticated ? (
    <button
      key="create-session"
      className="panel-card"
      style={{ marginBottom: "var(--space-8)", borderLeftColor: "#FF7A3C" }}
      onClick={() => navigate(`/teachingpanel/crear-sesion/${unitId}`)}
    >
      <span className="panel-card-kicker">Crear sesión</span>
    </button>
  ) : null;

  const handleDelete = async (session: Session) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Estás seguro de que quieres borrar esta sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#FF7A3C",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      background: "#16233A",
      color: "#F6F5F1",
    });

    if (result.isConfirmed) {
      try {
        await deleteSessionRequest(session.id);
        onDeleted(session.id);
        await Swal.fire({
          title: "Sesión eliminada",
          text: "Se ha eliminado correctamente la sesión.",
          icon: "success",
          confirmButtonColor: "#FF7A3C",
          background: "#16233A",
          color: "#F6F5F1",
        });
      } catch (err: any) {
        await Swal.fire({
          title: "Error",
          text: err.message || "Error al eliminar la sesión",
          icon: "error",
          confirmButtonColor: "#FF7A3C",
          background: "#16233A",
          color: "#F6F5F1",
        });
      }
    }
  };

  return (
    <section>
      <h2 className="panel-section-title">Sesiones de {unitTitle}</h2>
      {createSessionButton}
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
                <th>Visibilidad</th>
                {isAuthenticated && <th>Acciones</th>}
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
                  <td>
                    <span
                      className={`panel-badge ${session.isPublic ? "panel-badge-public" : "panel-badge-private"}`}
                    >
                      {session.isPublic ? "Pública" : "Privada"}
                    </span>
                  </td>
                  {isAuthenticated && (
                    <td>
                      <div className="panel-table-actions">
                        <button
                          className="panel-action-btn panel-action-edit"
                          onClick={() => onEdit(session)}
                          aria-label={`Editar sesión ${session.title}`}
                          title="Editar"
                        >
                          ✎
                        </button>
                        <button
                          className="panel-action-btn panel-action-delete"
                          onClick={() => handleDelete(session)}
                          aria-label={`Borrar sesión ${session.title}`}
                          title="Borrar"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
