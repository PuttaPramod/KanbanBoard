import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';
import { TaskPage } from './pages/taskpage/taskpage';
import { NavbarComponent } from './pages/navbar/navbar';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'tasks', component: TaskPage },
  { path: 'navbar', component: NavbarComponent },
  { path: '**', redirectTo: 'login' }
];
