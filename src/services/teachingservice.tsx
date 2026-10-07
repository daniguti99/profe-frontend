import type {
  SessionResponse,
  TeachingUnitResponse,
} from "../components/layout/interfaces/interfaces";

const URL_BASE_TEACHING_UNITS = "http://localhost:8080/api/teaching-units";
const URL_BASE_SESSIONS = "http://localhost:8080/api/sessions";

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

export async function getTeachingUnitsRequest(): Promise<TeachingUnitResponse> {
  return authenticatedGet(
    URL_BASE_TEACHING_UNITS,
    "Error al obtener las unidades didácticas"
  );
}

export async function getSessionsRequest(): Promise<SessionResponse> {
  return authenticatedGet(URL_BASE_SESSIONS, "Error al obtener las sesiones");
}