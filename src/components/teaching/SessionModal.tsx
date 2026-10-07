import { useEffect, useRef } from "react";
import type { Session } from "../../components/layout/interfaces/interfaces";

const SESSION_FIELDS: { key: keyof Session; label: string }[] = [
  { key: "title", label: "Título" },
  { key: "description", label: "Descripción" },
  { key: "materials", label: "Materiales" },
  { key: "totalDuration", label: "Duración total" },
  { key: "date", label: "Fecha" },
  { key: "warmUpTime", label: "Tiempo de calentamiento" },
  { key: "warmUpDescription", label: "Descripción del calentamiento" },
  { key: "warmUpGraphicUrl", label: "Gráfico del calentamiento" },
  { key: "warmUpObservations", label: "Observaciones del calentamiento" },
  { key: "mainPartTime", label: "Tiempo de parte principal" },
  { key: "mainPartDescription", label: "Descripción de parte principal" },
  { key: "mainPartGraphicUrl", label: "Gráfico de parte principal" },
  { key: "mainPartObservations", label: "Observaciones de parte principal" },
  { key: "coolDownTime", label: "Tiempo de vuelta a la calma" },
  { key: "coolDownDescription", label: "Descripción de vuelta a la calma" },
  { key: "coolDownGraphicUrl", label: "Gráfico de vuelta a la calma" },
  { key: "coolDownObservations", label: "Observaciones de vuelta a la calma" },
];

interface SessionModalProps {
  session: Session;
  onClose: () => void;
}

export default function SessionModal({ session, onClose }: SessionModalProps) {
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleClose = () => {
    onClose();
    openerRef.current?.focus();
  };

  const generalFields = SESSION_FIELDS.slice(0, 5);
  const warmUpFields = SESSION_FIELDS.slice(5, 9);
  const mainPartFields = SESSION_FIELDS.slice(9, 13);
  const coolDownFields = SESSION_FIELDS.slice(13, 17);

  return (
    <div className="session-modal-overlay" onClick={handleOverlayClick}>
      <div
        className="session-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-modal-title"
      >
        <div className="session-modal-header">
          <h3 className="session-modal-title" id="session-modal-title">
            {session.title || "Sin título"}
          </h3>
          <button
            className="session-modal-close"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="session-modal-body">
          <div className="session-modal-group">
            <h4 className="session-modal-group-title">Información general</h4>
            <dl className="session-modal-fields">
              {generalFields.map((field) => (
                <div key={field.key} className="session-modal-field">
                  <dt className="session-modal-label">{field.label}</dt>
                  <dd className="session-modal-value">
                    {session[field.key] ?? "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="session-modal-group">
            <h4 className="session-modal-group-title">Calentamiento</h4>
            <dl className="session-modal-fields">
              {warmUpFields.map((field) => (
                <div key={field.key} className="session-modal-field">
                  <dt className="session-modal-label">{field.label}</dt>
                  <dd className="session-modal-value">
                    {session[field.key] ?? "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="session-modal-group">
            <h4 className="session-modal-group-title">Parte principal</h4>
            <dl className="session-modal-fields">
              {mainPartFields.map((field) => (
                <div key={field.key} className="session-modal-field">
                  <dt className="session-modal-label">{field.label}</dt>
                  <dd className="session-modal-value">
                    {session[field.key] ?? "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="session-modal-group">
            <h4 className="session-modal-group-title">Vuelta a la calma</h4>
            <dl className="session-modal-fields">
              {coolDownFields.map((field) => (
                <div key={field.key} className="session-modal-field">
                  <dt className="session-modal-label">{field.label}</dt>
                  <dd className="session-modal-value">
                    {session[field.key] ?? "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="session-modal-footer">
          <button className="session-modal-done" onClick={handleClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
