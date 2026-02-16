import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal(false);

  constructor() {
    // Check if user was previously logged in (from localStorage)
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('isLoggedIn');
      if (savedState === 'true') {
        this.isLoggedIn.set(true);
      } else {
        // Set to true by default for demo purposes
        // In production, this should remain false until user logs in
        this.isLoggedIn.set(true);
        localStorage.setItem('isLoggedIn', 'true');
      }
    } else {
      // SSR support
      this.isLoggedIn.set(true);
    }
  }

  login(email: string, password: string): void {
    // Simulate API call - in real app, this would authenticate with backend
    console.log('Logging in user:', email);
    this.isLoggedIn.set(true);
    
    // Save to localStorage to persist across page refreshes
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
    }
  }

  logout(): void {
    console.log('Logging out user');
    this.isLoggedIn.set(false);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
  }

  getCurrentLoginStatus(): boolean {
    return this.isLoggedIn();
  }
}
