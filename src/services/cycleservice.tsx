import type { Cycle, Course } from "../components/layout/interfaces/interfaces";

const URL_BASE_CYCLES = "http://localhost:8080/api/cycles";
const URL_BASE_COURSES = "http://localhost:8080/api/courses";

const TOKEN_KEY = "profe_token";

async function authenticatedGet(url: string, errorMessage: string) {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("Debes iniciar sesión para ver esta información.");
  }

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Comprueba tu conexión.");
  }

  if (response.status === 403) {
    throw new Error("Tu sesión ha caducado. Vuelve a iniciar sesión.");
  }

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function getCyclesRequest(): Promise<Cycle[]> {
  return authenticatedGet(URL_BASE_CYCLES, "Error al obtener los ciclos");
}

export async function getCoursesRequest(): Promise<Course[]> {
  return authenticatedGet(URL_BASE_COURSES, "Error al obtener los cursos");
}
