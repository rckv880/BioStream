import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>BioStream</h1>
          <h2>Verify OTP</h2>
          <p class="subtitle">Enter the 6-digit code sent to {{ email() }}</p>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-error">
            {{ errorMessage() }}
          </div>
        }

        @if (successMessage()) {
          <div class="alert alert-success">
            {{ successMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #otpForm="ngForm">
          <div class="form-group">
            <label for="otp">OTP Code</label>
            <input
              type="text"
              id="otp"
              name="otp"
              [(ngModel)]="otp"
              required
              maxlength="6"
              pattern="[0-9]{6}"
              placeholder="Enter 6-digit code"
              [disabled]="loading()"
              class="otp-input"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="!otpForm.form.valid || loading()"
          >
            @if (loading()) {
              <span>Verifying...</span>
            } @else {
              <span>Verify OTP</span>
            }
          </button>
        </form>

        <div class="resend-section">
          <p>Didn't receive the code?</p>
          <button
            type="button"
            class="btn btn-link"
            (click)="resendOTP()"
            [disabled]="resendLoading() || resendCooldown() > 0"
          >
            @if (resendLoading()) {
              <span>Sending...</span>
            } @else if (resendCooldown() > 0) {
              <span>Resend in {{ resendCooldown() }}s</span>
            } @else {
              <span>Resend OTP</span>
            }
          </button>
        </div>

        <div class="auth-footer">
          <p><a routerLink="/login">Back to Login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      padding: 40px;
      max-width: 450px;
      width: 100%;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .auth-header h1 {
      color: #667eea;
      margin: 0 0 10px 0;
      font-size: 32px;
    }

    .auth-header h2 {
      color: #333;
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 500;
    }

    .subtitle {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    .alert {
      padding: 12px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .alert-error {
      background-color: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }

    .alert-success {
      background-color: #efe;
      color: #3c3;
      border: 1px solid #cfc;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #555;
      font-weight: 500;
    }

    .otp-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 24px;
      text-align: center;
      letter-spacing: 10px;
      font-weight: 600;
      box-sizing: border-box;
    }

    .otp-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .otp-input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background-color: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #5568d3;
    }

    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-block {
      width: 100%;
    }

    .btn-link {
      background: none;
      color: #667eea;
      padding: 0;
      font-size: 14px;
    }

    .btn-link:hover:not(:disabled) {
      text-decoration: underline;
    }

    .btn-link:disabled {
      color: #999;
      cursor: not-allowed;
    }

    .resend-section {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .resend-section p {
      color: #666;
      margin: 0 0 10px 0;
      font-size: 14px;
    }

    .auth-footer {
      text-align: center;
      margin-top: 20px;
    }

    .auth-footer p {
      color: #666;
      margin: 0;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class VerifyOtpComponent implements OnInit {
  email = signal('');
  otp = '';
  loading = signal(false);
  resendLoading = signal(false);
  resendCooldown = signal(0);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.queryParams['email'];
    if (!email) {
      this.router.navigate(['/login']);
      return;
    }
    this.email.set(email);
  }

  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.verifyOTP({ email: this.email(), otp: this.otp }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set('OTP verified successfully! Redirecting...');
        setTimeout(() => {
          this.router.navigate([this.authService.getRoleDashboardRoute(response.user.role)]);
        }, 1500);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'OTP verification failed. Please try again.');
      }
    });
  }

  resendOTP(): void {
    this.resendLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.resendOTP(this.email()).subscribe({
      next: (response) => {
        this.resendLoading.set(false);
        this.successMessage.set(response.message);
        this.startCooldown();
      },
      error: (error) => {
        this.resendLoading.set(false);
        this.errorMessage.set(error.message || 'Failed to resend OTP. Please try again.');
      }
    });
  }

  private startCooldown(): void {
    this.resendCooldown.set(60);
    const interval = setInterval(() => {
      const current = this.resendCooldown();
      if (current <= 1) {
        clearInterval(interval);
        this.resendCooldown.set(0);
      } else {
        this.resendCooldown.set(current - 1);
      }
    }, 1000);
  }
}
