import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';
import { TaskPage } from './pages/taskpage/taskpage';
import { Navbar } from './pages/navbar/navbar';
import { Contact } from './pages/contact/contact';
import { Profile } from './pages/profile/profile';
import { AuthGuard } from './guards/auth.guard';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Dashboard },   // ✅ public homepage

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskPage, canActivate: [AuthGuard] },
  { path: 'contact', component: Contact, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },

  { path: 'navbar', component: Navbar },
  { path: 'home', component: Home },

  { path: '**', redirectTo: 'login' }
];
