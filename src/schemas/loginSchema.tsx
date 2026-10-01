import { z } from "zod";

export function createLoginSchema() {
  return z.object({
    login: z
      .string()
      .min(1, "El email o nombre de usuario es obligatorio"),

    password: z
      .string()
      .min(1, "La contraseña es obligatoria"),
  });
}

export type LoginForm = z.infer<ReturnType<typeof createLoginSchema>>;
