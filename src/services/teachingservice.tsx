import type {
  SessionResponse,
  TeachingUnitResponse,
  CreateTeachingUnitResponse,
  CreateSessionResponse,
  UpdateTeachingUnitRequest,
  UpdateTeachingUnitResponse,
  DeleteTeachingUnitResponse,
  UpdateSessionRequest,
  UpdateSessionResponse,
  DeleteSessionResponse,
  PublicSessionSort,
  PublicSessionsResponse,
  PublicSessionDetailResponse,
  UpdateSessionVisibilityResponse,
} from "../components/layout/interfaces/interfaces";

import { expireSession, getAuthToken } from "./http";

const URL_BASE_TEACHING_UNITS = "http://localhost:8080/api/teaching-units";
const URL_BASE_SESSIONS = "http://localhost:8080/api/sessions";
const URL_BASE_PUBLIC_SESSIONS = "http://localhost:8080/api/public-sessions";

export async function getTeachingUnitsRequest(): Promise<TeachingUnitResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(URL_BASE_TEACHING_UNITS, {
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

    throw new Error("Error al obtener las unidades didácticas");
  }

  return await response.json();
}

export async function getSessionsRequest(): Promise<SessionResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(URL_BASE_SESSIONS, {
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

    throw new Error("Error al obtener las sesiones");
  }

  return await response.json();
}

export async function createTeachingUnitRequest(
  body: { courseId: number; title: string; description: string; schedule: string; notes: string }
): Promise<CreateTeachingUnitResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(URL_BASE_TEACHING_UNITS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
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

    throw new Error("Error en la creación del recurso");
  }

  return await response.json();
}

export async function createSessionRequest(
  body: {
    teachingUnitId: number,
    title: string,
    description: string,
    materials: string,
    totalDuration: string,
    date: string,
    warmUpTime: string,
    warmUpDescription: string,
    warmUpObservations: string,
    mainPartTime: string,
    mainPartDescription: string,
    mainPartObservations: string,
    coolDownTime: string,
    coolDownDescription: string,
    coolDownObservations: string,
    warmUpGraphicUrl?: string | null,
    mainPartGraphicUrl?: string | null,
    coolDownGraphicUrl?: string | null,
  }
): Promise<CreateSessionResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(URL_BASE_SESSIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
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

    throw new Error("Error en la creación del recurso");
  }

  return await response.json();
}

export async function updateTeachingUnitRequest(
  id: number,
  body: UpdateTeachingUnitRequest
): Promise<UpdateTeachingUnitResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(`${URL_BASE_TEACHING_UNITS}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
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

    throw new Error("Error al actualizar la unidad didáctica");
  }

  return await response.json();
}

export async function deleteTeachingUnitRequest(
  id: number
): Promise<DeleteTeachingUnitResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(`${URL_BASE_TEACHING_UNITS}/${id}`, {
      method: "DELETE",
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

    throw new Error("Error al eliminar la unidad didáctica");
  }

  return await response.json();
}

export async function updateSessionRequest(
  id: number,
  body: UpdateSessionRequest
): Promise<UpdateSessionResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(`${URL_BASE_SESSIONS}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
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

    throw new Error("Error al actualizar la sesión");
  }

  return await response.json();
}

export async function deleteSessionRequest(
  id: number
): Promise<DeleteSessionResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(`${URL_BASE_SESSIONS}/${id}`, {
      method: "DELETE",
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

    throw new Error("Error al eliminar la sesión");
  }

  return await response.json();
}

export async function updateSessionVisibilityRequest(
  id: number,
  isPublic: boolean
): Promise<UpdateSessionVisibilityResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(`${URL_BASE_SESSIONS}/${id}/visibility`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ isPublic })
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

    throw new Error("Error al cambiar la visibilidad de la sesión");
  }

  return await response.json();
}

export async function getPublicSessionsRequest(
  sort: PublicSessionSort
): Promise<PublicSessionsResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(`${URL_BASE_PUBLIC_SESSIONS}?sort=${sort}`, {
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

    throw new Error("Error al obtener las sesiones públicas");
  }

  return await response.json();
}

export async function getPublicSessionRequest(
  id: number
): Promise<PublicSessionDetailResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(`${URL_BASE_PUBLIC_SESSIONS}/${id}`, {
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

    throw new Error("Error al obtener la sesión pública");
  }

  return await response.json();
}
