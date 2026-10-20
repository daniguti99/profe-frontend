import type { Cycle, Course } from "../components/layout/interfaces/interfaces";
import { API_URL } from "../config";

import { expireSession, getAuthToken } from "./http";

const URL_BASE_CYCLES = `${API_URL}/api/cycles`;
const URL_BASE_COURSES = `${API_URL}/api/courses`;

export async function getCyclesRequest(): Promise<Cycle[]> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(URL_BASE_CYCLES, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Comprueba tu conexión.");
  }

  if (response.status === 401 || response.status === 403) {
    expireSession();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (errorData?.error) {
      throw new Error(errorData.error);
    }

    throw new Error("Error al obtener los ciclos");
  }

  return await response.json();
}

export async function getCoursesRequest(): Promise<Course[]> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(URL_BASE_COURSES, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Comprueba tu conexión.");
  }

  if (response.status === 401 || response.status === 403) {
    expireSession();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (errorData?.error) {
      throw new Error(errorData.error);
    }

    throw new Error("Error al obtener los cursos");
  }

  return await response.json();
}
