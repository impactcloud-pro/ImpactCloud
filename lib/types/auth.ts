export interface User {
  user_id: string;
  role_id: string;
  organization_id?: string;
  name: string;
  email: string;
  password_hash: string;
  phone_number?: string;
  status: 'Active' | 'Suspended' | 'Locked';
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  role_id: string;
  name: string;
  description?: string;
}

export interface Organization {
  organization_id: string;
  plan_id?: string;
  name: string;
  type?: string;
  status?: string;
  organization_manager?: string;
  username?: string;
  number_of_beneficiaries?: number;
  number_of_surveys?: number;
  quota?: number;
  consumed?: number;
  remaining?: number;
  created_by?: string;
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    user_id: string;
    name: string;
    email: string;
    role: string;
    organization?: string;
  };
  token?: string;
  message?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface UserAction {
  log_id: string;
  user_id?: string;
  organization_id?: string;
  action: string;
  details: string;
  ip_address?: string;
  user_agent?: string;
  timestamp?: string;
}

export interface JWTPayload {
  user_id: string;
  email: string;
  role: string;
  organization_id?: string;
  iat: number;
  exp: number;
}

export interface AuthMiddlewareRequest extends Request {
  user?: JWTPayload;
}