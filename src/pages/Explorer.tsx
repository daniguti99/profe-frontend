import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { getPublicSessionsRequest, getPublicSessionRequest } from "../services/teachingservice";
import PublicSessionCard from "../components/explorer/PublicSessionCard";
import SessionModal from "../components/teaching/SessionModal";
import type {
  PublicSession,
  PublicSessionSort,
  PublicSessionSummary,
} from "../components/layout/interfaces/interfaces";
import "../styles/teachingPanel.css";
import "../styles/explorer.css";

const OPCIONES_ORDEN: { value: PublicSessionSort; label: string }[] = [
  { value: "recent", label: "Más recientes" },
  { value: "oldest", label: "Más antiguas" },
  { value: "downloads", label: "Más descargadas" },
  { value: "views", label: "Más vistas" },
];

export default function Explorer() {
  const { user } = useAuth();

  const [sessions, setSessions] = useState<PublicSessionSummary[]>([]);
  const [sort, setSort] = useState<PublicSessionSort>("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<PublicSession | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Orden vigente: se usa para descartar respuestas que llegan tarde tras
  // cambiar el selector varias veces seguidas.
  const sortRef = useRef<PublicSessionSort>("recent");

  const cargar = useCallback((orden: PublicSessionSort) => {
    sortRef.current = orden;
    setLoading(true);
    setError("");

    getPublicSessionsRequest(orden)
      .then((data) => {
        if (sortRef.current !== orden) return;
        setSessions(data.sessions);
      })
      .catch((err: Error) => {
        if (sortRef.current !== orden) return;
        setError(err.message);
      })
      .finally(() => {
        if (sortRef.current === orden) setLoading(false);
      });
  }, []);

  useEffect(() => {
    cargar("recent");
  }, [cargar]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevo = e.target.value as PublicSessionSort;
    setSort(nuevo);
    cargar(nuevo);
  };

  const handleSelect = async (session: PublicSessionSummary, opener: HTMLElement) => {
    if (loadingDetail) return;
    opener.focus();
    setLoadingDetail(true);

    try {
      const data = await getPublicSessionRequest(session.id);
      setDetail(data.session);
    } catch (err: any) {
      await Swal.fire({
        title: "Error",
        text: err.message || "No se pudo abrir la sesión pública",
        icon: "error",
        confirmButtonColor: "#FF7A3C",
        background: "#16233A",
        color: "#F6F5F1",
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  const esPropia = (authorId: number) => user?.id === authorId;

  return (
    <div className="explorer">
      <div className="explorer-header">
        <h1 className="explorer-title">Explorar sesiones</h1>
        <p className="explorer-subtitle">
          Descubre sesiones compartidas por otros docentes.
        </p>
      </div>

      <div className="explorer-toolbar">
        <label className="explorer-sort">
          <span className="explorer-sort-label">Ordenar por</span>
          <select
            id="explorer-sort-select"
            name="sort"
            className="explorer-sort-select"
            value={sort}
            onChange={handleSortChange}
            disabled={loading && sessions.length === 0}
          >
            {OPCIONES_ORDEN.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && (
        <div className="panel-state">
          <p className="panel-state-text">Cargando sesiones...</p>
        </div>
      )}

      {!loading && error && (
        <div className="panel-state panel-state-error">
          <p className="panel-state-text">{error}</p>
          <button className="panel-retry" onClick={() => cargar(sort)}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && sessions.length === 0 && (
        <div className="panel-state">
          <p className="panel-state-text">Todavía no hay sesiones públicas.</p>
        </div>
      )}

      {!loading && !error && sessions.length > 0 && (
        <div className="explorer-grid">
          {sessions.map((session) => (
            <PublicSessionCard
              key={session.id}
              session={session}
              esPropia={esPropia(session.author.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      {detail && (
        <SessionModal
          session={detail}
          publicInfo={detail}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}
