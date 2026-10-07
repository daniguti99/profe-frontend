import type { Course } from "../../components/layout/interfaces/interfaces";

interface CoursesLevelProps {
  courses: Course[];
  cycleName: string;
  loading: boolean;
  error: string;
  onSelect: (course: Course) => void;
  onRetry: () => void;
}

export default function CoursesLevel({ courses, cycleName, loading, error, onSelect, onRetry }: CoursesLevelProps) {
  return (
    <section>
      <h2 className="panel-section-title">Cursos de {cycleName}</h2>
      {loading && (
        <div className="panel-state">
          <p className="panel-state-text">Cargando cursos...</p>
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
      {!loading && !error && courses.length === 0 && (
        <div className="panel-state">
          <p className="panel-state-text">Este ciclo no tiene cursos.</p>
        </div>
      )}
      {!loading && !error && courses.length > 0 && (
        <div className="panel-grid">
          {courses.map((course) => (
            <button
              key={course.id}
              className="panel-card"
              onClick={() => onSelect(course)}
            >
              <span className="panel-card-kicker">Curso</span>
              <span className="panel-card-title">{course.name}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
