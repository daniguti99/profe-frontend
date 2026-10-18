import { z } from "zod";

export const editSessionSchema = z.object({
  title: z.string().nonempty("El título es obligatorio").optional(),
  description: z.string().nonempty("La descripción es obligatoria").optional(),
  materials: z.string().nonempty("Los materiales son obligatorios").optional(),
  totalDuration: z.string().nonempty("La duración total es obligatoria").optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato yyyy-MM-dd")
    .nonempty("La fecha es obligatoria")
    .optional(),
  warmUpTime: z.string().nonempty("El tiempo de calentamiento es obligatorio").optional(),
  warmUpDescription: z.string().nonempty("La descripción del calentamiento es obligatoria").optional(),
  warmUpObservations: z.string().nonempty("Las observaciones del calentamiento son obligatorias").optional(),
  mainPartTime: z.string().nonempty("El tiempo de parte principal es obligatorio").optional(),
  mainPartDescription: z.string().nonempty("La descripción de parte principal es obligatoria").optional(),
  mainPartObservations: z.string().nonempty("Las observaciones de parte principal son obligatorias").optional(),
  coolDownTime: z.string().nonempty("El tiempo de vuelta a la calma es obligatorio").optional(),
  coolDownDescription: z.string().nonempty("La descripción de vuelta a la calma es obligatoria").optional(),
  coolDownObservations: z.string().nonempty("Las observaciones de vuelta a la calma son obligatorias").optional(),
});

export type EditSessionFormValues = z.infer<typeof editSessionSchema>;
