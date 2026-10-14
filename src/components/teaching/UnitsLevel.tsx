import type { TeachingUnit } from "../../components/layout/interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { deleteTeachingUnitRequest } from "../../services/teachingservice";

interface UnitsLevelProps {
  units: TeachingUnit[];
  courseName: string;
  courseId: number;
  loading: boolean;
  error: string;
  onSelect: (unit: TeachingUnit) => void;
  onRetry: () => void;
  onDeleted: (unitId: number) => void;
  onEdit: (unit: TeachingUnit) => void;
}

export default function UnitsLevel({ units, courseName, courseId, loading, error, onSelect, onRetry, onDeleted, onEdit }: UnitsLevelProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  const handleDelete = async (unit: TeachingUnit) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Se borrará la unidad didáctica y todas sus sesiones. Esta acción no se puede deshacer.",
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
        await deleteTeachingUnitRequest(unit.id);
        onDeleted(unit.id);
        await Swal.fire({
          title: "Unidad didáctica eliminada",
          text: "Se ha eliminado correctamente la unidad didáctica.",
          icon: "success",
          confirmButtonColor: "#FF7A3C",
          background: "#16233A",
          color: "#F6F5F1",
        });
      } catch (err: any) {
        await Swal.fire({
          title: "Error",
          text: err.message || "Error al eliminar la unidad didáctica",
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
            <div
              key={unit.id}
              className="panel-card"
              style={{ position: "relative" }}
            >
              {isAuthenticated && (
                <div className="panel-card-actions">
                  <button
                    className="panel-action-btn panel-action-edit"
                    onClick={(e) => { e.stopPropagation(); onEdit(unit); }}
                    aria-label={`Editar unidad ${unit.title}`}
                    title="Editar"
                  >
                    ✎
                  </button>
                  <button
                    className="panel-action-btn panel-action-delete"
                    onClick={(e) => { e.stopPropagation(); handleDelete(unit); }}
                    aria-label={`Borrar unidad ${unit.title}`}
                    title="Borrar"
                  >
                    🗑
                  </button>
                </div>
              )}
              <button
                className="panel-card-btn"
                onClick={() => onSelect(unit)}
              >
                <span className="panel-card-kicker">Unidad didáctica</span>
                <span className="panel-card-title">{unit.title}</span>
                {unit.description && (
                  <span className="panel-card-desc">{unit.description}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
