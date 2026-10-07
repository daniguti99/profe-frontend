import type {
  Cycle,
  Course,
  TeachingUnit,
  Session,
} from "../components/layout/interfaces/interfaces";
import { getCyclesRequest, getCoursesRequest } from "./cycleservice";
import { getTeachingUnitsRequest, getSessionsRequest } from "./teachingservice";

export interface HomeSummary {
  totalUnits: number;
  totalSessions: number;
  coursesWithUnits: number;
  cyclesWithUnits: number;
  totalCourses: number;
  totalCycles: number;
  sessionsPerUnit: number;
}

export async function getHomeSummaryRequest(): Promise<HomeSummary> {
  const [cyclesData, coursesData, unitsData, sessionsData] = await Promise.all([
    getCyclesRequest(),
    getCoursesRequest(),
    getTeachingUnitsRequest(),
    getSessionsRequest(),
  ]);

  const units: TeachingUnit[] = unitsData.teachingUnits;
  const sessions: Session[] = sessionsData.sessions;
  const courses: Course[] = coursesData;
  const cycles: Cycle[] = cyclesData;

  const unitCourseIds = new Set(units.map((u) => u.courseId));
  const courseCycleIds = new Set(
    courses.filter((c) => unitCourseIds.has(c.id)).map((c) => c.cycleId)
  );

  return {
    totalUnits: units.length,
    totalSessions: sessions.length,
    coursesWithUnits: unitCourseIds.size,
    cyclesWithUnits: courseCycleIds.size,
    totalCourses: courses.length,
    totalCycles: cycles.length,
    sessionsPerUnit: units.length > 0 ? Math.round(sessions.length / units.length * 10) / 10 : 0,
  };
}
