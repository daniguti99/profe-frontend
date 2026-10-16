import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { PublicSessionInfo, Session } from "../../components/layout/interfaces/interfaces";
import { exportSessionPdfRequest } from "../../services/teachingservice";

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
  /**
   * Datos de lectura de una sesión pública (autor y contadores). Su presencia
   * activa el modo público: oculta los gráficos, muestra el autor y las
   * métricas, y sustituye el botón de visibilidad por la descarga a PDF.
   */
  publicInfo?: PublicSessionInfo;
  /**
   * Solo en modo propietario: cambia la visibilidad de la sesión propia. Se
   * llama únicamente después de que el usuario confirme.
   */
  onVisibilityChange?: (isPublic: boolean) => void | Promise<void>;
}

export default function SessionModal({ session, onClose, publicInfo, onVisibilityChange }: SessionModalProps) {
  const openerRef = useRef<HTMLElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const esPublico = Boolean(publicInfo);

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

  const handleVisibility = async () => {
    if (!onVisibilityChange) return;

    const hacerPublica = !session.isPublic;
    const result = await Swal.fire({
      title: hacerPublica ? "¿Publicar esta sesión?" : "¿Despublicar esta sesión?",
      text: hacerPublica
        ? "La sesión pasará a estar visible para el resto de usuarios en Explorar."
        : "La sesión dejará de aparecer en Explorar y volverá a ser privada.",
      icon: "question",
      background: "#16233A",
      color: "#F6F5F1",
      confirmButtonColor: "#FF7A3C",
      confirmButtonText: hacerPublica ? "Sí, publicar" : "Sí, despublicar",
      cancelButtonColor: "#3A4A5F",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setSaving(true);
    try {
      await onVisibilityChange(hacerPublica);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDescargando(true);
    try {
      await exportSessionPdfRequest(session.id);
    } catch (error) {
      await Swal.fire({
        title: "No se pudo descargar el PDF",
        text: error instanceof Error ? error.message : "Inténtalo de nuevo más tarde.",
        icon: "error",
        background: "#16233A",
        color: "#F6F5F1",
        confirmButtonColor: "#FF7A3C",
      });
    } finally {
      setDescargando(false);
    }
  };

  // En modo público no se muestran los gráficos (son URLs internas).
  const visible = (fields: typeof SESSION_FIELDS) =>
    esPublico ? fields.filter((f) => !f.key.toString().endsWith("GraphicUrl")) : fields;

  const generalFields = SESSION_FIELDS.slice(0, 5);
  const warmUpFields = SESSION_FIELDS.slice(5, 9);
  const mainPartFields = SESSION_FIELDS.slice(9, 13);
  const coolDownFields = SESSION_FIELDS.slice(13, 17);

  const renderGroup = (title: string, fields: typeof SESSION_FIELDS) => (
    <div className="session-modal-group">
      <h4 className="session-modal-group-title">{title}</h4>
      <dl className="session-modal-fields">
        {visible(fields).map((field) => (
          <div key={field.key} className="session-modal-field">
            <dt className="session-modal-label">{field.label}</dt>
            <dd className="session-modal-value">{session[field.key] ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

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

        {publicInfo && (
          <div className="session-modal-meta">
            <div className="session-modal-author">
              {publicInfo.author.photo ? (
                <img
                  className="session-modal-author-photo"
                  src={publicInfo.author.photo}
                  alt=""
                />
              ) : (
                <span className="session-modal-author-initial" aria-hidden="true">
                  {publicInfo.author.username.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="session-modal-author-name">
                {publicInfo.author.username}
              </span>
            </div>
            <div className="session-modal-stats">
              <span className="session-modal-stat">{publicInfo.views} vistas</span>
              <span className="session-modal-stat">{publicInfo.downloads} descargas</span>
            </div>
          </div>
        )}

        <div className="session-modal-body">
          {renderGroup("Información general", generalFields)}
          {renderGroup("Calentamiento", warmUpFields)}
          {renderGroup("Parte principal", mainPartFields)}
          {renderGroup("Vuelta a la calma", coolDownFields)}
        </div>

        <div className="session-modal-footer">
          <button
            className="session-modal-download"
            onClick={handleDownloadPdf}
            disabled={descargando}
          >
            {descargando ? "Generando PDF..." : "Descargar PDF"}
          </button>
          {!publicInfo && onVisibilityChange && (
            <button
              className={`session-modal-visibility ${session.isPublic ? "session-modal-visibility-danger" : ""}`}
              onClick={handleVisibility}
              disabled={saving}
            >
              {saving
                ? "Guardando..."
                : session.isPublic
                  ? "Despublicar"
                  : "Publicar"}
            </button>
          )}
          <button className="session-modal-done" onClick={handleClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
