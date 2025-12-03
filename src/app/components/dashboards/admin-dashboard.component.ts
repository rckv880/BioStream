import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Administrator Dashboard</h1>
        <button class="btn btn-danger" (click)="logout()">Logout</button>
      </div>

      <div class="welcome-section">
        <h2>Welcome, {{ user()?.firstName }} {{ user()?.lastName }}!</h2>
        <p class="role-badge admin">Administrator</p>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-icon admin-icon">👥</div>
          <h3>User Management</h3>
          <p>Manage all system users and permissions</p>
          <div class="card-stats">
            <span class="stat-number">125</span>
            <span class="stat-label">Total Users</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon admin-icon">⚙️</div>
          <h3>System Settings</h3>
          <p>Configure system-wide settings and parameters</p>
          <div class="card-stats">
            <span class="stat-number">15</span>
            <span class="stat-label">Active Modules</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon admin-icon">📊</div>
          <h3>Analytics</h3>
          <p>View system analytics and reports</p>
          <div class="card-stats">
            <span class="stat-number">98%</span>
            <span class="stat-label">System Uptime</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon admin-icon">🔐</div>
          <h3>Security</h3>
          <p>Monitor security logs and access controls</p>
          <div class="card-stats">
            <span class="stat-number">0</span>
            <span class="stat-label">Security Alerts</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon admin-icon">💾</div>
          <h3>Database</h3>
          <p>Database management and backups</p>
          <div class="card-stats">
            <span class="stat-number">2.4 GB</span>
            <span class="stat-label">Storage Used</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon admin-icon">📧</div>
          <h3>Communications</h3>
          <p>Email templates and notifications</p>
          <div class="card-stats">
            <span class="stat-number">450</span>
            <span class="stat-label">Emails Sent Today</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #333;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .welcome-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .welcome-section h2 {
      margin: 0 0 10px 0;
    }

    .role-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }

    .role-badge.admin {
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .card {
      background: white;
      border-radius: 10px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }

    .card-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .admin-icon {
      filter: hue-rotate(250deg);
    }

    .card h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .card p {
      color: #666;
      margin: 0 0 20px 0;
    }

    .card-stats {
      display: flex;
      flex-direction: column;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .stat-number {
      font-size: 28px;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  `]
})
export class AdminDashboardComponent {
  user = signal<User | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user.set(this.authService.getCurrentUser());
  }

  logout(): void {
    this.authService.logout();
  }
}
