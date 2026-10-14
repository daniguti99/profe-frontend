import { z } from "zod";

export const editTeachingUnitSchema = z.object({
  title: z.string().nonempty("El título es obligatorio").optional(),
  description: z.string().nonempty("La descripción es obligatoria").optional(),
  schedule: z.string().nonempty("La temporalización es obligatoria").optional(),
  notes: z.string().nonempty("Las notas son obligatorias").optional(),
});

export type EditTeachingUnitFormValues = z.infer<typeof editTeachingUnitSchema>;
