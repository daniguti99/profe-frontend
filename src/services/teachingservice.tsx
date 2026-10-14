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
  PublicSessionSort,
  PublicSessionsResponse,
  PublicSessionDetailResponse,
  UpdateSessionVisibilityResponse,
} from "../components/layout/interfaces/interfaces";

import { authenticatedGet, authenticatedPost, authenticatedPatch, authenticatedDelete } from "./http";

const URL_BASE_TEACHING_UNITS = "http://localhost:8080/api/teaching-units";
const URL_BASE_SESSIONS = "http://localhost:8080/api/sessions";
const URL_BASE_PUBLIC_SESSIONS = "http://localhost:8080/api/public-sessions";

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

export async function updateSessionVisibilityRequest(
  id: number,
  isPublic: boolean
): Promise<UpdateSessionVisibilityResponse> {
  return authenticatedPatch<UpdateSessionVisibilityResponse>(
    `${URL_BASE_SESSIONS}/${id}/visibility`,
    { isPublic },
    "Error al cambiar la visibilidad de la sesión"
  );
}

export async function getPublicSessionsRequest(
  sort: PublicSessionSort
): Promise<PublicSessionsResponse> {
  return authenticatedGet<PublicSessionsResponse>(
    `${URL_BASE_PUBLIC_SESSIONS}?sort=${sort}`,
    "Error al obtener las sesiones públicas"
  );
}

export async function getPublicSessionRequest(
  id: number
): Promise<PublicSessionDetailResponse> {
  return authenticatedGet<PublicSessionDetailResponse>(
    `${URL_BASE_PUBLIC_SESSIONS}/${id}`,
    "Error al obtener la sesión pública"
  );
}
