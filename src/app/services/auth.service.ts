import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal(false);
  currentUser = signal<User | null>(null);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private auth: Auth) {
    // Monitor Firebase auth state changes
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.isLoggedIn.set(true);
        this.currentUser.set(user);
      } else {
        this.isLoggedIn.set(false);
        this.currentUser.set(null);
      }
    });
  }

  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);
      
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Store user profile data in localStorage
      if (firstName && lastName) {
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          firstName: firstName,
          lastName: lastName,
          displayName: `${firstName} ${lastName}`
        };
        localStorage.setItem(`user_profile_${userCredential.user.uid}`, JSON.stringify(userData));
      }
      
      this.currentUser.set(userCredential.user);
      this.isLoggedIn.set(true);
      
      return Promise.resolve();
    } catch (error: any) {
      const errorMsg = this.getErrorMessageFromCode(error.code);
      this.errorMessage.set(errorMsg);
      throw new Error(errorMsg);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);
      
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUser.set(userCredential.user);
      this.isLoggedIn.set(true);
      
      return Promise.resolve();
    } catch (error: any) {
      const errorMsg = this.getErrorMessageFromCode(error.code);
      this.errorMessage.set(errorMsg);
      throw new Error(errorMsg);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);
      
      await signOut(this.auth);
      this.isLoggedIn.set(false);
      this.currentUser.set(null);
      
      return Promise.resolve();
    } catch (error: any) {
      const errorMsg = this.getErrorMessageFromCode(error.code);
      this.errorMessage.set(errorMsg);
      throw new Error(errorMsg);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get current login status
   */
  getCurrentLoginStatus(): boolean {
    return this.isLoggedIn();
  }

  /**
   * Get current logged-in user
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  /**
   * Get user email
   */
  getUserEmail(): string | null {
    return this.currentUser()?.email || null;
  }

  /**
   * Get error message
   */
  getErrorMessage(): string | null {
    return this.errorMessage();
  }

  /**
   * Clear error message
   */
  clearErrorMessage(): void {
    this.errorMessage.set(null);
  }

  /**
   * Get user profile data (firstName, lastName)
   */
  getUserProfile(): { firstName: string; lastName: string } | null {
    try {
      const user = this.currentUser();
      // Try lookup by uid first
      if (user && user.uid) {
        const stored = localStorage.getItem(`user_profile_${user.uid}`);
        if (stored) {
          const profile = JSON.parse(stored);
          return {
            firstName: profile.firstName || '',
            lastName: profile.lastName || ''
          };
        }
      }

      // Fallback: try to find a profile stored by email (handles timing/race conditions)
      const email = user?.email || null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (!key.startsWith('user_profile_')) continue;
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const p = JSON.parse(raw);
          if (email && p.email && p.email === email) {
            return {
              firstName: p.firstName || '',
              lastName: p.lastName || ''
            };
          }
        } catch (e) {
          // ignore parse errors and continue
        }
      }
    } catch (error) {
      console.error('Error retrieving user profile:', error);
    }
    return null;
  }

  /**
   * Convert Firebase error codes to user-friendly messages
   */
  private getErrorMessageFromCode(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'User not found. Please check your email or sign up.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/email-already-in-use': 'Email is already in use. Please use a different email.',
      'auth/weak-password': 'Password is too weak. Please use a stronger password.',
      'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/user-disabled': 'User account has been disabled.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };

    return errorMessages[errorCode] || 'An error occurred during authentication. Please try again.';
  }
}
