import type { PublicSessionSummary } from "../layout/interfaces/interfaces";

interface PublicSessionCardProps {
  session: PublicSessionSummary;
  /** Indica que la sesión pertenece al usuario autenticado. */
  esPropia: boolean;
  onSelect: (session: PublicSessionSummary, opener: HTMLElement) => void;
}

/** Formatea una fecha ISO como dd/mm/aaaa; devuelve un guion si no es válida. */
function formatearFecha(iso: string | null): string {
  if (!iso) return "—";
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "—";
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PublicSessionCard({ session, esPropia, onSelect }: PublicSessionCardProps) {
  return (
    <button
      className="public-card"
      onClick={(e) => onSelect(session, e.currentTarget)}
    >
      {esPropia && <span className="public-card-own">Tuya</span>}

      <span className="public-card-title">{session.title || "(sin título)"}</span>
      <span className="public-card-desc">{session.description || "Sin descripción"}</span>

      <span className="public-card-author">
        {session.author.photo ? (
          <img className="public-card-author-photo" src={session.author.photo} alt="" />
        ) : (
          <span className="public-card-author-initial" aria-hidden="true">
            {session.author.username.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="public-card-author-name">{session.author.username}</span>
      </span>

      <span className="public-card-meta">
        <span>{formatearFecha(session.publishedAt)}</span>
        <span>{session.views} vistas</span>
        <span>{session.downloads} descargas</span>
      </span>
    </button>
  );
}
