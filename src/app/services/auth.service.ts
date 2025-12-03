import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay } from 'rxjs';
import {
  User,
  UserRole,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  OTPVerificationRequest,
  EmailVerificationRequest,
  AuthState
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = signal<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    requiresOTP: false
  });

  // Mock OTP storage (in production, this would be server-side)
  private otpStore = new Map<string, { otp: string; expires: number }>();

  // Mock user database
  private users: Map<string, User & { password: string }> = new Map();

  constructor(private router: Router) {
    this.loadAuthState();
    this.initializeMockUsers();
  }

  private initializeMockUsers() {
    // Create default users for each role
    const defaultUsers = [
      {
        id: '1',
        email: 'admin@biostream.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.Administrator,
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: '2',
        email: 'field@biostream.com',
        password: 'field123',
        firstName: 'Field',
        lastName: 'Agent',
        role: UserRole.FieldAgent,
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: '3',
        email: 'finance@biostream.com',
        password: 'finance123',
        firstName: 'Finance',
        lastName: 'User',
        role: UserRole.FinanceUser,
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: '4',
        email: 'it@biostream.com',
        password: 'it123',
        firstName: 'IT',
        lastName: 'Support',
        role: UserRole.ITSupportUser,
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: '5',
        email: 'user@biostream.com',
        password: 'user123',
        firstName: 'Regular',
        lastName: 'User',
        role: UserRole.User,
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date()
      }
    ];

    defaultUsers.forEach(user => {
      this.users.set(user.email, user);
    });
  }

  getAuthState() {
    return this.authState.asReadonly();
  }

  getCurrentUser(): User | null {
    return this.authState().user;
  }

  isAuthenticated(): boolean {
    return this.authState().isAuthenticated;
  }

  hasRole(role: UserRole): boolean {
    return this.authState().user?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.authState().user?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  register(request: RegisterRequest): Observable<{ message: string; email: string }> {
    // Simulate API delay
    return new Observable(observer => {
      setTimeout(() => {
        // Check if user already exists
        if (this.users.has(request.email)) {
          observer.error({ message: 'User already exists' });
          return;
        }

        // Create new user
        const newUser: User & { password: string } = {
          id: Math.random().toString(36).substring(7),
          email: request.email,
          password: request.password,
          firstName: request.firstName,
          lastName: request.lastName,
          role: request.role,
          isEmailVerified: false,
          isActive: false,
          createdAt: new Date()
        };

        this.users.set(request.email, newUser);

        // Generate verification token (in production, this would be a proper JWT)
        const verificationToken = btoa(request.email + ':' + Date.now());
        
        // Store token for verification (in production, this would be server-side)
        localStorage.setItem(`verification_${verificationToken}`, request.email);

        observer.next({
          message: 'Registration successful. Please check your email for verification link.',
          email: request.email
        });
        observer.complete();
      }, 1000);
    });
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.users.get(request.email);

        if (!user || user.password !== request.password) {
          observer.error({ message: 'Invalid email or password' });
          return;
        }

        if (!user.isEmailVerified) {
          observer.error({ message: 'Please verify your email before logging in' });
          return;
        }

        if (!user.isActive) {
          observer.error({ message: 'Your account is not active. Please contact support.' });
          return;
        }

        // Generate OTP
        const otp = this.generateOTP();
        const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
        this.otpStore.set(request.email, { otp, expires });

        console.log(`OTP for ${request.email}: ${otp}`); // In production, send via email

        // Return response requiring OTP
        const { password, ...userWithoutPassword } = user;
        observer.next({
          user: userWithoutPassword,
          token: '',
          requiresOTP: true
        });

        // Update auth state for OTP verification
        this.authState.set({
          user: null,
          token: null,
          isAuthenticated: false,
          requiresOTP: true,
          pendingEmail: request.email
        });

        observer.complete();
      }, 1000);
    });
  }

  verifyOTP(request: OTPVerificationRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const storedOTP = this.otpStore.get(request.email);

        if (!storedOTP) {
          observer.error({ message: 'OTP not found. Please login again.' });
          return;
        }

        if (Date.now() > storedOTP.expires) {
          this.otpStore.delete(request.email);
          observer.error({ message: 'OTP has expired. Please login again.' });
          return;
        }

        if (storedOTP.otp !== request.otp) {
          observer.error({ message: 'Invalid OTP' });
          return;
        }

        // OTP verified successfully
        this.otpStore.delete(request.email);
        const user = this.users.get(request.email)!;
        
        // Update last login
        user.lastLogin = new Date();

        // Generate token (in production, this would be a proper JWT)
        const token = btoa(request.email + ':' + Date.now());

        const { password, ...userWithoutPassword } = user;

        // Update auth state
        this.authState.set({
          user: userWithoutPassword,
          token,
          isAuthenticated: true,
          requiresOTP: false
        });

        this.saveAuthState();

        observer.next({
          user: userWithoutPassword,
          token,
          requiresOTP: false
        });

        observer.complete();
      }, 1000);
    });
  }

  verifyEmail(request: EmailVerificationRequest): Observable<{ message: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const email = localStorage.getItem(`verification_${request.token}`);

        if (!email) {
          observer.error({ message: 'Invalid or expired verification token' });
          return;
        }

        const user = this.users.get(email);

        if (!user) {
          observer.error({ message: 'User not found' });
          return;
        }

        // Mark email as verified and activate user
        user.isEmailVerified = true;
        user.isActive = true;

        // Clean up token
        localStorage.removeItem(`verification_${request.token}`);

        observer.next({ message: 'Email verified successfully. You can now login.' });
        observer.complete();
      }, 1000);
    });
  }

  resendOTP(email: string): Observable<{ message: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.users.get(email);

        if (!user) {
          observer.error({ message: 'User not found' });
          return;
        }

        // Generate new OTP
        const otp = this.generateOTP();
        const expires = Date.now() + 5 * 60 * 1000;
        this.otpStore.set(email, { otp, expires });

        console.log(`New OTP for ${email}: ${otp}`); // In production, send via email

        observer.next({ message: 'OTP has been resent to your email' });
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false,
      requiresOTP: false
    });
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private saveAuthState(): void {
    const state = this.authState();
    if (state.isAuthenticated && state.user && state.token) {
      localStorage.setItem('auth_user', JSON.stringify(state.user));
      localStorage.setItem('auth_token', state.token);
    }
  }

  private loadAuthState(): void {
    const userStr = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');

    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        this.authState.set({
          user,
          token,
          isAuthenticated: true,
          requiresOTP: false
        });
      } catch (e) {
        this.clearAuthState();
      }
    }
  }

  private clearAuthState(): void {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }

  getRoleDashboardRoute(role: UserRole): string {
    const routes: Record<UserRole, string> = {
      [UserRole.Administrator]: '/admin/dashboard',
      [UserRole.FieldAgent]: '/field-agent/dashboard',
      [UserRole.FinanceUser]: '/finance/dashboard',
      [UserRole.ITSupportUser]: '/it-support/dashboard',
      [UserRole.User]: '/user/dashboard'
    };
    return routes[role];
  }
}
