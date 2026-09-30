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