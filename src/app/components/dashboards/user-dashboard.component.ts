import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>User Dashboard</h1>
        <button class="btn btn-danger" (click)="logout()">Logout</button>
      </div>

      <div class="welcome-section user">
        <h2>Welcome, {{ user()?.firstName }} {{ user()?.lastName }}!</h2>
        <p class="role-badge">User</p>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-icon">📊</div>
          <h3>My Data</h3>
          <p>View your personal data and statistics</p>
          <div class="card-stats">
            <span class="stat-number">24</span>
            <span class="stat-label">Records</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon">📝</div>
          <h3>My Submissions</h3>
          <p>Track your submissions</p>
          <div class="card-stats">
            <span class="stat-number">8</span>
            <span class="stat-label">Pending Review</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon">📧</div>
          <h3>Messages</h3>
          <p>View your messages and notifications</p>
          <div class="card-stats">
            <span class="stat-number">5</span>
            <span class="stat-label">Unread Messages</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon">⚙️</div>
          <h3>Settings</h3>
          <p>Manage your account settings</p>
          <div class="card-stats">
            <span class="stat-number">✓</span>
            <span class="stat-label">Profile Complete</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon">📅</div>
          <h3>Calendar</h3>
          <p>View your schedule and events</p>
          <div class="card-stats">
            <span class="stat-number">3</span>
            <span class="stat-label">Events Today</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon">📄</div>
          <h3>Documents</h3>
          <p>Access your documents and files</p>
          <div class="card-stats">
            <span class="stat-number">42</span>
            <span class="stat-label">Total Documents</span>
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
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .welcome-section.user {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
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
      color: #fa709a;
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
export class UserDashboardComponent {
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
