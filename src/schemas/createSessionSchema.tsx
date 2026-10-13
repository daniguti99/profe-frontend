import { z } from "zod";

export const createSessionSchema = z.object({
  title: z.string().nonempty("El título es obligatorio"),
  description: z.string().nonempty("La descripción es obligatoria"),
  materials: z.string().nonempty("Los materiales son obligatorios"),
  totalDuration: z.string().nonempty("La duración total es obligatoria"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato yyyy-MM-dd")
    .nonempty("La fecha es obligatoria"),
  warmUpTime: z.string().nonempty("El tiempo de calentamiento es obligatorio"),
  warmUpDescription: z.string().nonempty("La descripción del calentamiento es obligatoria"),
  warmUpObservations: z.string().nonempty("Las observaciones del calentamiento son obligatorias"),
  mainPartTime: z.string().nonempty("El tiempo de parte principal es obligatorio"),
  mainPartDescription: z.string().nonempty("La descripción de parte principal es obligatoria"),
  mainPartObservations: z.string().nonempty("Las observaciones de parte principal son obligatorias"),
  coolDownTime: z.string().nonempty("El tiempo de vuelta a la calma es obligatorio"),
  coolDownDescription: z.string().nonempty("La descripción de vuelta a la calma es obligatoria"),
  coolDownObservations: z.string().nonempty("Las observaciones de vuelta a la calma son obligatorias"),
  // Campos opcionales (gráficos)
  warmUpGraphicUrl: z.string().nullable().optional(),
  mainPartGraphicUrl: z.string().nullable().optional(),
  coolDownGraphicUrl: z.string().nullable().optional(),
});

export type CreateSessionFormValues = z.infer<typeof createSessionSchema>;