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
  sort: PublicSessionSort,
  page: number,
  size: number = 10
): Promise<PublicSessionsResponse> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(
      `${URL_BASE_PUBLIC_SESSIONS}?sort=${sort}&page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );
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

/**
 * Descarga una sesión en formato PDF.
 *
 * El backend genera el documento y fija el nombre de archivo en la cabecera
 * `Content-Disposition`; aquí se lee ese nombre (con su variantes `filename*`)
 * y se dispara la descarga en el navegador. La petición no lleva `Content-Type`
 * porque no se envía cuerpo.
 *
 * @param id identificador de la sesión a exportar
 * @returns el nombre del archivo descargado
 */
export async function exportSessionPdfRequest(id: number): Promise<string> {
  const token = getAuthToken();
  let response: Response;

  try {
    response = await fetch(`${URL_BASE_SESSIONS}/${id}/export/pdf`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Comprueba tu conexión.");
  }

  // 401: token inválido. El 403 de este endpoint significa "sesión privada ajena"
  // y no debe cerrar la sesión, así que aquí solo caduca en 401.
  if (response.status === 401) {
    expireSession();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (errorData?.error) {
      throw new Error(errorData.error);
    }

    throw new Error("Error al exportar la sesión en PDF");
  }

  const blob = await response.blob();
  const filename = readFilename(response.headers.get("Content-Disposition"), id);
  downloadBlob(blob, filename);

  return filename;
}

/**
 * Lee el nombre de archivo que ha fijado el backend en `Content-Disposition`,
 * priorizando la variante `filename*` (UTF-8) sobre la simple `filename`.
 */
function readFilename(disposition: string | null, id: number): string {
  if (disposition) {
    const utf8 = /filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i.exec(disposition);
    if (utf8?.[1]) return cleanFilename(utf8[1]);

    const plain = /filename\s*=\s*"([^"]+)"/i.exec(disposition);
    if (plain?.[1]) return plain[1];
  }

  return `sesion-${id}.pdf`;
}

function cleanFilename(value: string): string {
  try {
    return decodeURIComponent(value.trim());
  } catch {
    return value.trim();
  }
}

/**
 * Crea un enlace temporal con el blob y lo pulsa para que el navegador abra el
 * diálogo de descarga; después libera el recurso.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
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
