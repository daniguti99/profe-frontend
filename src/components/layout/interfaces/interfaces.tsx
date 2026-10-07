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
}

export interface SessionResponse {
    sessions: Session[];
    message: string;
}