import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

/**
 * Auth Guard to protect routes from unauthorized access
 * Redirects to login page if user is not authenticated
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // During SSR/full page reload, avoid server-side redirect to /login.
    // Auth checks are enforced in browser after hydration.
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    // Wait for Firebase to restore auth state on browser refresh.
    await this.authService.waitForAuthReady();

    if (this.authService.getCurrentLoginStatus()) {
      return true;
    }

    // Redirect to login and store the intended destination
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
