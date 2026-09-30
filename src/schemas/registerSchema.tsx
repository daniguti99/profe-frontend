import { z } from "zod";

export function createRegisterSchema() {
  return z
    .object({
      username: z
        .string()
        .min(4, "El nombre de usuario debe tener mínimo 4 caracteres")
        .max(20, "El nombre de usuario debe tener máximo 20 caracteres")
        .regex(/^[a-zA-Z0-9_]+$/,"El nombre de usuario solo puede contener letras, números y guiones bajos"),

      firstName: z
        .string()
        .min(2, "El nombre debe tener mínimo 2 caracteres"),

      lastName: z
        .string()
        .min(2, "Los apellidos deben tener mínimo 2 caracteres"),

      email: z.string().email("Formato de correo inválido"),

      confirmEmail: z.string().email("Formato de correo inválido"),

      password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[a-z]/, "Debe contener al menos una minúscula")
        .regex(/[0-9]/, "Debe contener al menos un número"),

      confirmPassword: z.string().min(1, "Debes repetir la contraseña"),

      province: z
        .string()
        .min(2, "La provincia debe tener mínimo 2 caracteres"),

      locality: z
        .string()
        .min(2, "La localidad debe tener mínimo 2 caracteres"),
    })
    .refine((data) => data.email === data.confirmEmail, {
      message: "Los emails no coinciden",
      path: ["confirmEmail"],
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    });
}

export type RegisterForm = z.infer<ReturnType<typeof createRegisterSchema>>;