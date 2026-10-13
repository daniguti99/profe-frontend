import type { Cycle, Course } from "../components/layout/interfaces/interfaces";

import { authenticatedGet } from "./http";

const URL_BASE_CYCLES = "http://localhost:8080/api/cycles";
const URL_BASE_COURSES = "http://localhost:8080/api/courses";

export async function getCyclesRequest(): Promise<Cycle[]> {
  return authenticatedGet<Cycle[]>(URL_BASE_CYCLES, "Error al obtener los ciclos");
}

export async function getCoursesRequest(): Promise<Course[]> {
  return authenticatedGet<Course[]>(URL_BASE_COURSES, "Error al obtener los cursos");
}
