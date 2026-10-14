import type {
  SessionResponse,
  TeachingUnitResponse,
  CreateTeachingUnitResponse,
  CreateSessionResponse,
  UpdateTeachingUnitRequest,
  UpdateTeachingUnitResponse,
  DeleteTeachingUnitResponse,
  UpdateSessionRequest,
  UpdateSessionResponse,
  DeleteSessionResponse,
} from "../components/layout/interfaces/interfaces";

import { authenticatedGet, authenticatedPost, authenticatedPatch, authenticatedDelete } from "./http";

const URL_BASE_TEACHING_UNITS = "http://localhost:8080/api/teaching-units";
const URL_BASE_SESSIONS = "http://localhost:8080/api/sessions";

export async function getTeachingUnitsRequest(): Promise<TeachingUnitResponse> {
  return authenticatedGet<TeachingUnitResponse>(
    URL_BASE_TEACHING_UNITS,
    "Error al obtener las unidades didácticas"
  );
}

export async function getSessionsRequest(): Promise<SessionResponse> {
  return authenticatedGet<SessionResponse>(
    URL_BASE_SESSIONS,
    "Error al obtener las sesiones"
  );
}

export async function createTeachingUnitRequest(
  body: { courseId: number; title: string; description: string; schedule: string; notes: string }
): Promise<CreateTeachingUnitResponse> {
  return authenticatedPost<CreateTeachingUnitResponse>(URL_BASE_TEACHING_UNITS, body);
}

export async function createSessionRequest(
  body: {
    teachingUnitId: number;
    title: string;
    description: string;
    materials: string;
    totalDuration: string;
    date: string;
    warmUpTime: string;
    warmUpDescription: string;
    warmUpObservations: string;
    mainPartTime: string;
    mainPartDescription: string;
    mainPartObservations: string;
    coolDownTime: string;
    coolDownDescription: string;
    coolDownObservations: string;
    warmUpGraphicUrl?: string | null;
    mainPartGraphicUrl?: string | null;
    coolDownGraphicUrl?: string | null;
  }
): Promise<CreateSessionResponse> {
  return authenticatedPost<CreateSessionResponse>(URL_BASE_SESSIONS, body);
}

export async function updateTeachingUnitRequest(
  id: number,
  body: UpdateTeachingUnitRequest
): Promise<UpdateTeachingUnitResponse> {
  return authenticatedPatch<UpdateTeachingUnitResponse>(
    `${URL_BASE_TEACHING_UNITS}/${id}`,
    body,
    "Error al actualizar la unidad didáctica"
  );
}

export async function deleteTeachingUnitRequest(
  id: number
): Promise<DeleteTeachingUnitResponse> {
  return authenticatedDelete<DeleteTeachingUnitResponse>(
    `${URL_BASE_TEACHING_UNITS}/${id}`,
    "Error al eliminar la unidad didáctica"
  );
}

export async function updateSessionRequest(
  id: number,
  body: UpdateSessionRequest
): Promise<UpdateSessionResponse> {
  return authenticatedPatch<UpdateSessionResponse>(
    `${URL_BASE_SESSIONS}/${id}`,
    body,
    "Error al actualizar la sesión"
  );
}

export async function deleteSessionRequest(
  id: number
): Promise<DeleteSessionResponse> {
  return authenticatedDelete<DeleteSessionResponse>(
    `${URL_BASE_SESSIONS}/${id}`,
    "Error al eliminar la sesión"
  );
}
