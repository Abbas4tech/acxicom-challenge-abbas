import { Routes } from '@angular/router';
import { LoginScreen } from './auth/auth.component';

export const routes: Routes = [
  { path: 'login', component: LoginScreen },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
