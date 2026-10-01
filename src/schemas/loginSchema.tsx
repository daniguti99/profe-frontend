import { z } from "zod";

export function createLoginSchema() {
  return z.object({
    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("Formato de correo inválido"),

    password: z
      .string()
      .min(1, "La contraseña es obligatoria"),
  });
}

export type LoginForm = z.infer<ReturnType<typeof createLoginSchema>>;
