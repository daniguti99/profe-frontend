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

/** Sesiones que se piden en cada página (debe coincidir con el tamaño por defecto del backend). */
const TAMANO_PAGINA = 10;

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMore, setErrorMore] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [detail, setDetail] = useState<PublicSession | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Orden vigente: se usa para descartar respuestas que llegan tarde tras
  // cambiar el selector varias veces seguidas.
  const sortRef = useRef<PublicSessionSort>("recent");
  // Última página cargada y si quedan más: en referencias para que los
  // callbacks no dependan de valores de render y no arrastren cierres obsoletos.
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);
  // Centinela observado para disparar la carga de la página siguiente.
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  /** Carga la primera página del orden indicado, reemplazando el listado. */
  const cargar = useCallback((orden: PublicSessionSort) => {
    sortRef.current = orden;
    pageRef.current = 0;
    hasMoreRef.current = true;
    loadingMoreRef.current = false;

    setLoading(true);
    setError("");
    setLoadingMore(false);
    setErrorMore("");
    setHasMore(true);

    getPublicSessionsRequest(orden, 0, TAMANO_PAGINA)
      .then((data) => {
        if (sortRef.current !== orden) return;
        setSessions(data.sessions);
        setHasMore(data.hasMore);
        hasMoreRef.current = data.hasMore;
      })
      .catch((err: Error) => {
        if (sortRef.current !== orden) return;
        setError(err.message);
      })
      .finally(() => {
        if (sortRef.current === orden) setLoading(false);
      });
  }, []);

  /** Carga la página siguiente y la añade al final, sin repetir sesiones. */
  const cargarMas = useCallback(() => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    const orden = sortRef.current;
    const siguientePagina = pageRef.current + 1;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setErrorMore("");

    getPublicSessionsRequest(orden, siguientePagina, TAMANO_PAGINA)
      .then((data) => {
        if (sortRef.current !== orden) return;
        pageRef.current = siguientePagina;
        setSessions((prev) => {
          const ids = new Set(prev.map((s) => s.id));
          const nuevas = data.sessions.filter((s) => !ids.has(s.id));
          return nuevas.length === 0 ? prev : [...prev, ...nuevas];
        });
        setHasMore(data.hasMore);
        hasMoreRef.current = data.hasMore;
      })
      .catch((err: Error) => {
        if (sortRef.current !== orden) return;
        // Se conservan las sesiones ya cargadas y se ofrece reintentar.
        setErrorMore(err.message);
      })
      .finally(() => {
        if (sortRef.current === orden) {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        }
      });
  }, []);

  useEffect(() => {
    cargar("recent");
  }, [cargar]);

  // Carga automática al acercarse al final del listado. Se vuelve a observar
  // tras cada página nueva (sessions.length) y se pausa mientras hay una carga
  // en curso o un error pendiente de reintentar.
  useEffect(() => {
    const nodo = sentinelRef.current;
    if (!nodo || !hasMore || loading || loadingMore || errorMore) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) cargarMas();
      },
      { rootMargin: "200px" },
    );

    observer.observe(nodo);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, errorMore, cargarMas, sessions.length]);

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

      {!loading && !error && sessions.length > 0 && (
        <div className="explorer-footer">
          {errorMore ? (
            <div className="panel-state panel-state-error">
              <p className="panel-state-text">{errorMore}</p>
              <button className="panel-retry" onClick={cargarMas}>
                Reintentar
              </button>
            </div>
          ) : hasMore ? (
            <>
              <div ref={sentinelRef} className="explorer-sentinel" aria-hidden="true" />
              <button
                className="panel-retry explorer-more"
                onClick={cargarMas}
                disabled={loadingMore}
              >
                {loadingMore ? "Cargando más..." : "Cargar más"}
              </button>
            </>
          ) : (
            <p className="explorer-end">No hay más sesiones</p>
          )}
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
