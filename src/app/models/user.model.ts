export enum UserRole {
  User = 'User',
  Administrator = 'Administrator',
  FieldAgent = 'FieldAgent',
  FinanceUser = 'FinanceUser',
  ITSupportUser = 'ITSupportUser'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  requiresOTP: boolean;
}

export interface OTPVerificationRequest {
  email: string;
  otp: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  requiresOTP: boolean;
  pendingEmail?: string;
}
