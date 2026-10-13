/**
 * Helpers compartidos para peticiones autenticadas.
 *
 * Centraliza la lectura del token y el cierre de sesión cuando el backend
 * lo rechaza (401/403), de modo que cualquier servicio que detecte una
 * sesión caducada provoca el mismo comportamiento global.
 */

const TOKEN_KEY = "profe_token";
const USER_KEY = "profe_user";

/**
 * Evento de `window` que los servicios lanzan cuando la sesión deja de ser
 * válida. `AuthContext` lo escucha y cierra la sesión en toda la app.
 */
export const SESSION_EXPIRED_EVENT = "profe:session-expired";

/**
 * Limpia la sesión almacenada y avisa a la app para cerrarla globalmente.
 * Siempre lanza, de modo que quien la llame no continúe con la petición.
 */
export function expireSession(): never {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  throw new Error("Tu sesión ha caducado. Vuelve a iniciar sesión.");
}

/** Devuelve el token almacenado o cierra la sesión si no existe. */
function requireToken(): string {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return expireSession();
  return token;
}

async function fetchWithToken(url: string, init: RequestInit): Promise<Response> {
  const token = requireToken();

  try {
    return await fetch(url, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Comprueba tu conexión.");
  }
}

async function parseResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (response.status === 401 || response.status === 403) {
    expireSession();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error ?? fallbackMessage);
  }

  return (await response.json()) as T;
}

export async function authenticatedGet<T>(url: string, errorMessage: string): Promise<T> {
  const response = await fetchWithToken(url, { method: "GET" });
  return parseResponse<T>(response, errorMessage);
}

export async function authenticatedPost<T>(
  url: string,
  body: object,
  errorMessage: string = "Error en la creación del recurso"
): Promise<T> {
  const response = await fetchWithToken(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response, errorMessage);
}
