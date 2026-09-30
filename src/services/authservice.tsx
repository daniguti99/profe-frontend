import type { RegisterForm } from "../schemas/registerSchema";

const URL_BASE = "http://localhost:8080/api/auth";

export async function registerRequest(data: RegisterForm) {
  let response: Response;

  try {
    response = await fetch(`${URL_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Comprueba tu conexión.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (errorData?.error) {
      throw new Error(errorData.error);
    }

    throw new Error("Error desconocido en el registro");
  }

  return await response.text();
}