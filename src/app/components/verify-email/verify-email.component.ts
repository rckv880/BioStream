import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>BioStream</h1>
          <h2>Email Verification</h2>
        </div>

        @if (loading()) {
          <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Verifying your email...</p>
          </div>
        }

        @if (errorMessage()) {
          <div class="alert alert-error">
            <h3>Verification Failed</h3>
            <p>{{ errorMessage() }}</p>
          </div>
        }

        @if (successMessage()) {
          <div class="alert alert-success">
            <h3>✓ Email Verified!</h3>
            <p>{{ successMessage() }}</p>
          </div>
        }

        <div class="auth-footer">
          <a routerLink="/login" class="btn btn-primary">Go to Login</a>
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
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .loading-spinner {
      text-align: center;
      padding: 40px 0;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-spinner p {
      color: #666;
      margin: 0;
    }

    .alert {
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
      text-align: center;
    }

    .alert h3 {
      margin: 0 0 10px 0;
      font-size: 20px;
    }

    .alert p {
      margin: 0;
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

    .auth-footer {
      text-align: center;
      margin-top: 20px;
    }

    .btn {
      display: inline-block;
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s;
    }

    .btn-primary {
      background-color: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background-color: #5568d3;
    }
  `]
})
export class VerifyEmailComponent implements OnInit {
  loading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.loading.set(false);
      this.errorMessage.set('Invalid verification link');
      return;
    }

    this.verifyEmail(token);
  }

  private verifyEmail(token: string): void {
    this.authService.verifyEmail({ token }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response.message);
        
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'Email verification failed. The link may be invalid or expired.');
      }
    });
  }
}
