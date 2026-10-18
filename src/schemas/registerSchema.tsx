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

      // Foto de perfil: opcional, y solo JPG, PNG o WEBP de hasta 2 MB,
      // las mismas reglas que valida el backend antes de subirla.
      photo: z
        .instanceof(File)
        .optional()
        .refine(
          (file) => !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
          { message: "La foto debe ser una imagen JPG, PNG o WEBP" }
        )
        .refine(
          (file) => !file || file.size <= 2 * 1024 * 1024,
          { message: "La foto no puede superar 2 MB" }
        ),
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

/**
 * Campos del formulario de registro, sin la foto: la imagen viaja como parte
 * aparte del multipart, nunca dentro del JSON de `data`.
 */
export type RegisterForm = z.infer<ReturnType<typeof createRegisterSchema>>;
export type RegisterData = Omit<RegisterForm, "photo">;