/** URL base del backend. En local, localhost; en Vercel, la env VITE_API_URL. */
export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080";