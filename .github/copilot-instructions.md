# BioStream - AI Coding Agent Instructions

## Project Overview
BioStream is an Angular 19 standalone application with TypeScript, featuring role-based authentication and multi-user workflows. The app supports five user roles: User, Administrator, FieldAgent, FinanceUser, and ITSupportUser.

## Architecture & Key Patterns

### Component Architecture
- **Standalone Components**: All components use Angular 19's standalone API (no NgModules)
- **Signal-based State**: Uses Angular signals for reactive state management instead of RxJS BehaviorSubject where possible
- **Route-level Lazy Loading**: Components are lazy-loaded via `loadComponent` in routes

### Authentication Flow
1. **Registration** → Email verification link sent
2. **Email Verification** → Account activated
3. **Login** → OTP sent to email (check console for demo OTP)
4. **OTP Verification** → User authenticated and redirected to role-based dashboard

### User Roles & Dashboards
Each role has a dedicated dashboard route:
- `Administrator` → `/admin/dashboard`
- `FieldAgent` → `/field-agent/dashboard`
- `FinanceUser` → `/finance/dashboard`
- `ITSupportUser` → `/it-support/dashboard`
- `User` → `/user/dashboard`

### Guards & Security
- `authGuard`: Protects authenticated routes
- `guestGuard`: Prevents authenticated users from accessing login/register
- `roleGuard(roles)`: Enforces role-based access control

## Key Files & Locations

### Core Services
- `src/app/services/auth.service.ts` - Authentication, session management, mock user database
- `src/app/services/email.service.ts` - Email templates (OTP, verification, welcome emails)

### Models
- `src/app/models/user.model.ts` - User interface, UserRole enum, auth request/response types

### Guards
- `src/app/guards/auth.guard.ts` - All route protection logic

### Components Structure
```
src/app/components/
├── login/              # Login with demo credentials
├── register/           # Multi-role registration
├── verify-otp/         # OTP verification with resend
├── verify-email/       # Email verification handler
└── dashboards/         # Role-specific landing pages
    ├── admin-dashboard.component.ts
    ├── field-agent-dashboard.component.ts
    ├── finance-dashboard.component.ts
    ├── it-support-dashboard.component.ts
    └── user-dashboard.component.ts
```

## Development Patterns

### Component Style
- Use inline templates and styles for components
- Leverage `@if`, `@for`, `@defer` control flow syntax (not *ngIf, *ngFor)
- Import `CommonModule` and `FormsModule` as needed

### State Management
```typescript
// Prefer signals over observables for local state
private loading = signal(false);
private errorMessage = signal('');
```

### Authentication Service Usage
```typescript
// Check authentication
if (authService.isAuthenticated()) { }

// Check role
if (authService.hasRole(UserRole.Administrator)) { }

// Get current user
const user = authService.getCurrentUser();

// Get role dashboard route
const route = authService.getRoleDashboardRoute(user.role);
```

## Mock Data & Demo Accounts

The app includes pre-configured demo accounts (see `auth.service.ts` → `initializeMockUsers`):
- **Admin**: admin@biostream.com / admin123
- **Field Agent**: field@biostream.com / field123
- **Finance**: finance@biostream.com / finance123
- **IT Support**: it@biostream.com / it123
- **User**: user@biostream.com / user123

OTPs are logged to console during development.

## Build & Run

```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test
```

## Adding New Features

### Adding a New User Role
1. Add role to `UserRole` enum in `user.model.ts`
2. Create dashboard component in `components/dashboards/`
3. Add route in `app.routes.ts` with `roleGuard`
4. Update `getRoleDashboardRoute()` in `auth.service.ts`

### Adding Protected Routes
```typescript
{
  path: 'protected-page',
  loadComponent: () => import('./component').then(m => m.Component),
  canActivate: [roleGuard([UserRole.Administrator, UserRole.User])]
}
```

## Common Patterns to Follow

- **Lazy load routes**: Always use `loadComponent` for route components
- **Use signals for component state**: Prefer `signal()` over class properties for reactive data
- **Inline auth checks in templates**: Use `@if (authService.isAuthenticated())`
- **Role-based UI**: Show/hide features based on `authService.hasRole()` or `hasAnyRole()`
- **Logout everywhere**: Include logout button in all dashboards

## Important Notes

- This is a **mock authentication system** - no backend integration yet
- OTP and verification tokens are stored in localStorage (client-side only)
- All email sends are simulated and logged to console
- Session persistence uses localStorage for demo purposes
