import type { RegisterData } from "../schemas/registerSchema";
import type { LoginForm } from "../schemas/loginSchema";
import { API_URL } from "../config";

const URL_BASE = `${API_URL}/api/auth`;

export async function registerRequest(data: RegisterData, photo?: File) {
  const formData = new FormData();

  // La parte `data` lleva su Content-Type explícito: sin `application/json`
  // Spring no resolvería el JSON con Jackson. La foto viaja aparte y solo si
  // el usuario ha elegido imagen, porque es opcional.
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (photo) {
    formData.append("photo", photo);
  }

  let response: Response;

  try {
    // Sin cabecera Content-Type a mano: el navegador pone el boundary del multipart
    response = await fetch(`${URL_BASE}/register`, {
      method: "POST",
      body: formData
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

  return await response.json();
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  photo: string | null;
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