import { Routes } from '@angular/router';
import {
  AuthPipe,
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

// Define your auth pipes
const redirectUnauthorizedToLogin = (): AuthPipe =>
  redirectUnauthorizedTo(['auth']);
const redirectLoggedInToDashboard = (): AuthPipe =>
  redirectLoggedInTo(['dashboard/contacts']);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.LoginScreen),
    title: 'Login',
    ...canActivate(redirectLoggedInToDashboard),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/screens/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    title: 'Dashboard',
    ...canActivate(redirectUnauthorizedToLogin),
  },
  { path: '**', redirectTo: 'login' },
];
