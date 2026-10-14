export interface RegisterRequest {
    username: string;
    name: string;
    lastname: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
    province: string;
    locality: string;
}

export interface RegisterResponse {
    id: number;
    username: string;
    email: string;
    role: string;
    message: string;
}

export interface ApiErrorResponse {
    timestamp: string;
    status: number;
    message: string;
}

export interface Cycle {
    id: number;
    name: string;
}

export interface Course {
    id: number;
    name: string;
    cycleId: number;
}

export interface TeachingUnit {
    id: number;
    userId: number;
    courseId: number;
    title: string;
    description: string | null;
    schedule: string | null;
    notes: string | null;
    active: boolean;
}

export interface TeachingUnitResponse {
    teachingUnits: TeachingUnit[];
    message: string;
}

export interface Session {
    id: number;
    teachingUnitId: number;
    userId: number;
    title: string;
    description: string | null;
    materials: string | null;
    totalDuration: string | null;
    date: string | null;
    warmUpTime: string | null;
    warmUpDescription: string | null;
    warmUpGraphicUrl: string | null;
    warmUpObservations: string | null;
    mainPartTime: string | null;
    mainPartDescription: string | null;
    mainPartGraphicUrl: string | null;
    mainPartObservations: string | null;
    coolDownTime: string | null;
    coolDownDescription: string | null;
    coolDownGraphicUrl: string | null;
    coolDownObservations: string | null;
    active: boolean;
    isPublic: boolean;
    publishedAt: string | null;
}

export interface SessionResponse {
    sessions: Session[];
    message: string;
}

export interface CreateTeachingUnitResponse {
    id: number;
    userId: number;
    courseId: number;
    title: string;
    description: string;
    schedule: string;
    notes: string;
}

export interface CreateSessionResponse {
    id: number;
    teachingUnitId: number;
    userId: number;
    title: string;
    description: string;
    materials: string;
    totalDuration: string;
    date: string;
    warmUpTime: string;
    warmUpDescription: string;
    warmUpGraphicUrl: string | null;
    warmUpObservations: string;
    mainPartTime: string;
    mainPartDescription: string;
    mainPartGraphicUrl: string | null;
    mainPartObservations: string;
    coolDownTime: string;
    coolDownDescription: string;
    coolDownGraphicUrl: string | null;
    coolDownObservations: string;
    active: boolean;
}

export interface UpdateSessionRequest {
    title?: string;
    description?: string;
    materials?: string;
    totalDuration?: string;
    date?: string;
    warmUpTime?: string;
    warmUpDescription?: string;
    warmUpGraphicUrl?: string | null;
    warmUpObservations?: string;
    mainPartTime?: string;
    mainPartDescription?: string;
    mainPartGraphicUrl?: string | null;
    mainPartObservations?: string;
    coolDownTime?: string;
    coolDownDescription?: string;
    coolDownGraphicUrl?: string | null;
    coolDownObservations?: string;
}

export interface UpdateSessionResponse {
    message: string;
    session: Session;
}

export interface DeleteSessionResponse {
    message: string;
    session: Session;
}

export interface UpdateTeachingUnitRequest {
    title?: string;
    description?: string;
    schedule?: string;
    notes?: string;
}

export interface UpdateTeachingUnitResponse {
    message: string;
    teachingUnit: TeachingUnit;
}

export interface DeleteTeachingUnitResponse {
    message: string;
    teachingUnit: TeachingUnit;
}

/** Autor de una sesión pública: solo los datos que expone el backend. */
export interface Author {
    id: number;
    username: string;
    photo: string | null;
}

/** Orden del catálogo público; coincide con los valores del backend. */
export type PublicSessionSort = "recent" | "oldest" | "downloads" | "views";

/** Resumen de una sesión pública tal y como aparece en el listado. */
export interface PublicSessionSummary {
    id: number;
    title: string;
    description: string | null;
    date: string | null;
    publishedAt: string | null;
    views: number;
    downloads: number;
    author: Author;
}

/** Detalle de una sesión pública: todos los campos de la sesión más autor y contadores. */
export interface PublicSession extends Session {
    views: number;
    downloads: number;
    author: Author;
}

/** Datos de lectura de una sesión pública que necesita el modal en modo público. */
export type PublicSessionInfo = Pick<PublicSession, "author" | "views" | "downloads">;

export interface PublicSessionsResponse {
    sessions: PublicSessionSummary[];
    message: string;
}

export interface PublicSessionDetailResponse {
    message: string;
    session: PublicSession;
}

export interface UpdateSessionVisibilityRequest {
    isPublic: boolean;
}

export interface UpdateSessionVisibilityResponse {
    message: string;
    session: Session;
}