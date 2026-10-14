/**
 * Utilidades compartidas de sesión para las peticiones autenticadas.
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
export function getAuthToken(): string {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return expireSession();
  return token;
}
