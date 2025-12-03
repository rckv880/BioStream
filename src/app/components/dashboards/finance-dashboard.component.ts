import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Finance Dashboard</h1>
        <button class="btn btn-danger" (click)="logout()">Logout</button>
      </div>

      <div class="welcome-section finance">
        <h2>Welcome, {{ user()?.firstName }} {{ user()?.lastName }}!</h2>
        <p class="role-badge">Finance User</p>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-icon">💰</div>
          <h3>Revenue</h3>
          <p>Track revenue and income</p>
          <div class="card-stats">
            <span class="stat-number">$125,430</span>
            <span class="stat-label">This Month</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon">💸</div>
          <h3>Expenses</h3>
          <p>Monitor expenses and costs</p>
          <div class="card-stats">
            <span class="stat-number">$45,200</span>
            <span class="stat-label">This Month</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon">📈</div>
          <h3>Profit Margin</h3>
          <p>View profit margins and trends</p>
          <div class="card-stats">
            <span class="stat-number">64%</span>
            <span class="stat-label">Current Margin</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon">🧾</div>
          <h3>Invoices</h3>
          <p>Manage invoices and billing</p>
          <div class="card-stats">
            <span class="stat-number">23</span>
            <span class="stat-label">Pending Invoices</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon">💳</div>
          <h3>Payments</h3>
          <p>Process and track payments</p>
          <div class="card-stats">
            <span class="stat-number">15</span>
            <span class="stat-label">Pending Payments</span>
          </div>
        </div>

        <div class="card">
          <div class="card-icon">📊</div>
          <h3>Financial Reports</h3>
          <p>Generate financial reports</p>
          <div class="card-stats">
            <span class="stat-number">8</span>
            <span class="stat-label">Reports Generated</span>
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

    .welcome-section.finance {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
      color: #f5576c;
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
export class FinanceDashboardComponent {
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
