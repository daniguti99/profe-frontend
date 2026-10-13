import { z } from "zod";

export const createTeachingUnitSchema = z.object({
  title: z.string().nonempty("El título es obligatorio"),
  description: z.string().nonempty("La descripción es obligatoria"),
  schedule: z.string().nonempty("La temporalización es obligatoria"),
  notes: z.string().nonempty("Las notas son obligatorias"),
});

export type CreateTeachingUnitFormValues = z.infer<typeof createTeachingUnitSchema>;