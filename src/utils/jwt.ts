/**
 * Utilidades para inspeccionar el JWT sin verificar su firma.
 * El backend firma el token, así que esto solo sirve para leer `exp`
 * y cerrar la sesión en el instante exacto de caducidad.
 */

/**
 * Devuelve la expiración del token en milisegundos desde epoch,
 * o `null` si el token no tiene un `exp` válido o no se puede decodificar.
 */
export function getTokenExpiryMs(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(base64)) as { exp?: unknown };

    return typeof claims.exp === "number" ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}
