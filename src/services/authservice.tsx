import type { RegisterForm } from "../schemas/registerSchema";
import type { LoginForm } from "../schemas/loginSchema";

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

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresInMs: number;
  user: UserInfo;
  message?: string;
}

export async function loginRequest(data: LoginForm): Promise<LoginResponse> {
  let response: Response;

  try {
    response = await fetch(`${URL_BASE}/login`, {
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

    throw new Error("Error desconocido en el inicio de sesión");
  }

  return await response.json();
}

export async function getCurrentUserRequest(token: string): Promise<UserInfo> {
  let response: Response;

  try {
    response = await fetch(`${URL_BASE}/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Comprueba tu conexión.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (errorData?.error) {
      throw new Error(errorData.error);
    }

    throw new Error("Error al obtener el usuario actual");
  }

  return await response.json();
}