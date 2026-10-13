import type {
  SessionResponse,
  TeachingUnitResponse,
  CreateTeachingUnitResponse,
  CreateSessionResponse,
} from "../components/layout/interfaces/interfaces";

import { authenticatedGet, authenticatedPost } from "./http";

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
