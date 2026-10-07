import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCyclesRequest, getCoursesRequest } from "../services/cycleservice";
import { getTeachingUnitsRequest, getSessionsRequest } from "../services/teachingservice";
import type {
  Cycle,
  Course,
  TeachingUnit,
  Session,
} from "../components/layout/interfaces/interfaces";
import CyclesLevel from "../components/teaching/CyclesLevel";
import CoursesLevel from "../components/teaching/CoursesLevel";
import UnitsLevel from "../components/teaching/UnitsLevel";
import SessionsLevel from "../components/teaching/SessionsLevel";
import SessionModal from "../components/teaching/SessionModal";
import "../styles/teachingPanel.css";

type Level = "cycles" | "courses" | "units" | "sessions";

interface LoadingState {
  cycles: boolean;
  courses: boolean;
  units: boolean;
  sessions: boolean;
}

interface ErrorState {
  cycles: string;
  courses: string;
  units: string;
  sessions: string;
}

export default function TeachingPanel() {
  const { isAuthenticated } = useAuth();

  const [level, setLevel] = useState<Level>("cycles");
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<TeachingUnit[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<TeachingUnit | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState<LoadingState>({
    cycles: false,
    courses: false,
    units: false,
    sessions: false,
  });
  const [error, setError] = useState<ErrorState>({
    cycles: "",
    courses: "",
    units: "",
    sessions: "",
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading((prev) => ({ ...prev, cycles: true, courses: true }));
    setError((prev) => ({ ...prev, cycles: "", courses: "" }));

    Promise.all([getCyclesRequest(), getCoursesRequest()])
      .then(([cyclesData, coursesData]) => {
        setCycles(cyclesData);
        setCourses(coursesData);
      })
      .catch((err: Error) => {
        setError((prev) => ({
          ...prev,
          cycles: err.message,
          courses: err.message,
        }));
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, cycles: false, courses: false }));
      });
  }, [isAuthenticated]);

  useEffect(() => {
    if (level !== "units" || units.length > 0) return;

    setLoading((prev) => ({ ...prev, units: true }));
    setError((prev) => ({ ...prev, units: "" }));

    getTeachingUnitsRequest()
      .then((data) => setUnits(data.teachingUnits))
      .catch((err: Error) => setError((prev) => ({ ...prev, units: err.message })))
      .finally(() => setLoading((prev) => ({ ...prev, units: false })));
  }, [level, units.length]);

  useEffect(() => {
    if (level !== "sessions" || sessions.length > 0) return;

    setLoading((prev) => ({ ...prev, sessions: true }));
    setError((prev) => ({ ...prev, sessions: "" }));

    getSessionsRequest()
      .then((data) => setSessions(data.sessions))
      .catch((err: Error) => setError((prev) => ({ ...prev, sessions: err.message })))
      .finally(() => setLoading((prev) => ({ ...prev, sessions: false })));
  }, [level, sessions.length]);

  const goToCycles = () => {
    setLevel("cycles");
    setSelectedCycle(null);
    setSelectedCourse(null);
    setSelectedUnit(null);
  };

  const goToCourses = () => {
    setLevel("courses");
    setSelectedCourse(null);
    setSelectedUnit(null);
  };

  const goToUnits = () => {
    setLevel("units");
    setSelectedUnit(null);
  };

  const handleCycleClick = (cycle: Cycle) => {
    setSelectedCycle(cycle);
    setLevel("courses");
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setLevel("units");
  };

  const handleUnitClick = (unit: TeachingUnit) => {
    setSelectedUnit(unit);
    setLevel("sessions");
  };

  const handleSessionClick = (session: Session, opener: HTMLElement) => {
    setSelectedSession(session);
    opener.focus();
  };

  const filteredCourses = selectedCycle
    ? courses.filter((c) => c.cycleId === selectedCycle.id)
    : [];

  const filteredUnits = selectedCourse
    ? units.filter((u) => u.courseId === selectedCourse.id)
    : [];

  const filteredSessions = selectedUnit
    ? sessions.filter((s) => s.teachingUnitId === selectedUnit.id)
    : [];

  const retryCycles = () => {
    setLoading((prev) => ({ ...prev, cycles: true, courses: true }));
    setError((prev) => ({ ...prev, cycles: "", courses: "" }));

    Promise.all([getCyclesRequest(), getCoursesRequest()])
      .then(([cyclesData, coursesData]) => {
        setCycles(cyclesData);
        setCourses(coursesData);
      })
      .catch((err: Error) => {
        setError((prev) => ({
          ...prev,
          cycles: err.message,
          courses: err.message,
        }));
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, cycles: false, courses: false }));
      });
  };

  const retryUnits = () => {
    setLoading((prev) => ({ ...prev, units: true }));
    setError((prev) => ({ ...prev, units: "" }));

    getTeachingUnitsRequest()
      .then((data) => setUnits(data.teachingUnits))
      .catch((err: Error) => setError((prev) => ({ ...prev, units: err.message })))
      .finally(() => setLoading((prev) => ({ ...prev, units: false })));
  };

  const retrySessions = () => {
    setLoading((prev) => ({ ...prev, sessions: true }));
    setError((prev) => ({ ...prev, sessions: "" }));

    getSessionsRequest()
      .then((data) => setSessions(data.sessions))
      .catch((err: Error) => setError((prev) => ({ ...prev, sessions: err.message })))
      .finally(() => setLoading((prev) => ({ ...prev, sessions: false })));
  };

  if (!isAuthenticated) {
    return (
      <div className="panel">
        <div className="panel-state">
          <p className="panel-state-text">
            Debes iniciar sesión para ver el panel docente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h1 className="panel-title">Panel docente</h1>
        <nav className="panel-breadcrumb" aria-label="Miga de pan">
          <button
            className={`panel-crumb ${level === "cycles" ? "panel-crumb-current" : ""}`}
            onClick={goToCycles}
          >
            Ciclos
          </button>
          {selectedCycle && (
            <>
              <span className="panel-crumb-sep">/</span>
              <button
                className={`panel-crumb ${level === "courses" ? "panel-crumb-current" : ""}`}
                onClick={goToCourses}
              >
                {selectedCycle.name}
              </button>
            </>
          )}
          {selectedCourse && (
            <>
              <span className="panel-crumb-sep">/</span>
              <button
                className={`panel-crumb ${level === "units" ? "panel-crumb-current" : ""}`}
                onClick={goToUnits}
              >
                {selectedCourse.name}
              </button>
            </>
          )}
          {selectedUnit && (
            <>
              <span className="panel-crumb-sep">/</span>
              <span className="panel-crumb panel-crumb-current">{selectedUnit.title}</span>
            </>
          )}
        </nav>
      </div>

      {level === "cycles" && (
        <CyclesLevel
          cycles={cycles}
          loading={loading.cycles}
          error={error.cycles}
          onSelect={handleCycleClick}
          onRetry={retryCycles}
        />
      )}

      {level === "courses" && selectedCycle && (
        <CoursesLevel
          courses={filteredCourses}
          cycleName={selectedCycle.name}
          loading={loading.courses}
          error={error.courses}
          onSelect={handleCourseClick}
          onRetry={retryCycles}
        />
      )}

      {level === "units" && selectedCourse && (
        <UnitsLevel
          units={filteredUnits}
          courseName={selectedCourse.name}
          loading={loading.units}
          error={error.units}
          onSelect={handleUnitClick}
          onRetry={retryUnits}
        />
      )}

      {level === "sessions" && selectedUnit && (
        <SessionsLevel
          sessions={filteredSessions}
          unitTitle={selectedUnit.title}
          loading={loading.sessions}
          error={error.sessions}
          onSelect={handleSessionClick}
          onRetry={retrySessions}
        />
      )}

      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
